import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ExportJob, ExportJobCreate, ExportFormat } from '@/types/export';

// Query Keys
export const exportKeys = {
    all: ['exports'] as const,
    lists: () => [...exportKeys.all, 'list'] as const,
    list: (filters?: any) => [...exportKeys.lists(), filters] as const,
    details: () => [...exportKeys.all, 'detail'] as const,
    detail: (id: string) => [...exportKeys.details(), id] as const,
};

// Get all export jobs
export function useExports(projectId?: string) {
    return useQuery({
        queryKey: exportKeys.list({ projectId }),
        queryFn: async () => {
            const params = projectId ? `?project_id=${projectId}` : '';
            const { data } = await api.get<ExportJob[]>(`/exports/${params}`);
            return data;
        },
    });
}

// Get single export job
export function useExport(id: string) {
    return useQuery({
        queryKey: exportKeys.detail(id),
        queryFn: async () => {
            const { data } = await api.get<ExportJob>(`/exports/${id}`);
            return data;
        },
        enabled: !!id,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            // Poll every 2 seconds if processing, stop if completed/failed
            return status === 'processing' || status === 'pending' ? 2000 : false;
        },
    });
}

// Create export job
export function useCreateExport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (exportJob: ExportJobCreate) => {
            const { data } = await api.post<ExportJob>('/exports/', exportJob);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: exportKeys.lists() });
        },
    });
}

// Delete export job
export function useDeleteExport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/exports/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: exportKeys.lists() });
        },
    });
}