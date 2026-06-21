"use client";

// src/app/owner/dashboard/expenses/page.tsx

import { RecordExpenseDialog } from "@/src/components/dashboard/expenses/RecordExpenseDialog";
import {
    expenseCategoryAccent,
    expenseCategoryLabel,
    expenseCategoryStyles,
    formatExpenseDate,
} from "@/src/components/dashboard/expenses/expenseStyles";
import {
    paymentMethodLabel,
    paymentMethodStyles,
} from "@/src/components/dashboard/payments/paymentStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useBuildings } from "@/src/hooks/useBuildings";
import { useExpenses } from "@/src/hooks/useExpenses";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import {
    EXPENSE_CATEGORY_OPTIONS,
    type ExpenseCategory,
    type ExpenseListItem,
} from "@/src/types/expense.types";
import {
    ArrowUpRight,
    Banknote,
    Building,
    Calendar,
    Plus,
    Search,
    Store,
    X,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";

const ALL = "__ALL__";

export default function ExpensesListPage() {
    return (
        <Suspense fallback={<ListShell />}>
            <ExpensesListInner />
        </Suspense>
    );
}

function ExpensesListInner() {
    const [categoryFilter, setCategoryFilter] = useState<string>(ALL);
    const [buildingFilter, setBuildingFilter] = useState<string>(ALL);
    const [query, setQuery] = useState("");
    const [recordOpen, setRecordOpen] = useState(false);

    const filters = {
        ...(categoryFilter !== ALL && {
            category: categoryFilter as ExpenseCategory,
        }),
        ...(buildingFilter !== ALL && { buildingId: buildingFilter }),
    };

    const {
        data: expenses,
        isLoading,
        isError,
        error,
    } = useExpenses(filters);
    const { data: buildings } = useBuildings();

    const filtered = useMemo(
        () =>
            (expenses ?? []).filter((e) => {
                const q = query.trim().toLowerCase();
                if (!q) return true;
                return (
                    e.title.toLowerCase().includes(q) ||
                    (e.paidTo?.toLowerCase().includes(q) ?? false) ||
                    (e.building?.name.toLowerCase().includes(q) ?? false) ||
                    (e.notes?.toLowerCase().includes(q) ?? false)
                );
            }),
        [expenses, query],
    );

    const totalSpent = (expenses ?? []).reduce(
        (sum, e) => sum + Number(e.amount),
        0,
    );

    // This-month sub-stat (uses current calendar month against expenseDate)
    const now = new Date();
    const thisMonthSpent = (expenses ?? [])
        .filter((e) => {
            const d = new Date(e.expenseDate);
            return (
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth()
            );
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);

    const hasActiveFilters =
        categoryFilter !== ALL ||
        buildingFilter !== ALL ||
        query.trim() !== "";

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1240px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Heading */}
                <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Money out
                        </p>
                        <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            Expenses
                        </h1>
                        <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                            সব খরচ ও পরিচালনা ব্যয়।
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setRecordOpen(true)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                    >
                        <Plus size={14} />
                        Record expense
                    </button>
                </header>

                {/* Money hero — total spent is THE number */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
                    <div
                        className="relative overflow-hidden rounded-[18px] bg-jade-950 px-5 py-5 text-paper sm:px-6 sm:py-6"
                        style={{
                            boxShadow:
                                "0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 40px -22px rgba(10,46,34,0.5)",
                        }}
                    >
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-45"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(255,123,87,0.45), transparent 65%)",
                            }}
                        />

                        <p className="relative font-serif text-[13px] italic text-paper/60">
                            Total spent
                        </p>
                        <p className="font-bangla relative mt-0.5 text-[11.5px] text-paper/45">
                            মোট খরচ
                        </p>
                        <p className="relative mt-3 text-[40px] font-bold leading-none tracking-[-0.025em] tabular-nums text-coral-400 sm:text-[46px]">
                            {formatMoney(totalSpent)}
                        </p>
                        <p className="relative mt-3 text-[12.5px] text-paper/70">
                            across{" "}
                            <span className="font-semibold tabular-nums text-paper">
                                {fmtNum(expenses?.length ?? 0)}
                            </span>{" "}
                            expense{(expenses?.length ?? 0) === 1 ? "" : "s"}
                            {thisMonthSpent > 0 && (
                                <>
                                    {" · "}
                                    <span className="text-jade-300">
                                        {formatMoney(thisMonthSpent)} this month
                                    </span>
                                </>
                            )}
                        </p>
                    </div>

                    {/* Supporting */}
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                        <MiniStat
                            label="This month"
                            bn="এই মাসে"
                            value={formatMoney(thisMonthSpent)}
                            sub="spent so far"
                            tone={thisMonthSpent > 0 ? "warn" : "neutral"}
                        />
                        <MiniStat
                            label="Total entries"
                            bn="মোট এন্ট্রি"
                            value={fmtNum(expenses?.length ?? 0)}
                            sub="logged expenses"
                            tone="neutral"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-[14px] border border-rule-soft bg-paper p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/70"
                            />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by title, vendor, building, notes…"
                                className="h-9 w-full rounded-md border border-rule-soft bg-paper pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-soft/60 focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
                            />
                        </div>

                        <div className="w-full sm:w-48">
                            <Select
                                value={categoryFilter}
                                onValueChange={(v) =>
                                    setCategoryFilter(v ?? ALL)
                                }
                            >
                                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>
                                        All categories
                                    </SelectItem>
                                    {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-44">
                            <Select
                                value={buildingFilter}
                                onValueChange={(v) =>
                                    setBuildingFilter(v ?? ALL)
                                }
                            >
                                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                                    <SelectValue placeholder="Building" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>
                                        All buildings
                                    </SelectItem>
                                    {(buildings ?? []).map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {(filtered.length > 0 || hasActiveFilters) && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-rule-soft pt-3 text-[12px] text-ink-soft">
                            <span className="tabular-nums">
                                <span className="font-semibold text-ink">
                                    {fmtNum(filtered.length)}
                                </span>{" "}
                                {filtered.length === 1 ? "result" : "results"}
                                {categoryFilter !== ALL && (
                                    <span className="ml-1.5 text-ink-soft/70">
                                        ·{" "}
                                        {expenseCategoryLabel(
                                            categoryFilter as ExpenseCategory,
                                        )}
                                    </span>
                                )}
                            </span>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery("");
                                        setCategoryFilter(ALL);
                                        setBuildingFilter(ALL);
                                    }}
                                    className="inline-flex items-center gap-1 font-medium text-ink-soft transition-colors hover:text-coral-600"
                                >
                                    <X size={11} /> Clear filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <ListShell />
                ) : isError ? (
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load expenses
                        </h2>
                        <p className="mt-1 text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Please try again."}
                        </p>
                    </div>
                ) : !expenses || expenses.length === 0 ? (
                    <EmptyState onRecord={() => setRecordOpen(true)} />
                ) : filtered.length === 0 ? (
                    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-12 text-center">
                        <p className="text-[13.5px] text-ink-soft">
                            No expenses match your filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                        <ul className="divide-y divide-rule-soft">
                            {filtered.map((e) => (
                                <ExpenseRow key={e.id} expense={e} />
                            ))}
                        </ul>
                    </div>
                )}

                {/* Dialog */}
                <RecordExpenseDialog
                    open={recordOpen}
                    onOpenChange={setRecordOpen}
                />
            </div>
        </div>
    );
}

function ExpenseRow({ expense }: { expense: ExpenseListItem }) {
    return (
        <li>
            <Link
                href={`/owner/dashboard/expenses/${expense.id}`}
                className="group relative flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cream/60 sm:flex-row sm:items-center"
            >
                <span
                    aria-hidden
                    className={cn(
                        "absolute inset-y-0 left-0 w-[3px]",
                        expenseCategoryAccent[expense.category],
                    )}
                />

                <div className="min-w-0 flex-1 pl-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-[13.5px] font-semibold text-jade-950 group-hover:text-jade-900">
                            {expense.title}
                        </p>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                expenseCategoryStyles[expense.category],
                            )}
                        >
                            {expenseCategoryLabel(expense.category)}
                        </span>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                paymentMethodStyles[expense.paymentMethod],
                            )}
                        >
                            {paymentMethodLabel(expense.paymentMethod)}
                        </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-soft">
                        {expense.paidTo && (
                            <span className="inline-flex items-center gap-1">
                                <Store size={11} className="text-ink-soft/60" />
                                <span className="text-ink">
                                    {expense.paidTo}
                                </span>
                            </span>
                        )}
                        {expense.building && (
                            <span className="inline-flex items-center gap-1">
                                <Building
                                    size={11}
                                    className="text-ink-soft/60"
                                />
                                {expense.building.name}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 tabular-nums">
                            <Calendar
                                size={11}
                                className="text-ink-soft/60"
                            />
                            {formatExpenseDate(expense.expenseDate)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 pl-2 sm:pl-0">
                    <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                            Amount
                        </p>
                        <p className="text-[16px] font-bold tabular-nums text-coral-600">
                            {formatMoney(expense.amount)}
                        </p>
                    </div>
                    <ArrowUpRight
                        size={14}
                        className="shrink-0 text-ink-soft/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-jade-900"
                    />
                </div>
            </Link>
        </li>
    );
}

function MiniStat({
    label,
    bn,
    value,
    sub,
    tone,
}: {
    label: string;
    bn: string;
    value: string;
    sub: string;
    tone: "good" | "warn" | "neutral";
}) {
    const valueTone =
        tone === "warn"
            ? "text-coral-600"
            : tone === "good"
                ? "text-jade-950"
                : "text-ink-soft/85";

    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper px-4 py-3.5">
            <div className="flex items-baseline justify-between gap-2">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                    {label}
                </p>
                <p className="font-bangla text-[10.5px] text-ink-soft/65">
                    {bn}
                </p>
            </div>
            <p
                className={cn(
                    "mt-1.5 text-[20px] font-bold leading-none tracking-[-0.025em] tabular-nums",
                    valueTone,
                )}
            >
                {value}
            </p>
            <p className="mt-1.5 text-[11.5px] text-ink-soft">{sub}</p>
        </div>
    );
}

function ListShell() {
    return (
        <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                    key={i}
                    className="h-[72px] w-full rounded-[10px] bg-paper"
                />
            ))}
        </div>
    );
}

function EmptyState({ onRecord }: { onRecord: () => void }) {
    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
                <Banknote size={26} className="text-jade-800" />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-jade-950">
                No expenses yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
                Track operational costs — utilities, repairs, salaries, fuel,
                cleaning — to know where the money actually goes.
            </p>
            <p className="font-bangla mt-0.5 text-[12px] text-ink-soft/75">
                প্রথম খরচ যুক্ত করুন
            </p>
            <div className="mt-5 flex items-center justify-center">
                <button
                    type="button"
                    onClick={onRecord}
                    className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                >
                    <Plus size={14} />
                    Record expense
                </button>
            </div>
        </div>
    );
}
