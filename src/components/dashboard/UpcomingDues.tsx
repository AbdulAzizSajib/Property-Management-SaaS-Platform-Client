import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/src/components/ui/card";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, Clock } from "lucide-react";

interface Due {
    id: string;
    tenant: string;
    unit: string;
    amount: number;
    dueIn: number; // days; negative = overdue
}

const dues: Due[] = [
    { id: "I-2401", tenant: "Hassan Ali", unit: "Block A · 2B", amount: 22000, dueIn: -3 },
    { id: "I-2398", tenant: "Mehedi Hasan", unit: "Tower · 5C", amount: 28000, dueIn: -1 },
    { id: "I-2415", tenant: "Sumaiya Akter", unit: "Heights · 3A", amount: 30000, dueIn: 2 },
    { id: "I-2418", tenant: "Imran Khan", unit: "Block A · 1C", amount: 18000, dueIn: 4 },
    { id: "I-2421", tenant: "Fariha Islam", unit: "Tower · 6A", amount: 32000, dueIn: 7 },
];

const fmt = (n: number) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(n);

export function UpcomingDues() {
    const overdueTotal = dues
        .filter((d) => d.dueIn < 0)
        .reduce((sum, d) => sum + d.amount, 0);

    return (
        <Card className="px-5">
            <CardHeader className="px-0">
                <CardTitle>Upcoming & overdue invoices</CardTitle>
                <CardDescription>
                    <span className="font-medium text-rose-600">{fmt(overdueTotal)}</span> overdue
                    this week
                </CardDescription>
                <CardAction>
                    <Link
                        href="/owner/dashboard/invoices"
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        Manage <ArrowUpRight size={12} />
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent className="px-0">
                <ul className="divide-y divide-slate-100">
                    {dues.map((due) => {
                        const isOverdue = due.dueIn < 0;
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
                                        {due.tenant}
                                    </p>
                                    <p className="truncate text-xs text-slate-500">
                                        {due.id} · {due.unit}
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
                                            ? `${Math.abs(due.dueIn)}d overdue`
                                            : `Due in ${due.dueIn}d`}
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
