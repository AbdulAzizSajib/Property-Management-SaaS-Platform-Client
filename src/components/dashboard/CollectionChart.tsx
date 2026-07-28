"use client";

// src/components/dashboard/CollectionChart.tsx
//
// Replaces the indigo-gradient line chart. Now shows *collected vs target* — actionable.
// Current month uses coral; prior months use jade. Subtle dashed target line.

import { motion } from "framer-motion";
import { fmtTaka, toBnDigits } from "@/src/lib/numerals";
import { useDashboardOverview } from "@/src/hooks/useDashboard";
import { useTranslations, useLocale } from "next-intl";

const ease = [0.22, 1, 0.36, 1] as const;

export function CollectionChart() {
    const t = useTranslations("collectionChart");
    const isBn = useLocale() === "bn";
    const { data: overview } = useDashboardOverview();
    const data = overview?.collectionTrend ?? [];

    const max = data.length
        ? Math.max(...data.map((d) => Math.max(d.collected, d.target)), 1)
        : 1;
    const total = data.reduce((s, d) => s + d.collected, 0);
    const targetTotal = data.reduce((s, d) => s + d.target, 0);
    const rate =
        targetTotal > 0 ? ((total / targetTotal) * 100).toFixed(1) : "0.0";
    const best = data.reduce(
        (a, d) => (d.collected > a.collected ? d : a),
        { label: "—", collected: 0 } as { label: string; collected: number },
    );
    const avgGap = data.length
        ? data.reduce((s, d) => s + Math.max(0, d.target - d.collected), 0) /
          data.length
        : 0;

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
                        {t("last12Months")}
                    </p>
                    <h3 className="mt-0.5 text-[18px] font-bold tracking-[-0.015em] text-jade-950">
                        {t("title")}
                    </h3>
                    <p className="mt-0.5 text-[12.5px] text-ink-soft">
                        {t("subtitle")}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
                        {t("collectionRate")}
                    </p>
                    <p className="mt-0.5 text-[22px] font-bold tracking-[-0.02em] text-jade-900 tabular-nums">
                        {isBn ? toBnDigits(rate) : rate}%
                    </p>
                    <p className="text-[12px] text-ink-soft tabular-nums">
                        {t("ofTotal", {
                            collected: fmtTaka(total, { compact: true, bn: isBn }),
                            target: fmtTaka(targetTotal, { compact: true, bn: isBn }),
                        })}
                    </p>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap gap-4 text-[11.5px] text-ink-soft">
                <Legend color="bg-jade-700">{t("collected")}</Legend>
                <Legend color="bg-coral-600">{t("thisMonth")}</Legend>
                <Legend dashed>{t("target")}</Legend>
            </div>

            {/* Bars */}
            <div className="relative mt-3 h-[180px]">
                <div className="relative grid h-full grid-cols-12 items-end gap-2">
                    {data.map((d, i) => (
                        <div key={d.month} className="relative flex h-full flex-col justify-end" title={`${d.label}: ${fmtTaka(d.collected, { compact: true })}`}>
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
                                {d.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer hint */}
            <div className="mt-9 flex items-center justify-between border-t border-rule-soft pt-3.5 text-[12px] text-ink-soft">
                <span>
                    {t("bestMonth")}{" "}
                    <span className="font-semibold text-ink">
                        {best.label} · {fmtTaka(best.collected, { compact: true, bn: isBn })}
                    </span>
                </span>
                <span>
                    {t("avgGap")}{" "}
                    <span className="font-semibold text-ink tabular-nums">
                        {fmtTaka(avgGap, { compact: true, bn: isBn })}
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