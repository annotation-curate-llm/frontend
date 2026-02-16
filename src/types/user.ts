export enum UserRole {
    ADMIN = 'admin',
    ANNOTATOR = 'annotator',
    REVIEWER = 'reviewer'
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    provider: string;
    provider_id: string;
    role: UserRole;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface UserCreate {
    email: string;
    name: string;
    avatar_url?: string;
    provider: string;
    provider_id: string;
    role?: UserRole;
}

export interface UserUpdate {
    name?: string;
    avatar_url?: string;
    role?: UserRole;
    is_active?: boolean;
}

export interface BackendTokenResponse {
    access_token: string;
    token_type: string;
    user: User;
}