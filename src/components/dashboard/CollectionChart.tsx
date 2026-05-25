"use client";

// src/components/dashboard/CollectionChart.tsx
//
// Replaces the indigo-gradient line chart. Now shows *collected vs target* — actionable.
// Current month uses coral; prior months use jade. Subtle dashed target line.

import { motion } from "framer-motion";
import { fmtTaka } from "@/src/lib/numerals";

const ease = [0.22, 1, 0.36, 1] as const;

const data = [
    { month: "Jun", collected: 245000, target: 280000 },
    { month: "Jul", collected: 268000, target: 290000 },
    { month: "Aug", collected: 254000, target: 290000 },
    { month: "Sep", collected: 289000, target: 310000 },
    { month: "Oct", collected: 312000, target: 320000 },
    { month: "Nov", collected: 305000, target: 330000 },
    { month: "Dec", collected: 334000, target: 350000 },
    { month: "Jan", collected: 348000, target: 360000 },
    { month: "Feb", collected: 361000, target: 380000 },
    { month: "Mar", collected: 372000, target: 400000 },
    { month: "Apr", collected: 389000, target: 420000 },
    { month: "May", collected: 418500, target: 480000, current: true },
];

export function CollectionChart() {
    const max = Math.max(...data.map((d) => Math.max(d.collected, d.target)));
    const total = data.reduce((s, d) => s + d.collected, 0);
    const targetTotal = data.reduce((s, d) => s + d.target, 0);
    const rate = ((total / targetTotal) * 100).toFixed(1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.35 }}
            className="rounded-[18px] border border-rule-soft bg-paper p-5 sm:p-6"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-serif text-[13px] italic text-coral-600/85">
                        Last 12 months
                    </p>
                    <h3 className="mt-0.5 text-[18px] font-bold tracking-[-0.015em] text-jade-950">
                        Collection vs target
                    </h3>
                    <p className="font-bangla mt-0.5 text-[12.5px] text-ink-soft">
                        কালেকশন ও টার্গেট
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
                        Collection rate
                    </p>
                    <p className="mt-0.5 text-[22px] font-bold tracking-[-0.02em] text-jade-900 tabular-nums">
                        {rate}%
                    </p>
                    <p className="text-[12px] text-ink-soft tabular-nums">
                        {fmtTaka(total, { compact: true })} of{" "}
                        {fmtTaka(targetTotal, { compact: true })}
                    </p>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap gap-4 text-[11.5px] text-ink-soft">
                <Legend color="bg-jade-700">Collected</Legend>
                <Legend color="bg-coral-600">This month</Legend>
                <Legend dashed>Target</Legend>
            </div>

            {/* Bars */}
            <div className="relative mt-3 h-[180px]">
                <div className="relative grid h-full grid-cols-12 items-end gap-2">
                    {data.map((d, i) => (
                        <div key={d.month} className="relative flex h-full flex-col justify-end">
                            {/* Target marker */}
                            <div
                                className="absolute left-0 right-0 border-t border-dashed border-ink-soft/35"
                                style={{ bottom: `${(d.target / max) * 100}%` }}
                            />
                            <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{
                                    duration: 0.7,
                                    ease,
                                    delay: 0.55 + i * 0.04,
                                }}
                                style={{
                                    transformOrigin: "bottom",
                                    height: `${(d.collected / max) * 100}%`,
                                }}
                                className={`rounded-t-[5px] ${
                                    d.current
                                        ? "bg-coral-600"
                                        : "bg-jade-700 hover:bg-jade-800"
                                } transition-colors`}
                            />
                            <span className="absolute -bottom-5 left-0 right-0 text-center font-mono text-[10px] text-ink-soft">
                                {d.month}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer hint */}
            <div className="mt-9 flex items-center justify-between border-t border-rule-soft pt-3.5 text-[12px] text-ink-soft">
                <span>
                    Best month:{" "}
                    <span className="font-semibold text-ink">
                        May · {fmtTaka(418500, { compact: true })}
                    </span>
                </span>
                <span>
                    Avg gap to target:{" "}
                    <span className="font-semibold text-ink tabular-nums">
                        ৳ 23,000
                    </span>
                </span>
            </div>
        </motion.div>
    );
}

function Legend({
    color,
    dashed,
    children,
}: {
    color?: string;
    dashed?: boolean;
    children: React.ReactNode;
}) {
    return (
        <span className="inline-flex items-center gap-1.5">
            {dashed ? (
                <span className="inline-block h-px w-3.5 border-t border-dashed border-ink-soft/60" />
            ) : (
                <span className={`inline-block h-2.5 w-2.5 rounded-sm ${color}`} />
            )}
            {children}
        </span>
    );
}