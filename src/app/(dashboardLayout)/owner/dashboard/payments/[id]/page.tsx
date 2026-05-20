"use client";

import {
    paymentMethodLabel,
    paymentMethodStyles,
    paymentStatusLabel,
    paymentStatusStyles,
} from "@/src/components/dashboard/payments/paymentStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { usePayment } from "@/src/hooks/usePayments";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    FileText,
    Mail,
    MapPin,
    Phone,
    Printer,
    Receipt,
    User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PaymentDetailPage() {
    const params = useParams<{ id: string }>();
    const paymentId = params.id;

    const { data: p, isLoading, isError, error } = usePayment(paymentId);

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-72 w-full" />
            </div>
        );
    }

    if (isError || !p) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <Link
                    href="/owner/dashboard/payments"
                    className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                    <ArrowLeft size={12} />
                    Back to payments
                </Link>
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load payment
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Payment not found."}
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 print:p-0">
            {/* Toolbar (hidden on print) */}
            <div className="flex items-center justify-between print:hidden">
                <Link
                    href="/owner/dashboard/payments"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                    <ArrowLeft size={12} />
                    All payments
                </Link>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    <Printer size={13} />
                    Print receipt
                </button>
            </div>

            {/* Hero / Receipt header */}
            <Card className="px-6 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <span
                                className={cn(
                                    "flex size-12 items-center justify-center rounded-xl",
                                    p.status === "PAID"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-slate-100 text-slate-600",
                                )}
                            >
                                {p.status === "PAID" ? (
                                    <CheckCircle2 size={22} />
                                ) : (
                                    <Receipt size={22} />
                                )}
                            </span>
                            <div>
                                <p className="font-mono text-sm font-semibold text-slate-900">
                                    {p.receiptNumber}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {new Date(p.paidAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge
                                variant="outline"
                                className={cn(paymentStatusStyles[p.status])}
                            >
                                {paymentStatusLabel(p.status)}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={cn(paymentMethodStyles[p.method])}
                            >
                                {paymentMethodLabel(p.method)}
                            </Badge>
                            {p.isAdvance && (
                                <Badge
                                    variant="outline"
                                    className="border-violet-200 bg-violet-50 text-violet-700"
                                >
                                    Advance payment
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                            Amount paid
                        </p>
                        <p className="text-3xl font-bold tabular-nums text-emerald-700">
                            {formatMoney(p.amount)}
                        </p>
                    </div>
                </div>

                {/* Meta strip */}
                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
                    <MetaItem
                        label="Method"
                        value={paymentMethodLabel(p.method)}
                    />
                    {p.transactionId && (
                        <MetaItem
                            label="Transaction ID"
                            value={p.transactionId}
                            mono
                        />
                    )}
                    <MetaItem
                        label="Recorded on"
                        value={new Date(p.createdAt).toLocaleString()}
                    />
                </div>

                {p.notes && (
                    <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        <strong className="text-slate-700">Note:</strong> {p.notes}
                    </p>
                )}
            </Card>

            {/* From (tenant) + For (invoice) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* From — tenant */}
                <Card className="px-6">
                    <CardHeader className="px-0">
                        <CardTitle>From</CardTitle>
                        <CardDescription>Tenant who paid</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Link
                            href={`/owner/dashboard/tenants/${p.tenant.id}`}
                            className="-mx-2 -my-2 block rounded-md px-2 py-2 hover:bg-slate-50 print:cursor-default print:hover:bg-transparent"
                        >
                            <p className="text-sm font-semibold text-slate-900">
                                {p.tenant.name}
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-slate-600">
                                <li className="inline-flex items-center gap-1.5">
                                    <Phone size={11} className="text-slate-400" />
                                    {p.tenant.phone}
                                </li>
                                {p.tenant.email && (
                                    <li className="inline-flex items-center gap-1.5">
                                        <Mail size={11} className="text-slate-400" />
                                        {p.tenant.email}
                                    </li>
                                )}
                                {p.tenant.permanentAddress && (
                                    <li className="inline-flex items-start gap-1.5">
                                        <MapPin
                                            size={11}
                                            className="mt-0.5 text-slate-400"
                                        />
                                        <span>{p.tenant.permanentAddress}</span>
                                    </li>
                                )}
                            </ul>
                        </Link>
                    </CardContent>
                </Card>

                {/* For — invoice */}
                <Card className="px-6">
                    <CardHeader className="px-0">
                        <CardTitle>Applied to invoice</CardTitle>
                        <CardDescription>
                            Invoice this payment was recorded against
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Link
                            href={`/owner/dashboard/invoices/${p.invoice.id}`}
                            className="-mx-2 -my-2 block rounded-md px-2 py-2 hover:bg-slate-50 print:cursor-default print:hover:bg-transparent"
                        >
                            <p className="font-mono text-sm font-semibold text-slate-900">
                                {p.invoice.invoiceNumber}
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-slate-600">
                                <li className="flex justify-between">
                                    <span>Invoice total</span>
                                    <span className="font-medium text-slate-800 tabular-nums">
                                        {formatMoney(p.invoice.totalAmount)}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Paid (incl. this)</span>
                                    <span className="font-medium text-emerald-700 tabular-nums">
                                        {formatMoney(p.invoice.paidAmount)}
                                    </span>
                                </li>
                                <li className="flex justify-between border-t border-slate-100 pt-1.5">
                                    <span className="font-medium">Outstanding</span>
                                    <span
                                        className={cn(
                                            "font-semibold tabular-nums",
                                            Number(p.invoice.dueAmount) > 0
                                                ? "text-rose-700"
                                                : "text-emerald-700",
                                        )}
                                    >
                                        {formatMoney(p.invoice.dueAmount)}
                                    </span>
                                </li>
                            </ul>
                            <p className="mt-3 text-[11px] font-medium text-indigo-600 print:hidden">
                                View full invoice →
                            </p>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Receipt — formal payment breakdown */}
            <Card className="px-6">
                <CardHeader className="px-0">
                    <CardTitle>Receipt</CardTitle>
                    <CardDescription>Itemized payment record</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-2.5 text-left">Description</th>
                                    <th className="px-4 py-2.5 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                <tr>
                                    <td className="px-4 py-3 text-slate-700">
                                        Payment for {p.invoice.invoiceNumber}
                                        {p.invoice.type && (
                                            <span className="ml-1 text-xs text-slate-400">
                                                ({p.invoice.type.toLowerCase()})
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right tabular-nums text-slate-900">
                                        {formatMoney(p.amount)}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot className="bg-slate-50">
                                <tr>
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-700">
                                        Total paid
                                    </td>
                                    <td className="px-4 py-3 text-right text-base font-bold tabular-nums text-emerald-700">
                                        {formatMoney(p.amount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Linked lease */}
            <Card className="px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-xs text-slate-600">
                        <FileText size={13} className="text-slate-400" />
                        Linked lease:{" "}
                        <Link
                            href={`/owner/dashboard/leases/${p.lease.id}`}
                            className="font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            #{p.lease.id.slice(-8).toUpperCase()}
                        </Link>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Calendar size={11} />
                        Rent due day {p.lease.rentDueDay} ·{" "}
                        {formatMoney(p.lease.monthlyRent)}/month
                    </span>
                </div>
            </Card>

            {/* Recorded by */}
            {p.recordedById && (
                <div className="text-center text-xs text-slate-400">
                    <User size={10} className="mr-1 inline" />
                    Recorded by {p.recordedById.slice(-8).toUpperCase()}
                </div>
            )}
        </div>
    );
}

function MetaItem({
    label,
    value,
    mono,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <p
                className={cn(
                    "mt-0.5 text-sm font-medium text-slate-800",
                    mono && "font-mono",
                )}
            >
                {value}
            </p>
        </div>
    );
}
