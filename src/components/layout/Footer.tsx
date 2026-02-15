'use client';

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    const footerLinks = {
        Product: [
            { name: "Features", href: "/features" },
            { name: "Documentation", href: "/docs" },
            { name: "API Reference", href: "/api" },
            { name: "Integrations", href: "/integrations" },
        ],
        Company: [
            { name: "About", href: "/about" },
            { name: "Blog", href: "/blog" },
            { name: "Careers", href: "/careers" },
            { name: "Contact", href: "/contact" },
        ],
        Resources: [
            { name: "Guides", href: "/guides" },
            { name: "Support", href: "/support" },
            { name: "Community", href: "/community" },
            { name: "Changelog", href: "/changelog" },
        ],
        Legal: [
            { name: "Privacy", href: "/privacy" },
            { name: "Terms", href: "/terms" },
            { name: "Security", href: "/security" },
            { name: "Cookies", href: "/cookies" },
        ],
    };

    const socialLinks = [
        { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
        { name: "GitHub", icon: Github, href: "https://github.com" },
        { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
        { name: "Email", icon: Mail, href: "mailto:hello@annotatellm.com" },
    ];

    return (
        <footer className="bg-bg-primary border-t border-border-subtle relative overflow-hidden">
            {/* Aurora Effect - Multiple layers for depth */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-bg-secondary/30" />

                {/* Aurora Glow 1 - Orange */}
                <div
                    className="absolute -bottom-40 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '4s' }}
                />

                {/* Aurora Glow 2 - Deep Orange */}
                <div
                    className="absolute -bottom-32 right-1/4 w-80 h-80 bg-primary-700/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '5s', animationDelay: '1s' }}
                />

                {/* Aurora Glow 3 - Light Orange */}
                <div
                    className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-400/15 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '6s', animationDelay: '2s' }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Main Footer Content */}
                <div className="py-12 grid grid-cols-2 md:grid-cols-6 gap-8">
                    {/* Brand Column - Spans 2 columns */}
                    <div className="col-span-2 space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-3xl">💀</span>
                            <span className="text-xl font-bold text-gradient-orange-deep">
                                Curate-LLM
                            </span>
                        </Link>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                            Build high-quality training datasets 10x faster with our AI-powered annotation platform.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-2">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    className="w-9 h-9 rounded-lg bg-bg-secondary border border-border-subtle flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-bg-tertiary transition-all duration-300"
                                    aria-label={social.name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <social.icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="space-y-4">
                            <h3 className="text-text-primary font-semibold text-sm">
                                {category}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-text-secondary hover:text-primary text-sm transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-border-subtle">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-text-tertiary">
                        {/* Copyright */}
                        <p>
                            © {new Date().getFullYear()} Curate-LLM. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}