export interface Project {
    id: string;
    name: string;
    description?: string;
    category?: string;
    label_config: string;
    label_studio_project_id?: number;
    created_by?: string;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
    // Stats from API (not in DB)
    total_tasks?: number;
    completed_tasks?: number;
    pending_tasks?: number;
}

export interface ProjectCreate {
    name: string;
    description?: string;
    category?: string;
    label_config: string;
}

export interface ProjectUpdate {
    name?: string;
    description?: string;
    is_active?: boolean;
}

export interface ProjectWithStats extends Project {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
}