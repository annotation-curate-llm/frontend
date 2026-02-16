export enum ExportFormat {
    JSON = 'json',
    JSONL = 'jsonl',
    COCO = 'coco',
    YOLO = 'yolo',
    CSV = 'csv',
}

export enum ExportStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export interface ExportJob {
    id: string;
    project_id: string;
    created_by: string | null;
    export_format: ExportFormat;
    status: ExportStatus;
    file_url?: string;
    total_annotations?: number;
    error_message?: string;
    created_at: string;
    completed_at?: string;
}

export interface ExportJobCreate {
    project_id: string;
    export_format: ExportFormat;
}

export interface ExportJobList {
    id: string;
    project_id: string;
    export_format: ExportFormat;
    status: ExportStatus;
    file_url?: string;
    total_annotations?: number;
    created_at: string;
    completed_at?: string;
}