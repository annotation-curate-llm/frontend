'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ImageIcon,
    Users,
    CheckCircle,
    Download,
    BarChart3,
    Zap,
    Shield,
    Clock
} from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: ImageIcon,
            title: "Multi-Format Support",
            description: "Annotate images, audio, text, and video all in one platform.",
            badge: "All Types",
            gradient: "from-primary-500 to-primary-700"
        },
        {
            icon: Users,
            title: "Real-Time Collaboration",
            description: "Work together with your team simultaneously on the same datasets.",
            badge: "Team Ready",
            gradient: "from-primary-600 to-primary-800"
        },
        {
            icon: CheckCircle,
            title: "Quality Control",
            description: "Built-in review system ensures high-quality annotations every time.",
            badge: "QA Built-in",
            gradient: "from-primary-400 to-primary-600"
        },
        {
            icon: Download,
            title: "Export Formats",
            description: "Export to COCO, YOLO, JSON, CSV, and more ML-ready formats.",
            badge: "5+ Formats",
            gradient: "from-primary-500 to-primary-700"
        },
        {
            icon: BarChart3,
            title: "Progress Tracking",
            description: "Real-time analytics and performance metrics for your team.",
            badge: "Live Stats",
            gradient: "from-primary-600 to-primary-800"
        },
        {
            icon: Zap,
            title: "10x Faster",
            description: "Intuitive interface and keyboard shortcuts speed up annotation.",
            badge: "Speed",
            gradient: "from-primary-400 to-primary-600"
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your data stays secure with enterprise-grade encryption.",
            badge: "Secure",
            gradient: "from-primary-500 to-primary-700"
        },
        {
            icon: Clock,
            title: "Version Control",
            description: "Track changes and maintain annotation history automatically.",
            badge: "History",
            gradient: "from-primary-600 to-primary-800"
        }
    ];

    return (
        <section className="py-20 px-4 bg-bg-primary relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-subtle opacity-50" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                        Powerful Features
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Everything You Need{" "}
                        <span className="text-gradient-orange-deep">to Annotate</span>
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Built for ML teams who demand speed, quality, and collaboration in their annotation workflow.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="card group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            <CardHeader>
                                {/* Icon with gradient background */}
                                <div className="mb-4 relative">
                                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center group-hover:shadow-glow-orange transition-all duration-300`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    {/* Badge */}
                                    <Badge className="absolute -top-2 -right-2 bg-bg-tertiary border-primary/30 text-xs">
                                        {feature.badge}
                                    </Badge>
                                </div>

                                <CardTitle className="text-xl mb-2 text-text-primary">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <CardDescription className="text-text-secondary">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    );
}