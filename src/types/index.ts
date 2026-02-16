export * from './user';
export * from './project';
export * from './task';
export * from './asset';
export * from './annotation';
export * from './review';
export * from './export';
export * from './label-config';

// API Response types
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface ApiError {
    detail: string;
    status_code?: number;
}

export interface SuccessResponse {
    message: string;
    [key: string]: any;
}