"use client";

import DashboardMockup from "./hero/DashboardMockup";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-6 pb-24">
             <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 ">
                <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
                    {/* LEFT — copy column */}
                    <div>
                        {/* Eyebrow — single quiet link */}
                        <a
                            href="#report"
                            className="group inline-flex items-center gap-2.5 text-[12.5px] text-ink-soft hover:text-jade-900 transition-colors mb-8"
                        >
                            <span className="relative flex w-1.5 h-1.5">
                                <span className="absolute inset-0 rounded-full bg-coral-600 animate-ping opacity-60" />
                                <span className="relative w-1.5 h-1.5 rounded-full bg-coral-600" />
                            </span>
                            <span className="font-bangla">
                                ২০২৬ ভাড়া কালেকশন রিপোর্ট
                            </span>
                            <span className="text-rule">·</span>
                            <span className="font-medium">Read the data</span>
                            <span className="transition-transform group-hover:translate-x-0.5">
                                →
                            </span>
                        </a>

                        {/* Editorial overline — the poetic line, demoted but kept */}
                        <p className="font-serif italic text-coral-600/90 text-[15px] mb-3">
                           Track every tenant, rent, and expense daily.
                        </p>

                        {/* Headline — leads with the job */}
<h1 className="font-bold text-jade-900 leading-[1.02] tracking-[-0.035em] text-[44px] sm:text-[56px] lg:text-[64px] xl:text-[72px] mb-5 text-balance">
    Manage your
    <br />

    <span className="text-jade-500">property</span> <br />
    <span className=" text-coral-600">finances</span>{" "}
    <span className="font-serif italic font-normal tracking-[-0.02em]">
        easily
    </span>
    <span className="text-coral-600">.</span>
</h1>

                        {/* Bangla sub-headline */}
                        <p className="font-bangla text-[22px] sm:text-[24px] text-jade-800 font-semibold tracking-[-0.01em] mb-7">
                         এক প্লাটফর্মে — সব ভাড়াটিয়া, সব হিসাব
                        </p>

                        {/* Subhead — intro + bullet benefits */}
                        <div className="max-w-125 mb-9 font-bangla">
                            <p className="text-[17px] leading-[1.6] text-ink-soft mb-4">
                                আর Excel না, ডায়েরি না, বার বার ফোন না। সবকিছু এখন এক platform এ —
                            </p>
                            <ul className="space-y-1 text-[15px] text-ink">
                                <li className="flex items-start gap-2.5">
                                    <Tick />
                                    <span>ভাড়া আদায় ও বকেয়ার tracking</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Tick />
                                    <span>বিল পাঠানো ও invoice generate</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Tick />
                                    <span>মাসিক আয়, ব্যয় ও খরচের হিসাব</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Tick />
                                    <span>ভাড়াটিয়ার complaint management</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Tick />
                                    <span>মাসিক report — এক ক্লিকে</span>
                                </li>
                            </ul>
                            <p className="text-[14px] text-ink-soft mt-4">
                                প্রতিদিনের property management — সব হবে এক ফোন থেকেই।
                            </p>
                        </div>

                        {/* CTAs — flatter, more premium */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                className="group relative bg-jade-900 hover:bg-jade-950 text-paper font-semibold text-[15px] px-6 py-3.5 rounded-[10px] transition-all duration-200 hover:shadow-[0_10px_30px_-10px_rgba(13,79,63,0.5)]"
                            >
                                <span className="relative z-10 inline-flex items-center gap-2">
                                    Start 30-day free trial
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        className="transition-transform group-hover:translate-x-0.5"
                                    >
                                        <path
                                            d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                            </button>

                            <button
                                type="button"
                                className="group text-jade-900 font-semibold text-[15px] px-5 py-3.5 rounded-[10px] inline-flex items-center gap-2.5 hover:text-coral-600 transition-colors"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className="transition-transform group-hover:scale-110"
                                >
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="9.25"
                                        stroke="currentColor"
                                        strokeWidth="1.3"
                                        opacity="0.35"
                                    />
                                    <path
                                        d="M8.5 7l4 3-4 3V7z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Watch the 90-second demo
                            </button>
                        </div>

                        {/* Micro-disclaimer — close to CTA */}
                        <p className="text-[12.5px] text-ink-soft mt-4 font-medium">
                            Quick Setup
                            <span className="text-rule mx-1">·</span>
                             No card required
                            <span className="text-rule mx-1">·</span>
                            <span className="font-bangla">Bangla Support</span>
                        </p>

                        {/* Trust strip — concrete, established */}
                        <div className="mt-7 pt-7 border-t border-rule-soft">
                            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-soft/70 font-semibold mb-4">
                                Trusted across Bangladesh
                            </div>
                            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 ">
                                <Stat value="340+" label="landlords" />
                                <Stat
                                    value="৳12 cr"
                                    label="collected in 2025"
                                />
                                <Stat value="4" label="divisions live" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — mockup column */}
                    <div>
                        <DashboardMockup />
                    </div>
                </div>
            </div>
        </section>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex items-baseline gap-1.5">
            <span className="text-[22px] font-bold text-jade-950 tracking-[-0.02em] tabular-nums">
                {value}
            </span>
            <span className="text-[13px] text-ink-soft">{label}</span>
        </div>
    );
}

function Tick() {
    return (
        <span
            aria-hidden
            className="mt-1 inline-flex size-4.5 shrink-0 items-center justify-center rounded-full bg-jade-50"
        >
            <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="text-jade-700"
            >
                <path
                    d="M2 5l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
}
