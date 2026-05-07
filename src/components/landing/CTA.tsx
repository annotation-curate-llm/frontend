'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTA() {
    return (
        <section className="py-20 px-4 bg-bg-primary relative overflow-hidden">

            {/* glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header - matching Features style */}
                <div className="text-center mb-16 space-y-4">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Get Started Today
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Ready to Transform Your{" "}
                        <span className="text-gradient-orange-deep">Annotation Workflow?</span>
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Join ML teams building high-quality training datasets with our powerful annotation platform.
                        Start annotating in minutes.
                    </p>
                </div>

                {/* Main CTA Card */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="relative group">
                        {/* Animated glow border */}
                        <div className="absolute -inset-0.5 bg-linear-to-r from-primary-400 via-primary-500 to-primary-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500 animate-glow" />

                        <div className="relative bg-linear-to-r from-bg-secondary to-bg-tertiary border border-border-subtle rounded-2xl p-8 md:p-12 backdrop-blur-sm">
                            <div className="text-center space-y-8">
                                {/* Value Props */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    {[
                                        { title: "Quick Setup", desc: "Create your first project in under 5 minutes" },
                                        { title: "Team Ready", desc: "Collaborate with your team in real-time" },
                                        { title: "Export Anywhere", desc: "COCO, YOLO, JSON, CSV formats supported" },
                                    ].map((item, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="text-text-primary font-semibold">
                                                {item.title}
                                            </div>
                                            <div className="text-text-secondary text-sm">
                                                {item.desc}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                    <Link href="/login">
                                        <Button size="lg" className="bg-gradient-orange hover:shadow-glow-orange-strong w-full sm:w-auto px-8">
                                            Get Started Free
                                        </Button>
                                    </Link>
                                    <Link href="/demo">
                                        <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-primary/30 hover:bg-primary/10">
                                            View Demo
                                        </Button>
                                    </Link>
                                </div>

                                {/* Trust Indicators */}
                                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-tertiary pt-4 border-t border-border-subtle">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-success" />
                                        No credit card required
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-success" />
                                        Setup in 5 minutes
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-success" />
                                        Open source powered
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom message */}
                <div className="text-center">
                    <p className="text-text-tertiary text-sm">
                        Powered by Label Studio • Built for ML Teams
                    </p>
                </div>
            </div>
        </section>
    );
}