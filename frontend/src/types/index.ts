export type AgentType = 'hr' | 'finance' | 'legal' | 'marketing';

export type MissionStatus = 'planning' | 'running' | 'awaiting_approval' | 'completed';

export type TaskStatus = 'queued' | 'in_progress' | 'done';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | null;

export interface Mission {
  id: string;
  founder_goal: string;
  status: MissionStatus;
  created_at: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  mission_id: string;
  agent: AgentType;
  description: string;
  output?: string;
  artifact_type?: string;
  requires_approval: boolean;
  approval_status: ApprovalStatus;
  status: TaskStatus;
  started_at?: string;
  completed_at?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: 'orchestrator' | 'hr' | 'finance' | 'legal' | 'marketing' | 'founder';
  action: string;
  mission_id: string;
  task_id?: string;
  details: string;
}

export interface AgentInfo {
  id: AgentType;
  name: string;
  icon: string;
  color: string;
  description: string;
  capabilities: string[];
  status: 'idle' | 'thinking' | 'working' | 'done';
}
