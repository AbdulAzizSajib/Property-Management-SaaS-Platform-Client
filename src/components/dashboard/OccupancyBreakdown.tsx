"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card";
import { useDashboardOverview } from "@/src/hooks/useDashboard";

export function OccupancyBreakdown() {
    const { data } = useDashboardOverview();
    const o = data?.occupancy;

    const segments = [
        { label: "Occupied", value: o?.occupied ?? 0, color: "bg-emerald-500", text: "text-emerald-700" },
        { label: "Vacant", value: o?.vacant ?? 0, color: "bg-amber-500", text: "text-amber-700" },
        { label: "Maintenance", value: o?.underMaintenance ?? 0, color: "bg-rose-500", text: "text-rose-700" },
    ];

    const total = o?.total ?? segments.reduce((sum, s) => sum + s.value, 0);

    return (
        <Card className="px-5">
            <CardHeader className="px-0">
                <CardTitle>Unit occupancy</CardTitle>
                <CardDescription>{total} total units across all buildings</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
                {/* Stacked bar */}
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    {segments.map((s) => (
                        <div
                            key={s.label}
                            className={s.color}
                            style={{ width: total > 0 ? `${(s.value / total) * 100}%` : "0%" }}
                            title={`${s.label}: ${s.value}`}
                        />
                    ))}
                </div>

                <ul className="space-y-2.5">
                    {segments.map((s) => {
                        const pct = total > 0 ? ((s.value / total) * 100).toFixed(1) : "0.0";
                        return (
                            <li
                                key={s.label}
                                className="flex items-center justify-between gap-3 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`size-2.5 rounded-sm ${s.color}`} />
                                    <span className="text-slate-700">{s.label}</span>
                                </div>
                                <div className="flex items-baseline gap-2 tabular-nums">
                                    <span className="font-medium text-slate-900">{s.value}</span>
                                    <span className="text-xs text-slate-500">{pct}%</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
}
