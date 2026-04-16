'use client';

import { MyTask, TaskStatus } from '@/types/task';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
    task: MyTask;
    onStart?: (taskId: string) => void;
}

export function TaskCard({ task, onStart }: TaskCardProps) {

    const getLabelStudioUrl = () => {
        const baseUrl = process.env.NEXT_PUBLIC_LABEL_STUDIO_URL || 'http://localhost:8080';
        // Use task's own label_studio_task_id — project id comes from task.label_studio_project_id
        // open the task directly via task id
        return `${baseUrl}/tasks/${task.label_studio_task_id}/labeling`;
    };

    const handleStart = () => {
        onStart?.(task.id); // updates status to in_progress
        if (task.label_studio_task_id) {
            window.open(getLabelStudioUrl(), '_blank');
        }
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

                    <h4 className="text-sm font-medium text-text-primary mb-1 truncate">
                        {task.asset.file_name}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                                {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                            </span>
                        </div>
                        {task.label_studio_task_id && (
                            <span className="text-success">LS Task #{task.label_studio_task_id}</span>
                        )}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Already in progress — just open LS */}
                    {task.status === TaskStatus.IN_PROGRESS && task.label_studio_task_id && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(getLabelStudioUrl(), '_blank')}
                        >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Continue in Label Studio
                        </Button>
                    )}

                    {/* Assigned — start + open LS */}
                    {task.status === TaskStatus.ASSIGNED && (
                        <Button size="sm" onClick={handleStart}>
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {task.label_studio_task_id ? 'Start Annotating' : 'Start'}
                        </Button>
                    )}

                    {/* Completed */}
                    {task.status === TaskStatus.COMPLETED && (
                        <span className="text-xs text-success font-medium">✓ Completed</span>
                    )}
                </div>
            </div>
        </div>
    );
}