"use client";

// src/app/owner/dashboard/reports/occupancy/page.tsx
//
// Building-wise occupancy breakdown.

import { Skeleton } from "@/src/components/ui/skeleton";
import { useOccupancyReport } from "@/src/hooks/useReports";
import { cn } from "@/src/lib/utils";
import { Building, DoorOpen } from "lucide-react";

export default function OccupancyReportPage() {
    const { data, isLoading, isError } = useOccupancyReport();

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1240px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <header>
                    <p className="font-serif text-[13px] italic text-coral-600/85">
                        Reports
                    </p>
                    <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                        Occupancy
                    </h1>
                    <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                        বিল্ডিংভেদে দখলদারের অবস্থা
                    </p>
                </header>

                {isLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-24 rounded-[14px] bg-paper" />
                        <Skeleton className="h-48 rounded-[14px] bg-paper" />
                    </div>
                ) : isError || !data ? (
                    <p className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-4 py-8 text-center text-[13px] text-coral-600">
                        Couldn&apos;t load report.
                    </p>
                ) : (
                    <>
                        {/* Summary */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <Stat
                                label="Total units"
                                value={data.summary.totalUnits}
                            />
                            <Stat
                                label="Occupied"
                                value={data.summary.occupiedUnits}
                                tone="good"
                            />
                            <Stat
                                label="Vacant"
                                value={data.summary.vacantUnits}
                                tone="warn"
                            />
                            <Stat
                                label="Occupancy rate"
                                value={`${data.summary.occupancyRate.toFixed(1)}%`}
                                tone="good"
                            />
                        </div>

                        {/* Per-building */}
                        <ul className="space-y-3">
                            {data.buildings.map((b) => {
                                const rate = b.occupancyRate;
                                return (
                                    <li
                                        key={b.buildingId}
                                        className="rounded-[14px] border border-rule-soft bg-paper p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex size-9 items-center justify-center rounded-[10px] bg-jade-50 text-jade-700">
                                                    <Building size={16} />
                                                </span>
                                                <div>
                                                    <p className="text-[15px] font-bold text-jade-950">
                                                        {b.buildingName}
                                                    </p>
                                                    <p className="text-[11.5px] text-ink-soft">
                                                        {b.totalUnits} units total
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-[20px] font-bold tabular-nums text-jade-950">
                                                {rate.toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream">
                                            <div
                                                className="h-full rounded-full bg-jade-700 transition-all"
                                                style={{ width: `${rate}%` }}
                                            />
                                        </div>
                                        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px]">
                                            <Mini
                                                label="Occupied"
                                                count={b.occupiedUnits}
                                                tone="good"
                                            />
                                            <Mini
                                                label="Vacant"
                                                count={b.vacantUnits}
                                                tone="warn"
                                            />
                                            <Mini
                                                label="Maintenance"
                                                count={b.maintenanceUnits}
                                            />
                                            <Mini
                                                label="Reserved"
                                                count={b.reservedUnits}
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                            {data.buildings.length === 0 && (
                                <li className="rounded-[14px] border border-dashed border-rule-soft bg-paper px-6 py-8 text-center text-ink-soft">
                                    <DoorOpen
                                        size={20}
                                        className="mx-auto opacity-60"
                                    />
                                    <p className="mt-2 text-[13px]">
                                        No buildings yet.
                                    </p>
                                </li>
                            )}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

function Stat({
    label,
    value,
    tone = "neutral",
}: {
    label: string;
    value: string | number;
    tone?: "neutral" | "warn" | "good";
}) {
    return (
        <div
            className={cn(
                "rounded-[12px] border px-4 py-3",
                tone === "warn"
                    ? "border-coral-100 bg-coral-50/60"
                    : tone === "good"
                        ? "border-jade-100 bg-jade-50/60"
                        : "border-rule-soft bg-paper",
            )}
        >
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                {label}
            </p>
            <p
                className={cn(
                    "mt-1 text-[20px] font-bold tabular-nums",
                    tone === "warn"
                        ? "text-coral-600"
                        : tone === "good"
                            ? "text-jade-800"
                            : "text-jade-950",
                )}
            >
                {value}
            </p>
        </div>
    );
}

function Mini({
    label,
    count,
    tone = "neutral",
}: {
    label: string;
    count: number;
    tone?: "neutral" | "warn" | "good";
}) {
    return (
        <div
            className={cn(
                "rounded-md border px-2 py-1.5",
                tone === "warn"
                    ? "border-coral-100 bg-coral-50/40"
                    : tone === "good"
                        ? "border-jade-100 bg-jade-50/40"
                        : "border-rule-soft bg-cream/40",
            )}
        >
            <p className="text-[14px] font-bold tabular-nums text-jade-950">
                {count}
            </p>
            <p className="text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                {label}
            </p>
        </div>
    );
}
