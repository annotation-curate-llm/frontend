'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Upload,
    Settings,
    MoreVertical,
    Trash2,
    Download,
    ExternalLink,
    Loader2,
} from 'lucide-react';
import { useProject, useDeleteProject } from '@/hooks/use-projects';
import { useProjectTasks } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskStatus } from '@/types/task';
import { cn } from '@/lib/utils';

interface ProjectDetailPageProps {
    projectId: string;
}

type TabType = 'overview' | 'tasks' | 'settings';

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const { data: project, isLoading, error } = useProject(projectId);
    const { data: tasks } = useProjectTasks(projectId);
    const deleteProject = useDeleteProject();

    const handleDelete = async () => {
        if (!confirm(`Delete "${project?.name}"? This cannot be undone.`)) return;

        deleteProject.mutate(projectId, {
            onSuccess: () => router.push('/dashboard/projects'),
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-error mb-2">Project not found</p>
                    <Button onClick={() => router.push('/dashboard/projects')}>
                        Back to Projects
                    </Button>
                </div>
            </div>
        );
    }

    const completionRate =
        project.total_tasks && project.total_tasks > 0
            ? Math.round((project.completed_tasks! / project.total_tasks) * 100)
            : 0;

    const tasksByStatus = {
        total: tasks?.length || 0,
        unassigned: tasks?.filter((t) => t.status === TaskStatus.UNASSIGNED).length || 0,
        assigned: tasks?.filter((t) => t.status === TaskStatus.ASSIGNED).length || 0,
        in_progress: tasks?.filter((t) => t.status === TaskStatus.IN_PROGRESS).length || 0,
        completed: tasks?.filter((t) => t.status === TaskStatus.COMPLETED).length || 0,
        reviewed: tasks?.filter((t) => t.status === TaskStatus.REVIEWED).length || 0,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-3">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                </Button>

                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-gradient-orange rounded-2xl flex items-center justify-center shadow-glow-orange">
                            <span className="text-3xl">
                                {project.category === 'classification' && '🖼️'}
                                {project.category === 'object_detection' && '⬜'}
                                {project.category === 'segmentation' && '🎨'}
                                {project.category === 'text_classification' && '📝'}
                                {project.category === 'ner' && '🏷️'}
                                {project.category === 'audio' && '🎵'}
                                {!project.category && '📁'}
                            </span>
                        </div>

                        {/* Info */}
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary mb-2">{project.name}</h1>
                            {project.description && (
                                <p className="text-text-secondary mb-3">{project.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-text-tertiary">
                                <span className="capitalize">{project.category?.replace('_', ' ')}</span>
                                <span>•</span>
                                <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                                {project.label_studio_project_id && (
                                    <>
                                        <span>•</span>
                                        <span>Label Studio ID: {project.label_studio_project_id}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button asChild>
                            <Link href={`/dashboard/projects/${projectId}/upload`}>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Assets
                            </Link>
                        </Button>

                        {project.label_studio_project_id && (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    window.open(
                                        `http://localhost:8080/projects/${project.label_studio_project_id}`,
                                        '_blank'
                                    )
                                }
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open in Label Studio
                            </Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Data
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDelete} className="text-error">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Project
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-bg-secondary border border-border-subtle rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Total Tasks</p>
                    <p className="text-3xl font-bold text-text-primary">{tasksByStatus.total}</p>
                </div>
                <div className="p-4 bg-bg-secondary border border-border-subtle rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Completed</p>
                    <p className="text-3xl font-bold text-success">{tasksByStatus.completed}</p>
                </div>
                <div className="p-4 bg-bg-secondary border border-border-subtle rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-warning">{tasksByStatus.in_progress}</p>
                </div>
                <div className="p-4 bg-bg-secondary border border-border-subtle rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Completion Rate</p>
                    <p className="text-3xl font-bold text-primary">{completionRate}%</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-text-primary">Overall Progress</h3>
                    <span className="text-sm text-text-tertiary">
                        {project.completed_tasks || 0} / {project.total_tasks || 0} tasks
                    </span>
                </div>
                <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-orange transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border-subtle">
                <div className="flex gap-6">
                    {(['overview', 'tasks', 'settings'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                'pb-3 text-sm font-medium transition-colors relative',
                                activeTab === tab
                                    ? 'text-primary'
                                    : 'text-text-tertiary hover:text-text-primary'
                            )}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'overview' && (
                    <OverviewTab project={project} tasksByStatus={tasksByStatus} />
                )}
                {activeTab === 'tasks' && <TasksTab projectId={projectId} tasks={tasks || []} />}
                {activeTab === 'settings' && <SettingsTab project={project} />}
            </div>
        </div>
    );
}

function OverviewTab({ project, tasksByStatus }: any) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Distribution */}
            <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Task Distribution</h3>
                <div className="space-y-3">
                    {[
                        { label: 'Unassigned', count: tasksByStatus.unassigned, color: 'text-text-tertiary' },
                        { label: 'Assigned', count: tasksByStatus.assigned, color: 'text-info' },
                        { label: 'In Progress', count: tasksByStatus.in_progress, color: 'text-warning' },
                        { label: 'Completed', count: tasksByStatus.completed, color: 'text-success' },
                        { label: 'Reviewed', count: tasksByStatus.reviewed, color: 'text-primary' },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">{item.label}</span>
                            <span className={cn('text-lg font-semibold', item.color)}>{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Label Configuration */}
            <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Label Configuration</h3>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-text-tertiary mb-1">Category</p>
                        <p className="text-sm text-text-primary capitalize">
                            {project.category?.replace('_', ' ') || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-text-tertiary mb-1">Label Studio Project ID</p>
                        <p className="text-sm text-text-primary">
                            {project.label_studio_project_id || 'Not created'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-text-tertiary mb-1">Status</p>
                        <span
                            className={cn(
                                'inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium',
                                project.is_active
                                    ? 'bg-success/10 text-success'
                                    : 'bg-text-tertiary/10 text-text-tertiary'
                            )}
                        >
                            {project.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TasksTab({ projectId, tasks }: any) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-text-secondary">
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''} in this project
                </p>
                <Button asChild size="sm">
                    <Link href={`/dashboard/projects/${projectId}/upload`}>
                        <Upload className="w-4 h-4 mr-2" />
                        Add More Tasks
                    </Link>
                </Button>
            </div>

            {tasks.length > 0 ? (
                <div className="text-center py-8 text-text-tertiary text-sm">
                    Task management view coming soon...
                </div>
            ) : (
                <div className="text-center py-12 bg-bg-secondary border border-border-subtle rounded-xl">
                    <p className="text-text-secondary mb-4">No tasks yet</p>
                    <Button asChild>
                        <Link href={`/dashboard/projects/${projectId}/upload`}>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Assets to Create Tasks
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

function SettingsTab({ project }: any) {
    return (
        <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Label Configuration (XML)</h3>
            <pre className="p-4 bg-bg-tertiary rounded-xl overflow-x-auto text-xs font-mono text-text-primary">
                {project.label_config}
            </pre>
        </div>
    );
}