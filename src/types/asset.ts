export interface Asset {
    id: string;
    project_id: string;
    file_name: string;
    file_path: string;
    file_url: string;
    mime_type?: string;
    file_size?: number;
    asset_metadata?: Record<string, any>;
    created_at: string;
}

export interface AssetCreate {
    project_id: string;
    file_name: string;
    file_path: string;
    file_url: string;
    mime_type?: string;
    file_size?: number;
    asset_metadata?: Record<string, any>;
}

export interface AssetUploadResponse {
    message: string;
    asset_id: string;
    file_url: string;
}