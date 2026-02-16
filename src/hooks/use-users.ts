import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { User, UserUpdate } from '@/types/user';

// Query Keys
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters?: any) => [...userKeys.lists(), filters] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
    me: () => [...userKeys.all, 'me'] as const,
};

// Get current user
export function useCurrentUser() {
    return useQuery({
        queryKey: userKeys.me(),
        queryFn: async () => {
            const { data } = await api.get<User>('/users/me');
            return data;
        },
    });
}

// Get all users (Admin only)
export function useUsers() {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: async () => {
            const { data } = await api.get<User[]>('/users/');
            return data;
        },
    });
}

// Get users by role
export function useUsersByRole(role?: string) {
    return useQuery({
        queryKey: userKeys.list({ role }),
        queryFn: async () => {
            const { data } = await api.get<User[]>('/users/');
            return role ? data.filter((u) => u.role === role) : data;
        },
    });
}

// Get single user
export function useUser(id: string) {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: async () => {
            const { data } = await api.get<User>(`/users/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

// Update user (Admin only - mainly for changing roles)
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: UserUpdate }) => {
            const { data } = await api.patch<User>(`/users/${id}`, updates);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
        },
    });
}

// Get annotators only (helper)
export function useAnnotators() {
    return useQuery({
        queryKey: userKeys.list({ role: 'annotator' }),
        queryFn: async () => {
            const { data } = await api.get<User[]>('/users/');
            return data.filter((u) => u.role === 'annotator' && u.is_active);
        },
    });
}

// Get reviewers only (helper)
export function useReviewers() {
    return useQuery({
        queryKey: userKeys.list({ role: 'reviewer' }),
        queryFn: async () => {
            const { data } = await api.get<User[]>('/users/');
            return data.filter((u) => u.role === 'reviewer' && u.is_active);
        },
    });
}