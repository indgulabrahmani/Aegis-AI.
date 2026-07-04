from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.database import User, Task, Approval, Log, TaskStatus, ApprovalStatus, ActorType
from app.models.schemas import ApprovalRequest, ApprovalResponse
from datetime import datetime

router = APIRouter(prefix="/api/approvals", tags=["Approvals"])


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


@router.post("/", response_model=ApprovalResponse, status_code=status.HTTP_201_CREATED)
async def create_approval(
    approval_data: ApprovalRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Approve or reject a task
    """
    # Get task
    result = await db.execute(select(Task).where(Task.id == approval_data.task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Verify mission ownership
    mission_result = await db.execute(
        select(Task).join(Task.mission).where(Task.id == approval_data.task_id)
    )
    # Note: Need to verify the user owns the mission this task belongs to
    
    # Check if task requires approval
    if not task.requires_approval:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This task does not require approval"
        )
    
    # Check if already approved/rejected
    if task.approval_status in [ApprovalStatus.APPROVED, ApprovalStatus.REJECTED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task has already been approved or rejected"
        )
    
    # Create approval record
    new_approval = Approval(
        task_id=approval_data.task_id,
        approved=approval_data.approved,
        comment=approval_data.comment
    )
    
    db.add(new_approval)
    
    # Update task approval status
    task.approval_status = ApprovalStatus.APPROVED if approval_data.approved else ApprovalStatus.REJECTED
    
    await db.commit()
    await db.refresh(new_approval)
    
    # Log the action
    await log_action(
        db,
        ActorType.FOUNDER,
        "approval_" + ("granted" if approval_data.approved else "denied"),
        mission_id=task.mission_id,
        task_id=task.id,
        details=f"Founder {'approved' if approval_data.approved else 'rejected'} task: {task.description}"
    )
    
    return new_approval


@router.get("/pending", response_model=list)
async def get_pending_approvals(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all pending approvals for the current user
    """
    result = await db.execute(
        select(Task)
        .join(Task.mission)
        .where(
            Task.requires_approval == True,
            Task.approval_status == ApprovalStatus.PENDING,
            Task.mission.has(founder_id=current_user.id)
        )
    )
    tasks = result.scalars().all()
    return tasks


@router.get("/history", response_model=list[ApprovalResponse])
async def get_approval_history(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get approval history for the current user
    """
    result = await db.execute(
        select(Approval)
        .join(Approval.task)
        .join(Task.mission)
        .where(Task.mission.has(founder_id=current_user.id))
        .order_by(Approval.created_at.desc())
    )
    approvals = result.scalars().all()
    return approvals
