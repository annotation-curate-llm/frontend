export enum ReviewStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export interface Review {
    id: string;
    annotation_id: string;
    reviewer_id: string | null;
    status: ReviewStatus;
    comments?: string;
    reviewed_at?: string;
    created_at: string;
}

export interface ReviewCreate {
    annotation_id: string;
    status: ReviewStatus;
    comments?: string;
}

export interface ReviewWithDetails extends Review {
    task_id: string;
    annotator_id: string;
    annotation_data: any;
    file_url: string;
    file_name: string;
}