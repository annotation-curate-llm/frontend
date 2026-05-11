'use client';

const steps = [
    { num: '01', name: 'Create project', desc: 'Templates or custom workflows, set up in seconds.' },
    { num: '02', name: 'Upload data', desc: 'Drag-and-drop or bulk upload. Any media type accepted.' },
    { num: '03', name: 'Annotate', desc: 'Intuitive Label Studio interface. Your whole team, real-time.', highlight: true },
    { num: '04', name: 'Review & QA', desc: 'Approve or reject with feedback. Quality ensured at every step.' },
    { num: '05', name: 'Export', desc: 'COCO, YOLO, JSON, CSV. Pipeline-ready in one click.' },
];

export default function HowItWorks() {
    return (
        <section className="px-6 py-16 md:px-14 md:py-20 border-b border-(--color-border-subtle) bg-(--color-bg-primary)" id="howItWorks">

            {/* ── Header ── */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-16 md:mb-20">
                <h2 className="text-[clamp(36px,5vw,58px)] leading-none tracking-tight text-(--color-text-primary) font-bold">
                    From raw data<br />
                    to{' '}
                    <span className="text-gradient-orange-deep italic font-bold">ML-ready</span>
                </h2>
                <p className="text-[12px] font-mono text-text-tertiary md:text-right leading-relaxed md:max-w-[180px] shrink-0">
                    5 steps · under 5 minutes<br className="hidden md:block" /> to first annotation
                </p>
            </div>

            {/* ── Desktop: horizontal 5-col ── */}
            <div className="hidden md:grid grid-cols-5 relative">
                {/* Hairline across the top */}
                <div className="absolute top-[18px] left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, var(--color-border-subtle) 10%, var(--color-border-subtle) 90%, transparent)' }} />

                {steps.map((s, i) => (
                    <div
                        key={s.num}
                        className={[
                            'pr-6 pb-0 relative',
                            i !== 0 ? 'pl-6 border-l border-(--color-border-subtle)' : '',
                        ].join(' ')}
                    >
                        {/* Dot sitting on the hairline */}
                        <div className={[
                            'w-[9px] h-[9px] rounded-full mb-7 relative z-10',
                            s.highlight ? 'bg-(--color-primary)' : 'bg-(--color-primary)/40',
                        ].join(' ')} />

                        <div className="font-mono text-[10px] tracking-widest text-[var(--color-text-tertiary) mb-3">{s.num}</div>
                        <div className={[
                            'text-[15px] font-semibold mb-2 tracking-tight',
                            s.highlight ? 'text-(--color-primary)' : 'text-(--color-text-primary)',
                        ].join(' ')}>
                            {s.name}
                        </div>
                        <div className="text-[12px] text-(--color-text-secondary) leading-relaxed">{s.desc}</div>
                    </div>
                ))}
            </div>

            {/* ── Mobile: vertical list ── */}
            <div className="flex flex-col md:hidden">
                {steps.map((s, i) => (
                    <div key={s.num} className="grid grid-cols-[28px_1fr] gap-x-5">
                        {/* Left: dot + line */}
                        <div className="flex flex-col items-center pt-1">
                            <div className={[
                                'w-2 h-2 rounded-full shrink-0',
                                s.highlight ? 'bg-(--color-primary)' : 'bg-(--color-primary)/40',
                            ].join(' ')} />
                            {i < steps.length - 1 && (
                                <div className="w-px flex-1 mt-2 bg-(--color-border-subtle)" />
                            )}
                        </div>
                        {/* Right: content */}
                        <div className={[
                            'pb-8',
                            i === steps.length - 1 ? 'pb-0' : '',
                        ].join(' ')}>
                            <div className="font-mono text-[10px] tracking-widest text-text-tertiary mb-1.5">{s.num}</div>
                            <div className={[
                                'text-[15px] font-semibold mb-1.5 tracking-tight',
                                s.highlight ? 'text-(--color-primary)' : 'text-(--color-text-primary)',
                            ].join(' ')}>
                                {s.name}
                            </div>
                            <div className="text-[13px] text-(--color-text-secondary) leading-relaxed">{s.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}