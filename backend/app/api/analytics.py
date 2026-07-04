from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.database import User, Mission, Task, Approval
from app.models.schemas import AnalyticsResponse
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/", response_model=AnalyticsResponse)
async def get_analytics(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get analytics data for the current user
    """
    # Total missions
    total_missions_result = await db.execute(
        select(func.count(Mission.id)).where(Mission.founder_id == current_user.id)
    )
    total_missions = total_missions_result.scalar() or 0
    
    # Completed missions
    completed_missions_result = await db.execute(
        select(func.count(Mission.id)).where(
            Mission.founder_id == current_user.id,
            Mission.status == "completed"
        )
    )
    completed_missions = completed_missions_result.scalar() or 0
    
    # Total tasks
    total_tasks_result = await db.execute(
        select(func.count(Task.id))
        .join(Task.mission)
        .where(Mission.founder_id == current_user.id)
    )
    total_tasks = total_tasks_result.scalar() or 0
    
    # Tasks by agent
    hr_tasks_result = await db.execute(
        select(func.count(Task.id))
        .join(Task.mission)
        .where(
            Mission.founder_id == current_user.id,
            Task.agent == "hr"
        )
    )
    hr_tasks = hr_tasks_result.scalar() or 0
    
    finance_tasks_result = await db.execute(
        select(func.count(Task.id))
        .join(Task.mission)
        .where(
            Mission.founder_id == current_user.id,
            Task.agent == "finance"
        )
    )
    finance_tasks = finance_tasks_result.scalar() or 0
    
    legal_tasks_result = await db.execute(
        select(func.count(Task.id))
        .join(Task.mission)
        .where(
            Mission.founder_id == current_user.id,
            Task.agent == "legal"
        )
    )
    legal_tasks = legal_tasks_result.scalar() or 0
    
    marketing_tasks_result = await db.execute(
        select(func.count(Task.id))
        .join(Task.mission)
        .where(
            Mission.founder_id == current_user.id,
            Task.agent == "marketing"
        )
    )
    marketing_tasks = marketing_tasks_result.scalar() or 0
    
    tasks_by_agent = {
        "hr": hr_tasks,
        "finance": finance_tasks,
        "legal": legal_tasks,
        "marketing": marketing_tasks
    }
    
    # Approval rate
    approvals_granted_result = await db.execute(
        select(func.count(Approval.id))
        .join(Approval.task)
        .join(Task.mission)
        .where(
            Mission.founder_id == current_user.id,
            Approval.approved == True
        )
    )
    approvals_granted = approvals_granted_result.scalar() or 0
    
    approvals_denied_result = await db.execute(
        select(func.count(Approval.id))
        .join(Approval.task)
        .join(Task.mission)
        .where(
            Mission.founder_id == current_user.id,
            Approval.approved == False
        )
    )
    approvals_denied = approvals_denied_result.scalar() or 0
    
    total_approvals = approvals_granted + approvals_denied
    approval_rate = (approvals_granted / total_approvals * 100) if total_approvals > 0 else 0
    
    # Average completion time (in hours)
    completed_tasks_result = await db.execute(
        select(Task)
        .join(Task.mission)
        .where(
            Mission.founder_id == current_user.id,
            Task.status == "done",
            Task.started_at.isnot(None),
            Task.completed_at.isnot(None)
        )
    )
    completed_tasks = completed_tasks_result.scalars().all()
    
    if completed_tasks:
        total_time = sum(
            (task.completed_at - task.started_at).total_seconds()
            for task in completed_tasks
        )
        avg_completion_time = total_time / len(completed_tasks) / 3600  # Convert to hours
    else:
        avg_completion_time = 0
    
    return AnalyticsResponse(
        total_missions=total_missions,
        completed_missions=completed_missions,
        total_tasks=total_tasks,
        tasks_by_agent=tasks_by_agent,
        approval_rate=round(approval_rate, 2),
        avg_completion_time=round(avg_completion_time, 2)
    )
