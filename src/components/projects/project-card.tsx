'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Trash2, Edit, ExternalLink, Loader2 } from 'lucide-react';
import { ProjectWithStats } from '@/types/project';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDeleteProject } from '@/hooks/use-projects';

interface ProjectCardProps {
    project: ProjectWithStats;
    onEdit?: (project: ProjectWithStats) => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteProject = useDeleteProject();

    const completionRate = project.total_tasks > 0
        ? Math.round((project.completed_tasks / project.total_tasks) * 100)
        : 0;

    const handleDelete = async () => {
        if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;

        setIsDeleting(true);
        deleteProject.mutate(project.id, {
            onSettled: () => setIsDeleting(false),
        });
    };

    return (
        <div className="group relative bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-primary hover:shadow-card-hover transition-all">
            {/* Actions Menu */}
            <div className="absolute top-4 right-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(project)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/projects/${project.id}`}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-error focus:text-error"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4 mr-2" />
                            )}
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Icon/Category Badge */}
            <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center mb-4 shadow-glow-orange">
                <span className="text-2xl">
                    {project.category === 'classification' && '🖼️'}
                    {project.category === 'object_detection' && '⬜'}
                    {project.category === 'segmentation' && '🎨'}
                    {project.category === 'text_classification' && '📝'}
                    {project.category === 'ner' && '🏷️'}
                    {project.category === 'audio' && '🎵'}
                    {!project.category && '📁'}
                </span>
            </div>

            {/* Project Info */}
            <Link href={`/dashboard/projects/${project.id}`}>
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {project.name}
                </h3>
            </Link>

            {project.description && (
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {project.description}
                </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-text-primary">
                        {project.total_tasks || 0}
                    </p>
                    <p className="text-xs text-text-tertiary">Total</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-success">
                        {project.completed_tasks || 0}
                    </p>
                    <p className="text-xs text-text-tertiary">Done</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-warning">
                        {project.pending_tasks || 0}
                    </p>
                    <p className="text-xs text-text-tertiary">Pending</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-text-tertiary">Progress</span>
                    <span className="text-text-primary font-medium">{completionRate}%</span>
                </div>
                <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-orange transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-tertiary">
                <span className="capitalize">{project.category?.replace('_', ' ') || 'General'}</span>
                <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    );
}