'use client';

import { useState } from 'react';
import { MyTask, TaskStatus } from '@/types/task';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Copy, Check, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { api } from '@/lib/api-client';

interface TaskCardProps {
    task: MyTask;
    onStart?: (taskId: string) => void;
    onComplete?: (taskId: string) => void;
}

const LS_CREDENTIALS_KEY = 'ls_credentials_shown';

export function TaskCard({ task, onStart, onComplete }: TaskCardProps) {
    const [showCredentials, setShowCredentials] = useState(false);
    const [copied, setCopied] = useState<'email' | 'password' | null>(null);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getLabelStudioUrl = () => {
        const baseUrl = process.env.NEXT_PUBLIC_LABEL_STUDIO_URL || 'http://localhost:8080';
        return `${baseUrl}/projects/${task.label_studio_project_id}/data?tab=1&task=${task.label_studio_task_id}`;
    };

    const openLabelStudio = (url: string) => {
        window.open(url, '_blank');
    };

    const handleStart = () => {
        onStart?.(task.id);

        if (!task.label_studio_task_id) {
            console.warn('[TaskCard] No label_studio_task_id found for task:', task.id, task);
            return;
        }

        const url = getLabelStudioUrl();
        const alreadyShown = localStorage.getItem(LS_CREDENTIALS_KEY);

        if (!alreadyShown) {
            setPendingUrl(url);
            setShowCredentials(true);
        } else {
            openLabelStudio(url);
        }
    };

    const handleContinue = () => {
        localStorage.setItem(LS_CREDENTIALS_KEY, 'true');
        setShowCredentials(false);
        if (pendingUrl) openLabelStudio(pendingUrl);
    };

    const handleCopy = (type: 'email' | 'password') => {
        const value = type === 'email'
            ? process.env.NEXT_PUBLIC_LS_ANNOTATOR_EMAIL || 'annotator@curate.llm'
            : process.env.NEXT_PUBLIC_LS_ANNOTATOR_PASSWORD || '';

        navigator.clipboard.writeText(value);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleMarkComplete = async () => {
        setIsSubmitting(true);
        try {
            const { data: lsAnnotation } = await api.get(
                `/annotations/ls-result/${task.label_studio_task_id}`
            );

            await api.post('/annotations/', {
                task_id: task.id,
                annotation_data: lsAnnotation?.result || { result: [], note: 'Submitted via Label Studio' },
                time_spent: 0
            });

            onComplete?.(task.id);
            setShowCompleteDialog(false);
        } catch (err) {
            console.error('Failed to mark task complete:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Credentials Modal */}
            <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Label Studio Credentials</DialogTitle>
                        <DialogDescription>
                            You'll be redirected to Label Studio to annotate. Use these shared credentials to login.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 my-2">
                        <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg border border-border-subtle">
                            <div>
                                <p className="text-xs text-text-tertiary mb-0.5">Email</p>
                                <p className="text-sm font-medium text-text-primary">
                                    {process.env.NEXT_PUBLIC_LS_ANNOTATOR_EMAIL || 'annotator@curate.llm'}
                                </p>
                            </div>
                            <button onClick={() => handleCopy('email')} className="p-1.5 hover:bg-bg-tertiary rounded">
                                {copied === 'email' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-tertiary" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg border border-border-subtle">
                            <div>
                                <p className="text-xs text-text-tertiary mb-0.5">Password</p>
                                <p className="text-sm font-medium text-text-primary">
                                    {process.env.NEXT_PUBLIC_LS_ANNOTATOR_PASSWORD || '••••••••'}
                                </p>
                            </div>
                            <button onClick={() => handleCopy('password')} className="p-1.5 hover:bg-bg-tertiary rounded">
                                {copied === 'password' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-tertiary" />}
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-text-tertiary">
                        These credentials are saved in your browser. You won't see this again.
                    </p>

                    <div className="flex gap-2 mt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowCredentials(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1" onClick={handleContinue}>
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open Label Studio
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Mark Complete Confirmation Dialog */}
            <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Mark Task as Complete?</DialogTitle>
                        <DialogDescription>
                            Make sure you have submitted your annotation in Label Studio before marking this task as complete.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2 mt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowCompleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleMarkComplete}
                            disabled={isSubmitting}
                        >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {isSubmitting ? 'Submitting...' : 'Yes, Mark Complete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Task Card */}
            <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 hover:border-primary transition-all">
                <div className="flex items-start justify-between gap-4">
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
                                <span>{formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
                            </div>
                            {task.label_studio_task_id ? (
                                <span className="text-success">LS Task #{task.label_studio_task_id}</span>
                            ) : (
                                <span className="text-warning">No LS Task ID</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {task.status === TaskStatus.IN_PROGRESS && (
                            <div className="flex gap-2">
                                {task.label_studio_task_id && (
                                    <Button size="sm" variant="outline" onClick={() => openLabelStudio(getLabelStudioUrl())}>
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        Continue
                                    </Button>
                                )}
                                {/* NEW: Mark Complete button */}
                                <Button size="sm" onClick={() => setShowCompleteDialog(true)}>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Mark Complete
                                </Button>
                            </div>
                        )}
                        {task.status === TaskStatus.ASSIGNED && (
                            <Button size="sm" onClick={handleStart}>
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {task.label_studio_task_id ? 'Start Annotating' : 'Start'}
                            </Button>
                        )}
                        {task.status === TaskStatus.COMPLETED && (
                            <span className="text-xs text-success font-medium">✓ Completed</span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}