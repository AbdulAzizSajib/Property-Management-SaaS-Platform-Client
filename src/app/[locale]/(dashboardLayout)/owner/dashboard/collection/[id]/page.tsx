"use client";

// src/app/owner/dashboard/collection/[id]/page.tsx

import {
    paymentMethodLabel,
    paymentMethodStyles,
    paymentStatusLabel,
    paymentStatusStyles,
} from "@/src/components/dashboard/payments/paymentStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import { Skeleton } from "@/src/components/ui/skeleton";
import { usePayment } from "@/src/hooks/usePayments";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    ArrowUpRight,
    Calendar,
    CheckCircle2,
    FileText,
    Mail,
    MapPin,
    Phone,
    Printer,
    Receipt,
    User,
    XCircle,
} from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useParams } from "next/navigation";

export default function PaymentDetailPage() {
    const params = useParams<{ id: string }>();
    const paymentId = params.id;

    const { data: p, isLoading, isError, error } = usePayment(paymentId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8">
                    <Skeleton className="h-5 w-32 bg-paper" />
                    <Skeleton className="h-44 w-full bg-paper rounded-[18px]" />
                    <Skeleton className="h-56 w-full bg-paper rounded-[14px]" />
                </div>
            </div>
        );
    }

    if (isError || !p) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] p-4 sm:p-6 lg:p-8">
                    <Link
                        href="/owner/dashboard/collection"
                        className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        Back to collection
                    </Link>
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load payment
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Payment not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const isPaid = p.status === "PAID";
    const isFailed = p.status === "FAILED";

    return (
        <div className="min-h-screen bg-cream print:bg-white">
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print\\:document { box-shadow: none !important; border-color: transparent !important; }
                }
            `}</style>

            <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8 print:max-w-full print:p-0 print:space-y-4">
                {/* Toolbar */}
                <div className="flex items-center justify-between print:hidden">
                    <Link
                        href="/owner/dashboard/collection"
                        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        All collection
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-rule-soft bg-paper px-3 text-[12.5px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
                    >
                        <Printer size={12} />
                        Print receipt
                    </button>
                </div>

                {/* Receipt document */}
                <div className="print:document overflow-hidden rounded-[18px] border border-rule-soft bg-paper print:rounded-none">
                    {/* Letterhead */}
                    <div className="border-b border-rule-soft px-6 py-5 sm:px-8 sm:py-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                                        {isPaid ? "Payment receipt" : "Payment record"}
                                    </p>
                                    <p className="font-mono text-[14px] font-bold tracking-tight text-jade-950">
                                        {p.receiptNumber}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={cn(
                                        "rounded-md border px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider",
                                        paymentStatusStyles[p.status],
                                    )}
                                >
                                    {paymentStatusLabel(p.status)}
                                </span>
                                <span
                                    className={cn(
                                        "rounded-md border px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider",
                                        paymentMethodStyles[p.method],
                                    )}
                                >
                                    {paymentMethodLabel(p.method)}
                                </span>
                                {p.isAdvance && (
                                    <span className="rounded-md border border-jade-100 bg-jade-50/60 px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-jade-700">
                                        Advance
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Amount + key meta */}
                    <div className="grid grid-cols-1 border-b border-rule-soft sm:grid-cols-[1.5fr_1fr]">
                        <div className="px-6 py-5 sm:px-8 sm:py-6">
                            <p className="font-serif text-[13px] italic text-coral-600/85">
                                Amount {isPaid ? "received" : "recorded"}
                            </p>

                            <div className="mt-3 flex items-center gap-3">
                                <p
                                    className={cn(
                                        "text-[40px] font-bold leading-none tracking-[-0.025em] tabular-nums sm:text-[44px]",
                                        isPaid
                                            ? "text-jade-800"
                                            : isFailed
                                                ? "text-coral-600"
                                                : "text-ink-soft",
                                    )}
                                >
                                    {isFailed ? "" : "+ "}
                                    {formatMoney(p.amount)}
                                </p>
                                {isPaid && (
                                    <CheckCircle2
                                        size={26}
                                        className="text-jade-700"
                                    />
                                )}
                                {isFailed && (
                                    <XCircle
                                        size={26}
                                        className="text-coral-600"
                                    />
                                )}
                            </div>

                            <p className="mt-3 text-[12.5px] text-ink-soft">
                                Paid on{" "}
                                <span className="font-semibold text-ink tabular-nums">
                                    {new Date(p.paidAt).toLocaleString()}
                                </span>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 divide-x divide-rule-soft border-t border-rule-soft sm:grid-cols-1 sm:divide-x-0 sm:divide-y sm:border-l sm:border-t-0">
                            <MetaBlock label="Method">
                                <span
                                    className={cn(
                                        "inline-block rounded-md border px-2 py-0.5 text-[12px] font-semibold",
                                        paymentMethodStyles[p.method],
                                    )}
                                >
                                    {paymentMethodLabel(p.method)}
                                </span>
                            </MetaBlock>
                            {p.transactionId ? (
                                <MetaBlock label="Transaction">
                                    <span className="font-mono text-[12.5px] font-semibold text-jade-950">
                                        {p.transactionId}
                                    </span>
                                </MetaBlock>
                            ) : (
                                <MetaBlock label="Recorded">
                                    <span className="text-[12.5px] font-semibold text-jade-950 tabular-nums">
                                        {new Date(
                                            p.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </MetaBlock>
                            )}
                        </div>
                    </div>

                    {/* From + Applied to */}
                    <div className="grid grid-cols-1 border-b border-rule-soft sm:grid-cols-2 sm:divide-x sm:divide-rule-soft">
                        <PartyBlock
                            eyebrow="From"
                            href={`/owner/dashboard/tenants/${p.tenant.id}`}
                            heading={p.tenant.name}
                        >
                            <ul className="space-y-1 text-[12px] text-ink-soft">
                                <li className="inline-flex items-center gap-1.5 tabular-nums">
                                    <Phone
                                        size={11}
                                        className="text-ink-soft/60"
                                    />
                                    {p.tenant.phone}
                                </li>
                                {p.tenant.email && (
                                    <li className="flex items-center gap-1.5 truncate">
                                        <Mail
                                            size={11}
                                            className="shrink-0 text-ink-soft/60"
                                        />
                                        <span className="truncate">
                                            {p.tenant.email}
                                        </span>
                                    </li>
                                )}
                                {p.tenant.permanentAddress && (
                                    <li className="flex items-start gap-1.5">
                                        <MapPin
                                            size={11}
                                            className="mt-0.5 shrink-0 text-ink-soft/60"
                                        />
                                        <span>
                                            {p.tenant.permanentAddress}
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </PartyBlock>

                        {p.invoice ? (
                            <PartyBlock
                                eyebrow="Applied to"
                                href={`/owner/dashboard/invoices/${p.invoice.id}`}
                                heading={p.invoice.invoiceNumber}
                                headingMono
                            >
                                <ul className="space-y-1 text-[12px]">
                                    <li className="flex justify-between">
                                        <span className="text-ink-soft">
                                            Invoice total
                                        </span>
                                        <span className="font-semibold text-ink tabular-nums">
                                            {formatMoney(p.invoice.totalAmount)}
                                        </span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-ink-soft">
                                            Paid to date
                                        </span>
                                        <span className="font-semibold text-jade-800 tabular-nums">
                                            {formatMoney(p.invoice.paidAmount)}
                                        </span>
                                    </li>
                                    <li className="flex justify-between border-t border-rule-soft pt-1.5">
                                        <span className="font-semibold text-ink">
                                            Outstanding
                                        </span>
                                        <span
                                            className={cn(
                                                "font-bold tabular-nums",
                                                Number(p.invoice.dueAmount) > 0
                                                    ? "text-coral-600"
                                                    : "text-jade-800",
                                            )}
                                        >
                                            {formatMoney(p.invoice.dueAmount)}
                                        </span>
                                    </li>
                                </ul>
                            </PartyBlock>
                        ) : (
                            <PartyBlock
                                eyebrow="Applied to"
                                heading="Unallocated"
                                headingMono={false}
                            >
                                <p className="text-[12px] text-ink-soft">
                                    {p.isAdvance
                                        ? "Advance payment — not yet tied to an invoice."
                                        : "Linked invoice is unavailable."}
                                </p>
                            </PartyBlock>
                        )}
                    </div>

                    {/* Itemized */}
                    <div className="px-6 py-5 sm:px-8 sm:py-6">
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Itemized record
                        </p>
                        <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                            Receipt
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
                                    <tr>
                                        <td className="px-4 py-3 text-ink">
                                            {p.invoice ? (
                                                <>
                                                    Payment for{" "}
                                                    <span className="font-mono font-semibold">
                                                        {p.invoice.invoiceNumber}
                                                    </span>
                                                    {p.invoice.type && (
                                                        <span className="ml-1.5 text-[11px] text-ink-soft">
                                                            (
                                                            {p.invoice.type
                                                                .charAt(0) +
                                                                p.invoice.type
                                                                    .slice(1)
                                                                    .toLowerCase()}
                                                            )
                                                        </span>
                                                    )}
                                                </>
                                            ) : p.isAdvance ? (
                                                "Advance payment"
                                            ) : (
                                                "Unallocated payment"
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold tabular-nums text-jade-950">
                                            {formatMoney(p.amount)}
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-cream/40">
                                    <tr className="border-t border-rule-soft">
                                        <td className="px-4 py-3 text-[14px] font-bold text-jade-950">
                                            Total paid
                                        </td>
                                        <td
                                            className={cn(
                                                "px-4 py-3 text-right text-[16px] font-bold tabular-nums",
                                                isPaid
                                                    ? "text-jade-800"
                                                    : isFailed
                                                        ? "text-coral-600"
                                                        : "text-ink-soft",
                                            )}
                                        >
                                            {formatMoney(p.amount)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {p.notes && (
                            <p className="mt-4 rounded-[10px] border-l-[2.5px] border-coral-500 bg-cream/70 px-3 py-2 text-[13px] text-ink">
                                <strong className="font-semibold text-ink">
                                    Note:
                                </strong>{" "}
                                {p.notes}
                            </p>
                        )}
                    </div>

                    {/* Thank-you footer — only on PAID, only on print */}
                    {isPaid && (
                        <div className="hidden border-t border-rule-soft px-6 py-4 text-center text-[12px] text-ink-soft sm:px-8 print:block">
                            <p className="font-serif italic text-coral-600/85">
                                Thank you for your payment.
                            </p>
                        </div>
                    )}
                </div>

                {/* Linked lease — outside the receipt, hidden in print */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-rule-soft bg-paper px-4 py-3 print:hidden">
                    <div className="inline-flex items-center gap-2 text-[12px] text-ink-soft">
                        <FileText size={13} className="text-ink-soft/60" />
                        Linked lease:{" "}
                        <Link
                            href={`/owner/dashboard/leases/${p.lease.id}`}
                            className="font-semibold text-jade-900 transition-colors hover:text-coral-600"
                        >
                            #{p.lease.id.slice(-8).toUpperCase()}
                        </Link>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[12px] text-ink-soft tabular-nums">
                        <Calendar size={11} className="text-ink-soft/60" />
                        Due day{" "}
                        <span className="font-semibold text-ink">
                            {p.lease.rentDueDay}
                        </span>{" "}
                        ·{" "}
                        <span className="font-semibold text-ink">
                            {formatMoney(p.lease.monthlyRent)}
                        </span>
                        /month
                    </span>
                </div>

                {/* Recorded-by — meta info, hidden in print */}
                {p.recordedById && (
                    <div className="text-center text-[11px] text-ink-soft/65 print:hidden">
                        <User
                            size={10}
                            className="mr-1 inline -translate-y-px"
                        />
                        Recorded by{" "}
                        <span className="font-mono">
                            {p.recordedById.slice(-8).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function MetaBlock({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-baseline justify-between gap-2 sm:justify-start sm:gap-1.5">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                    {label}
                </p>
            </div>
            <div className="mt-1">{children}</div>
        </div>
    );
}

function PartyBlock({
    eyebrow,
    href,
    heading,
    headingMono,
    children,
}: {
    eyebrow: string;
    /** Omit when the heading isn't linked anywhere (eg unallocated payments). */
    href?: string;
    heading: string;
    headingMono?: boolean;
    children: React.ReactNode;
}) {
    const headingContent = (
        <>
            <span className={headingMono ? "font-mono" : ""}>{heading}</span>
            {href && (
                <ArrowUpRight
                    size={13}
                    className="text-ink-soft/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-jade-900 print:hidden"
                />
            )}
        </>
    );
    return (
        <div className="px-6 py-5 sm:px-8 sm:py-6">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                {eyebrow}
            </p>
            {href ? (
                <Link
                    href={href}
                    className="group mt-1.5 inline-flex items-center gap-1.5 text-[15px] font-bold text-jade-950 transition-colors hover:text-jade-900 print:no-underline print:hover:text-jade-950"
                >
                    {headingContent}
                </Link>
            ) : (
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-[15px] font-bold text-jade-950">
                    {headingContent}
                </p>
            )}
            <div className="mt-3">{children}</div>
        </div>
    );
}