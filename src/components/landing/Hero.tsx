'use client';

import Beams from "@/components/ui/Beams";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
    return (
        <div className="min-h-screen relative">
            {/* Background Beams - Fixed layer */}
            <div className="fixed inset-0 z-0 w-full h-full" style={{ height: '150vh' }}>
                <Beams
                    beamWidth={3}
                    beamHeight={60}
                    beamNumber={20}
                    lightColor="#ff6600"
                    speed={2}
                    noiseIntensity={1.75}
                    scale={0.2}
                    rotation={30}
                />
            </div>

            {/* Content layer - Above background */}
            <div className="relative flex h-screen w-full overflow-hidden antialiased md:items-center md:justify-center">
                <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
                    {/* Badge (Optional) */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-black/50 px-4 py-1.5 text-xs text-white backdrop-blur-sm">
                            <span className="text-gradient-orange">
                                ✨ Powered by Label Studio
                            </span>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="bg-opacity-50 bg-linear-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
                        <span className='text-gradient-orange-deep'>Curate-LLM</span>
                        <br />
                        Annotate Data 10x Faster
                    </h1>

                    {/* Subheading */}
                    <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300 md:text-lg">
                        Build high-quality training datasets with your team.
                        Label images, audio, text, and video in one powerful platform.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Link href="/signup">
                            <Button size="lg" className="bg-gradient-orange hover:shadow-glow-orange w-full sm:w-auto">
                                Get Started Free
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                Learn More
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-neutral-400">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            14-day free trial
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Setup in 5 minutes
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}