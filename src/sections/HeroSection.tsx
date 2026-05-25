"use client";

import { motion } from "framer-motion";
import DashboardMockup from "./hero/DashboardMockup";

const ease = [0.22, 1, 0.36, 1] as const;

const rise = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease, delay: 0.05 + i * 0.08 },
    }),
};

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-20 pb-24">
            {/* Atmospheric layers */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(13,79,63,0.07) 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                    maskImage:
                        "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 75%)",
                }}
            />
            <div
                aria-hidden
                className="absolute -top-32 right-[-10%] w-[600px] h-[600px] pointer-events-none opacity-60"
                style={{
                    background:
                        "radial-gradient(circle, rgba(13,79,63,0.10), transparent 60%)",
                }}
            />
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />

            <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8">
                <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
                    {/* LEFT — copy column */}
                    <div>
                        {/* Eyebrow — single quiet link */}
                        <motion.a
                            href="#report"
                            initial="hidden"
                            animate="show"
                            variants={rise}
                            custom={0}
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
                        </motion.a>

                        {/* Editorial overline — the poetic line, demoted but kept */}
                        <motion.p
                            initial="hidden"
                            animate="show"
                            variants={rise}
                            custom={1}
                            className="font-serif italic text-coral-600/90 text-[15px] tracking-[-0.01em] mb-3"
                        >
                            Every flat. Every tenant. Every taka of rent.
                        </motion.p>

                        {/* Headline — leads with the job */}
                        <motion.h1
                            initial="hidden"
                            animate="show"
                            variants={rise}
                            custom={2}
                            className="font-bold text-jade-950 leading-[1.02] tracking-[-0.035em] text-[44px] sm:text-[56px] lg:text-[64px] xl:text-[72px] mb-5 text-balance"
                        >
                            Run your buildings
                            <br />
                            <span className="text-jade-900">from one</span>{" "}
                            <span className="font-serif italic font-normal tracking-[-0.02em]">
                                phone
                            </span>
                            <span className="text-coral-600">.</span>
                        </motion.h1>

                        {/* Bangla sub-headline */}
                        <motion.p
                            initial="hidden"
                            animate="show"
                            variants={rise}
                            custom={3}
                            className="font-bangla text-[22px] sm:text-[24px] text-jade-800 font-semibold tracking-[-0.01em] mb-7"
                        >
                            এক ফোনে — সব ভাড়াটিয়া, সব হিসাব।
                        </motion.p>

                        {/* Subhead — single tight sentence */}
                        <motion.p
                            initial="hidden"
                            animate="show"
                            variants={rise}
                            custom={4}
                            className="text-[17px] leading-[1.6] text-ink-soft max-w-[500px] mb-9 text-pretty"
                        >
                            BariBari is Bangladesh's end-to-end property platform for
                            landlords with 4 to 400 flats — collect on bKash, Nagad &
                            Rocket, send Bangla SMS reminders, and split every utility
                            bill automatically.
                        </motion.p>

                        {/* CTAs — flatter, more premium */}
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={rise}
                            custom={5}
                            className="flex flex-wrap items-center gap-2"
                        >
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
                        </motion.div>

                        {/* Micro-disclaimer — close to CTA */}
                        <motion.p
                            initial="hidden"
                            animate="show"
                            variants={rise}
                            custom={6}
                            className="text-[12.5px] text-ink-soft mt-4 ml-1"
                        >
                            No card required · Setup in{" "}
                            <span className="text-jade-900 font-semibold">17 minutes</span>
                            {" · "}
                            <span className="font-bangla">বাংলা সাপোর্ট</span>
                        </motion.p>

                        {/* Trust strip — concrete, established */}
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={rise}
                            custom={7}
                            className="mt-12 pt-7 border-t border-rule-soft"
                        >
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
                        </motion.div>
                    </div>

                    {/* RIGHT — mockup column */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.9, ease, delay: 0.25 }}
                    >
                        <DashboardMockup />
                    </motion.div>
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