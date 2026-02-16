export interface Annotation {
    id: string;
    task_id: string;
    annotator_id: string;
    annotation_data: any; // JSON
    label_studio_annotation_id?: number;
    time_spent?: number;
    version: number;
    created_at: string;
    updated_at: string;
}

export interface Review {
    id: string;
    annotation_id: string;
    reviewer_id: string;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    reviewed_at?: string;
    created_at: string;
}