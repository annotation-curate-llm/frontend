'use client';

import { useState } from 'react';
import { Search, CheckCircle, Loader2, TrendingUp, Clock } from 'lucide-react';
import { useMyTasks } from '@/hooks/use-tasks';
import { TaskCard } from '@/components/tasks/task-card';
import { Input } from '@/components/ui/input';
import { TaskStatus } from '@/types/task';
import { formatDistanceToNow } from 'date-fns';

export default function CompletedPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: tasks, isLoading, error } = useMyTasks(TaskStatus.COMPLETED);

    const filteredTasks = tasks?.filter((task) =>
        task.asset?.file_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Most recently completed task
    const lastCompleted = tasks
        ?.filter((t) => t.completed_at)
        .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())[0];

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
                    <div className="w-9 h-9 bg-success/10 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary">Completed</h1>
                </div>
                <p className="text-text-secondary mt-1 ml-12">
                    All tasks you've finished annotating
                </p>
            </div>

            {/* Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-success/5 border border-success/20 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold text-success">{tasks?.length || 0}</p>
                        <p className="text-sm text-text-secondary mt-0.5">Tasks completed</p>
                    </div>
                    <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                </div>

                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-text-primary">
                            {lastCompleted
                                ? formatDistanceToNow(new Date(lastCompleted.completed_at!), { addSuffix: true })
                                : '—'}
                        </p>
                        <p className="text-sm text-text-secondary mt-0.5">Last completed</p>
                    </div>
                    <div className="w-10 h-10 bg-bg-tertiary rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-text-tertiary" />
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <Input
                    placeholder="Search completed tasks..."
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
                        <CheckCircle className="w-8 h-8 text-text-tertiary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {searchQuery ? 'No tasks match your search' : 'No completed tasks yet'}
                    </h3>
                    <p className="text-text-secondary max-w-md">
                        {searchQuery
                            ? "Try a different search query"
                            : "Complete your in-progress tasks and they'll show up here"
                        }
                    </p>
                </div>
            )}

            {/* Footer */}
            {filteredTasks && filteredTasks.length > 0 && (
                <div className="text-sm text-text-tertiary pt-4 border-t border-border-subtle">
                    Showing {filteredTasks.length} of {tasks?.length || 0} completed tasks
                </div>
            )}
        </div>
    );
}