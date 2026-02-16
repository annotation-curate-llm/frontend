'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    LABEL_CONFIG_TEMPLATES,
    LabelConfigTemplate,
    LabelConfigCategory,
} from '@/types/label-config';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface LabelConfigSelectorProps {
    value?: string; // template id
    onChange: (template: LabelConfigTemplate) => void;
    className?: string;
}

const CATEGORY_LABELS: Record<LabelConfigCategory, string> = {
    classification: 'Image Classification',
    object_detection: 'Object Detection',
    segmentation: 'Segmentation',
    text_classification: 'Text Classification',
    ner: 'Named Entity Recognition',
    audio: 'Audio',
    custom: 'Custom',
};

export function LabelConfigSelector({
    value,
    onChange,
    className,
}: LabelConfigSelectorProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<LabelConfigTemplate | null>(
        value ? LABEL_CONFIG_TEMPLATES.find((t) => t.id === value) || null : null
    );

    const handleSelect = (template: LabelConfigTemplate) => {
        setSelectedTemplate(template);
        onChange(template);
    };

    // Group templates by category
    const groupedTemplates = LABEL_CONFIG_TEMPLATES.reduce((acc, template) => {
        if (!acc[template.category]) {
            acc[template.category] = [];
        }
        acc[template.category].push(template);
        return acc;
    }, {} as Record<string, LabelConfigTemplate[]>);

    return (
        <div className={cn('w-full', className)}>
            <label className="block text-sm font-medium text-text-primary mb-2">
                Annotation Type
            </label>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                    >
                        {selectedTemplate ? (
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{selectedTemplate.icon}</span>
                                <span>{selectedTemplate.name}</span>
                            </div>
                        ) : (
                            <span className="text-text-tertiary">Select annotation template...</span>
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[400px] max-h-[500px] overflow-y-auto">
                    {Object.entries(groupedTemplates).map(([category, templates]) => (
                        <div key={category}>
                            <DropdownMenuLabel className="text-xs uppercase text-text-tertiary">
                                {CATEGORY_LABELS[category as LabelConfigCategory]}
                            </DropdownMenuLabel>

                            {templates.map((template) => (
                                <DropdownMenuItem
                                    key={template.id}
                                    onClick={() => handleSelect(template)}
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-start gap-3 w-full py-1">
                                        <span className="text-2xl shrink-0">{template.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">
                                                    {template.name}
                                                </span>
                                                {selectedTemplate?.id === template.id && (
                                                    <Check className="w-4 h-4 text-primary" />
                                                )}
                                            </div>
                                            <p className="text-xs text-text-tertiary mt-0.5">
                                                {template.description}
                                            </p>
                                            {template.labels && (
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {template.labels.slice(0, 3).map((label, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-1.5 py-0.5 text-xs bg-bg-tertiary border border-border-subtle rounded"
                                                        >
                                                            {label}
                                                        </span>
                                                    ))}
                                                    {template.labels.length > 3 && (
                                                        <span className="text-xs text-text-tertiary">
                                                            +{template.labels.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}

                            <DropdownMenuSeparator />
                        </div>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Selected Template Info */}
            {selectedTemplate && (
                <div className="mt-3 p-3 bg-bg-tertiary border border-border-subtle rounded-xl">
                    <div className="flex items-start gap-2">
                        <span className="text-xl">{selectedTemplate.icon}</span>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-text-primary">
                                {selectedTemplate.name}
                            </h4>
                            <p className="text-xs text-text-secondary mt-1">
                                {selectedTemplate.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}