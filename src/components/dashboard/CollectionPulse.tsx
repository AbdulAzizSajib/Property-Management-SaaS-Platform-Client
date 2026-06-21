"use client";

// src/components/dashboard/CollectionPulse.tsx
//
// This is the dashboard's hero. Answers Aziz's Monday-morning question:
// "Who owes me money this week and is anyone late?"
//
// Layout: three semantic columns — overdue (coral), due-this-week (jade), paid (ink-soft).
// Each is clickable, leads to the filtered tenant list.

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, AlertCircle, Clock, CheckCheck } from "lucide-react";
import { fmtTaka } from "@/src/lib/numerals";

const ease = [0.22, 1, 0.36, 1] as const;

interface Bucket {
    key: "overdue" | "due" | "paid";
    label: string;
    bn: string;
    tenants: number;
    amount: number;
    href: string;
    icon: typeof AlertCircle;
}

const buckets: Bucket[] = [
    {
        key: "overdue",
        label: "Overdue",
        bn: "বকেয়া",
        tenants: 3,
        amount: 62000,
        href: "/owner/dashboard/collections?filter=overdue",
        icon: AlertCircle,
    },
    {
        key: "due",
        label: "Due this week",
        bn: "এ সপ্তাহে",
        tenants: 7,
        amount: 148500,
        href: "/owner/dashboard/collections?filter=due",
        icon: Clock,
    },
    {
        key: "paid",
        label: "Paid this month",
        bn: "পরিশোধিত",
        tenants: 132,
        amount: 418500,
        href: "/owner/dashboard/collections?filter=paid",
        icon: CheckCheck,
    },
];

export function CollectionPulse() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="relative overflow-hidden rounded-[18px] border border-rule-soft bg-paper"
            style={{
                boxShadow:
                    "0 1px 0 rgba(255,255,255,0.6) inset, 0 10px 30px -18px rgba(10,46,34,0.18)",
            }}
        >
            {/* Section eyebrow */}
            <div className="flex items-center justify-between border-b border-rule-soft px-5 py-3.5 sm:px-6">
                <div className="flex items-center gap-2.5">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inset-0 animate-ping rounded-full bg-coral-600 opacity-70" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-coral-600" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                        Collection pulse
                    </span>
                    <span className="font-serif text-[13px] italic text-ink-soft/70">
                        — week 21
                    </span>
                </div>
                <Link
                    href="/owner/dashboard/collections"
                    className="group inline-flex items-center gap-1 text-[12.5px] font-medium text-jade-900 hover:text-coral-600"
                >
                    Open collections
                    <ArrowUpRight
                        size={13}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                </Link>
            </div>

            <div className="grid grid-cols-1 divide-y divide-rule-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {buckets.map((b, i) => (
                    <Pulse key={b.key} bucket={b} index={i} />
                ))}
            </div>
        </motion.section>
    );
}

function Pulse({ bucket, index }: { bucket: Bucket; index: number }) {
    const Icon = bucket.icon;
    const tone =
        bucket.key === "overdue"
            ? { ink: "text-coral-600", chip: "bg-coral-50 text-coral-600", dot: "bg-coral-600" }
            : bucket.key === "due"
                ? { ink: "text-jade-900", chip: "bg-jade-50 text-jade-800", dot: "bg-jade-700" }
                : { ink: "text-ink", chip: "bg-cream text-ink-soft", dot: "bg-ink-soft/40" };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 + index * 0.08 }}
        >
            <Link
                href={bucket.href}
                className="group block px-5 py-5 transition-colors hover:bg-cream/60 sm:px-6 sm:py-6"
            >
                <div className="mb-3 flex items-center justify-between">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider ${tone.chip}`}
                    >
                        <Icon size={11} />
                        {bucket.label}
                    </span>
                    <span className="font-bangla text-[12px] text-ink-soft/80">
                        {bucket.bn}
                    </span>
                </div>

                <div className="flex items-baseline gap-2">
                    <span
                        className={`text-[30px] font-bold tracking-[-0.025em] tabular-nums sm:text-[34px] ${tone.ink}`}
                    >
                        {fmtTaka(bucket.amount, { compact: false })}
                    </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <p className="text-[13px] text-ink-soft">
                        from{" "}
                        <span className="font-semibold text-ink">
                            {bucket.tenants}
                        </span>{" "}
                        {bucket.tenants === 1 ? "tenant" : "tenants"}
                    </p>
                    <span
                        className="text-[12.5px] font-medium text-jade-900 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        Review →
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}