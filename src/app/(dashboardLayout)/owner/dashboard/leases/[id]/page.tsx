"use client";

import {
    leaseStatusLabel,
    leaseStatusStyles,
} from "@/src/components/dashboard/leases/leaseStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Textarea } from "@/src/components/ui/textarea";
import { useLease, useTerminateLease } from "@/src/hooks/useLeases";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    Building,
    Calendar,
    CalendarOff,
    CreditCard,
    DoorOpen,
    Loader2,
    LogOut,
    Mail,
    Phone,
    Receipt,
    User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function LeaseDetailPage() {
    const params = useParams<{ id: string }>();
    const leaseId = params.id;

    const { data: lease, isLoading, isError, error } = useLease(leaseId);
    const terminateMutation = useTerminateLease(leaseId);

    const [terminateOpen, setTerminateOpen] = useState(false);
    const [moveOutDate, setMoveOutDate] = useState("");
    const [terminateNotes, setTerminateNotes] = useState("");

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-44 w-full" />
                <div className="grid gap-4 sm:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError || !lease) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <Link
                    href="/owner/dashboard/leases"
                    className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                    <ArrowLeft size={12} />
                    Back to leases
                </Link>
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load lease
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Lease not found."}
                    </p>
                </Card>
            </div>
        );
    }

    const totalMonthly =
        Number(lease.monthlyRent) + Number(lease.serviceCharge);

    const paidTotal = lease.payments.reduce(
        (sum, p) => sum + Number(p.amount),
        0,
    );
    const dueTotal = lease.invoices
        .filter((i) => i.status === "DUE" || i.status === "PARTIAL")
        .reduce((sum, i) => sum + Number(i.dueAmount), 0);

    const canTerminate =
        lease.status === "ACTIVE" || lease.status === "PENDING";

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Breadcrumb */}
            <Link
                href="/owner/dashboard/leases"
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
            >
                <ArrowLeft size={12} />
                All leases
            </Link>

            {/* Hero */}
            <Card className="px-6 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="font-mono text-[11px] text-slate-400">
                            LEASE #{lease.id.slice(-8).toUpperCase()}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                {lease.tenant.name}
                            </h1>
                            <Badge
                                variant="outline"
                                className={cn(leaseStatusStyles[lease.status])}
                            >
                                {leaseStatusLabel(lease.status)}
                            </Badge>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                                <Building size={11} />
                                {lease.unit.building.name}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <DoorOpen size={11} />
                                Unit {lease.unit.name}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Calendar size={11} />
                                {new Date(lease.startDate).toLocaleDateString()} –{" "}
                                {new Date(lease.endDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {canTerminate && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setTerminateOpen(true)}
                        >
                            <LogOut size={13} /> Terminate
                        </Button>
                    )}
                </div>

                {lease.notes && (
                    <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        {lease.notes}
                    </p>
                )}
            </Card>

            {/* Money KPIs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MoneyTile
                    label="Monthly rent"
                    value={formatMoney(lease.monthlyRent)}
                    sublabel="base rent only"
                    accent="indigo"
                />
                <MoneyTile
                    label="Total monthly"
                    value={formatMoney(totalMonthly)}
                    sublabel="rent + service"
                    accent="emerald"
                />
                <MoneyTile
                    label="Security deposit"
                    value={formatMoney(lease.securityDeposit)}
                    sublabel="held"
                    accent="amber"
                />
                <MoneyTile
                    label="Outstanding"
                    value={formatMoney(dueTotal)}
                    sublabel={`${formatMoney(paidTotal)} collected`}
                    accent={dueTotal > 0 ? "rose" : "violet"}
                />
            </div>

            {/* Tenant + Unit + Key dates */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Tenant */}
                <Card className="px-6">
                    <CardHeader className="px-0">
                        <CardTitle>Tenant</CardTitle>
                        <CardDescription>Primary contact</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Link
                            href={`/owner/dashboard/tenants/${lease.tenant.id}`}
                            className="-mx-2 -my-2 block rounded-md px-2 py-2 hover:bg-slate-50"
                        >
                            <p className="text-sm font-semibold text-slate-900">
                                {lease.tenant.name}
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-slate-500">
                                <li className="inline-flex items-center gap-1.5">
                                    <Phone size={11} className="text-slate-400" />
                                    {lease.tenant.phone}
                                </li>
                                {lease.tenant.email && (
                                    <li className="inline-flex items-center gap-1.5">
                                        <Mail size={11} className="text-slate-400" />
                                        {lease.tenant.email}
                                    </li>
                                )}
                                {lease.tenant.occupation && (
                                    <li className="inline-flex items-center gap-1.5">
                                        <User size={11} className="text-slate-400" />
                                        {lease.tenant.occupation}
                                    </li>
                                )}
                            </ul>
                            <p className="mt-3 text-[11px] font-medium text-indigo-600">
                                View tenant profile →
                            </p>
                        </Link>
                    </CardContent>
                </Card>

                {/* Unit */}
                <Card className="px-6">
                    <CardHeader className="px-0">
                        <CardTitle>Unit</CardTitle>
                        <CardDescription>Property details</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Link
                            href={`/owner/dashboard/units/${lease.unit.id}`}
                            className="-mx-2 -my-2 block rounded-md px-2 py-2 hover:bg-slate-50"
                        >
                            <p className="text-sm font-semibold text-slate-900">
                                {lease.unit.building.name} · Unit {lease.unit.name}
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-slate-500">
                                <li>
                                    {lease.unit.floor.floorNumber === 0
                                        ? "Ground floor"
                                        : `Floor ${lease.unit.floor.floorNumber}`}{" "}
                                    · {lease.unit.floor.name}
                                </li>
                                <li>
                                    {lease.unit.bedrooms ?? "—"} bed ·{" "}
                                    {lease.unit.bathrooms ?? "—"} bath
                                    {lease.unit.sizeSqft &&
                                        ` · ${lease.unit.sizeSqft} sqft`}
                                </li>
                                <li className="text-slate-400">
                                    {lease.unit.building.address}
                                </li>
                            </ul>
                            <p className="mt-3 text-[11px] font-medium text-indigo-600">
                                View unit →
                            </p>
                        </Link>
                    </CardContent>
                </Card>

                {/* Key dates */}
                <Card className="px-6">
                    <CardHeader className="px-0">
                        <CardTitle>Key dates</CardTitle>
                        <CardDescription>Lease term &amp; rent schedule</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <ul className="space-y-3">
                            <DateRow
                                icon={Calendar}
                                label="Start"
                                value={new Date(lease.startDate).toLocaleDateString()}
                            />
                            <DateRow
                                icon={Calendar}
                                label="End"
                                value={new Date(lease.endDate).toLocaleDateString()}
                            />
                            <DateRow
                                icon={Calendar}
                                label="Move-in"
                                value={new Date(lease.moveInDate).toLocaleDateString()}
                            />
                            {lease.moveOutDate && (
                                <DateRow
                                    icon={CalendarOff}
                                    label="Move-out"
                                    value={new Date(lease.moveOutDate).toLocaleDateString()}
                                />
                            )}
                            <DateRow
                                icon={Receipt}
                                label="Rent due day"
                                value={`Day ${lease.rentDueDay} of each month`}
                            />
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices + Payments */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card className="px-6">
                    <CardHeader className="px-0">
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>
                            {lease.invoices.length === 0
                                ? "No invoices yet"
                                : `${lease.invoices.length} invoice${lease.invoices.length === 1 ? "" : "s"} generated`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        {lease.invoices.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
                                <Receipt className="mx-auto text-slate-300" size={24} />
                                <p className="mt-2 text-sm text-slate-500">
                                    No invoices yet
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {lease.invoices.map((inv) => (
                                    <li
                                        key={inv.id}
                                        className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-mono text-xs font-medium text-slate-800">
                                                {inv.invoiceNumber}
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Due{" "}
                                                {new Date(inv.dueDate).toLocaleDateString()}{" "}
                                                · {inv.type}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900 tabular-nums">
                                                {formatMoney(inv.totalAmount)}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[10px]",
                                                    inv.status === "PAID"
                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                        : inv.status === "PARTIAL"
                                                          ? "border-amber-200 bg-amber-50 text-amber-700"
                                                          : "border-rose-200 bg-rose-50 text-rose-700",
                                                )}
                                            >
                                                {inv.status}
                                            </Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card className="px-6">
                    <CardHeader className="px-0">
                        <CardTitle>Payments</CardTitle>
                        <CardDescription>
                            {lease.payments.length === 0
                                ? "No payments recorded"
                                : `${formatMoney(paidTotal)} collected across ${lease.payments.length} payment${lease.payments.length === 1 ? "" : "s"}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        {lease.payments.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
                                <CreditCard className="mx-auto text-slate-300" size={24} />
                                <p className="mt-2 text-sm text-slate-500">
                                    No payments recorded
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {lease.payments.map((p) => (
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
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </p>
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
            </div>

            {/* Terminate confirmation */}
            <AlertDialog
                open={terminateOpen}
                onOpenChange={(open) => {
                    setTerminateOpen(open);
                    if (!open) {
                        setMoveOutDate("");
                        setTerminateNotes("");
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Terminate this lease?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will mark the lease as <strong>TERMINATED</strong> and the
                            unit as <strong>VACANT</strong>. The action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="term-moveout">
                                Move-out date <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="term-moveout"
                                type="date"
                                value={moveOutDate}
                                onChange={(e) => setMoveOutDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="term-notes">Notes</Label>
                            <Textarea
                                id="term-notes"
                                rows={2}
                                value={terminateNotes}
                                onChange={(e) => setTerminateNotes(e.target.value)}
                                placeholder="Reason or other context..."
                            />
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={terminateMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={terminateMutation.isPending || !moveOutDate}
                            onClick={() => {
                                terminateMutation.mutate(
                                    {
                                        moveOutDate,
                                        ...(terminateNotes.trim() && {
                                            notes: terminateNotes.trim(),
                                        }),
                                    },
                                    {
                                        onSuccess: () => {
                                            setTerminateOpen(false);
                                            setMoveOutDate("");
                                            setTerminateNotes("");
                                        },
                                    },
                                );
                            }}
                        >
                            {terminateMutation.isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Terminating...
                                </>
                            ) : (
                                "Terminate lease"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function MoneyTile({
    label,
    value,
    sublabel,
    accent,
}: {
    label: string;
    value: string;
    sublabel: string;
    accent: "indigo" | "emerald" | "amber" | "rose" | "violet";
}) {
    const accents: Record<typeof accent, string> = {
        indigo: "bg-indigo-50 text-indigo-700",
        emerald: "bg-emerald-50 text-emerald-700",
        amber: "bg-amber-50 text-amber-700",
        rose: "bg-rose-50 text-rose-700",
        violet: "bg-violet-50 text-violet-700",
    };

    return (
        <Card className="px-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {label}
            </p>
            <p className="mt-1.5 text-xl font-semibold text-slate-900 tabular-nums">
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

function DateRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <li className="flex items-start justify-between gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-slate-600">
                <Icon size={13} className="text-slate-400" />
                {label}
            </span>
            <span className="text-right font-medium text-slate-900">{value}</span>
        </li>
    );
}

