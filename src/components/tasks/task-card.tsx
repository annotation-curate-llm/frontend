'use client';

import { Task } from '@/types/task';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, User, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
    task: Task;
    onStart?: (taskId: string) => void;
}

export function TaskCard({ task, onStart }: TaskCardProps) {
    const handleStart = () => {
        onStart?.(task.id);
    };

    return (
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 hover:border-primary transition-all">
            <div className="flex items-start justify-between gap-4">
                {/* Left: Task Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={task.status} />
                        {task.priority > 0 && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                                Priority {task.priority}
                            </span>
                        )}
                    </div>

                    {task.asset && (
                        <h4 className="text-sm font-medium text-text-primary mb-1 truncate">
                            {task.asset.file_name}
                        </h4>
                    )}

                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                        {task.assignee && (
                            <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{task.assignee.name}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                                {task.created_at && formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {task.label_studio_task_id && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`${process.env.NEXT_PUBLIC_LABEL_STUDIO_URL || 'http://localhost:8080'}/projects/${task.project?.label_studio_project_id}/data?task=${task.label_studio_task_id}`, '_blank')}
                        >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open LS
                        </Button>
                    )}
                    {task.status === 'assigned' && (
                        <Button size="sm" onClick={handleStart}>
                            Start
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}