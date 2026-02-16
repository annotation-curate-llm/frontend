import { User } from "./user";
import { Project } from "./project";

export interface Task {
    id: string;
    asset_id: string;
    project_id: string;
    assigned_to?: string;
    status: 'unassigned' | 'assigned' | 'in_progress' | 'completed' | 'reviewed';
    label_studio_task_id?: number;
    priority: number;
    assigned_at?: string;
    started_at?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    // Populated fields
    asset?: Asset;
    project?: Project;
    assignee?: User;
}

export interface Asset {
    id: string;
    file_name: string;
    file_url: string;
    mime_type: string;
    file_size: number;
}