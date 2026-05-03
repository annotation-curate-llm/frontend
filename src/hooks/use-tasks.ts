import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import {
    Task,
    TaskCreate,
    TaskUpdate,
    TaskAssign,
    TaskBulkUpdateStatus,
    MyTask,
    TaskStatus
} from '@/types/task';

// Query Keys
export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (filters?: any) => [...taskKeys.lists(), filters] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: string) => [...taskKeys.details(), id] as const,
    myTasks: (status?: TaskStatus) => [...taskKeys.all, 'my-tasks', status] as const,
};

// Get my tasks
export function useMyTasks(status?: TaskStatus, options?: { refetchInterval?: number }) {
    return useQuery({
        queryKey: taskKeys.myTasks(status),
        queryFn: async () => {
            const params = status ? `?status=${status}` : '';
            const { data } = await api.get<MyTask[]>(`/tasks/my-tasks${params}`);
            return data;
        },
        refetchInterval: options?.refetchInterval,
    });
}

// Get next task for annotator
export function useNextTask() {
    return useQuery({
        queryKey: [...taskKeys.all, 'next'],
        queryFn: async () => {
            const { data } = await api.get<Task>('/tasks/next');
            return data;
        },
        retry: false, // Don't retry if no tasks available
    });
}

// Get single task
export function useTask(id: string) {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn: async () => {
            const { data } = await api.get<Task>(`/tasks/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

// Get tasks for a project
export function useProjectTasks(projectId: string, status?: TaskStatus) {
    return useQuery({
        queryKey: taskKeys.list({ projectId, status }),
        queryFn: async () => {
            const params = status ? `?status=${status}` : '';
            const { data } = await api.get<Task[]>(`/tasks/project/${projectId}${params}`);
            return data;
        },
        enabled: !!projectId,
    });
}

// Create task
export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ task, labelStudioProjectId }: { task: TaskCreate; labelStudioProjectId?: number }) => {
            const params = labelStudioProjectId ? `?label_studio_project_id=${labelStudioProjectId}` : '';
            const { data } = await api.post<Task>(`/tasks/${params}`, task);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        },
    });
}

// Update task
export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: TaskUpdate }) => {
            const { data } = await api.patch<Task>(`/tasks/${id}`, updates);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
        },
    });
}

// Assign tasks to user
export function useAssignTasks() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (assignment: TaskAssign) => {
            const { data } = await api.post('/tasks/assign', assignment);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        },
    });
}

// Auto-assign tasks
export function useAutoAssignTasks() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ project_id, tasks_per_user }: { project_id: string; tasks_per_user?: number }) => {
            const { data } = await api.post(
                `/tasks/auto-assign?project_id=${project_id}&tasks_per_user=${tasks_per_user || 5}`
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        },
    });
}

// Bulk update task status
export function useBulkUpdateTaskStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (bulkUpdate: TaskBulkUpdateStatus) => {
            const { data } = await api.post('/tasks/bulk-update-status', bulkUpdate);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
        },
    });
}