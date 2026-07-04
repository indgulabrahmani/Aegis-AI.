from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum as SQLEnum, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    missions = relationship("Mission", back_populates="founder")


class MissionStatus(enum.Enum):
    PLANNING = "planning"
    RUNNING = "running"
    AWAITING_APPROVAL = "awaiting_approval"
    COMPLETED = "completed"


class TaskStatus(enum.Enum):
    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class ApprovalStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class AgentType(enum.Enum):
    HR = "hr"
    FINANCE = "finance"
    LEGAL = "legal"
    MARKETING = "marketing"


class ActorType(enum.Enum):
    ORCHESTRATOR = "orchestrator"
    HR = "hr"
    FINANCE = "finance"
    LEGAL = "legal"
    MARKETING = "marketing"
    FOUNDER = "founder"


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    founder_goal = Column(Text, nullable=False)
    status = Column(SQLEnum(MissionStatus), default=MissionStatus.PLANNING)
    created_at = Column(DateTime, default=datetime.utcnow)
    founder_id = Column(Integer, ForeignKey("users.id"))

    founder = relationship("User", back_populates="missions")
    tasks = relationship("Task", back_populates="mission", cascade="all, delete-orphan")
    logs = relationship("Log", back_populates="mission", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=False)
    agent = Column(SQLEnum(AgentType), nullable=False)
    description = Column(Text, nullable=False)
    output = Column(Text, nullable=True)
    artifact_type = Column(String, nullable=True)
    requires_approval = Column(Boolean, default=False)
    approval_status = Column(SQLEnum(ApprovalStatus), nullable=True)
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.QUEUED)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    mission = relationship("Mission", back_populates="tasks")
    approvals = relationship("Approval", back_populates="task", cascade="all, delete-orphan")
    logs = relationship("Log", back_populates="task", cascade="all, delete-orphan")


class Approval(Base):
    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    approved = Column(Boolean, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    task = relationship("Task", back_populates="approvals")


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    actor = Column(SQLEnum(ActorType), nullable=False)
    action = Column(String, nullable=False)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    details = Column(Text, nullable=False)

    mission = relationship("Mission", back_populates="logs")
    task = relationship("Task", back_populates="logs")


class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    total_missions = Column(Integer, default=0)
    completed_missions = Column(Integer, default=0)
    total_tasks = Column(Integer, default=0)
    hr_tasks = Column(Integer, default=0)
    finance_tasks = Column(Integer, default=0)
    legal_tasks = Column(Integer, default=0)
    marketing_tasks = Column(Integer, default=0)
    approvals_granted = Column(Integer, default=0)
    approvals_denied = Column(Integer, default=0)
    avg_completion_time = Column(Float, default=0.0)
