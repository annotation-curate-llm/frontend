'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center shadow-glow-orange">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Create New Project</h1>
                        <p className="text-text-secondary">
                            Set up a new annotation project with Label Studio
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info Card */}
                <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl space-y-4">
                    <h2 className="text-lg font-semibold text-text-primary">Project Details</h2>

                    {/* Project Name */}
                    <div>
                        <Label htmlFor="name">
                            Project Name <span className="text-error">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g., Dog vs Cat Classification"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-2"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="What is this project about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Template Selection Card */}
                <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl space-y-4">
                    <h2 className="text-lg font-semibold text-text-primary">Annotation Type</h2>
                    <LabelConfigSelector
                        value={selectedTemplate?.id}
                        onChange={setSelectedTemplate}
                    />
                </div>

                {/* Preview Card */}
                {selectedTemplate && (
                    <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary">Configuration Preview</h2>
                        <LabelConfigPreview config={selectedTemplate.config} />
                    </div>
                )}

                {/* Info Card */}
                <div className="p-4 bg-info/10 border border-info/20 rounded-xl">
                    <p className="text-sm text-text-secondary">
                        💡 <strong>Tip:</strong> You can upload assets and create tasks after creating the
                        project. The Label Studio project will be automatically created with your selected
                        configuration.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
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
                    >
                        {createProject.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating Project...
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