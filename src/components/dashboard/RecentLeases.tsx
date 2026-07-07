"use client";

import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/src/components/ui/card";
import { Link } from "@/src/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { useDashboardOverview } from "@/src/hooks/useDashboard";
import { useTranslations, useLocale } from "next-intl";
import { fmtTaka } from "@/src/lib/numerals";

const statusStyles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    TERMINATED: "bg-slate-100 text-slate-600 border-slate-200",
    EXPIRED: "bg-slate-100 text-slate-600 border-slate-200",
    RENEWED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    const first = parts[0][0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
    return (first + last).toUpperCase();
}

export function RecentLeases() {
    const t = useTranslations("recentLeases");
    const isBn = useLocale() === "bn";
    const { data } = useDashboardOverview();
    const leases = data?.recentLeases ?? [];

    const fmt = (n: number) => fmtTaka(n, { bn: isBn });

    return (
        <Card className="px-5">
            <CardHeader className="px-0">
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("subtitle")}</CardDescription>
                <CardAction>
                    <Link
                        href="/owner/dashboard/leases"
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        {t("viewAll")} <ArrowUpRight size={12} />
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent className="px-0">
                <ul className="divide-y divide-slate-100">
                    {leases.map((lease) => (
                        <li
                            key={lease.id}
                            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                        >
                            <Avatar className="size-9">
                                <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
                                    {initialsOf(lease.tenantName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-slate-800">
                                    {lease.tenantName}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                    {t("unitBuilding", {
                                        unit: lease.unitName,
                                        building: lease.buildingName,
                                    })}
                                </p>
                            </div>
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold text-slate-900 tabular-nums">
                                    {fmt(lease.monthlyRent)}
                                </p>
                                <p className="text-[11px] text-slate-500">{t("perMonth")}</p>
                            </div>
                            <Badge
                                variant="outline"
                                className={`${statusStyles[lease.status] ?? "bg-slate-100 text-slate-600 border-slate-200"} text-[10px]`}
                            >
                                {t.has(`status.${lease.status}`)
                                    ? t(`status.${lease.status}`)
                                    : lease.status}
                            </Badge>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
