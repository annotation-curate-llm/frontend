'use client';

import { useState } from 'react';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
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
import { Input } from '@/components/ui/input';

interface LabelConfigSelectorProps {
    value?: string;
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

function buildConfigFromLabels(baseConfig: string, labels: string[]): string {
    // Replace Choice values in classification configs
    if (baseConfig.includes('<Choices')) {
        const choiceXml = labels.map(l => `    <Choice value="${l}"/>`).join('\n');
        return baseConfig.replace(
            /<Choices([^>]*)>[\s\S]*?<\/Choices>/,
            `<Choices$1>\n${choiceXml}\n  </Choices>`
        );
    }
    // Replace Label values in detection/segmentation configs
    if (baseConfig.includes('<RectangleLabels') || baseConfig.includes('<PolygonLabels') || baseConfig.includes('<Labels')) {
        const labelXml = labels.map(l => `    <Label value="${l}"/>`).join('\n');
        return baseConfig
            .replace(/<RectangleLabels([^>]*)>[\s\S]*?<\/RectangleLabels>/, `<RectangleLabels$1>\n${labelXml}\n  </RectangleLabels>`)
            .replace(/<PolygonLabels([^>]*)>[\s\S]*?<\/PolygonLabels>/, `<PolygonLabels$1>\n${labelXml}\n  </PolygonLabels>`)
            .replace(/<Labels([^>]*)>[\s\S]*?<\/Labels>/, `<Labels$1>\n${labelXml}\n  </Labels>`);
    }
    return baseConfig;
}

export function LabelConfigSelector({ value, onChange, className }: LabelConfigSelectorProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<LabelConfigTemplate | null>(
        value ? LABEL_CONFIG_TEMPLATES.find((t) => t.id === value) || null : null
    );
    const [customLabels, setCustomLabels] = useState<string[]>([]);
    const [newLabel, setNewLabel] = useState('');

    const handleSelect = (template: LabelConfigTemplate) => {
        const initialLabels = template.labels || [];
        setSelectedTemplate(template);
        setCustomLabels(initialLabels);
        onChange({ ...template, labels: initialLabels, config: buildConfigFromLabels(template.config, initialLabels) });
    };

    const handleAddLabel = () => {
        const trimmed = newLabel.trim();
        if (!trimmed || customLabels.includes(trimmed)) return;
        const updated = [...customLabels, trimmed];
        setCustomLabels(updated);
        setNewLabel('');
        if (selectedTemplate) {
            const newConfig = buildConfigFromLabels(selectedTemplate.config, updated);
            onChange({ ...selectedTemplate, labels: updated, config: newConfig });
        }
    };

    const handleRemoveLabel = (label: string) => {
        const updated = customLabels.filter(l => l !== label);
        setCustomLabels(updated);
        if (selectedTemplate) {
            const newConfig = buildConfigFromLabels(selectedTemplate.config, updated);
            onChange({ ...selectedTemplate, labels: updated, config: newConfig });
        }
    };

    const groupedTemplates = LABEL_CONFIG_TEMPLATES.reduce((acc, template) => {
        if (!acc[template.category]) acc[template.category] = [];
        acc[template.category].push(template);
        return acc;
    }, {} as Record<string, LabelConfigTemplate[]>);

    return (
        <div className={cn('w-full space-y-4', className)}>
            <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                    Annotation Type <span className="text-error">*</span>
                </label>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between h-11">
                            {selectedTemplate ? (
                                <div className="flex items-center gap-2">
                                    {(() => { const Icon = selectedTemplate.icon; return <Icon className="w-4 h-4" />; })()}
                                    <span>{selectedTemplate.name}</span>
                                </div>
                            ) : (
                                <span className="text-text-tertiary">Select annotation template...</span>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-[420px] max-h-[500px] overflow-y-auto">
                        {Object.entries(groupedTemplates).map(([category, templates]) => (
                            <div key={category}>
                                <DropdownMenuLabel className="text-xs uppercase tracking-wider text-text-tertiary px-3 py-2">
                                    {CATEGORY_LABELS[category as LabelConfigCategory]}
                                </DropdownMenuLabel>
                                {templates.map((template) => {
                                    const Icon = template.icon;
                                    return (
                                        <DropdownMenuItem
                                            key={template.id}
                                            onClick={() => handleSelect(template)}
                                            className="cursor-pointer px-3 py-2"
                                        >
                                            <div className="flex items-start gap-3 w-full">
                                                <Icon className="w-5 h-5 shrink-0 mt-0.5 text-text-secondary" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">{template.name}</span>
                                                        {selectedTemplate?.id === template.id && (
                                                            <Check className="w-3.5 h-3.5 text-primary" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
                                                        {template.description}
                                                    </p>
                                                    {template.labels && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {template.labels.slice(0, 4).map((label, idx) => (
                                                                <span key={idx} className="px-1.5 py-0.5 text-xs bg-bg-tertiary border border-border-subtle rounded">
                                                                    {label}
                                                                </span>
                                                            ))}
                                                            {template.labels.length > 4 && (
                                                                <span className="text-xs text-text-tertiary">+{template.labels.length - 4} more</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    );
                                })}
                                <DropdownMenuSeparator />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Custom Label Editor — shown after template selected */}
            {selectedTemplate && (
                <div className="p-4 bg-bg-tertiary border border-border-subtle rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">
                            Customize Labels
                        </p>
                        <span className="text-xs text-text-tertiary">{customLabels.length} label{customLabels.length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Current Labels */}
                    <div className="flex flex-wrap gap-2 min-h-9">
                        {customLabels.map((label, idx) => (
                            <span
                                key={idx}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-bg-secondary border border-border-default rounded-lg text-sm"
                            >
                                {label}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLabel(label)}
                                    className="text-text-tertiary hover:text-error transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        {customLabels.length === 0 && (
                            <p className="text-xs text-text-tertiary italic">No labels yet — add some below</p>
                        )}
                    </div>

                    {/* Add Label Input */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g. Dog, Cat, Bird..."
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLabel(); } }}
                            className="h-9 text-sm"
                        />
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleAddLabel}
                            disabled={!newLabel.trim()}
                            className="h-9 px-3 shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-text-tertiary">Press Enter or click + to add a label</p>
                </div>
            )}
        </div>
    );
}