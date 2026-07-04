from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class AgentType(str, Enum):
    HR = "hr"
    FINANCE = "finance"
    LEGAL = "legal"
    MARKETING = "marketing"


class MissionStatus(str, Enum):
    PLANNING = "planning"
    RUNNING = "running"
    AWAITING_APPROVAL = "awaiting_approval"
    COMPLETED = "completed"


class TaskStatus(str, Enum):
    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class ActorType(str, Enum):
    ORCHESTRATOR = "orchestrator"
    HR = "hr"
    FINANCE = "finance"
    LEGAL = "legal"
    MARKETING = "marketing"
    FOUNDER = "founder"


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


# Mission Schemas
class TaskCreate(BaseModel):
    agent: AgentType
    description: str
    requires_approval: bool = False


class TaskResponse(BaseModel):
    id: int
    mission_id: int
    agent: AgentType
    description: str
    output: Optional[str] = None
    artifact_type: Optional[str] = None
    requires_approval: bool
    approval_status: Optional[ApprovalStatus] = None
    status: TaskStatus
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MissionCreate(BaseModel):
    founder_goal: str


class MissionResponse(BaseModel):
    id: int
    founder_goal: str
    status: MissionStatus
    created_at: datetime
    tasks: List[TaskResponse] = []

    class Config:
        from_attributes = True


# Approval Schemas
class ApprovalRequest(BaseModel):
    task_id: int
    approved: bool
    comment: Optional[str] = None


class ApprovalResponse(BaseModel):
    id: int
    task_id: int
    approved: bool
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Log Schemas
class LogCreate(BaseModel):
    actor: ActorType
    action: str
    mission_id: Optional[int] = None
    task_id: Optional[int] = None
    details: str


class LogResponse(BaseModel):
    id: int
    timestamp: datetime
    actor: ActorType
    action: str
    mission_id: Optional[int] = None
    task_id: Optional[int] = None
    details: str

    class Config:
        from_attributes = True


# Analytics Schemas
class AnalyticsResponse(BaseModel):
    total_missions: int
    completed_missions: int
    total_tasks: int
    tasks_by_agent: dict
    approval_rate: float
    avg_completion_time: float


# Agent Schemas
class AgentStatus(BaseModel):
    agent: AgentType
    status: str
    current_task: Optional[str] = None


class AgentResponse(BaseModel):
    id: AgentType
    name: str
    description: str
    capabilities: List[str]
    status: str


# WebSocket Messages
class WSMessage(BaseModel):
    type: str
    data: dict


class MissionProgressUpdate(BaseModel):
    mission_id: int
    status: MissionStatus
    current_agent: Optional[AgentType] = None
    message: str


class TaskProgressUpdate(BaseModel):
    task_id: int
    agent: AgentType
    status: TaskStatus
    message: str
