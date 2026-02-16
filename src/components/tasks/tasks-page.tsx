'use client';

import { useState } from 'react';
import { Search, Filter, Loader2, CheckSquare } from 'lucide-react';
import { useMyTasks, useUpdateTask } from '@/hooks/use-tasks';
import { TaskCard } from '@/components/tasks/task-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskStatus } from '@/types/task';

export function TasksPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

    const { data: tasks, isLoading, error } = useMyTasks(
        statusFilter === 'all' ? undefined : statusFilter
    );
    const updateTask = useUpdateTask();

    // Filter tasks by search
    const filteredTasks = tasks?.filter((task) => {
        const matchesSearch = task.asset?.file_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const handleStartTask = (taskId: string) => {
        updateTask.mutate({
            id: taskId,
            updates: { status: TaskStatus.IN_PROGRESS },
        });
    };

    // Count by status
    const statusCounts = {
        all: tasks?.length || 0,
        assigned: tasks?.filter((t) => t.status === TaskStatus.ASSIGNED).length || 0,
        in_progress: tasks?.filter((t) => t.status === TaskStatus.IN_PROGRESS).length || 0,
        completed: tasks?.filter((t) => t.status === TaskStatus.COMPLETED).length || 0,
        reviewed: tasks?.filter((t) => t.status === TaskStatus.REVIEWED).length || 0,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-error mb-2">Failed to load tasks</p>
                    <p className="text-sm text-text-tertiary">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary">My Tasks</h1>
                <p className="text-text-secondary mt-1">
                    View and manage your assigned annotation tasks
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <button
                    onClick={() => setStatusFilter('all')}
                    className={`p-4 bg-bg-secondary border rounded-xl text-left transition-all ${statusFilter === 'all'
                            ? 'border-primary shadow-sm'
                            : 'border-border-subtle hover:border-border-default'
                        }`}
                >
                    <p className="text-2xl font-bold text-text-primary">{statusCounts.all}</p>
                    <p className="text-xs text-text-tertiary mt-1">All Tasks</p>
                </button>

                <button
                    onClick={() => setStatusFilter(TaskStatus.ASSIGNED)}
                    className={`p-4 bg-bg-secondary border rounded-xl text-left transition-all ${statusFilter === TaskStatus.ASSIGNED
                            ? 'border-info shadow-sm'
                            : 'border-border-subtle hover:border-border-default'
                        }`}
                >
                    <p className="text-2xl font-bold text-info">{statusCounts.assigned}</p>
                    <p className="text-xs text-text-tertiary mt-1">Assigned</p>
                </button>

                <button
                    onClick={() => setStatusFilter(TaskStatus.IN_PROGRESS)}
                    className={`p-4 bg-bg-secondary border rounded-xl text-left transition-all ${statusFilter === TaskStatus.IN_PROGRESS
                            ? 'border-warning shadow-sm'
                            : 'border-border-subtle hover:border-border-default'
                        }`}
                >
                    <p className="text-2xl font-bold text-warning">{statusCounts.in_progress}</p>
                    <p className="text-xs text-text-tertiary mt-1">In Progress</p>
                </button>

                <button
                    onClick={() => setStatusFilter(TaskStatus.COMPLETED)}
                    className={`p-4 bg-bg-secondary border rounded-xl text-left transition-all ${statusFilter === TaskStatus.COMPLETED
                            ? 'border-success shadow-sm'
                            : 'border-border-subtle hover:border-border-default'
                        }`}
                >
                    <p className="text-2xl font-bold text-success">{statusCounts.completed}</p>
                    <p className="text-xs text-text-tertiary mt-1">Completed</p>
                </button>

                <button
                    onClick={() => setStatusFilter(TaskStatus.REVIEWED)}
                    className={`p-4 bg-bg-secondary border rounded-xl text-left transition-all ${statusFilter === TaskStatus.REVIEWED
                            ? 'border-primary shadow-sm'
                            : 'border-border-subtle hover:border-border-default'
                        }`}
                >
                    <p className="text-2xl font-bold text-primary">{statusCounts.reviewed}</p>
                    <p className="text-xs text-text-tertiary mt-1">Reviewed</p>
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Tasks List */}
            {filteredTasks && filteredTasks.length > 0 ? (
                <div className="space-y-3">
                    {filteredTasks.map((task) => (
                        <TaskCard key={task.id} task={task} onStart={handleStartTask} />
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="w-16 h-16 bg-bg-tertiary rounded-2xl flex items-center justify-center mb-4">
                        <CheckSquare className="w-8 h-8 text-text-tertiary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {searchQuery || statusFilter !== 'all'
                            ? 'No tasks found'
                            : 'No tasks assigned yet'}
                    </h3>
                    <p className="text-text-secondary max-w-md">
                        {searchQuery || statusFilter !== 'all'
                            ? 'Try adjusting your filters or search query'
                            : 'Tasks will appear here once they are assigned to you'}
                    </p>
                </div>
            )}

            {/* Footer Stats */}
            {filteredTasks && filteredTasks.length > 0 && (
                <div className="text-sm text-text-tertiary pt-4 border-t border-border-subtle">
                    Showing {filteredTasks.length} of {tasks?.length || 0} tasks
                </div>
            )}
        </div>
    );
}