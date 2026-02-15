'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FolderPlus,
    Upload,
    Pencil,
    CheckCircle2,
    Download,
    ArrowRight,
    Sparkles
} from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            step: "01",
            icon: FolderPlus,
            title: "Create Project",
            description: "Set up your annotation project with pre-built templates or custom workflows in seconds.",
            color: "text-primary-400"
        },
        {
            step: "02",
            icon: Upload,
            title: "Upload Data",
            description: "Drag and drop your images, videos, audio, or text. Bulk upload supported.",
            color: "text-primary-500"
        },
        {
            step: "03",
            icon: Pencil,
            title: "Annotate",
            description: "Your team collaborates in real-time using our intuitive Label Studio interface.",
            color: "text-primary-600"
        },
        {
            step: "04",
            icon: CheckCircle2,
            title: "Review",
            description: "Built-in QA workflow ensures quality. Approve or reject with feedback.",
            color: "text-primary-500"
        },
        {
            step: "05",
            icon: Download,
            title: "Export",
            description: "Download in COCO, YOLO, JSON, or CSV format. Ready for your ML pipeline.",
            color: "text-primary-400"
        }
    ];

    return (
        <section className="py-32 px-4 bg-bg-primary relative">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20 space-y-4">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        How It Works
                    </Badge>
                    <h2 className="text-4xl md:text-6xl font-bold">
                        From Upload to Training
                        <br />
                        <span className="text-gradient-orange-deep">in 5 Simple Steps</span>
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Our streamlined workflow transforms raw data into ML-ready datasets faster than ever.
                    </p>
                </div>

                {/* Timeline Steps */}
                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary/30 to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="relative group"
                                style={{
                                    animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                {/* Connector Dot */}
                                <div className="hidden lg:flex absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <div className="w-4 h-4 rounded-full bg-primary border-4 border-bg-primary group-hover:scale-150 transition-transform duration-300" />
                                </div>

                                {/* Card */}
                                <div className="text-center space-y-4">
                                    {/* Icon Circle */}
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-full bg-linear-to-br from-bg-secondary to-bg-tertiary border border-border-subtle flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-glow-orange">
                                                <step.icon className={`w-9 h-9 ${step.color} transition-all duration-300 group-hover:scale-110`} />
                                            </div>
                                            {/* Step number badge */}
                                            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center border-2 border-bg-primary">
                                                {step.step}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-text-secondary leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Hover indicator */}
                                    <div className="h-1 w-0 bg-gradient-orange mx-auto rounded-full group-hover:w-12 transition-all duration-300" />
                                </div>

                                {/* Mobile Arrow */}
                                {index < steps.length - 1 && (
                                    <div className="lg:hidden flex justify-center py-6">
                                        <ArrowRight className="w-5 h-5 text-primary/30 rotate-90" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}