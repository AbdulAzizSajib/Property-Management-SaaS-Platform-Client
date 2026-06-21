"use client";

// src/app/owner/dashboard/payments/page.tsx

import { RecordPaymentDialog } from "@/src/components/dashboard/payments/RecordPaymentDialog";
import {
    paymentMethodLabel,
    paymentMethodStyles,
    paymentStatusAccent,
    paymentStatusLabel,
    paymentStatusStyles,
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
import { usePayments } from "@/src/hooks/usePayments";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import {
    PAYMENT_METHOD_OPTIONS,
    PAYMENT_STATUS_OPTIONS,
    type PaymentListItem,
    type PaymentMethod,
    type PaymentStatus,
} from "@/src/types/payment.types";
import {
    ArrowUpRight,
    Calendar,
    Plus,
    Receipt,
    Search,
    User,
    Wallet,
    X,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";

const ALL = "__ALL__";

export default function PaymentsListPage() {
    return (
        <Suspense fallback={<ListShell />}>
            <PaymentsListInner />
        </Suspense>
    );
}

function PaymentsListInner() {
    const [statusFilter, setStatusFilter] = useState<string>(ALL);
    const [methodFilter, setMethodFilter] = useState<string>(ALL);
    const [query, setQuery] = useState("");
    const [recordOpen, setRecordOpen] = useState(false);

    const { data: payments, isLoading, isError, error } = usePayments();

    const filtered = useMemo(
        () =>
            (payments ?? []).filter((p) => {
                if (statusFilter !== ALL && p.status !== statusFilter) return false;
                if (methodFilter !== ALL && p.method !== methodFilter) return false;
                const q = query.trim().toLowerCase();
                if (!q) return true;
                return (
                    p.receiptNumber.toLowerCase().includes(q) ||
                    (p.invoice?.invoiceNumber.toLowerCase().includes(q) ??
                        false) ||
                    p.tenant.name.toLowerCase().includes(q) ||
                    p.tenant.phone.toLowerCase().includes(q) ||
                    (p.transactionId?.toLowerCase().includes(q) ?? false)
                );
            }),
        [payments, query, statusFilter, methodFilter],
    );

    const totalCollected = (payments ?? [])
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const advanceCount = (payments ?? []).filter((p) => p.isAdvance).length;
    const failedCount = (payments ?? []).filter((p) => p.status === "FAILED").length;

    const hasActiveFilters =
        statusFilter !== ALL || methodFilter !== ALL || query.trim() !== "";

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1240px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Heading */}
                <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Money in
                        </p>
                        <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            Payments
                        </h1>
                        <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                            সব রিসিভড পেমেন্ট।
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setRecordOpen(true)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                    >
                        <Plus size={14} />
                        Record payment
                    </button>
                </header>

                {/* Money hero — collected is THE number */}
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
                            className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-40"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(46,196,140,0.45), transparent 65%)",
                            }}
                        />

                        <p className="relative font-serif text-[13px] italic text-paper/60">
                            Total collected
                        </p>
                        <p className="font-bangla relative mt-0.5 text-[11.5px] text-paper/45">
                            মোট আদায়
                        </p>
                        <p className="relative mt-3 text-[40px] font-bold leading-none tracking-[-0.025em] tabular-nums text-jade-300 sm:text-[46px]">
                            {formatMoney(totalCollected)}
                        </p>
                        <p className="relative mt-3 text-[12.5px] text-paper/70">
                            across{" "}
                            <span className="font-semibold tabular-nums text-paper">
                                {fmtNum(payments?.length ?? 0)}
                            </span>{" "}
                            payment{(payments?.length ?? 0) === 1 ? "" : "s"}
                        </p>
                    </div>

                    {/* Supporting */}
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                        <MiniStat
                            label="Advances"
                            bn="অগ্রিম"
                            value={fmtNum(advanceCount)}
                            sub="held against future"
                            tone="good"
                        />
                        <MiniStat
                            label="Failed"
                            bn="ব্যর্থ"
                            value={fmtNum(failedCount)}
                            sub="need review"
                            tone={failedCount > 0 ? "warn" : "neutral"}
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
                                placeholder="Search by receipt #, invoice, tenant, txn ID…"
                                className="h-9 w-full rounded-md border border-rule-soft bg-paper pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-soft/60 focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
                            />
                        </div>

                        <div className="w-full sm:w-44">
                            <Select
                                value={statusFilter}
                                onValueChange={(v) => setStatusFilter(v ?? ALL)}
                            >
                                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>All statuses</SelectItem>
                                    {PAYMENT_STATUS_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-44">
                            <Select
                                value={methodFilter}
                                onValueChange={(v) => setMethodFilter(v ?? ALL)}
                            >
                                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                                    <SelectValue placeholder="Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>All methods</SelectItem>
                                    {PAYMENT_METHOD_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
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
                                {statusFilter !== ALL && (
                                    <span className="ml-1.5 text-ink-soft/70">
                                        ·{" "}
                                        {paymentStatusLabel(
                                            statusFilter as PaymentStatus,
                                        )}
                                    </span>
                                )}
                                {methodFilter !== ALL && (
                                    <span className="ml-1.5 text-ink-soft/70">
                                        ·{" "}
                                        {paymentMethodLabel(
                                            methodFilter as PaymentMethod,
                                        )}
                                    </span>
                                )}
                            </span>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery("");
                                        setStatusFilter(ALL);
                                        setMethodFilter(ALL);
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
                            Couldn&apos;t load payments
                        </h2>
                        <p className="mt-1 text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Please try again."}
                        </p>
                    </div>
                ) : !payments || payments.length === 0 ? (
                    <EmptyState onRecord={() => setRecordOpen(true)} />
                ) : filtered.length === 0 ? (
                    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-12 text-center">
                        <p className="text-[13.5px] text-ink-soft">
                            No payments match your filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                        <ul className="divide-y divide-rule-soft">
                            {filtered.map((p) => (
                                <PaymentRow key={p.id} payment={p} />
                            ))}
                        </ul>
                    </div>
                )}

                {/* Dialog */}
                <RecordPaymentDialog
                    open={recordOpen}
                    onOpenChange={setRecordOpen}
                />
            </div>
        </div>
    );
}

function PaymentRow({ payment }: { payment: PaymentListItem }) {
    return (
        <li>
            <Link
                href={`/owner/dashboard/payments/${payment.id}`}
                className="group relative flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cream/60 sm:flex-row sm:items-center"
            >
                <span
                    aria-hidden
                    className={cn(
                        "absolute inset-y-0 left-0 w-[3px]",
                        paymentStatusAccent[payment.status],
                    )}
                />

                <div className="min-w-0 flex-1 pl-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate font-mono text-[12.5px] font-semibold text-jade-950 group-hover:text-jade-900">
                            {payment.receiptNumber}
                        </p>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                paymentStatusStyles[payment.status],
                            )}
                        >
                            {paymentStatusLabel(payment.status)}
                        </span>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                paymentMethodStyles[payment.method],
                            )}
                        >
                            {paymentMethodLabel(payment.method)}
                        </span>
                        {payment.isAdvance && (
                            <span className="rounded-md border border-jade-100 bg-jade-50/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-jade-700">
                                Advance
                            </span>
                        )}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-soft">
                        <span className="inline-flex items-center gap-1">
                            <User size={11} className="text-ink-soft/60" />
                            <span className="text-ink">{payment.tenant.name}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <Receipt size={11} className="text-ink-soft/60" />
                            <span className="font-mono">
                                {payment.invoice?.invoiceNumber ?? "—"}
                            </span>
                        </span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                            <Calendar size={11} className="text-ink-soft/60" />
                            {new Date(payment.paidAt).toLocaleDateString()}
                        </span>
                        {payment.transactionId && (
                            <span className="inline-flex items-center gap-1 font-mono">
                                <Wallet size={11} className="text-ink-soft/60" />
                                {payment.transactionId}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 pl-2 sm:pl-0">
                    <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                            Amount
                        </p>
                        <p
                            className={cn(
                                "text-[16px] font-bold tabular-nums",
                                payment.status === "PAID"
                                    ? "text-jade-800"
                                    : payment.status === "FAILED"
                                        ? "text-coral-600"
                                        : "text-ink-soft",
                            )}
                        >
                            {formatMoney(payment.amount)}
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
                <p className="font-bangla text-[10.5px] text-ink-soft/65">{bn}</p>
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
                <Wallet size={26} className="text-jade-800" />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-jade-950">
                No payments yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
                Record a payment against an outstanding invoice — bKash, Nagad,
                cash, or bank transfer.
            </p>
            <p className="font-bangla mt-0.5 text-[12px] text-ink-soft/75">
                প্রথম পেমেন্ট রেকর্ড করুন
            </p>
            <div className="mt-5 flex items-center justify-center">
                <button
                    type="button"
                    onClick={onRecord}
                    className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                >
                    <Plus size={14} />
                    Record payment
                </button>
            </div>
        </div>
    );
}
