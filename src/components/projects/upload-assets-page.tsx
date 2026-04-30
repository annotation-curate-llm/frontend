'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/projects/file-upload';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Image, ScanSearch, Layers, FileText, Tag, Music, Folder, ClipboardList } from 'lucide-react';
import { useCreateTask } from '@/hooks/use-tasks';
import { useProject } from '@/hooks/use-projects';
import type { ComponentType } from 'react';

interface UploadAssetsPageProps {
    projectId: string;
}

const CATEGORY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
    classification: Image,
    object_detection: ScanSearch,
    segmentation: Layers,
    text_classification: FileText,
    ner: Tag,
    audio: Music,
};

export function UploadAssetsPage({ projectId }: UploadAssetsPageProps) {
    const router = useRouter();
    const [uploadedAssetIds, setUploadedAssetIds] = useState<string[]>([]);
    const [creatingTasks, setCreatingTasks] = useState(false);

    const { data: project } = useProject(projectId);
    const createTask = useCreateTask();

    const handleUploadComplete = (assetIds: string[]) => {
        setUploadedAssetIds((prev) => [...prev, ...assetIds]);
    };

    const handleCreateTasks = async () => {
        if (uploadedAssetIds.length === 0) return;

        setCreatingTasks(true);

        try {
            for (const assetId of uploadedAssetIds) {
                await createTask.mutateAsync({
                    task: {
                        project_id: projectId,
                        asset_id: assetId,
                        priority: 0,
                    },
                    labelStudioProjectId: project?.label_studio_project_id,
                });
            }

            router.push(`/dashboard/projects/${projectId}`);
        } catch (error) {
            console.error('Error creating tasks:', error);
        } finally {
            setCreatingTasks(false);
        }
    };

    const CategoryIcon = project?.category
        ? (CATEGORY_ICONS[project.category] ?? Folder)
        : Folder;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="mb-3"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-text-primary">Upload Assets</h1>
                    <p className="text-text-secondary mt-1">
                        {project ? `Upload files for ${project.name}` : 'Upload files to project'}
                    </p>
                </div>

                {uploadedAssetIds.length > 0 && (
                    <Button onClick={handleCreateTasks} disabled={creatingTasks} size="lg">
                        {creatingTasks ? (
                            <>Creating {uploadedAssetIds.length} tasks...</>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Create {uploadedAssetIds.length} Task{uploadedAssetIds.length > 1 ? 's' : ''}
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* Info Card */}
            {project && (
                <div className="p-4 bg-bg-secondary border border-border-subtle rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-orange rounded-lg flex items-center justify-center">
                            <CategoryIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-medium text-text-primary">{project.name}</h3>
                            <p className="text-sm text-text-tertiary capitalize">
                                {project.category?.replace('_', ' ')} • {project.total_tasks || 0} existing tasks
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Component */}
            <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6">
                <FileUpload
                    projectId={projectId}
                    onUploadComplete={handleUploadComplete}
                    maxFiles={100}
                />
            </div>

            {/* Instructions */}
            <div className="p-4 bg-info/10 border border-info/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <ClipboardList className="w-4 h-4 text-info" />
                    <h3 className="text-sm font-medium text-info">Next Steps</h3>
                </div>
                <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
                    <li>Upload your files using drag & drop or click to browse</li>
                    <li>Wait for all uploads to complete</li>
                    <li>Click "Create Tasks" to generate annotation tasks</li>
                    <li>Tasks will be available for assignment to annotators</li>
                </ol>
            </div>
        </div>
    );
}