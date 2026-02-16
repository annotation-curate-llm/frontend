'use client';

import { useState } from 'react';
import { Download, Loader2, CheckCircle2, XCircle, Trash2, FileJson, FileText } from 'lucide-react';
import { useProjects } from '@/hooks/use-projects';
import { useExports, useCreateExport, useDeleteExport } from '@/hooks/use-exports';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ExportJob } from '@/types/export';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExportFormat, ExportStatus } from '@/types/export';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const FORMAT_INFO: Record<ExportFormat, {
    label: string;
    description: string;
    icon: any;
}> = {
    [ExportFormat.JSON]: {
        label: 'JSON',
        description: 'Standard JSON format',
        icon: FileJson,
    },
    [ExportFormat.JSONL]: {
        label: 'JSON Lines',
        description: 'One JSON object per line',
        icon: FileJson,
    },
    [ExportFormat.CSV]: {
        label: 'CSV',
        description: 'Comma-separated values',
        icon: FileText,
    },
    [ExportFormat.COCO]: {
        label: 'COCO',
        description: 'COCO dataset format (object detection)',
        icon: FileJson,
    },
    [ExportFormat.YOLO]: {
        label: 'YOLO',
        description: 'YOLO format (object detection)',
        icon: FileText,
    },
};

export function ExportDataPage() {
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(ExportFormat.JSON);

    const { data: projects } = useProjects();
    const { data: exports } = useExports();
    const createExport = useCreateExport();
    const deleteExport = useDeleteExport();

    const selectedProject = projects?.find((p) => p.id === selectedProjectId);

    const handleCreateExport = () => {
        if (!selectedProjectId) return;

        createExport.mutate({
            project_id: selectedProjectId,
            export_format: selectedFormat,
        });
    };

    const handleDelete = (exportId: string) => {
        if (confirm('Delete this export?')) {
            deleteExport.mutate(exportId);
        }
    };

    const projectExports = exports?.filter(
        (exp) => !selectedProjectId || exp.project_id === selectedProjectId
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Export Data</h1>
                <p className="text-text-secondary">
                    Export approved annotations in various formats
                </p>
            </div>

            {/* Create Export Section */}
            <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                    Create New Export
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Selector */}
                    <div>
                        <Label className="mb-2 block">Select Project</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {selectedProject ? selectedProject.name : 'Choose a project...'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                {projects?.map((project) => (
                                    <DropdownMenuItem
                                        key={project.id}
                                        onClick={() => setSelectedProjectId(project.id)}
                                    >
                                        <div>
                                            <p className="font-medium">{project.name}</p>
                                            <p className="text-xs text-text-tertiary">
                                                {project.completed_tasks || 0} completed tasks
                                            </p>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Format Selector */}
                    <div>
                        <Label className="mb-2 block">Export Format</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {FORMAT_INFO[selectedFormat].label}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                <DropdownMenuLabel>Select Format</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {Object.entries(FORMAT_INFO).map(([format, info]) => {
                                    const Icon = info.icon;
                                    return (
                                        <DropdownMenuItem
                                            key={format}
                                            onClick={() => setSelectedFormat(format as ExportFormat)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Icon className="w-4 h-4 mt-0.5 text-text-tertiary" />
                                                <div>
                                                    <p className="font-medium">{info.label}</p>
                                                    <p className="text-xs text-text-tertiary">{info.description}</p>
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Selected Format Info */}
                {selectedFormat && (
                    <div className="mt-4 p-4 bg-bg-tertiary rounded-xl">
                        <p className="text-sm text-text-secondary">
                            {FORMAT_INFO[selectedFormat].description}
                        </p>
                    </div>
                )}

                <Button
                    onClick={handleCreateExport}
                    disabled={!selectedProjectId || createExport.isPending}
                    className="w-full mt-6"
                >
                    {createExport.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating Export...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4 mr-2" />
                            Create Export
                        </>
                    )}
                </Button>
            </div>

            {/* Export History */}
            <div>
                <h2 className="text-lg font-semibold text-text-primary mb-4">Export History</h2>

                {projectExports && projectExports.length > 0 ? (
                    <div className="space-y-3">
                        {projectExports.map((exportJob) => (
                            <ExportJobCard
                                key={exportJob.id}
                                exportJob={exportJob}
                                onDelete={handleDelete}
                                projectName={
                                    projects?.find((p) => p.id === exportJob.project_id)?.name || 'Unknown'
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 bg-bg-secondary border border-border-subtle rounded-2xl text-center">
                        <Download className="w-16 h-16 text-text-tertiary mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-text-primary mb-2">No Exports Yet</h3>
                        <p className="text-text-secondary">
                            Create your first export to download annotation data
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ExportJobCard({
    exportJob,
    onDelete,
    projectName,
}: {
    exportJob: ExportJob;
    onDelete: (id: string) => void;
    projectName: string;
}) {
    const statusConfig: Record<ExportStatus, {
        icon: any;
        color: string;
        bg: string;
        label: string;
        animate?: boolean;
    }> = {
        [ExportStatus.PENDING]: {
            icon: Loader2,
            color: 'text-text-tertiary',
            bg: 'bg-text-tertiary/10',
            label: 'Queued',
        },
        [ExportStatus.PROCESSING]: {
            icon: Loader2,
            color: 'text-warning',
            bg: 'bg-warning/10',
            label: 'Processing',
            animate: true,
        },
        [ExportStatus.COMPLETED]: {
            icon: CheckCircle2,
            color: 'text-success',
            bg: 'bg-success/10',
            label: 'Completed',
        },
        [ExportStatus.FAILED]: {
            icon: XCircle,
            color: 'text-error',
            bg: 'bg-error/10',
            label: 'Failed',
        },
    };

    const config = statusConfig[exportJob.status];
    const Icon = config.icon;

    return (
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 hover:border-primary transition-all">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', config.bg)}>
                        <Icon className={cn('w-5 h-5', config.color, config.animate && 'animate-spin')} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-text-primary">{projectName}</h3>
                            <span className={cn('px-2 py-0.5 rounded text-xs font-medium', config.bg, config.color)}>
                                {FORMAT_INFO[exportJob.export_format].label}
                            </span>
                        </div>

                        <p className="text-xs text-text-tertiary mb-2">
                            Created {formatDistanceToNow(new Date(exportJob.created_at), { addSuffix: true })}
                        </p>

                        {exportJob.total_annotations && (
                            <p className="text-xs text-text-secondary">
                                {exportJob.total_annotations} annotations
                            </p>
                        )}

                        {exportJob.error_message && (
                            <p className="text-xs text-error mt-1">{exportJob.error_message}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {exportJob.status === ExportStatus.COMPLETED && exportJob.file_url && (
                        <Button
                            size="sm"
                            onClick={() => window.open(exportJob.file_url, '_blank')}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(exportJob.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}