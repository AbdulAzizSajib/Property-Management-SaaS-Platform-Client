"use client";

// src/components/dashboard/SupportingStats.tsx
//
// Three secondary stats stacked vertically. No icon chips, no per-stat color theming.
// Color in the delta chip only carries semantic meaning (jade = good, coral = bad).

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

interface Stat {
    label: string;
    bn: string;
    value: string;
    delta: { value: string; trend: "up" | "down"; good: boolean };
    context: string;
}

const stats: Stat[] = [
    {
        label: "Buildings",
        bn: "বিল্ডিং",
        value: "8",
        delta: { value: "2 new", trend: "up", good: true },
        context: "added this quarter",
    },
    {
        label: "Total units",
        bn: "মোট ইউনিট",
        value: "166",
        delta: { value: "12", trend: "up", good: true },
        context: "added vs last month",
    },
    {
        label: "Occupancy",
        bn: "ভাড়া",
        value: "85.5%",
        delta: { value: "3.2pp", trend: "up", good: true },
        context: "24 vacancies filled",
    },
];

export function SupportingStats() {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((s, i) => (
                <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.3 + i * 0.07 }}
                    className="rounded-[14px] border border-rule-soft bg-paper px-4 py-3.5"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                                {s.label}
                            </p>
                            <p className="font-bangla text-[11px] text-ink-soft/65">
                                {s.bn}
                            </p>
                        </div>
                        <DeltaChip {...s.delta} />
                    </div>
                    <p className="mt-2 text-[26px] font-bold leading-none tracking-[-0.025em] text-jade-950 tabular-nums">
                        {s.value}
                    </p>
                    <p className="mt-1.5 text-[12px] text-ink-soft">{s.context}</p>
                </motion.div>
            ))}
        </div>
    );
}

function DeltaChip({
    value,
    trend,
    good,
}: {
    value: string;
    trend: "up" | "down";
    good: boolean;
}) {
    const styles = good
        ? "bg-jade-50 text-jade-800"
        : "bg-coral-50 text-coral-700";
    const Icon = trend === "up" ? ArrowUpRight : ArrowDownRight;
    return (
        <span
            className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums ${styles}`}
        >
            <Icon size={10} />
            {value}
        </span>
    );
}