'use client';

import { useState } from 'react';
import { Plus, Loader2, Sparkles } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LabelConfigSelector } from './label-config-selector';
import { LabelConfigPreview } from './label-config-preview';
import { useCreateProject } from '@/hooks/use-projects';
import { LabelConfigTemplate } from '@/types/label-config';

interface CreateProjectModalProps {
    trigger?: React.ReactNode;
    onSuccess?: (projectId: string) => void;
}

export function CreateProjectModal({ trigger, onSuccess }: CreateProjectModalProps) {
    const [open, setOpen] = useState(false);
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
                    setOpen(false);
                    setName('');
                    setDescription('');
                    setSelectedTemplate(null);
                    onSuccess?.(data.id);
                },
            }
        );
    };

    const isValid = name.trim() && selectedTemplate;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Project
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Create New Project
                        </DialogTitle>
                        <DialogDescription>
                            Set up a new annotation project with Label Studio integration
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Project Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Project Name <span className="text-error">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Dog vs Cat Classification"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="What is this project about?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Template Selector */}
                        <LabelConfigSelector
                            value={selectedTemplate?.id}
                            onChange={setSelectedTemplate}
                        />

                        {/* Preview */}
                        {selectedTemplate && (
                            <LabelConfigPreview config={selectedTemplate.config} />
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            disabled={createProject.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!isValid || createProject.isPending}>
                            {createProject.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Project
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}