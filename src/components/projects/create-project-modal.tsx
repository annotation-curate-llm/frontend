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
                    <DialogHeader className="pb-2">
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Create New Project
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            Set up a new annotation project with Label Studio integration
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-5">
                        {/* Project Name */}
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

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="description">
                                Description <span className="text-text-tertiary font-normal">(optional)</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="What is this project about?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="resize-none"
                            />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border-subtle" />

                        {/* Template Selector with label editing */}
                        <LabelConfigSelector
                            value={selectedTemplate?.id}
                            onChange={setSelectedTemplate}
                        />

                        {/* Preview */}
                        {selectedTemplate && (
                            <>
                                <div className="border-t border-border-subtle" />
                                <LabelConfigPreview config={selectedTemplate.config} />
                            </>
                        )}
                    </div>

                    <DialogFooter className="pt-2 border-t border-border-subtle gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            disabled={createProject.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isValid || createProject.isPending}
                            className="min-w-[130px]"
                        >
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