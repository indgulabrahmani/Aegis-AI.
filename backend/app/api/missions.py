from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.database import User, Mission, Task, Log, MissionStatus, TaskStatus, ActorType
from app.models.schemas import MissionCreate, MissionResponse, TaskResponse
from app.services.orchestrator import orchestrator_service
from app.services.agents import agent_service
from datetime import datetime
import asyncio

router = APIRouter(prefix="/api/missions", tags=["Missions"])


async def log_action(
    db: AsyncSession,
    actor: ActorType,
    action: str,
    mission_id: int = None,
    task_id: int = None,
    details: str = ""
):
    """
    Log an action to the database
    """
    log_entry = Log(
        actor=actor,
        action=action,
        mission_id=mission_id,
        task_id=task_id,
        details=details
    )
    db.add(log_entry)
    await db.commit()


async def execute_agent_task(
    task_id: int,
    db: AsyncSession
):
    """
    Execute a task by an agent in the background
    """
    # Get task
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        return
    
    # Update task status to in_progress
    task.status = TaskStatus.IN_PROGRESS
    task.started_at = datetime.utcnow()
    await db.commit()
    
    await log_action(
        db,
        ActorType(task.agent.value),
        "task_started",
        mission_id=task.mission_id,
        task_id=task.id,
        details=f"Agent {task.agent.value} started task: {task.description}"
    )
    
    try:
        # Execute task with agent
        response = await agent_service.execute_task(
            agent=task.agent,
            task_description=task.description,
            context=f"Mission: {task.mission.founder_goal}"
        )
        
        # Update task with results
        task.output = response.get("output")
        task.artifact_type = response.get("artifact_type")
        task.status = TaskStatus.DONE
        task.completed_at = datetime.utcnow()
        
        await db.commit()
        
        await log_action(
            db,
            ActorType(task.agent.value),
            "task_completed",
            mission_id=task.mission_id,
            task_id=task.id,
            details=f"Agent {task.agent.value} completed task successfully"
        )
        
        # Check if all tasks are done
        mission_result = await db.execute(
            select(Mission).where(Mission.id == task.mission_id)
        )
        mission = mission_result.scalar_one_or_none()
        
        if mission:
            tasks_result = await db.execute(
                select(Task).where(Task.mission_id == mission.id)
            )
            tasks = tasks_result.scalars().all()
            
            all_done = all(t.status == TaskStatus.DONE for t in tasks)
            if all_done:
                mission.status = MissionStatus.COMPLETED
                await db.commit()
                
                await log_action(
                    db,
                    ActorType.ORCHESTRATOR,
                    "mission_completed",
                    mission_id=mission.id,
                    details="All tasks completed, mission finished"
                )
    
    except Exception as e:
        task.status = TaskStatus.QUEUED  # Reset to queued for retry
        await db.commit()
        
        await log_action(
            db,
            ActorType(task.agent.value),
            "task_failed",
            mission_id=task.mission_id,
            task_id=task.id,
            details=f"Task failed: {str(e)}"
        )


@router.post("/", response_model=MissionResponse, status_code=status.HTTP_201_CREATED)
async def create_mission(
    mission_data: MissionCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new mission and trigger orchestrator analysis
    """
    # Create mission
    new_mission = Mission(
        founder_goal=mission_data.founder_goal,
        status=MissionStatus.PLANNING,
        founder_id=current_user.id
    )
    
    db.add(new_mission)
    await db.commit()
    await db.refresh(new_mission)
    
    await log_action(
        db,
        ActorType.FOUNDER,
        "mission_created",
        mission_id=new_mission.id,
        details=f"Founder created mission: {mission_data.founder_goal}"
    )
    
    # Analyze mission with orchestrator
    try:
        analysis = await orchestrator_service.analyze_mission(mission_data.founder_goal)
        tasks = orchestrator_service.parse_tasks(analysis)
        
        # Create tasks
        for task_data in tasks:
            new_task = Task(
                mission_id=new_mission.id,
                agent=task_data.agent,
                description=task_data.description,
                requires_approval=task_data.requires_approval,
                status=TaskStatus.QUEUED
            )
            db.add(new_task)
        
        await db.commit()
        
        await log_action(
            db,
            ActorType.ORCHESTRATOR,
            "mission_analyzed",
            mission_id=new_mission.id,
            details=f"Orchestrator analyzed mission and created {len(tasks)} tasks"
        )
        
        # Update mission status
        new_mission.status = MissionStatus.RUNNING
        await db.commit()
        
        # Execute tasks in background
        result = await db.execute(
            select(Task).where(Task.mission_id == new_mission.id)
        )
        mission_tasks = result.scalars().all()
        
        for task in mission_tasks:
            background_tasks.add_task(execute_agent_task, task.id, db)
        
        await db.refresh(new_mission)
        return new_mission
    
    except Exception as e:
        await log_action(
            db,
            ActorType.ORCHESTRATOR,
            "orchestration_failed",
            mission_id=new_mission.id,
            details=f"Orchestration failed: {str(e)}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze mission: {str(e)}"
        )


@router.get("/", response_model=List[MissionResponse])
async def get_missions(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all missions for the current user
    """
    result = await db.execute(
        select(Mission).where(Mission.founder_id == current_user.id).order_by(Mission.created_at.desc())
    )
    missions = result.scalars().all()
    return missions


@router.get("/{mission_id}", response_model=MissionResponse)
async def get_mission(
    mission_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific mission
    """
    result = await db.execute(
        select(Mission).where(
            Mission.id == mission_id,
            Mission.founder_id == current_user.id
        )
    )
    mission = result.scalar_one_or_none()
    
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )
    
    return mission


@router.get("/{mission_id}/tasks", response_model=List[TaskResponse])
async def get_mission_tasks(
    mission_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all tasks for a specific mission
    """
    # Verify mission ownership
    mission_result = await db.execute(
        select(Mission).where(
            Mission.id == mission_id,
            Mission.founder_id == current_user.id
        )
    )
    mission = mission_result.scalar_one_or_none()
    
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )
    
    result = await db.execute(
        select(Task).where(Task.mission_id == mission_id)
    )
    tasks = result.scalars().all()
    return tasks
