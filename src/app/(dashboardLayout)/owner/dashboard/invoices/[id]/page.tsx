"use client";

import {
    formatBillingMonth,
    invoiceStatusLabel,
    invoiceStatusStyles,
    invoiceTypeLabel,
    invoiceTypeStyles,
} from "@/src/components/dashboard/invoices/invoiceStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useInvoice } from "@/src/hooks/useInvoices";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    Building,
    Calendar,
    CreditCard,
    DoorOpen,
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

export default function InvoiceDetailPage() {
    const params = useParams<{ id: string }>();
    const invoiceId = params.id;

    const { data: inv, isLoading, isError, error } = useInvoice(invoiceId);

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-72 w-full" />
            </div>
        );
    }

    if (isError || !inv) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <Link
                    href="/owner/dashboard/invoices"
                    className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                    <ArrowLeft size={12} />
                    Back to invoices
                </Link>
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load invoice
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Invoice not found."}
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 print:p-0">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between print:hidden">
                <Link
                    href="/owner/dashboard/invoices"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                    <ArrowLeft size={12} />
                    All invoices
                </Link>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    <Printer size={13} />
                    Print
                </button>
            </div>

            {/* Hero */}
            <Card className="px-6 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                                <Receipt size={18} />
                            </span>
                            <div>
                                <p className="font-mono text-sm font-semibold text-slate-900">
                                    {inv.invoiceNumber}
                                </p>
                                <p className="text-xs text-slate-500">
                                    For {formatBillingMonth(inv.billingMonth)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge
                                variant="outline"
                                className={cn(invoiceTypeStyles[inv.type])}
                            >
                                {invoiceTypeLabel(inv.type)}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={cn(invoiceStatusStyles[inv.status])}
                            >
                                {invoiceStatusLabel(inv.status)}
                            </Badge>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                            Amount due
                        </p>
                        <p
                            className={cn(
                                "text-3xl font-bold tabular-nums",
                                Number(inv.dueAmount) > 0
                                    ? "text-rose-700"
                                    : "text-emerald-700",
                            )}
                        >
                            {formatMoney(inv.dueAmount)}
                        </p>
                        <p className="text-xs text-slate-500">
                            of {formatMoney(inv.totalAmount)} total
                        </p>
                    </div>
                </div>

                {/* Key dates */}
                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
                    <DateRow
                        label="Issue date"
                        value={new Date(inv.issueDate).toLocaleDateString()}
                    />
                    <DateRow
                        label="Due date"
                        value={new Date(inv.dueDate).toLocaleDateString()}
                    />
                    <DateRow
                        label="Billing month"
                        value={formatBillingMonth(inv.billingMonth)}
                    />
                </div>

                {inv.notes && (
                    <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        {inv.notes}
                    </p>
                )}
            </Card>

            {/* Bill from / Bill to */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Bill to (tenant) */}
                <Card className="px-6">
                    <CardHeader className="px-0">
                        <CardTitle>Bill to</CardTitle>
                        <CardDescription>Tenant details</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Link
                            href={`/owner/dashboard/tenants/${inv.tenant.id}`}
                            className="-mx-2 -my-2 block rounded-md px-2 py-2 hover:bg-slate-50 print:cursor-default print:hover:bg-transparent"
                        >
                            <p className="text-sm font-semibold text-slate-900">
                                {inv.tenant.name}
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-slate-600">
                                <li className="inline-flex items-center gap-1.5">
                                    <Phone size={11} className="text-slate-400" />
                                    {inv.tenant.phone}
                                </li>
                                {inv.tenant.email && (
                                    <li className="inline-flex items-center gap-1.5">
                                        <Mail size={11} className="text-slate-400" />
                                        {inv.tenant.email}
                                    </li>
                                )}
                                {inv.tenant.permanentAddress && (
                                    <li className="inline-flex items-start gap-1.5">
                                        <MapPin
                                            size={11}
                                            className="mt-0.5 text-slate-400"
                                        />
                                        <span>{inv.tenant.permanentAddress}</span>
                                    </li>
                                )}
                            </ul>
                        </Link>
                    </CardContent>
                </Card>

                {/* Property */}
                <Card className="px-6">
                    <CardHeader className="px-0">
                        <CardTitle>Property</CardTitle>
                        <CardDescription>Unit details</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Link
                            href={`/owner/dashboard/units/${inv.unit.id}`}
                            className="-mx-2 -my-2 block rounded-md px-2 py-2 hover:bg-slate-50 print:cursor-default print:hover:bg-transparent"
                        >
                            <p className="text-sm font-semibold text-slate-900">
                                {inv.unit.building.name} · Unit {inv.unit.name}
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-slate-600">
                                <li className="inline-flex items-center gap-1.5">
                                    <Building size={11} className="text-slate-400" />
                                    {inv.unit.building.address}
                                </li>
                                <li className="inline-flex items-center gap-1.5">
                                    <DoorOpen size={11} className="text-slate-400" />
                                    {inv.unit.type.charAt(0) +
                                        inv.unit.type.slice(1).toLowerCase()}
                                </li>
                                <li className="inline-flex items-center gap-1.5">
                                    <FileText size={11} className="text-slate-400" />
                                    <Link
                                        href={`/owner/dashboard/leases/${inv.lease.id}`}
                                        className="font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                        Lease #{inv.lease.id.slice(-6).toUpperCase()}
                                    </Link>
                                </li>
                            </ul>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Charges breakdown */}
            <Card className="px-6">
                <CardHeader className="px-0">
                    <CardTitle>Charges</CardTitle>
                    <CardDescription>
                        Breakdown for {formatBillingMonth(inv.billingMonth)}
                    </CardDescription>
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
                                <ChargeRow
                                    label="Base rent"
                                    value={inv.rentAmount}
                                />
                                <ChargeRow
                                    label="Service charge"
                                    value={inv.serviceCharge}
                                />
                                {Number(inv.utilityAmount) > 0 && (
                                    <ChargeRow
                                        label="Utility"
                                        value={inv.utilityAmount}
                                    />
                                )}
                                {Number(inv.penaltyAmount) > 0 && (
                                    <ChargeRow
                                        label="Penalty"
                                        value={inv.penaltyAmount}
                                        accent="rose"
                                    />
                                )}
                            </tbody>
                            <tfoot className="bg-slate-50 text-sm">
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-700">
                                        Total
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900">
                                        {formatMoney(inv.totalAmount)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 text-xs text-slate-500">
                                        Paid
                                    </td>
                                    <td className="px-4 py-2 text-right text-xs tabular-nums text-emerald-700">
                                        {formatMoney(inv.paidAmount)}
                                    </td>
                                </tr>
                                <tr className="border-t border-slate-200">
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-700">
                                        Due
                                    </td>
                                    <td
                                        className={cn(
                                            "px-4 py-3 text-right text-base font-bold tabular-nums",
                                            Number(inv.dueAmount) > 0
                                                ? "text-rose-700"
                                                : "text-emerald-700",
                                        )}
                                    >
                                        {formatMoney(inv.dueAmount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Payments */}
            <Card className="px-6">
                <CardHeader className="px-0">
                    <CardTitle>Payment history</CardTitle>
                    <CardDescription>
                        {inv.payments.length === 0
                            ? "No payments recorded yet"
                            : `${inv.payments.length} payment${inv.payments.length === 1 ? "" : "s"} totalling ${formatMoney(inv.paidAmount)}`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    {inv.payments.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
                            <CreditCard className="mx-auto text-slate-300" size={24} />
                            <p className="mt-2 text-sm text-slate-500">
                                No payments recorded for this invoice
                            </p>
                            {Number(inv.dueAmount) > 0 && (
                                <Link
                                    href={`/owner/dashboard/payments?invoiceId=${inv.id}&record=1`}
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                                >
                                    Record a payment →
                                </Link>
                            )}
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {inv.payments.map((p) => (
                                <li
                                    key={p.id}
                                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-800">
                                            {p.method}
                                            {p.transactionId && (
                                                <span className="ml-1 font-mono text-[10px] text-slate-400">
                                                    ({p.transactionId})
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            <Calendar size={10} className="mr-1 inline" />
                                            {new Date(p.createdAt).toLocaleString()}
                                        </p>
                                        {p.notes && (
                                            <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                                {p.notes}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold text-emerald-700 tabular-nums">
                                        +{formatMoney(p.amount)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            {/* Lease summary footer */}
            <Card className="px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-xs text-slate-600">
                        <User size={13} className="text-slate-400" />
                        Linked lease:{" "}
                        <Link
                            href={`/owner/dashboard/leases/${inv.lease.id}`}
                            className="font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            #{inv.lease.id.slice(-8).toUpperCase()}
                        </Link>
                    </div>
                    <span className="text-xs text-slate-500">
                        Rent due day {inv.lease.rentDueDay} ·{" "}
                        {formatMoney(inv.lease.monthlyRent)}/month
                    </span>
                </div>
            </Card>
        </div>
    );
}

function ChargeRow({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent?: "rose";
}) {
    return (
        <tr>
            <td className="px-4 py-2.5 text-slate-700">{label}</td>
            <td
                className={cn(
                    "px-4 py-2.5 text-right tabular-nums",
                    accent === "rose" ? "text-rose-700" : "text-slate-900",
                )}
            >
                {formatMoney(value)}
            </td>
        </tr>
    );
}

function DateRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">{value}</p>
        </div>
    );
}
