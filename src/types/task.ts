import { Asset } from './asset';
import { Project } from './project';
import { User } from './user';

export enum TaskStatus {
    UNASSIGNED = 'unassigned',
    ASSIGNED = 'assigned',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    REVIEWED = 'reviewed',
}

export interface Task {
    id: string;
    asset_id: string;
    project_id: string;
    assigned_to?: string | null;
    status: TaskStatus;
    label_studio_task_id?: number;
    label_studio_project_id?: number | null;
    priority: number;
    assigned_at?: string;
    started_at?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    // Populated fields (from relationships)
    asset?: Asset;
    project?: Project;
    assignee?: User;
}

export interface TaskCreate {
    project_id: string;
    asset_id: string;
    priority?: number;
}

export interface TaskUpdate {
    status?: TaskStatus;
    priority?: number;
    assigned_to?: string;
}

export interface TaskAssign {
    project_id: string;
    user_id: string;
    count: number;
}

export interface TaskAutoAssign {
    project_id: string;
    tasks_per_user?: number;
}

export interface TaskBulkUpdateStatus {
    task_ids: string[];
    new_status: TaskStatus;
}

export interface MyTask extends Task {
    asset: Asset;
}