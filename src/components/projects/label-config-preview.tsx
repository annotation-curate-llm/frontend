'use client';

import { useState } from 'react';
import { Code, Eye, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LabelConfigPreviewProps {
    config: string;
    className?: string;
}

export function LabelConfigPreview({ config, className }: LabelConfigPreviewProps) {
    const [showRaw, setShowRaw] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(config);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn('w-full', className)}>
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-primary">
                    Label Configuration
                </label>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRaw(!showRaw)}
                        className="h-8"
                    >
                        {showRaw ? (
                            <>
                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                Preview
                            </>
                        ) : (
                            <>
                                <Code className="w-3.5 h-3.5 mr-1.5" />
                                XML
                            </>
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-8"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 mr-1.5" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5 mr-1.5" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {showRaw ? (
                // XML Code View
                <div className="relative">
                    <pre className="p-4 bg-bg-tertiary border border-border-default rounded-xl overflow-x-auto text-xs font-mono">
                        <code className="text-text-primary">{config}</code>
                    </pre>
                </div>
            ) : (
                // Visual Preview
                <div className="p-6 bg-bg-tertiary border border-border-default rounded-xl">
                    <div className="space-y-4">
                        {/* Parse and show visual representation */}
                        <PreviewContent config={config} />
                    </div>
                </div>
            )}
        </div>
    );
}

function PreviewContent({ config }: { config: string }) {
    // Simple parser to show what the config will look like
    const hasImage = config.includes('<Image');
    const hasText = config.includes('<Text');
    const hasAudio = config.includes('<Audio');
    const hasChoices = config.includes('<Choices');
    const hasRectangle = config.includes('<RectangleLabels');
    const hasPolygon = config.includes('<PolygonLabels');
    const hasLabels = config.includes('<Labels');

    // Extract choice values
    const choiceMatches = config.match(/<Choice value="([^"]+)"/g);
    const choices = choiceMatches?.map(m => m.match(/"([^"]+)"/)?.[1]) || [];

    // Extract label values
    const labelMatches = config.match(/<Label value="([^"]+)"/g);
    const labels = labelMatches?.map(m => m.match(/"([^"]+)"/)?.[1]) || [];

    return (
        <div className="space-y-4">
            {/* Media Type */}
            {hasImage && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <div className="w-full h-32 bg-bg-secondary border-2 border-dashed border-border-default rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-12 h-12 mx-auto text-text-tertiary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xs text-text-tertiary">Image will appear here</p>
                        </div>
                    </div>
                </div>
            )}

            {hasText && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <div className="w-full p-4 bg-bg-secondary border border-border-default rounded-lg">
                        <p className="text-sm text-text-secondary italic">Sample text content will appear here...</p>
                    </div>
                </div>
            )}

            {hasAudio && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <div className="w-full p-4 bg-bg-secondary border border-border-default rounded-lg flex items-center gap-3">
                        <svg className="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <div className="flex-1 h-2 bg-bg-tertiary rounded-full"></div>
                        <span className="text-xs text-text-tertiary">0:00 / 0:00</span>
                    </div>
                </div>
            )}

            {/* Annotation Tools */}
            <div className="pt-4 border-t border-border-subtle">
                {hasChoices && choices.length > 0 && (
                    <div>
                        <p className="text-xs font-medium text-text-tertiary mb-2">Classification Options:</p>
                        <div className="flex flex-wrap gap-2">
                            {choices.map((choice, idx) => (
                                <button
                                    key={idx}
                                    className="px-3 py-1.5 bg-bg-secondary border border-border-default rounded-lg text-sm hover:border-primary transition-colors"
                                >
                                    {choice}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {(hasRectangle || hasPolygon) && labels.length > 0 && (
                    <div>
                        <p className="text-xs font-medium text-text-tertiary mb-2">
                            {hasRectangle ? 'Bounding Box Labels:' : 'Segmentation Labels:'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {labels.map((label, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-border-default rounded-lg text-sm"
                                >
                                    <div className="w-3 h-3 rounded-sm bg-primary"></div>
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hasLabels && labels.length > 0 && (
                    <div>
                        <p className="text-xs font-medium text-text-tertiary mb-2">Entity Labels:</p>
                        <div className="flex flex-wrap gap-2">
                            {labels.map((label, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}