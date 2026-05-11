'use client';

import Link from 'next/link';

const confScores = [
    { name: 'person', val: '0.97', pct: '97%' },
    { name: 'vehicle', val: '0.89', pct: '89%' },
    { name: 'region', val: '0.74', pct: '74%' },
];

export default function Hero() {
    return (
        <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 border-b border-(--color-border-subtle) bg-(--color-bg-primary) overflow-hidden">

            {/* ── Left: Content ── */}
            <div className="flex flex-col justify-between px-6 py-14 md:px-14 md:py-16 border-b border-(--color-border-subtle) md:border-b-0 md:border-r md:border-(--color-border-subtle)">

                <div>
                    <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] uppercase text-(--color-primary) mb-10">
                        <span className="w-6 h-px bg-(--color-primary) shrink-0" />
                        Annotation Infrastructure
                    </p>
                    <h1 className="text-[clamp(48px,7vw,80px)] leading-[0.93] tracking-tight text-(--color-text-primary) font-bold">
                        Curate<br />
                        <em className="not-italic text-gradient-orange-deep">LLM</em>
                    </h1>
                    <p className="mt-8 max-w-xs text-[15px] leading-relaxed text-(--color-text-secondary)">
                        Build high-quality training datasets — 10× faster. Label images, audio, text and video with your team in one focused platform.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-12">
                        <Link
                            href="/login"
                            className="inline-block px-7 py-3.5 bg-gradient-orange text-white text-sm font-semibold tracking-wide transition-all duration-200 hover:shadow-glow-orange-strong"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                        >
                            Get started free →
                        </Link>
                        <Link
                            href="#howItWorks"
                            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm text-(--color-text-secondary) border border-(--color-border-subtle) hover:border-(--color-border-default) hover:text-(--color-text-primary) transition-all duration-200"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                            How It Works
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-2 border-t border-(--color-border-subtle) pt-8 mt-12">
                    <div className="border-r border-(--color-border-subtle) pr-6">
                        <div className="text-[42px] leading-none font-bold text-(--color-text-primary)">10×</div>
                        <div className="mt-1 text-[11px] font-mono tracking-[0.05em] text-text-tertiary">faster annotation</div>
                    </div>
                    <div className="pl-6">
                        <div className="text-[42px] leading-none font-bold text-text-primary">5+</div>
                        <div className="mt-1 text-[11px] font-mono tracking-[0.05em] text-text-tertiary">export formats</div>
                    </div>
                </div>
            </div>

            {/* ── Right: Annotation Visual ── */}

            <div className="relative min-h-[420px] md:min-h-0 overflow-hidden bg-[#0a0a0a]">

                <style>{`
                    @keyframes h-scan {
                        0%   { top: 4%;  opacity: 0; }
                        12%  { opacity: 1; }
                        88%  { opacity: 1; }
                        100% { top: 96%; opacity: 0; }
                    }
                `}</style>

                {/* Background photo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://images.unsplash.com/photo-1567372673107-83b596d67309?w=900&q=85&auto=format&fit=crop&crop=center"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ filter: 'brightness(0.42) saturate(0.8) contrast(1.1)' }}
                />

                {/* Edge vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.4) 100%)',
                }} />

                {/* Grid */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(rgba(255,87,34,0.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,87,34,0.055) 1px,transparent 1px)',
                    backgroundSize: '40px 40px',
                }} />

                {/* Scanline */}
                <div className="absolute left-0 w-full pointer-events-none z-20" style={{
                    height: '2px',
                    background: 'linear-gradient(90deg,transparent 0%,rgba(255,87,34,0.9) 25%,rgba(255,200,140,1) 50%,rgba(255,87,34,0.9) 75%,transparent 100%)',
                    boxShadow: '0 0 12px 4px rgba(255,87,34,0.3)',
                    animation: 'h-scan 3s ease-in-out infinite',
                }} />

                {/* ── BBOX: person (left walking figure) ── */}
                <div className="absolute z-10" style={{
                    left: '45%', top: '50%', width: '15%', height: '30%',
                    border: '1.5px solid #ff5722',
                    background: 'rgba(255,87,34,0.06)',
                }}>
                    <span className="absolute -top-[22px] left-0 px-2 py-[3px] bg-[#ff5722] text-white text-[10px] font-mono tracking-wider whitespace-nowrap">
                        person · 0.97
                    </span>
                    <span className="absolute -top-px -left-px  w-[7px] h-[7px] bg-[#ff5722]" />
                    <span className="absolute -top-px -right-px w-[7px] h-[7px] bg-[#ff5722]" />
                    <span className="absolute -bottom-px] -left-px  w-[7px] h-[7px] bg-[#ff5722]" />
                    <span className="absolute -bottom-px -right-px w-[7px] h-[7px] bg-[#ff5722]" />
                </div>

                {/* ── BBOX: vehicle (parked car, right side) ── */}
                <div className="absolute z-10" style={{
                    left: '28%', top: '60%', width: '35%', height: '15%',
                    border: '1.5px solid rgba(255,138,65,0.9)',
                    background: 'rgba(255,112,67,0.06)',
                }}>
                    <span className="absolute -top-[22px] left-0 px-2 py-[3px] text-white text-[10px] font-mono tracking-wider whitespace-nowrap"
                        style={{ background: 'rgba(232,100,40,0.95)' }}>
                        vehicle · 0.89
                    </span>
                    <span className="absolute -top-px -left-px  w-[7px] h-[7px]" style={{ background: 'rgba(255,120,60,0.95)' }} />
                    <span className="absolute -top-px -right-px w-[7px] h-[7px]" style={{ background: 'rgba(255,120,60,0.95)' }} />
                    <span className="absolute -bottom-px -left-px  w-[7px] h-[7px]" style={{ background: 'rgba(255,120,60,0.95)' }} />
                    <span className="absolute -bottom-px -right-px w-[7px] h-[7px]" style={{ background: 'rgba(255,120,60,0.95)' }} />
                </div>

                {/* Status chip */}
                <div className="absolute top-[6%] right-4 px-2.5 py-1.5 text-[10px] font-mono text-(--color-primary) border border-(--color-border-subtle) bg-black/85 whitespace-nowrap z-20">
                    COCO JSON ready
                </div>
                <div className="absolute left-4 px-2.5 py-1.5 text-[10px] font-mono text-(--color-primary) border border-(--color-border-subtle) bg-black/85 whitespace-nowrap z-20"
                    style={{ bottom: '90px' }}>
                    3 annotators active
                </div>

                {/* Confidence panel */}
                <div className="absolute bottom-4 right-4 hidden sm:block bg-black/90 border border-(--color-border-subtle) p-3 min-w-[175px] z-20">
                    <p className="text-[10px] font-mono tracking-[0.08em] text-text-tertiary mb-2.5">CONFIDENCE SCORES</p>
                    {confScores.map(item => (
                        <div key={item.name} className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-mono text-(--color-text-primary) w-12">{item.name}</span>
                            <div className="flex-1 h-px bg-(--color-border-subtle)">
                                <div className="h-px bg-(--color-primary)" style={{ width: item.pct }} />
                            </div>
                            <span className="text-[10px] font-mono text-text-tertiary w-7 text-right">{item.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}