'use client';
import Image from "next/image";
import Link from "next/link";
import { Github, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-bg-primary border-t border-border-subtle relative overflow-hidden">
            {/* Aurora Effect */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-bg-secondary/30" />
                <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute -bottom-32 right-1/4 w-80 h-80 bg-primary-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
                <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="py-12 flex flex-col md:flex-row items-start justify-between gap-8">
                    {/* Brand */}
                    <div className="space-y-4 max-w-xs">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image src="/logo.png" alt="Curate-LLM" width={32} height={32} />
                            <span className="text-xl font-bold text-gradient-orange-deep">
                                Curate-LLM
                            </span>
                        </Link>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Build high-quality training datasets 10x faster with our AI-powered annotation platform.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <Link
                                href="https://github.com"
                                className="w-9 h-9 rounded-lg bg-bg-secondary border border-border-subtle flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-bg-tertiary transition-all duration-300"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </Link>
                            <Link
                                href="mailto:hello@curatellm.com"
                                className="w-9 h-9 rounded-lg bg-bg-secondary border border-border-subtle flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-bg-tertiary transition-all duration-300"
                                aria-label="Email"
                            >
                                <Mail className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Links - only real pages */}
                    <div className="flex gap-16">
                        <div className="space-y-4">
                            <h3 className="text-text-primary font-semibold text-sm">Platform</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="#features" className="text-text-secondary hover:text-primary text-sm transition-colors duration-200">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="text-text-secondary hover:text-primary text-sm transition-colors duration-200">
                                        Get Started
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard" className="text-text-secondary hover:text-primary text-sm transition-colors duration-200">
                                        Dashboard
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-border-subtle">
                    <div className="flex justify-center text-sm text-text-tertiary">
                        <p>© {new Date().getFullYear()} Curate-LLM. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}