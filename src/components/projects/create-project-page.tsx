'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LabelConfigSelector } from '@/components/projects/label-config-selector';
import { LabelConfigPreview } from '@/components/projects/label-config-preview';
import { useCreateProject } from '@/hooks/use-projects';
import { LabelConfigTemplate } from '@/types/label-config';

export function CreateProjectPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<LabelConfigTemplate | null>(null);

    const createProject = useCreateProject();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !selectedTemplate) return;

        createProject.mutate(
            {
                name: name.trim(),
                description: description.trim() || undefined,
                category: selectedTemplate.category,
                label_config: selectedTemplate.config,
            },
            {
                onSuccess: (data) => {
                    router.push(`/dashboard/projects/${data.id}`);
                },
            }
        );
    };

    const isValid = name.trim() && selectedTemplate;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center shadow-glow-orange shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Create New Project</h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Set up a new annotation project with Label Studio
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Details */}
                <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl space-y-5">
                    <h2 className="text-base font-semibold text-text-primary">Project Details</h2>

                    <div className="space-y-1.5">
                        <Label htmlFor="name">
                            Project Name <span className="text-error">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g., Dog vs Cat Classification"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-10"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description">Description <span className="text-text-tertiary font-normal">(optional)</span></Label>
                        <Textarea
                            id="description"
                            placeholder="What is this project about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="resize-none"
                        />
                    </div>
                </div>

                {/* Annotation Type */}
                <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                    <h2 className="text-base font-semibold text-text-primary mb-4">Annotation Type</h2>
                    <LabelConfigSelector
                        value={selectedTemplate?.id}
                        onChange={setSelectedTemplate}
                    />
                </div>

                {/* Preview */}
                {selectedTemplate && (
                    <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                        <h2 className="text-base font-semibold text-text-primary mb-4">Configuration Preview</h2>
                        <LabelConfigPreview config={selectedTemplate.config} />
                    </div>
                )}

                {/* Tip */}
                <div className="px-4 py-3 bg-info/10 border border-info/20 rounded-xl">
                    <p className="text-sm text-text-secondary">
                        💡 <strong>Tip:</strong> Upload assets and create tasks after creating the project. The Label Studio project will be automatically synced.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        disabled={createProject.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isValid || createProject.isPending}
                        size="lg"
                        className="min-w-40"
                    >
                        {createProject.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Create Project
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}