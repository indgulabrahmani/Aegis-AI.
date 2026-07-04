from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.database import User, Log
from app.models.schemas import LogResponse
from typing import Optional

router = APIRouter(prefix="/api/logs", tags=["Logs"])


@router.get("/", response_model=list[LogResponse])
async def get_logs(
    mission_id: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get logs for the current user, optionally filtered by mission
    """
    query = select(Log).join(Log.mission).where(
        Log.mission.has(founder_id=current_user.id)
    )
    
    if mission_id:
        query = query.where(Log.mission_id == mission_id)
    
    query = query.order_by(Log.timestamp.desc())
    
    result = await db.execute(query)
    logs = result.scalars().all()
    return logs


@router.get("/{log_id}", response_model=LogResponse)
async def get_log(
    log_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific log entry
    """
    result = await db.execute(
        select(Log).where(
            Log.id == log_id,
            Log.mission.has(founder_id=current_user.id)
        )
    )
    log = result.scalar_one_or_none()
    
    if not log:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found"
        )
    
    return log
