"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/src/components/ui/card";
import { Link } from "@/src/i18n/navigation";
import { AlertCircle, ArrowUpRight, Clock } from "lucide-react";
import { useDashboardOverview } from "@/src/hooks/useDashboard";
import { useTranslations, useLocale } from "next-intl";
import { fmtTaka, toBnDigits } from "@/src/lib/numerals";

export function UpcomingDues() {
    const t = useTranslations("upcomingDues");
    const isBn = useLocale() === "bn";
    const { data } = useDashboardOverview();
    const dues = data?.upcomingDues ?? [];

    const fmt = (n: number) => fmtTaka(n, { bn: isBn });
    const num = (n: number) => (isBn ? toBnDigits(String(n)) : String(n));

    const overdueTotal = dues
        .filter((d) => d.overdue)
        .reduce((sum, d) => sum + d.amount, 0);

    return (
        <Card className="px-5">
            <CardHeader className="px-0">
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>
                    {t.rich("overdueThisWeek", {
                        amount: fmt(overdueTotal),
                        strong: (chunks) => (
                            <span className="font-medium text-rose-600">{chunks}</span>
                        ),
                    })}
                </CardDescription>
                <CardAction>
                    <Link
                        href="/owner/dashboard/invoices"
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        {t("manage")} <ArrowUpRight size={12} />
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent className="px-0">
                <ul className="divide-y divide-slate-100">
                    {dues.map((due) => {
                        const isOverdue = due.overdue;
                        return (
                            <li
                                key={due.id}
                                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                            >
                                <span
                                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                                        isOverdue
                                            ? "bg-rose-50 text-rose-600"
                                            : "bg-amber-50 text-amber-600"
                                    }`}
                                >
                                    {isOverdue ? (
                                        <AlertCircle size={16} />
                                    ) : (
                                        <Clock size={16} />
                                    )}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-800">
                                        {due.tenantName}
                                    </p>
                                    <p className="truncate text-xs text-slate-500">
                                        {due.invoiceNumber} · {due.unitLabel}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-900 tabular-nums">
                                        {fmt(due.amount)}
                                    </p>
                                    <p
                                        className={`text-[11px] ${
                                            isOverdue ? "text-rose-600" : "text-slate-500"
                                        }`}
                                    >
                                        {isOverdue
                                            ? t("daysOverdue", { days: num(Math.abs(due.dueInDays)) })
                                            : t("dueInDays", { days: num(due.dueInDays) })}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
}
