'use client';

const features = [
    {
        num: '01', badge: 'All types',
        name: 'Multi-Format Support',
        desc: 'Images, audio, text, video — all in one platform. Zero switching.',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>,
    },
    {
        num: '02', badge: 'Team ready',
        name: 'Real-Time Collaboration',
        desc: 'Your whole team annotates simultaneously on the same dataset.',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    },
    {
        num: '03', badge: 'QA built-in',
        name: 'Quality Control',
        desc: 'Review workflow built in. Approve, reject, and give feedback — fast.',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12" /></svg>,
    },
    {
        num: '04', badge: '5+ formats',
        name: 'Export Anywhere',
        desc: 'COCO, YOLO, JSON, CSV and more. Drop-in ready for any ML pipeline.',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    },
    {
        num: '05', badge: 'Live stats',
        name: 'Progress Analytics',
        desc: 'Live stats on throughput, quality scores, and team performance.',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
    },
    {
        num: '06', badge: 'Speed',
        name: 'Keyboard-First Speed',
        desc: 'Shortcuts that matter. Annotators work 10× faster out of the box.',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    },
    {
        num: '07', badge: 'Secure',
        name: 'Secure & Private',
        desc: 'Enterprise-grade encryption. Your data stays yours, always.',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    },
    {
        num: '08', badge: 'History',
        name: 'Version Control',
        desc: 'Full annotation history tracked automatically. Roll back anytime.',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    },
];

export default function Features() {
    return (
        <section className="flex flex-col md:grid md:grid-cols-[280px_1fr] border-b border-(--color-border-subtle) bg-(--color-bg-primary)">

            {/* ── Left panel ── */}
            <div className="flex flex-col justify-between px-6 py-12 md:px-12 md:py-16 border-b border-(--color-border-subtle) md:border-b-0 md:border-r md:border-(--color-border-subtle) md:sticky md:top-0 md:self-start">
                <div>
                    <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] uppercase text-(--color-primary) mb-10">
                        <span className="w-6 h-px bg-(--color-primary) shrink-0" />
                        Platform
                    </p>
                    <h2 className="text-[clamp(32px,3.5vw,46px)] leading-[1.05] tracking-tight text-(--color-text-primary) font-bold">
                        Built for<br />
                        <span className="text-(--color-text-secondary) font-normal italic">ML teams</span><br />
                        who ship.
                    </h2>
                </div>
                {/* Ghost number — decorative, hidden mobile */}
                <div className="hidden md:block text-[96px] leading-none tracking-[-0.04em] select-none mt-auto pt-8"
                    style={{ color: 'rgba(255,255,255,0.04)' }}>
                    8
                </div>
            </div>

            {/* ── Feature grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2">
                {features.map((f, i) => {
                    const isLastRow = i >= features.length - 2;
                    return (
                        <div
                            key={f.num}
                            className={[
                                'group p-8 md:p-10 transition-colors duration-300 hover:bg-(--color-bg-secondary) cursor-default',
                                'border-l border-(--color-border-subtle)',
                                !isLastRow ? 'border-b border-(--color-border-subtle)' : '',
                                // On mobile, always show border-b except last
                                i < features.length - 1 ? 'max-sm:border-b max-sm:border-(--color-border-subtle)' : '',
                            ].join(' ')}
                        >
                            <div className="font-mono text-[10px] tracking-widest text-text-tertiary mb-5">{f.num}</div>

                            <div className="w-9 h-9 flex items-center justify-center border border-(--color-border-subtle) text-(--color-primary) mb-5 transition-colors duration-300 group-hover:border-(--color-primary)">
                                {f.icon}
                            </div>

                            <div className="text-[15px] font-semibold text-(--color-text-primary) mb-2 tracking-tight">
                                {f.name}
                            </div>
                            <div className="text-[13px] text-(--color-text-secondary) leading-relaxed">
                                {f.desc}
                            </div>
                            <span className="inline-block mt-3.5 text-[10px] font-mono text-(--color-primary) border border-(--color-primary)/30 px-2 py-0.5 tracking-[0.06em]">
                                {f.badge}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}