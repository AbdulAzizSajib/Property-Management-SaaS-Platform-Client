import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string;
    delta?: { value: string; trend: "up" | "down" };
    icon: LucideIcon;
    accent?: "indigo" | "emerald" | "amber" | "rose";
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
};

export function StatCard({
    label,
    value,
    delta,
    icon: Icon,
    accent = "indigo",
}: StatCardProps) {
    return (
        <Card className="px-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        {label}
                    </p>
                    <p className="text-2xl font-semibold text-slate-900 tabular-nums">
                        {value}
                    </p>
                    {delta && (
                        <div className="flex items-center gap-1 text-xs">
                            <span
                                className={cn(
                                    "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
                                    delta.trend === "up"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-rose-50 text-rose-700",
                                )}
                            >
                                {delta.trend === "up" ? (
                                    <ArrowUpRight size={12} />
                                ) : (
                                    <ArrowDownRight size={12} />
                                )}
                                {delta.value}
                            </span>
                            <span className="text-slate-500">vs last month</span>
                        </div>
                    )}
                </div>
                <span
                    className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg",
                        accentStyles[accent],
                    )}
                >
                    <Icon size={18} />
                </span>
            </div>
        </Card>
    );
}
