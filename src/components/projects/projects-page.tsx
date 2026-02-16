'use client';

import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Loader2, FolderOpen } from 'lucide-react';
import { useProjects } from '@/hooks/use-projects';
import { ProjectCard } from '@/components/projects/project-card';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
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
import { LabelConfigCategory } from '@/types/label-config';

type SortOption = 'name' | 'date' | 'progress' | 'tasks';

export function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<LabelConfigCategory | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortOption>('date');

    const { data: projects, isLoading, error } = useProjects();

    // Filter and sort projects
    const filteredProjects = projects
        ?.filter((project) => {
            // Search filter
            const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchQuery.toLowerCase());

            // Category filter
            const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'date':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'progress': {
                    const aProgress = a.total_tasks > 0 ? (a.completed_tasks / a.total_tasks) : 0;
                    const bProgress = b.total_tasks > 0 ? (b.completed_tasks / b.total_tasks) : 0;
                    return bProgress - aProgress;
                }
                case 'tasks':
                    return (b.total_tasks || 0) - (a.total_tasks || 0);
                default:
                    return 0;
            }
        });

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
                    <p className="text-error mb-2">Failed to load projects</p>
                    <p className="text-sm text-text-tertiary">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
                    <p className="text-text-secondary mt-1">
                        Manage your annotation projects
                    </p>
                </div>
                <CreateProjectModal />
            </div>

            {/* Filters Bar */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Category Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            {categoryFilter === 'all' ? 'All Categories' : categoryFilter.replace('_', ' ')}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                            All Categories
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryFilter('classification')}>
                            🖼️ Image Classification
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryFilter('object_detection')}>
                            ⬜ Object Detection
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryFilter('segmentation')}>
                            🎨 Segmentation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryFilter('text_classification')}>
                            📝 Text Classification
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryFilter('ner')}>
                            🏷️ NER
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryFilter('audio')}>
                            🎵 Audio
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Sort
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSortBy('date')}>
                            Latest First
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('name')}>
                            Name (A-Z)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('progress')}>
                            Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('tasks')}>
                            Task Count
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Projects Grid */}
            {filteredProjects && filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="w-16 h-16 bg-bg-tertiary rounded-2xl flex items-center justify-center mb-4">
                        <FolderOpen className="w-8 h-8 text-text-tertiary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {searchQuery || categoryFilter !== 'all'
                            ? 'No projects found'
                            : 'No projects yet'}
                    </h3>
                    <p className="text-text-secondary mb-6 max-w-md">
                        {searchQuery || categoryFilter !== 'all'
                            ? 'Try adjusting your filters or search query'
                            : 'Get started by creating your first annotation project'}
                    </p>
                    {!searchQuery && categoryFilter === 'all' && <CreateProjectModal />}
                </div>
            )}

            {/* Stats Footer */}
            {filteredProjects && filteredProjects.length > 0 && (
                <div className="flex items-center justify-between text-sm text-text-tertiary pt-4 border-t border-border-subtle">
                    <span>
                        Showing {filteredProjects.length} of {projects?.length || 0} projects
                    </span>
                    <span>
                        Total tasks: {projects?.reduce((acc, p) => acc + (p.total_tasks || 0), 0) || 0}
                    </span>
                </div>
            )}
        </div>
    );
}