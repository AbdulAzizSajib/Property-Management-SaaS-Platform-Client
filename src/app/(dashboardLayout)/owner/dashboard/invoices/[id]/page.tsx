"use client";

// src/app/owner/dashboard/invoices/[id]/page.tsx

import { CancelInvoiceDialog } from "@/src/components/dashboard/invoices/CancelInvoiceDialog";
import { EditInvoiceDialog } from "@/src/components/dashboard/invoices/EditInvoiceDialog";
import {
    formatBillingMonth,
    invoiceStatusLabel,
    invoiceStatusStyles,
    invoiceTypeLabel,
    invoiceTypeStyles,
} from "@/src/components/dashboard/invoices/invoiceStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useInvoice } from "@/src/hooks/useInvoices";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    ArrowUpRight,
    Building,
    Calendar,
    CreditCard,
    DoorOpen,
    FileText,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Printer,
    Receipt,
    User,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function InvoiceDetailPage() {
    const params = useParams<{ id: string }>();
    const invoiceId = params.id;

    const { data: inv, isLoading, isError, error } = useInvoice(invoiceId);

    const [editOpen, setEditOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8">
                    <Skeleton className="h-5 w-32 bg-paper" />
                    <Skeleton className="h-44 w-full bg-paper rounded-[18px]" />
                    <Skeleton className="h-72 w-full bg-paper rounded-[14px]" />
                </div>
            </div>
        );
    }

    if (isError || !inv) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] p-4 sm:p-6 lg:p-8">
                    <Link
                        href="/owner/dashboard/invoices"
                        className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        Back to invoices
                    </Link>
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-700">
                            Couldn&apos;t load invoice
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-700/80">
                            {error instanceof Error
                                ? error.message
                                : "Invoice not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const hasDue = Number(inv.dueAmount) > 0;

    return (
        <div className="min-h-screen bg-cream print:bg-white">
            {/* Print-only CSS — clean document look when printing */}
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print\\:document { box-shadow: none !important; border-color: transparent !important; }
                }
            `}</style>

            <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8 print:max-w-full print:p-0 print:space-y-4">
                {/* Toolbar — hidden in print */}
                <div className="flex items-center justify-between gap-2 print:hidden">
                    <Link
                        href="/owner/dashboard/invoices"
                        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        All invoices
                    </Link>
                    <div className="flex items-center gap-2">
                        {inv.status !== "CANCELED" && inv.status !== "PAID" && (
                            <button
                                type="button"
                                onClick={() => setEditOpen(true)}
                                className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-rule-soft bg-paper px-3 text-[12.5px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
                            >
                                <Pencil size={12} />
                                Edit
                            </button>
                        )}
                        {inv.status !== "CANCELED" && inv.status !== "PAID" && (
                            <button
                                type="button"
                                onClick={() => setCancelOpen(true)}
                                className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-coral-100 bg-coral-50/60 px-3 text-[12.5px] font-medium text-coral-700 transition-colors hover:bg-coral-50"
                            >
                                <XCircle size={12} />
                                Cancel
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-rule-soft bg-paper px-3 text-[12.5px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
                        >
                            <Printer size={12} />
                            Print
                        </button>
                    </div>
                </div>

                {/* Document */}
                <div className="print:document overflow-hidden rounded-[18px] border border-rule-soft bg-paper print:rounded-none">
                    {/* Document header — letterhead style */}
                    <div className="border-b border-rule-soft px-6 py-5 sm:px-8 sm:py-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            {/* Brand mark */}
                            <div className="flex items-center gap-3">
                                <span className="relative inline-flex size-11 items-center justify-center rounded-[9px] bg-jade-900 text-paper">
                                    <span className="text-[16px] font-bold leading-none">
                                        B
                                    </span>
                                    <span
                                        aria-hidden
                                        className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-coral-600 ring-2 ring-paper"
                                    />
                                </span>
                                <div>
                                    <p className="font-serif text-[13px] italic text-coral-600/85">
                                        Invoice
                                    </p>
                                    <p className="font-mono text-[14px] font-bold tracking-tight text-jade-950">
                                        {inv.invoiceNumber}
                                    </p>
                                </div>
                            </div>

                            {/* Status pills */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={cn(
                                        "rounded-md border px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider",
                                        invoiceTypeStyles[inv.type],
                                    )}
                                >
                                    {invoiceTypeLabel(inv.type)}
                                </span>
                                <span
                                    className={cn(
                                        "rounded-md border px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider",
                                        invoiceStatusStyles[inv.status],
                                    )}
                                >
                                    {invoiceStatusLabel(inv.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Amount due — the headline number */}
                    <div className="grid grid-cols-1 border-b border-rule-soft sm:grid-cols-[1.5fr_1fr]">
                        <div className="px-6 py-5 sm:px-8 sm:py-6">
                            <p className="font-serif text-[13px] italic text-coral-600/85">
                                Amount due
                            </p>
                            <p className="font-bangla text-[11.5px] text-ink-soft/70 mt-0.5">
                                পরিশোধযোগ্য পরিমাণ
                            </p>
                            <p
                                className={cn(
                                    "mt-3 text-[40px] font-bold leading-none tracking-[-0.025em] tabular-nums sm:text-[44px]",
                                    hasDue
                                        ? "text-coral-700"
                                        : "text-jade-800",
                                )}
                            >
                                {formatMoney(inv.dueAmount)}
                            </p>
                            <p className="mt-3 text-[12.5px] text-ink-soft">
                                of{" "}
                                <span className="font-semibold text-ink tabular-nums">
                                    {formatMoney(inv.totalAmount)}
                                </span>{" "}
                                total
                                {Number(inv.paidAmount) > 0 && (
                                    <>
                                        {" · "}
                                        <span className="text-jade-800 tabular-nums">
                                            {formatMoney(inv.paidAmount)} paid
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>

                        {/* Key dates */}
                        <div className="grid grid-cols-3 divide-x divide-rule-soft border-t border-rule-soft sm:grid-cols-1 sm:divide-x-0 sm:divide-y sm:border-l sm:border-t-0">
                            <DateBlock
                                label="Issued"
                                bn="ইস্যু"
                                value={new Date(
                                    inv.issueDate,
                                ).toLocaleDateString()}
                            />
                            <DateBlock
                                label="Due"
                                bn="শেষ দিন"
                                value={new Date(
                                    inv.dueDate,
                                ).toLocaleDateString()}
                                emphasis={hasDue}
                            />
                            <DateBlock
                                label="Billing"
                                bn="মাস"
                                value={formatBillingMonth(inv.billingMonth)}
                            />
                        </div>
                    </div>

                    {/* Bill to + Property */}
                    <div className="grid grid-cols-1 border-b border-rule-soft sm:grid-cols-2 sm:divide-x sm:divide-rule-soft">
                        <PartyBlock
                            eyebrow="Bill to · বিল প্রাপক"
                            href={`/owner/dashboard/tenants/${inv.tenant.id}`}
                            heading={inv.tenant.name}
                        >
                            <ul className="space-y-1 text-[12px] text-ink-soft">
                                <li className="inline-flex items-center gap-1.5 tabular-nums">
                                    <Phone
                                        size={11}
                                        className="text-ink-soft/60"
                                    />
                                    {inv.tenant.phone}
                                </li>
                                {inv.tenant.email && (
                                    <li className="flex items-center gap-1.5 truncate">
                                        <Mail
                                            size={11}
                                            className="shrink-0 text-ink-soft/60"
                                        />
                                        <span className="truncate">
                                            {inv.tenant.email}
                                        </span>
                                    </li>
                                )}
                                {inv.tenant.permanentAddress && (
                                    <li className="flex items-start gap-1.5">
                                        <MapPin
                                            size={11}
                                            className="mt-0.5 shrink-0 text-ink-soft/60"
                                        />
                                        <span>
                                            {inv.tenant.permanentAddress}
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </PartyBlock>

                        <PartyBlock
                            eyebrow="Property · সম্পত্তি"
                            href={`/owner/dashboard/units/${inv.unit.id}`}
                            heading={`${inv.unit.building.name} · Unit ${inv.unit.name}`}
                        >
                            <ul className="space-y-1 text-[12px] text-ink-soft">
                                <li className="flex items-start gap-1.5">
                                    <Building
                                        size={11}
                                        className="mt-0.5 shrink-0 text-ink-soft/60"
                                    />
                                    <span>{inv.unit.building.address}</span>
                                </li>
                                <li className="inline-flex items-center gap-1.5">
                                    <DoorOpen
                                        size={11}
                                        className="text-ink-soft/60"
                                    />
                                    {inv.unit.type.charAt(0) +
                                        inv.unit.type.slice(1).toLowerCase()}
                                </li>
                                <li className="inline-flex items-center gap-1.5">
                                    <FileText
                                        size={11}
                                        className="text-ink-soft/60"
                                    />
                                    <Link
                                        href={`/owner/dashboard/leases/${inv.lease.id}`}
                                        className="font-medium text-jade-900 transition-colors hover:text-coral-600 print:text-ink print:no-underline"
                                    >
                                        Lease #
                                        {inv.lease.id.slice(-6).toUpperCase()}
                                    </Link>
                                </li>
                            </ul>
                        </PartyBlock>
                    </div>

                    {/* Charges */}
                    <div className="px-6 py-5 sm:px-8 sm:py-6">
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Breakdown for {formatBillingMonth(inv.billingMonth)}
                        </p>
                        <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                            Charges
                        </h3>

                        <div className="mt-4 overflow-hidden rounded-[10px] border border-rule-soft">
                            <table className="w-full text-[13px]">
                                <thead className="bg-cream/60 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left">
                                            Description
                                        </th>
                                        <th className="px-4 py-2.5 text-right">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-rule-soft bg-paper">
                                    <ChargeRow
                                        label="Base rent"
                                        bn="মূল ভাড়া"
                                        value={inv.rentAmount}
                                    />
                                    <ChargeRow
                                        label="Service charge"
                                        bn="সার্ভিস চার্জ"
                                        value={inv.serviceCharge}
                                    />
                                    {Number(inv.utilityAmount) > 0 && (
                                        <ChargeRow
                                            label="Utility"
                                            bn="ইউটিলিটি"
                                            value={inv.utilityAmount}
                                        />
                                    )}
                                    {Number(inv.penaltyAmount) > 0 && (
                                        <ChargeRow
                                            label="Penalty"
                                            bn="জরিমানা"
                                            value={inv.penaltyAmount}
                                            warn
                                        />
                                    )}
                                </tbody>
                                <tfoot className="bg-cream/40 text-[13px]">
                                    <tr>
                                        <td className="px-4 py-2.5 text-ink-soft">
                                            Subtotal
                                        </td>
                                        <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-jade-950">
                                            {formatMoney(inv.totalAmount)}
                                        </td>
                                    </tr>
                                    {Number(inv.paidAmount) > 0 && (
                                        <tr>
                                            <td className="px-4 py-2 text-[12px] text-ink-soft">
                                                Paid to date
                                            </td>
                                            <td className="px-4 py-2 text-right text-[12px] font-semibold tabular-nums text-jade-800">
                                                − {formatMoney(inv.paidAmount)}
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="border-t border-rule-soft">
                                        <td className="px-4 py-3 text-[14px] font-bold text-jade-950">
                                            Due
                                        </td>
                                        <td
                                            className={cn(
                                                "px-4 py-3 text-right text-[16px] font-bold tabular-nums",
                                                hasDue
                                                    ? "text-coral-700"
                                                    : "text-jade-800",
                                            )}
                                        >
                                            {formatMoney(inv.dueAmount)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {inv.notes && (
                            <p className="mt-4 rounded-[10px] border-l-[2.5px] border-coral-500 bg-cream/70 px-3 py-2 text-[13px] text-ink">
                                {inv.notes}
                            </p>
                        )}
                    </div>
                </div>

                {/* Payments — outside the document, hidden in print */}
                <div className="rounded-[14px] border border-rule-soft bg-paper p-5 print:hidden">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="font-serif text-[13px] italic text-coral-600/85">
                                Money received
                            </p>
                            <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                                Payment history
                            </h3>
                            <p className="mt-1 text-[12px] text-ink-soft">
                                {inv.payments.length === 0
                                    ? "No payments recorded yet"
                                    : `${inv.payments.length} payment${inv.payments.length === 1 ? "" : "s"} totalling ${formatMoney(inv.paidAmount)}`}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        {inv.payments.length === 0 ? (
                            <div className="rounded-[10px] border border-dashed border-rule-soft px-4 py-8 text-center">
                                <CreditCard
                                    className="mx-auto text-ink-soft/40"
                                    size={24}
                                />
                                <p className="mt-2 text-[13px] text-ink-soft">
                                    No payments recorded for this invoice
                                </p>
                                {hasDue && (
                                    <Link
                                        href={`/owner/dashboard/payments?invoiceId=${inv.id}&record=1`}
                                        className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-jade-900 transition-colors hover:text-coral-600"
                                    >
                                        Record a payment →
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <ul className="divide-y divide-rule-soft">
                                {inv.payments.map((p) => (
                                    <li
                                        key={p.id}
                                        className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-[13px] font-semibold text-ink">
                                                {p.method}
                                                {p.transactionId && (
                                                    <span className="ml-1.5 font-mono text-[10.5px] font-normal text-ink-soft/70">
                                                        ({p.transactionId})
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-[11px] text-ink-soft tabular-nums">
                                                <Calendar
                                                    size={10}
                                                    className="mr-1 inline -translate-y-px text-ink-soft/60"
                                                />
                                                {new Date(
                                                    p.createdAt,
                                                ).toLocaleString()}
                                            </p>
                                            {p.notes && (
                                                <p className="mt-0.5 truncate text-[11px] text-ink-soft/85">
                                                    {p.notes}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-[14px] font-semibold text-jade-800 tabular-nums">
                                            + {formatMoney(p.amount)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Lease summary footer — hidden in print */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-rule-soft bg-paper px-4 py-3 print:hidden">
                    <div className="inline-flex items-center gap-2 text-[12px] text-ink-soft">
                        <User size={13} className="text-ink-soft/60" />
                        Linked lease:{" "}
                        <Link
                            href={`/owner/dashboard/leases/${inv.lease.id}`}
                            className="font-semibold text-jade-900 transition-colors hover:text-coral-600"
                        >
                            #{inv.lease.id.slice(-8).toUpperCase()}
                        </Link>
                    </div>
                    <span className="text-[12px] text-ink-soft tabular-nums">
                        Rent due day{" "}
                        <span className="font-semibold text-ink">
                            {inv.lease.rentDueDay}
                        </span>{" "}
                        ·{" "}
                        <span className="font-semibold text-ink">
                            {formatMoney(inv.lease.monthlyRent)}
                        </span>
                        /month
                    </span>
                </div>
            </div>

            {/* Mutation dialogs */}
            <EditInvoiceDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                invoice={inv}
            />
            <CancelInvoiceDialog
                open={cancelOpen}
                onOpenChange={setCancelOpen}
                invoice={inv}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function DateBlock({
    label,
    bn,
    value,
    emphasis,
}: {
    label: string;
    bn: string;
    value: string;
    emphasis?: boolean;
}) {
    return (
        <div className="px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-baseline justify-between gap-2 sm:justify-start sm:gap-1.5">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                    {label}
                </p>
                <p className="font-bangla text-[10.5px] text-ink-soft/65">
                    {bn}
                </p>
            </div>
            <p
                className={cn(
                    "mt-1 text-[13.5px] font-semibold tabular-nums",
                    emphasis ? "text-coral-700" : "text-jade-950",
                )}
            >
                {value}
            </p>
        </div>
    );
}

function PartyBlock({
    eyebrow,
    href,
    heading,
    children,
}: {
    eyebrow: string;
    href: string;
    heading: string;
    children: React.ReactNode;
}) {
    return (
        <div className="px-6 py-5 sm:px-8 sm:py-6">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                {eyebrow}
            </p>
            <Link
                href={href}
                className="group mt-1.5 inline-flex items-center gap-1.5 text-[15px] font-bold text-jade-950 transition-colors hover:text-jade-900 print:no-underline print:hover:text-jade-950"
            >
                {heading}
                <ArrowUpRight
                    size={13}
                    className="text-ink-soft/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-jade-900 print:hidden"
                />
            </Link>
            <div className="mt-3">{children}</div>
        </div>
    );
}

function ChargeRow({
    label,
    bn,
    value,
    warn,
}: {
    label: string;
    bn: string;
    value: string;
    warn?: boolean;
}) {
    return (
        <tr>
            <td className="px-4 py-2.5">
                <span className="text-ink">{label}</span>
                <span className="font-bangla ml-1.5 text-[11px] text-ink-soft/70">
                    · {bn}
                </span>
            </td>
            <td
                className={cn(
                    "px-4 py-2.5 text-right tabular-nums font-semibold",
                    warn ? "text-coral-700" : "text-jade-950",
                )}
            >
                {formatMoney(value)}
            </td>
        </tr>
    );
}