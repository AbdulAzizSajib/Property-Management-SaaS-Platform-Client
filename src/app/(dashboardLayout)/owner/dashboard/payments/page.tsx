"use client";

import {
    paymentMethodLabel,
    paymentMethodStyles,
    paymentStatusLabel,
    paymentStatusStyles,
} from "@/src/components/dashboard/payments/paymentStyles";
import { RecordPaymentDialog } from "@/src/components/dashboard/payments/RecordPaymentDialog";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { usePayments } from "@/src/hooks/usePayments";
import { cn } from "@/src/lib/utils";
import type { PaymentListItem } from "@/src/types/payment.types";
import {
    Calendar,
    CreditCard,
    FileText,
    Plus,
    Receipt,
    Search,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

export default function PaymentsListPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading…</div>}>
            <PaymentsListInner />
        </Suspense>
    );
}

function PaymentsListInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const invoiceIdParam = searchParams.get("invoiceId") ?? "";
    const tenantIdParam = searchParams.get("tenantId") ?? "";
    const leaseIdParam = searchParams.get("leaseId") ?? "";

    const [recordOpen, setRecordOpen] = useState(false);
    const [query, setQuery] = useState("");

    const filters = useMemo(
        () => ({
            ...(invoiceIdParam && { invoiceId: invoiceIdParam }),
            ...(tenantIdParam && { tenantId: tenantIdParam }),
            ...(leaseIdParam && { leaseId: leaseIdParam }),
        }),
        [invoiceIdParam, tenantIdParam, leaseIdParam],
    );

    const { data: payments, isLoading, isError, error } = usePayments(filters);

    // Auto-open the record dialog when arriving with ?invoiceId= and no payments yet,
    // OR when ?record=1 is in the URL (explicit signal from "Record a payment" links).
    useEffect(() => {
        if (searchParams.get("record") === "1") {
            setRecordOpen(true);
            const next = new URLSearchParams(searchParams.toString());
            next.delete("record");
            router.replace(`/owner/dashboard/payments?${next.toString()}`);
        }
    }, [searchParams, router]);

    const filtered = (payments ?? []).filter((p) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            p.receiptNumber.toLowerCase().includes(q) ||
            p.tenant.name.toLowerCase().includes(q) ||
            p.tenant.phone.toLowerCase().includes(q) ||
            p.invoice.invoiceNumber.toLowerCase().includes(q) ||
            (p.transactionId ?? "").toLowerCase().includes(q)
        );
    });

    const totalCollected = (payments ?? []).reduce(
        (sum, p) => (p.status === "PAID" ? sum + Number(p.amount) : sum),
        0,
    );
    const advanceCount = (payments ?? []).filter((p) => p.isAdvance).length;
    const hasUrlFilters = !!invoiceIdParam || !!tenantIdParam || !!leaseIdParam;

    function clearUrlFilters() {
        router.replace(`/owner/dashboard/payments`);
    }

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Payments
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Recorded payments against invoices. Status updates automatically.
                    </p>
                </div>
                <Button onClick={() => setRecordOpen(true)}>
                    <Plus size={14} />
                    Record Payment
                </Button>
            </div>

            {/* URL filter indicator */}
            {hasUrlFilters && (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs">
                    <span className="font-medium text-indigo-900">Filtered by:</span>
                    {invoiceIdParam && (
                        <Badge
                            variant="outline"
                            className="border-indigo-300 bg-white text-indigo-700"
                        >
                            Invoice {invoiceIdParam.slice(-6).toUpperCase()}
                        </Badge>
                    )}
                    {tenantIdParam && (
                        <Badge
                            variant="outline"
                            className="border-indigo-300 bg-white text-indigo-700"
                        >
                            Tenant {tenantIdParam.slice(-6).toUpperCase()}
                        </Badge>
                    )}
                    {leaseIdParam && (
                        <Badge
                            variant="outline"
                            className="border-indigo-300 bg-white text-indigo-700"
                        >
                            Lease {leaseIdParam.slice(-6).toUpperCase()}
                        </Badge>
                    )}
                    <button
                        type="button"
                        onClick={clearUrlFilters}
                        className="ml-auto inline-flex items-center gap-1 font-medium text-indigo-700 hover:text-indigo-900"
                    >
                        <X size={11} /> Clear
                    </button>
                </div>
            )}

            {/* Stat tiles */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatTile
                    label="Total payments"
                    value={String(payments?.length ?? 0)}
                    sublabel="recorded"
                    accent="indigo"
                />
                <StatTile
                    label="Total collected"
                    value={formatMoney(totalCollected)}
                    sublabel="across paid records"
                    accent="emerald"
                />
                <StatTile
                    label="Advance payments"
                    value={String(advanceCount)}
                    sublabel="applied to balance"
                    accent="violet"
                />
            </div>

            {/* Search */}
            <Card className="px-4 py-3">
                <div className="relative">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by receipt #, tenant, invoice #, transaction ID..."
                        className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="tabular-nums">
                        {filtered.length} {filtered.length === 1 ? "result" : "results"}
                    </span>
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                        >
                            <X size={11} /> Clear
                        </button>
                    )}
                </div>
            </Card>

            {/* Content */}
            {isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                </div>
            ) : isError ? (
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load payments
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Please try again."}
                    </p>
                </Card>
            ) : !payments || payments.length === 0 ? (
                <EmptyState onRecord={() => setRecordOpen(true)} />
            ) : filtered.length === 0 ? (
                <Card className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-500">
                        No payments match your search.
                    </p>
                </Card>
            ) : (
                <Card className="overflow-hidden p-0">
                    <ul className="divide-y divide-slate-100">
                        {filtered.map((p) => (
                            <PaymentRow key={p.id} payment={p} />
                        ))}
                    </ul>
                </Card>
            )}

            <RecordPaymentDialog
                open={recordOpen}
                onOpenChange={setRecordOpen}
                fixedInvoiceId={invoiceIdParam || undefined}
            />
        </div>
    );
}

function PaymentRow({ payment }: { payment: PaymentListItem }) {
    return (
        <li>
            <Link
                href={`/owner/dashboard/payments/${payment.id}`}
                className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-mono text-xs font-medium text-slate-900 group-hover:text-indigo-700">
                            {payment.receiptNumber}
                        </p>
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-[10px]",
                                paymentMethodStyles[payment.method],
                            )}
                        >
                            {paymentMethodLabel(payment.method)}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-[10px]",
                                paymentStatusStyles[payment.status],
                            )}
                        >
                            {paymentStatusLabel(payment.status)}
                        </Badge>
                        {payment.isAdvance && (
                            <Badge
                                variant="outline"
                                className="border-violet-200 bg-violet-50 text-[10px] text-violet-700"
                            >
                                Advance
                            </Badge>
                        )}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                            <User size={11} /> {payment.tenant.name}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <FileText size={11} /> {payment.invoice.invoiceNumber}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(payment.paidAt).toLocaleDateString()}
                        </span>
                        {payment.transactionId && (
                            <span className="font-mono text-[10px] text-slate-400">
                                Txn: {payment.transactionId}
                            </span>
                        )}
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-lg font-semibold text-emerald-700 tabular-nums">
                        +{formatMoney(payment.amount)}
                    </p>
                </div>
            </Link>
        </li>
    );
}

function StatTile({
    label,
    value,
    sublabel,
    accent,
}: {
    label: string;
    value: string;
    sublabel: string;
    accent: "indigo" | "emerald" | "violet";
}) {
    const accents: Record<typeof accent, string> = {
        indigo: "bg-indigo-50 text-indigo-700",
        emerald: "bg-emerald-50 text-emerald-700",
        violet: "bg-violet-50 text-violet-700",
    };
    return (
        <Card className="px-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                {label}
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">
                {value}
            </p>
            <span
                className={cn(
                    "mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                    accents[accent],
                )}
            >
                {sublabel}
            </span>
        </Card>
    );
}

function EmptyState({ onRecord }: { onRecord: () => void }) {
    return (
        <Card className="px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-indigo-50">
                <CreditCard size={28} className="text-indigo-600" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No payments yet
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Record your first payment against an outstanding invoice. Invoice
                status updates automatically.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Receipt size={12} />
                You need at least one outstanding invoice
            </div>
            <div className="mt-5">
                <Button onClick={onRecord}>
                    <Plus size={14} /> Record your first payment
                </Button>
            </div>
        </Card>
    );
}
