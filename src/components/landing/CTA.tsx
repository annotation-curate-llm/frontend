'use client';

import Link from 'next/link';

const valueProps = [
    { num: '01', title: 'Quick setup', desc: 'First project live in under 5 minutes. No config hell.' },
    { num: '02', title: 'Team-ready', desc: 'Invite annotators and reviewers. Roles, permissions, live.' },
    { num: '03', title: 'Export anywhere', desc: 'COCO, YOLO, JSON, CSV — your format, your pipeline.' },
];

const trust = ['No credit card required', 'Open source powered', 'Setup in 5 minutes'];

export default function CTA() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 bg-(--color-bg-primary) border-b bborder-(--color-border-subtle)">

            {/* ── Left ── */}
            <div className="flex flex-col justify-between gap-12 px-6 py-14 md:px-14 md:py-20 border-b border-(--color-border-subtle) md:border-b-0 md:border-r md:border-(--color-border-subtle)">

                {/* Heading */}
                <div>
                    <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] uppercase text-(--color-primary) mb-7">
                        <span className="w-6 h-px bg-(--color-primary) shrink-0" />
                        Get started
                    </p>
                    <h2 className="text-[clamp(36px,4vw,52px)] leading-[0.95] tracking-tight text-[(--color-text-primary) font-bold">
                        Your datasets.<br />
                        <span className="text-gradient-orange-deep italic">Shipped faster.</span>
                    </h2>
                </div>

                {/* Numbered value props */}
                <div className="border-t border-(--color-border-subtle)">
                    {valueProps.map((v) => (
                        <div key={v.num} className="flex gap-5 py-5 border-b border-(--color-border-subtle) last:border-b-0">
                            <span className="font-mono text-[11px] text-(--color-primary) shrink-0 pt-0.5">{v.num}</span>
                            <div>
                                <div className="text-[14px] font-semibold text-(--color-text-primary) mb-1 tracking-tight">{v.title}</div>
                                <div className="text-[12px] text-(--color-text-secondary) leading-relaxed">{v.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions + trust */}
                <div>
                    <div className="flex flex-col gap-2.5 mb-5">
                        <Link
                            href="/login"
                            className="flex items-center justify-between px-7 py-4 bg-gradient-orange text-white text-sm font-semibold tracking-wide transition-all duration-200 hover:shadow-glow-orange-strong w-full"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
                        >
                            Get started free <span>→</span>
                        </Link>
                        <Link
                            href="/demo"
                            className="flex items-center justify-center gap-2 px-7 py-4 text-sm text(--color-text-secondary) border border-(--color-border-subtle) hover:border-[var(--color-border-default) hover:text-(--color-text-primary) transition-all duration-200 w-full"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Watch the demo
                        </Link>
                    </div>

                    {/* Trust */}
                    <div className="flex flex-col gap-2">
                        {trust.map(t => (
                            <div key={t} className="flex items-center gap-2.5 text-[12px] font-mono text-text-tertiary tracking-[0.03em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary)/40 shrink-0" />
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right ── */}
            <div className="relative flex flex-col justify-center px-6 py-14 md:px-14 md:py-20 overflow-hidden min-h-[360px]">

                {/* Radial glow background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 80% 60% at 75% 50%, rgba(255,87,34,0.1) 0%, transparent 70%)' }}
                />

                <div className="relative z-10">
                    {/* Ghost number */}
                    <div
                        className="text-[clamp(80px,14vw,140px)] leading-none tracking-[-0.04em] select-none mb-2 font-bold"
                        style={{ color: 'rgba(255,255,255,0.04)' }}
                    >
                        10×
                    </div>

                    {/* Pull quote */}
                    <blockquote className="text-[clamp(17px,2vw,22px)] leading-normal text-(--color-text-primary) italic border-l-2 border-(--color-primary) pl-5 mb-4 font-normal">
                        "We cut our labeling time from weeks to days. The QA workflow alone is worth it."
                    </blockquote>
                    <p className="text-[11px] font-mono text-text-tertiary tracking-[0.05em] pl-5">
                        — ML Engineer, Computer Vision team
                    </p>

                    {/* Powered by */}
                    <div className="flex items-center gap-2.5 mt-14">
                        <span className="w-4 h-px bg-text-tertiary shrink-0" />
                        <span className="text-[10px] font-mono text-text-tertiary tracking-[0.12em] uppercase">
                            Powered by Label Studio
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}