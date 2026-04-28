'use client';

import { useState } from 'react';
import { Search, Clock, Loader2, ExternalLink } from 'lucide-react';
import { useMyTasks } from '@/hooks/use-tasks';
import { TaskCard } from '@/components/tasks/task-card';
import { Input } from '@/components/ui/input';
import { TaskStatus } from '@/types/task';

export default function InProgressPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: tasks, isLoading, error } = useMyTasks(TaskStatus.IN_PROGRESS);

    const filteredTasks = tasks?.filter((task) =>
        task.asset?.file_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 bg-warning/10 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-warning" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary">In Progress</h1>
                </div>
                <p className="text-text-secondary mt-1 ml-12">
                    Tasks you're currently working on
                </p>
            </div>

            {/* Summary Banner */}
            <div className="bg-warning/5 border border-warning/20 rounded-2xl p-5 flex items-center justify-between">
                <div>
                    <p className="text-2xl font-bold text-warning">{tasks?.length || 0}</p>
                    <p className="text-sm text-text-secondary mt-0.5">Tasks in progress</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-text-tertiary">Keep going!</p>
                    <p className="text-xs text-text-tertiary mt-0.5">Complete these to move forward</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <Input
                    placeholder="Search in-progress tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Task List */}
            {filteredTasks && filteredTasks.length > 0 ? (
                <div className="space-y-3">
                    {filteredTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="w-16 h-16 bg-bg-tertiary rounded-2xl flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-text-tertiary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {searchQuery ? 'No tasks match your search' : 'No tasks in progress'}
                    </h3>
                    <p className="text-text-secondary max-w-md">
                        {searchQuery
                            ? 'Try a different search query'
                            : 'Start a task from My Tasks and it will appear here'}
                    </p>
                </div>
            )}

            {/* Footer */}
            {filteredTasks && filteredTasks.length > 0 && (
                <div className="text-sm text-text-tertiary pt-4 border-t border-border-subtle">
                    Showing {filteredTasks.length} of {tasks?.length || 0} in-progress tasks
                </div>
            )}
        </div>
    );
}