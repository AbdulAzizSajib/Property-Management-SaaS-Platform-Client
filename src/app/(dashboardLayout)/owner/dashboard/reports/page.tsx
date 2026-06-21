"use client";

// src/app/owner/dashboard/reports/page.tsx
//
// Financial report — income vs expense vs net profit over a date range
// with a monthly breakdown bar chart.

import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useFinancialReport } from "@/src/hooks/useReports";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import type { FinancialReportMonthly } from "@/src/types/report.types";
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Calendar,
    Printer,
    Sparkles,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// ─────────────────────────────────────────────────────────────────
// Date helpers — default to year-to-date
// ─────────────────────────────────────────────────────────────────

function toDateInput(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function toIsoStart(value: string): string {
    return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function toIsoEnd(value: string): string {
    return new Date(`${value}T23:59:59.000Z`).toISOString();
}

function formatMonthLabel(ym: string): string {
    if (!/^\d{4}-\d{2}$/.test(ym)) return ym;
    const d = new Date(`${ym}-01T00:00:00`);
    return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

function formatPeriod(from: string, to: string): string {
    const f = new Date(from);
    const t = new Date(to);
    if (isNaN(f.getTime()) || isNaN(t.getTime())) return `${from} → ${to}`;
    const opts: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        year: "numeric",
    };
    return `${f.toLocaleDateString("en-GB", opts)} → ${t.toLocaleDateString("en-GB", opts)}`;
}

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────

export default function ReportsPage() {
    const now = useMemo(() => new Date(), []);
    const startOfYear = useMemo(
        () => new Date(now.getFullYear(), 0, 1),
        [now],
    );

    const [fromDate, setFromDate] = useState(toDateInput(startOfYear));
    const [toDate, setToDate] = useState(toDateInput(now));

    const filters = {
        from: toIsoStart(fromDate),
        to: toIsoEnd(toDate),
    };

    const { data: report, isLoading, isError, error } =
        useFinancialReport(filters);

    function applyPreset(months: number) {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - months + 1);
        start.setDate(1);
        setFromDate(toDateInput(start));
        setToDate(toDateInput(end));
    }

    function applyYTD() {
        const end = new Date();
        const start = new Date(end.getFullYear(), 0, 1);
        setFromDate(toDateInput(start));
        setToDate(toDateInput(end));
    }

    function applyLastYear() {
        const lastYear = new Date().getFullYear() - 1;
        setFromDate(`${lastYear}-01-01`);
        setToDate(`${lastYear}-12-31`);
    }

    const income = report ? Number(report.summary.totalIncome) : 0;
    const expense = report ? Number(report.summary.totalExpense) : 0;
    const net = report ? Number(report.summary.netProfit) : 0;
    const isProfit = net >= 0;
    const expenseRatio = income > 0 ? expense / income : 0;

    return (
        <div className="min-h-screen bg-cream print:bg-white">
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print\\:document { box-shadow: none !important; border-color: transparent !important; }
                }
            `}</style>

            <div className="mx-auto max-w-[1240px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 print:max-w-full print:p-0 print:space-y-4">
                {/* Heading */}
                <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between print:hidden">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Financial overview
                        </p>
                        <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            Reports
                        </h1>
                        <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                            আয়, ব্যয় ও মুনাফার বিশ্লেষণ।
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-rule-soft bg-paper px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
                    >
                        <Printer size={14} />
                        Print
                    </button>
                </header>

                {/* Report quick-links */}
                <nav className="flex flex-wrap gap-2 print:hidden">
                    <ReportLink href="/owner/dashboard/reports" active>
                        Financial
                    </ReportLink>
                    <ReportLink href="/owner/dashboard/reports/rent-collection">
                        Rent collection
                    </ReportLink>
                    <ReportLink href="/owner/dashboard/reports/occupancy">
                        Occupancy
                    </ReportLink>
                    <ReportLink href="/owner/dashboard/reports/expenses">
                        Expenses
                    </ReportLink>
                </nav>

                {/* Date range picker */}
                <div className="rounded-[14px] border border-rule-soft bg-paper p-4 print:hidden">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label className="block text-[11.5px] font-semibold text-ink">
                                    From
                                </label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    max={toDate}
                                    onChange={(e) =>
                                        setFromDate(e.target.value)
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-rule-soft bg-paper px-3 text-[13.5px] text-ink tabular-nums focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[11.5px] font-semibold text-ink">
                                    To
                                </label>
                                <input
                                    type="date"
                                    value={toDate}
                                    min={fromDate}
                                    onChange={(e) =>
                                        setToDate(e.target.value)
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-rule-soft bg-paper px-3 text-[13.5px] text-ink tabular-nums focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                            <PresetButton
                                onClick={() => applyPreset(1)}
                                label="This month"
                            />
                            <PresetButton
                                onClick={() => applyPreset(3)}
                                label="Last 3 months"
                            />
                            <PresetButton
                                onClick={() => applyPreset(6)}
                                label="Last 6 months"
                            />
                            <PresetButton
                                onClick={applyYTD}
                                label="Year to date"
                            />
                            <PresetButton
                                onClick={applyLastYear}
                                label="Last year"
                            />
                        </div>
                    </div>

                    {report && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-rule-soft pt-3 text-[12px] text-ink-soft">
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar
                                    size={12}
                                    className="text-ink-soft/60"
                                />
                                <span className="tabular-nums">
                                    {formatPeriod(
                                        report.period.from,
                                        report.period.to,
                                    )}
                                </span>
                            </span>
                            <span className="tabular-nums">
                                <span className="font-semibold text-ink">
                                    {fmtNum(report.monthly.length)}
                                </span>{" "}
                                month{report.monthly.length === 1 ? "" : "s"}{" "}
                                covered
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <ReportShell />
                ) : isError ? (
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load report
                        </h2>
                        <p className="mt-1 text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Please adjust the date range and try again."}
                        </p>
                    </div>
                ) : !report ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Summary KPIs */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
                            {/* Net profit hero */}
                            <div
                                className={cn(
                                    "relative overflow-hidden rounded-[18px] px-5 py-5 sm:px-6 sm:py-6",
                                    isProfit
                                        ? "bg-jade-950 text-paper"
                                        : "border border-coral-100 bg-coral-50/60",
                                )}
                                style={
                                    isProfit
                                        ? {
                                              boxShadow:
                                                  "0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 40px -22px rgba(10,46,34,0.5)",
                                          }
                                        : undefined
                                }
                            >
                                {isProfit && (
                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-40"
                                        style={{
                                            background:
                                                "radial-gradient(circle, rgba(46,196,140,0.45), transparent 65%)",
                                        }}
                                    />
                                )}

                                <p
                                    className={cn(
                                        "relative font-serif text-[13px] italic",
                                        isProfit
                                            ? "text-paper/60"
                                            : "text-coral-600/85",
                                    )}
                                >
                                    {isProfit ? "Net profit" : "Net loss"}
                                </p>
                                <p
                                    className={cn(
                                        "font-bangla relative mt-0.5 text-[11.5px]",
                                        isProfit
                                            ? "text-paper/45"
                                            : "text-ink-soft/65",
                                    )}
                                >
                                    {isProfit ? "নিট মুনাফা" : "নিট ক্ষতি"}
                                </p>
                                <p
                                    className={cn(
                                        "relative mt-3 text-[40px] font-bold leading-none tracking-[-0.025em] tabular-nums sm:text-[46px]",
                                        isProfit
                                            ? "text-jade-300"
                                            : "text-coral-600",
                                    )}
                                >
                                    {formatMoney(Math.abs(net))}
                                </p>
                                <p
                                    className={cn(
                                        "relative mt-3 text-[12.5px]",
                                        isProfit
                                            ? "text-paper/70"
                                            : "text-ink-soft",
                                    )}
                                >
                                    income{" "}
                                    <span
                                        className={cn(
                                            "font-semibold tabular-nums",
                                            isProfit
                                                ? "text-paper"
                                                : "text-ink",
                                        )}
                                    >
                                        {formatMoney(income)}
                                    </span>{" "}
                                    −{" "}
                                    <span
                                        className={cn(
                                            "font-semibold tabular-nums",
                                            isProfit
                                                ? "text-paper"
                                                : "text-ink",
                                        )}
                                    >
                                        {formatMoney(expense)}
                                    </span>{" "}
                                    expense
                                </p>

                                {income > 0 && (
                                    <div
                                        className={cn(
                                            "relative mt-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium",
                                            isProfit
                                                ? "bg-jade-500/20 text-jade-300"
                                                : "bg-coral-50 text-coral-600",
                                        )}
                                    >
                                        <Sparkles size={11} />
                                        <span className="tabular-nums">
                                            {(expenseRatio * 100).toFixed(1)}%
                                        </span>
                                        <span>
                                            of income spent on expenses
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Supporting — income + expense */}
                            <div className="grid grid-cols-1 gap-3">
                                <SummaryStat
                                    label="Total income"
                                    bn="মোট আয়"
                                    value={formatMoney(income)}
                                    Icon={TrendingUp}
                                    tone="good"
                                />
                                <SummaryStat
                                    label="Total expense"
                                    bn="মোট ব্যয়"
                                    value={formatMoney(expense)}
                                    Icon={TrendingDown}
                                    tone="warn"
                                />
                            </div>
                        </div>

                        {/* Monthly breakdown */}
                        <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                            <div className="flex items-center justify-between border-b border-rule-soft px-5 py-4 sm:px-6">
                                <div>
                                    <p className="font-serif text-[12.5px] italic text-coral-600/85">
                                        Monthly breakdown
                                    </p>
                                    <p className="font-bangla text-[11.5px] text-ink-soft/75">
                                        মাসিক বিশ্লেষণ
                                    </p>
                                </div>
                                <div className="hidden items-center gap-3 text-[11px] text-ink-soft sm:flex">
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-sm bg-jade-700" />
                                        Income
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-sm bg-coral-500" />
                                        Expense
                                    </span>
                                </div>
                            </div>

                            {report.monthly.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <BarChart3
                                        size={28}
                                        className="mx-auto text-ink-soft/40"
                                    />
                                    <p className="mt-3 text-[13.5px] text-ink-soft">
                                        No data for this period.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <MonthlyChart monthly={report.monthly} />
                                    <MonthlyTable monthly={report.monthly} />
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// Monthly chart — paired bars, hand-rolled SVG to stay in brand palette.
// ─────────────────────────────────────────────────────────────────

function MonthlyChart({ monthly }: { monthly: FinancialReportMonthly[] }) {
    const max = useMemo(
        () =>
            Math.max(
                1,
                ...monthly.flatMap((m) => [
                    Number(m.income),
                    Number(m.expense),
                ]),
            ),
        [monthly],
    );

    const W = 880;
    const H = 240;
    const padTop = 16;
    const padBottom = 36;
    const padX = 32;
    const innerH = H - padTop - padBottom;
    const innerW = W - padX * 2;
    const groupW = innerW / monthly.length;
    const barGap = 4;
    const barW = Math.max(6, Math.min(28, groupW / 2 - barGap));

    return (
        <div className="overflow-x-auto px-5 py-4 sm:px-6">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="block w-full min-w-[640px]"
                role="img"
                aria-label="Monthly income vs expense"
            >
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                    const y = padTop + innerH * (1 - t);
                    return (
                        <line
                            key={t}
                            x1={padX}
                            x2={W - padX}
                            y1={y}
                            y2={y}
                            stroke="var(--color-rule-soft)"
                            strokeDasharray={t === 0 ? undefined : "3 4"}
                            strokeWidth={t === 0 ? 1 : 0.75}
                        />
                    );
                })}

                {monthly.map((m, i) => {
                    const incomeVal = Number(m.income);
                    const expenseVal = Number(m.expense);
                    const groupX = padX + i * groupW;
                    const cx = groupX + groupW / 2;

                    const incomeH = (incomeVal / max) * innerH;
                    const expenseH = (expenseVal / max) * innerH;
                    const baseY = padTop + innerH;

                    const incomeX = cx - barW - barGap / 2;
                    const expenseX = cx + barGap / 2;

                    return (
                        <g key={m.month}>
                            <title>
                                {m.month} · Income {m.income} · Expense{" "}
                                {m.expense}
                            </title>

                            {/* Income bar */}
                            <rect
                                x={incomeX}
                                y={baseY - incomeH}
                                width={barW}
                                height={Math.max(incomeH, 0)}
                                rx={3}
                                fill="var(--color-jade-700)"
                            />
                            {/* Expense bar */}
                            <rect
                                x={expenseX}
                                y={baseY - expenseH}
                                width={barW}
                                height={Math.max(expenseH, 0)}
                                rx={3}
                                fill="var(--color-coral-500)"
                            />

                            {/* Month label */}
                            <text
                                x={cx}
                                y={H - 14}
                                textAnchor="middle"
                                fontSize={10.5}
                                fontWeight={500}
                                fill="var(--color-ink-soft)"
                            >
                                {formatMonthLabel(m.month)}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

function MonthlyTable({
    monthly,
}: {
    monthly: FinancialReportMonthly[];
}) {
    return (
        <div className="border-t border-rule-soft">
            <table className="w-full text-[12.5px]">
                <thead className="bg-cream/40 text-[10.5px] uppercase tracking-[0.12em] text-ink-soft">
                    <tr>
                        <th className="px-5 py-2 text-left font-semibold sm:px-6">
                            Month
                        </th>
                        <th className="px-3 py-2 text-right font-semibold">
                            Income
                        </th>
                        <th className="px-3 py-2 text-right font-semibold">
                            Expense
                        </th>
                        <th className="px-5 py-2 text-right font-semibold sm:px-6">
                            Net
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-rule-soft">
                    {monthly.map((m) => {
                        const incomeVal = Number(m.income);
                        const expenseVal = Number(m.expense);
                        const netVal = Number(m.net);
                        const isProfit = netVal >= 0;
                        return (
                            <tr key={m.month} className="hover:bg-cream/40">
                                <td className="px-5 py-2 text-ink sm:px-6">
                                    <span className="inline-flex items-center gap-1.5 font-semibold">
                                        {formatMonthLabel(m.month)}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-right tabular-nums text-jade-800">
                                    {incomeVal > 0 ? (
                                        <span className="inline-flex items-center gap-1">
                                            <ArrowUpRight
                                                size={11}
                                                className="text-jade-700"
                                            />
                                            {formatMoney(incomeVal)}
                                        </span>
                                    ) : (
                                        <span className="text-ink-soft/50">
                                            {formatMoney(0)}
                                        </span>
                                    )}
                                </td>
                                <td className="px-3 py-2 text-right tabular-nums text-coral-600">
                                    {expenseVal > 0 ? (
                                        <span className="inline-flex items-center gap-1">
                                            <ArrowDownRight
                                                size={11}
                                                className="text-coral-600"
                                            />
                                            {formatMoney(expenseVal)}
                                        </span>
                                    ) : (
                                        <span className="text-ink-soft/50">
                                            {formatMoney(0)}
                                        </span>
                                    )}
                                </td>
                                <td
                                    className={cn(
                                        "px-5 py-2 text-right font-semibold tabular-nums sm:px-6",
                                        isProfit
                                            ? "text-jade-950"
                                            : "text-coral-600",
                                    )}
                                >
                                    {isProfit ? "" : "−"}
                                    {formatMoney(Math.abs(netVal))}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────

function SummaryStat({
    label,
    bn,
    value,
    tone,
    Icon,
}: {
    label: string;
    bn: string;
    value: string;
    tone: "good" | "warn";
    Icon: typeof TrendingUp;
}) {
    const valueTone = tone === "warn" ? "text-coral-600" : "text-jade-950";
    const iconBg = tone === "warn" ? "bg-coral-50" : "bg-jade-50";
    const iconFg = tone === "warn" ? "text-coral-600" : "text-jade-700";

    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper px-4 py-3.5">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                        {label}
                    </p>
                    <p className="font-bangla text-[10.5px] text-ink-soft/65">
                        {bn}
                    </p>
                </div>
                <span
                    className={cn(
                        "inline-flex size-7 shrink-0 items-center justify-center rounded-md",
                        iconBg,
                    )}
                >
                    <Icon size={14} className={iconFg} />
                </span>
            </div>
            <p
                className={cn(
                    "mt-2 text-[22px] font-bold leading-none tracking-[-0.025em] tabular-nums",
                    valueTone,
                )}
            >
                {value}
            </p>
        </div>
    );
}

function PresetButton({
    onClick,
    label,
}: {
    onClick: () => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex h-8 items-center rounded-[8px] border border-rule-soft bg-paper px-2.5 text-[11.5px] font-medium text-ink-soft transition-colors hover:border-jade-700/30 hover:text-jade-900"
        >
            {label}
        </button>
    );
}

function ReportShell() {
    return (
        <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
                <Skeleton className="h-44 rounded-[18px] bg-paper" />
                <div className="grid grid-cols-1 gap-3">
                    <Skeleton className="h-20 rounded-[14px] bg-paper" />
                    <Skeleton className="h-20 rounded-[14px] bg-paper" />
                </div>
            </div>
            <Skeleton className="h-80 rounded-[14px] bg-paper" />
        </>
    );
}

function EmptyState() {
    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
                <BarChart3 size={26} className="text-jade-800" />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-jade-950">
                Pick a date range
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
                Choose a period above to see income, expenses, and net profit
                over time.
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// ReportLink — pill nav between the four report screens
// ─────────────────────────────────────────────────────────────────

function ReportLink({
    href,
    active,
    children,
}: {
    href: string;
    active?: boolean;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-flex h-8 items-center rounded-full px-3 text-[12.5px] font-semibold transition-colors",
                active
                    ? "bg-jade-900 text-paper"
                    : "border border-rule-soft bg-paper text-ink-soft hover:border-jade-700/30 hover:text-jade-900",
            )}
        >
            {children}
        </Link>
    );
}
