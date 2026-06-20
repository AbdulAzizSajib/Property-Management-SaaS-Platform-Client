const trustItems = [
    "30-day free trial",
    "No credit card required",
    "Setup in 17 minutes",
    "Cancel anytime",
];

export default function BottomBanner() {
    return (
        <section
            className="relative mx-4 md:mx-8 mt-20 overflow-hidden rounded-[28px] py-24 lg:py-28 px-6 md:px-16 text-paper text-center"
            style={{
                background:
                    "radial-gradient(ellipse at 80% 20%, rgba(232,93,68,0.18), transparent 50%), radial-gradient(ellipse at 10% 80%, rgba(31,152,118,0.18), transparent 50%), var(--color-jade-950)",
            }}
        >
            <span
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
                    backgroundSize: "28px 28px",
                }}
            />
            <div className="relative z-10">
                <h2 className="font-bold tracking-[-0.035em] leading-[1.05] text-balance max-w-[880px] mx-auto mb-5 text-[40px] md:text-[52px] lg:text-[64px]">
                    Stop chasing rent.
                    <br />
                    Start{" "}
                    <em className="font-serif italic font-normal text-amber-500">
                        collecting it.
                    </em>
                </h2>
                <p className="text-lg leading-[1.5] text-white/70 mb-9 max-w-[540px] mx-auto">
                    Join 1,200+ landlords across Bangladesh already managing their properties
                    with Bariyan.
                </p>
                <div className="flex flex-wrap gap-3.5 justify-center mb-12">
                    <button
                        type="button"
                        className="bg-coral-600 hover:bg-coral-500 transition text-paper font-semibold text-[15px] px-6 py-3.5 rounded-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.2),0_4px_12px_rgba(232,93,68,0.22)]"
                    >
                        Start free trial →
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#1fb455] transition text-paper font-semibold text-[15px] px-6 py-3.5 rounded-[10px] shadow-[0_4px_14px_rgba(37,211,102,0.3)]"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden
                        >
                            <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1c-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4 0 1.4 1 2.7 1.2 2.9.2.2 2 3.1 4.9 4.4 1.5.6 2.3.7 2.9.6.7-.1 1.7-.7 2-1.4.3-.7.3-1.3.2-1.4 0-.1-.2-.2-.5-.3M12 2A10 10 0 002 12c0 1.7.4 3.4 1.3 4.9L2 22l5.3-1.4A10 10 0 0012 22a10 10 0 0010-10A10 10 0 0012 2" />
                        </svg>
                        Talk to sales on WhatsApp
                    </button>
                </div>
                <div className="flex flex-wrap justify-center gap-9 text-[13px] text-white/60">
                    {trustItems.map((t) => (
                        <span key={t} className="flex items-center gap-1.5">
                            <span className="text-amber-500 font-bold">✓</span>
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
