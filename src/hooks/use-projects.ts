import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Project, ProjectCreate, ProjectUpdate, ProjectWithStats } from '@/types/project';

// Query Keys
export const projectKeys = {
    all: ['projects'] as const,
    lists: () => [...projectKeys.all, 'list'] as const,
    list: (filters?: any) => [...projectKeys.lists(), filters] as const,
    details: () => [...projectKeys.all, 'detail'] as const,
    detail: (id: string) => [...projectKeys.details(), id] as const,
};

// Get all projects
export function useProjects() {
    return useQuery({
        queryKey: projectKeys.lists(),
        queryFn: async () => {
            const { data } = await api.get<ProjectWithStats[]>('/projects/');
            return data;
        },
    });
}

// Get single project
export function useProject(id: string) {
    return useQuery({
        queryKey: projectKeys.detail(id),
        queryFn: async () => {
            const { data } = await api.get<Project>(`/projects/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

// Create project
export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newProject: ProjectCreate) => {
            const { data } = await api.post<Project>('/projects/', newProject);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
}

// Update project
export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: ProjectUpdate }) => {
            const { data } = await api.patch<Project>(`/projects/${id}`, updates);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(data.id) });
        },
    });
}

// Delete project
export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/projects/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
}

// Upload asset to project
export function useUploadAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ projectId, file }: { projectId: string; file: File }) => {
            const formData = new FormData();
            formData.append('file', file);

            const { data } = await api.post(
                `/projects/${projectId}/assets/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
        },
    });
}