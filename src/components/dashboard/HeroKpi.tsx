"use client";

// src/components/dashboard/HeroKpi.tsx
//
// Replaces 4 equal-weight StatCards with one *primary* KPI rendered editorial-large,
// plus the context that makes it actionable: target, gap, days remaining.

import { motion } from "framer-motion";
import { fmtTaka } from "@/src/lib/numerals";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroKpi() {
    const collected = 418500;
    const target = 480000;
    const pct = (collected / target) * 100;
    const gap = target - collected;
    const daysLeft = 6;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.25 }}
            className="relative overflow-hidden rounded-[18px] bg-jade-950 px-6 py-6 text-paper sm:px-7 sm:py-7"
            style={{
                boxShadow:
                    "0 1px 0 rgba(255,255,255,0.06) inset, 0 22px 50px -22px rgba(10,46,34,0.55)",
            }}
        >
            {/* atmospheric jade radial */}
            <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-40"
                style={{
                    background:
                        "radial-gradient(circle, rgba(255,123,87,0.35), transparent 65%)",
                }}
            />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="font-serif text-[14px] italic text-paper/60">
                        Collected this month
                    </p>
                    <p className="font-bangla mt-0.5 text-[12.5px] text-paper/45">
                        মে মাসে কালেক্ট
                    </p>
                </div>
                <span className="rounded-md border border-paper/15 px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-paper/70">
                    May 2026
                </span>
            </div>

            <div className="relative mt-4 flex items-baseline gap-2">
                <span className="text-[44px] font-bold tracking-[-0.03em] tabular-nums leading-none sm:text-[52px]">
                    {fmtTaka(collected)}
                </span>
            </div>

            <p className="relative mt-2.5 text-[13px] text-paper/70">
                Target{" "}
                <span className="font-semibold text-paper tabular-nums">
                    {fmtTaka(target, { compact: true })}
                </span>{" "}
                ·{" "}
                <span className="text-coral-500">
                    {fmtTaka(gap, { compact: true })} to go
                </span>{" "}
                · <span className="tabular-nums">{daysLeft} days left</span>
            </p>

            {/* Progress bar */}
            <div className="relative mt-5">
                <div className="h-2 w-full overflow-hidden rounded-full bg-paper/10">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.1, ease, delay: 0.5 }}
                        className="h-full rounded-full bg-coral-600"
                        style={{
                            boxShadow: "0 0 12px rgba(255,123,87,0.45)",
                        }}
                    />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-paper/55 tabular-nums">
                    <span>{pct.toFixed(1)}% of target</span>
                    <span>৳0 → {fmtTaka(target, { compact: true })}</span>
                </div>
            </div>

            {/* delta vs last month */}
            <div className="relative mt-5 flex items-center gap-2 border-t border-paper/10 pt-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-jade-700/40 px-2 py-0.5 text-[11px] font-semibold text-paper">
                    ↑ 12.4%
                </span>
                <span className="text-[12.5px] text-paper/65">
                    vs April · ৳46,200 more
                </span>
            </div>
        </motion.div>
    );
}