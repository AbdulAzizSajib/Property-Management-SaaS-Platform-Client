"use client";

// src/app/owner/dashboard/leases/[id]/page.tsx

import {
    getInvoiceStatusTone,
    leaseStatusLabel,
    leaseStatusStyles,
} from "@/src/components/dashboard/leases/leaseStyles";
import { RentAgreementPanel } from "@/src/components/dashboard/leases/RentAgreementPanel";
import { RentIncreasesPanel } from "@/src/components/dashboard/leases/RentIncreasesPanel";
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
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Textarea } from "@/src/components/ui/textarea";
import { useLease, useTerminateLease } from "@/src/hooks/useLeases";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import {
    AlertTriangle,
    ArrowLeft,
    ArrowUpRight,
    Building,
    Calendar,
    CalendarOff,
    CreditCard,
    DoorOpen,
    Droplets,
    Flame,
    Layers,
    Loader2,
    LogOut,
    Mail,
    Phone,
    Receipt,
    User,
    Wifi,
    Zap,
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
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1240px] space-y-5 p-4 sm:p-6 lg:p-8">
                    <Skeleton className="h-5 w-32 bg-paper" />
                    <Skeleton className="h-44 w-full bg-paper rounded-[18px]" />
                    <Skeleton className="h-56 w-full bg-paper rounded-[14px]" />
                </div>
            </div>
        );
    }

    if (isError || !lease) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1240px] p-4 sm:p-6 lg:p-8">
                    <Link
                        href="/owner/dashboard/leases"
                        className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        Back to leases
                    </Link>
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load lease
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Lease not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const isSeparate = lease.billingMode === "FIXED_SEPARATE";
    const utilitiesTotal = isSeparate
        ? Number(lease.gasCharge) +
          Number(lease.waterCharge) +
          Number(lease.electricityCharge) +
          Number(lease.internetCharge)
        : 0;
    const totalMonthly =
        Number(lease.monthlyRent) +
        Number(lease.serviceCharge) +
        utilitiesTotal;

    const paidTotal = lease.payments.reduce(
        (sum, p) => sum + Number(p.amount),
        0,
    );
    const dueTotal = lease.invoices
        .filter((i) => i.status === "DUE" || i.status === "PARTIAL")
        .reduce((sum, i) => sum + Number(i.dueAmount), 0);

    const canTerminate =
        lease.status === "ACTIVE" || lease.status === "PENDING";

    const tenantInitials = lease.tenant.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1240px] space-y-5 p-4 sm:p-6 lg:p-8">
                {/* Back link */}
                <Link
                    href="/owner/dashboard/leases"
                    className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-jade-900"
                >
                    <ArrowLeft size={12} />
                    All leases
                </Link>

                {/* Hero */}
                <div
                    className="overflow-hidden rounded-[18px] border border-rule-soft bg-paper"
                    style={{
                        boxShadow:
                            "0 1px 0 rgba(255,255,255,0.6) inset, 0 14px 36px -22px rgba(10,46,34,0.22)",
                    }}
                >
                    <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-6">
                        <div className="flex items-start gap-4 min-w-0">
                            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-jade-50 ring-2 ring-jade-100 text-[15px] font-bold text-jade-800">
                                {tenantInitials}
                            </span>
                            <div className="min-w-0">
                                <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft/65">
                                    Lease #{lease.id.slice(-8).toUpperCase()}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <h1 className="truncate text-[26px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[28px]">
                                        {lease.tenant.name}
                                    </h1>
                                    <span
                                        className={cn(
                                            "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                            leaseStatusStyles[lease.status],
                                        )}
                                    >
                                        {leaseStatusLabel(lease.status)}
                                    </span>
                                </div>

                                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-ink-soft">
                                    <span className="inline-flex items-center gap-1">
                                        <Building
                                            size={11}
                                            className="text-ink-soft/60"
                                        />
                                        {lease.unit.building.name}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <DoorOpen
                                            size={11}
                                            className="text-ink-soft/60"
                                        />
                                        Unit {lease.unit.name}
                                    </span>
                                    <span className="inline-flex items-center gap-1 tabular-nums">
                                        <Calendar
                                            size={11}
                                            className="text-ink-soft/60"
                                        />
                                        {new Date(
                                            lease.startDate,
                                        ).toLocaleDateString()}
                                        {" – "}
                                        {lease.endDate
                                            ? new Date(
                                                  lease.endDate,
                                              ).toLocaleDateString()
                                            : "Open-ended"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {canTerminate && (
                            <button
                                type="button"
                                onClick={() => setTerminateOpen(true)}
                                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] border border-coral-100 bg-coral-50 px-3 text-[12.5px] font-semibold text-coral-600 transition-colors hover:bg-coral-100"
                            >
                                <LogOut size={12} />
                                Terminate
                            </button>
                        )}
                    </div>

                    {lease.notes && (
                        <div className="border-t border-rule-soft px-5 py-3 sm:px-6">
                            <p className="rounded-[10px] border-l-[2.5px] border-coral-500 bg-cream/70 px-3 py-2 text-[13.5px] text-ink">
                                {lease.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Money KPIs — outstanding gets visual priority when > 0 */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <MoneyTile
                        label="Monthly rent"
                        bn="মাসিক ভাড়া"
                        value={formatMoney(lease.monthlyRent)}
                        sub="base rent"
                    />
                    <MoneyTile
                        label="Total monthly"
                        bn="মোট মাসিক"
                        value={formatMoney(totalMonthly)}
                        sub={
                            isSeparate
                                ? "rent + service + utilities"
                                : "rent + service"
                        }
                    />
                    <MoneyTile
                        label="Security deposit"
                        bn="জামানত"
                        value={formatMoney(lease.securityDeposit)}
                        sub="held"
                    />
                    <MoneyTile
                        label="Outstanding"
                        bn="বকেয়া"
                        value={formatMoney(dueTotal)}
                        sub={
                            paidTotal > 0
                                ? `${formatMoney(paidTotal)} collected`
                                : "nothing collected yet"
                        }
                        tone={dueTotal > 0 ? "warn" : "good"}
                    />
                </div>

                {/* Tenant + Unit + Dates */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Tenant */}
                    <LinkCard
                        href={`/owner/dashboard/tenants/${lease.tenant.id}`}
                        eyebrow="Primary contact"
                        title="Tenant"
                    >
                        <p className="text-[14px] font-bold text-jade-950">
                            {lease.tenant.name}
                        </p>
                        <ul className="mt-2.5 space-y-1.5 text-[12px] text-ink-soft">
                            <li className="inline-flex items-center gap-1.5 tabular-nums">
                                <Phone size={11} className="text-ink-soft/60" />
                                {lease.tenant.phone}
                            </li>
                            {lease.tenant.email && (
                                <li className="flex items-center gap-1.5 truncate">
                                    <Mail
                                        size={11}
                                        className="shrink-0 text-ink-soft/60"
                                    />
                                    <span className="truncate">
                                        {lease.tenant.email}
                                    </span>
                                </li>
                            )}
                            {lease.tenant.occupation && (
                                <li className="inline-flex items-center gap-1.5">
                                    <User
                                        size={11}
                                        className="text-ink-soft/60"
                                    />
                                    {lease.tenant.occupation}
                                </li>
                            )}
                        </ul>
                    </LinkCard>

                    {/* Unit */}
                    <LinkCard
                        href={`/owner/dashboard/units/${lease.unit.id}`}
                        eyebrow="Property"
                        title="Unit"
                    >
                        <p className="text-[14px] font-bold text-jade-950">
                            {lease.unit.building.name} · Unit{" "}
                            {lease.unit.name}
                        </p>
                        <ul className="mt-2.5 space-y-1.5 text-[12px] text-ink-soft">
                            <li>
                                {lease.unit.floor.floorNumber === 0
                                    ? "Ground floor"
                                    : `Floor ${fmtNum(lease.unit.floor.floorNumber)}`}{" "}
                                · {lease.unit.floor.name}
                            </li>
                            <li className="tabular-nums">
                                {lease.unit.bedrooms !== null
                                    ? fmtNum(lease.unit.bedrooms)
                                    : "—"}{" "}
                                bed ·{" "}
                                {lease.unit.bathrooms !== null
                                    ? fmtNum(lease.unit.bathrooms)
                                    : "—"}{" "}
                                bath
                                {lease.unit.sizeSqft != null &&
                                    ` · ${fmtNum(lease.unit.sizeSqft)} sqft`}
                            </li>
                            <li className="truncate text-ink-soft/70">
                                {lease.unit.building.address}
                            </li>
                        </ul>
                    </LinkCard>

                    {/* Key dates */}
                    <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Lease term &amp; rent schedule
                        </p>
                        <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                            Key dates
                        </h3>

                        <ul className="mt-4 space-y-3">
                            <DateRow
                                icon={Calendar}
                                label="Start"
                                value={new Date(
                                    lease.startDate,
                                ).toLocaleDateString()}
                            />
                            <DateRow
                                icon={Calendar}
                                label="End"
                                value={
                                    lease.endDate
                                        ? new Date(
                                              lease.endDate,
                                          ).toLocaleDateString()
                                        : "Open-ended"
                                }
                            />
                            <DateRow
                                icon={Calendar}
                                label="Move-in"
                                value={new Date(
                                    lease.moveInDate,
                                ).toLocaleDateString()}
                            />
                            {lease.moveOutDate && (
                                <DateRow
                                    icon={CalendarOff}
                                    label="Move-out"
                                    value={new Date(
                                        lease.moveOutDate,
                                    ).toLocaleDateString()}
                                />
                            )}
                            <DateRow
                                icon={Receipt}
                                label="Rent due"
                                value={`Day ${fmtNum(lease.rentDueDay)} of each month`}
                            />
                        </ul>
                    </div>
                </div>

                {/* Billing breakdown */}
                <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="font-serif text-[13px] italic text-coral-600/85">
                                How rent is billed
                            </p>
                            <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                                Billing breakdown
                            </h3>
                            <p className="font-bangla mt-0.5 text-[11.5px] text-ink-soft/70">
                                · বিলিং বিভাজন
                            </p>
                        </div>
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider",
                                isSeparate
                                    ? "border-coral-100 bg-coral-50 text-coral-600"
                                    : "border-jade-100 bg-jade-50/60 text-jade-700",
                            )}
                        >
                            <Layers size={11} />
                            {isSeparate ? "Fixed separate" : "Inclusive"}
                        </span>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-[10px] border border-rule-soft">
                        <table className="w-full text-[13px]">
                            <tbody className="divide-y divide-rule-soft bg-cream/30">
                                <BreakdownRow
                                    label="Base rent"
                                    value={formatMoney(lease.monthlyRent)}
                                />
                                <BreakdownRow
                                    label="Service charge"
                                    value={formatMoney(lease.serviceCharge)}
                                />
                                {isSeparate && (
                                    <>
                                        <UtilityRow
                                            icon={Flame}
                                            label="Gas"
                                            value={lease.gasCharge}
                                        />
                                        <UtilityRow
                                            icon={Droplets}
                                            label="Water"
                                            value={lease.waterCharge}
                                        />
                                        <UtilityRow
                                            icon={Zap}
                                            label="Electricity"
                                            value={lease.electricityCharge}
                                        />
                                        <UtilityRow
                                            icon={Wifi}
                                            label="Internet"
                                            value={lease.internetCharge}
                                        />
                                    </>
                                )}
                            </tbody>
                            <tfoot className="bg-paper">
                                <tr className="border-t border-rule-soft">
                                    <td className="px-3.5 py-2.5 text-[12.5px] font-bold text-ink">
                                        Monthly invoice total
                                    </td>
                                    <td className="px-3.5 py-2.5 text-right text-[15px] font-bold text-jade-950 tabular-nums">
                                        {formatMoney(totalMonthly)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {!isSeparate && (
                        <p className="mt-3 text-[11.5px] text-ink-soft">
                            All utilities are included in the rent amount —
                            tenants pay one fixed price per month.
                        </p>
                    )}
                </div>

                {/* Agreement + Rent increases */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <RentAgreementPanel leaseId={lease.id} />
                    <RentIncreasesPanel
                        leaseId={lease.id}
                        currentRent={lease.monthlyRent}
                    />
                </div>

                {/* Invoices + Payments */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Invoices */}
                    <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="font-serif text-[13px] italic text-coral-600/85">
                                    Billing
                                </p>
                                <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                                    Invoices
                                </h3>
                                <p className="mt-1 text-[12px] text-ink-soft">
                                    {lease.invoices.length === 0
                                        ? "No invoices yet"
                                        : `${fmtNum(lease.invoices.length)} invoice${lease.invoices.length === 1 ? "" : "s"} generated`}
                                </p>
                            </div>
                            {lease.invoices.length > 0 && (
                                <Link
                                    href={`/owner/dashboard/invoices?leaseId=${lease.id}`}
                                    className="inline-flex items-center gap-1 text-[12.5px] font-medium text-jade-900 transition-colors hover:text-coral-600"
                                >
                                    View all
                                    <ArrowUpRight size={12} />
                                </Link>
                            )}
                        </div>

                        <div className="mt-4">
                            {lease.invoices.length === 0 ? (
                                <EmptyBlock icon={Receipt} label="No invoices yet" />
                            ) : (
                                <ul className="divide-y divide-rule-soft">
                                    {lease.invoices.map((inv) => (
                                        <li
                                            key={inv.id}
                                            className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate font-mono text-[12px] font-semibold text-ink">
                                                    {inv.invoiceNumber}
                                                </p>
                                                <p className="text-[11px] text-ink-soft tabular-nums">
                                                    Due{" "}
                                                    {new Date(
                                                        inv.dueDate,
                                                    ).toLocaleDateString()}{" "}
                                                    · {inv.type}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <p className="text-[14px] font-semibold text-jade-950 tabular-nums">
                                                    {formatMoney(inv.totalAmount)}
                                                </p>
                                                <span
                                                    className={cn(
                                                        "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                                        getInvoiceStatusTone(
                                                            inv.status,
                                                        ),
                                                    )}
                                                >
                                                    {inv.status}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Payments */}
                    <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="font-serif text-[13px] italic text-coral-600/85">
                                    Money received
                                </p>
                                <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                                    Payments
                                </h3>
                                <p className="mt-1 text-[12px] text-ink-soft">
                                    {lease.payments.length === 0
                                        ? "No payments recorded"
                                        : `${formatMoney(paidTotal)} across ${fmtNum(lease.payments.length)} payment${lease.payments.length === 1 ? "" : "s"}`}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            {lease.payments.length === 0 ? (
                                <EmptyBlock
                                    icon={CreditCard}
                                    label="No payments recorded"
                                />
                            ) : (
                                <ul className="divide-y divide-rule-soft">
                                    {lease.payments.map((p) => (
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
                                                    {new Date(
                                                        p.createdAt,
                                                    ).toLocaleDateString()}
                                                </p>
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
                </div>

                {/* Terminate dialog */}
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
                            <AlertDialogTitle className="text-jade-950">
                                Terminate this lease?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-ink-soft">
                                This will mark the lease as{" "}
                                <strong className="text-ink">TERMINATED</strong>{" "}
                                and the unit as{" "}
                                <strong className="text-ink">VACANT</strong>. The
                                action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {dueTotal > 0 && (
                            <div className="flex items-start gap-2 rounded-[10px] border border-coral-100 bg-coral-50/70 px-3 py-2 text-[12.5px] text-coral-600">
                                <AlertTriangle
                                    size={13}
                                    className="mt-0.5 shrink-0"
                                />
                                <span>
                                    This lease has{" "}
                                    <strong>{formatMoney(dueTotal)}</strong>{" "}
                                    outstanding. Settle invoices before terminating
                                    if possible.
                                </span>
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="term-moveout"
                                    className="text-[12.5px] font-semibold text-ink"
                                >
                                    Move-out date
                                    <span
                                        className="ml-1 text-coral-600"
                                        aria-label="required"
                                    >
                                        *
                                    </span>
                                </Label>
                                <Input
                                    id="term-moveout"
                                    type="date"
                                    value={moveOutDate}
                                    onChange={(e) =>
                                        setMoveOutDate(e.target.value)
                                    }
                                    required
                                    className="border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20 tabular-nums"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="term-notes"
                                    className="text-[12.5px] font-semibold text-ink"
                                >
                                    Notes
                                </Label>
                                <Textarea
                                    id="term-notes"
                                    rows={2}
                                    value={terminateNotes}
                                    onChange={(e) =>
                                        setTerminateNotes(e.target.value)
                                    }
                                    placeholder="Reason or other context…"
                                    className="resize-none border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20"
                                />
                            </div>
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel
                                disabled={terminateMutation.isPending}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                disabled={
                                    terminateMutation.isPending || !moveOutDate
                                }
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
                                className="bg-coral-600 text-paper hover:bg-coral-700"
                            >
                                {terminateMutation.isPending ? (
                                    <>
                                        <Loader2
                                            size={14}
                                            className="animate-spin"
                                        />
                                        Terminating…
                                    </>
                                ) : (
                                    "Terminate lease"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// MoneyTile — outstanding gets the warn treatment when > 0
// ─────────────────────────────────────────────────────────────────

function MoneyTile({
    label,
    bn,
    value,
    sub,
    tone = "neutral",
}: {
    label: string;
    bn: string;
    value: string;
    sub: string;
    tone?: "neutral" | "warn" | "good";
}) {
    const warn = tone === "warn";

    return (
        <div
            className={cn(
                "rounded-[12px] border px-4 py-3.5 transition-colors",
                warn
                    ? "border-coral-100 bg-coral-50/70"
                    : "border-rule-soft bg-paper",
            )}
        >
            <div className="flex items-baseline justify-between gap-2">
                <p
                    className={cn(
                        "text-[10.5px] font-semibold uppercase tracking-[0.12em]",
                        warn ? "text-coral-600" : "text-ink-soft",
                    )}
                >
                    {label}
                </p>
                <p
                    className={cn(
                        "font-bangla text-[10.5px]",
                        warn ? "text-coral-600/85" : "text-ink-soft/65",
                    )}
                >
                    {bn}
                </p>
            </div>
            <p
                className={cn(
                    "mt-1.5 text-[22px] font-bold tracking-[-0.025em] tabular-nums leading-none",
                    warn ? "text-coral-600" : "text-jade-950",
                )}
            >
                {value}
            </p>
            <p
                className={cn(
                    "mt-1.5 text-[11.5px]",
                    warn ? "text-coral-600/85 font-medium" : "text-ink-soft",
                )}
            >
                {sub}
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// LinkCard — Tenant + Unit cards link to their detail pages
// ─────────────────────────────────────────────────────────────────

function LinkCard({
    href,
    eyebrow,
    title,
    children,
}: {
    href: string;
    eyebrow: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="group block rounded-[14px] border border-rule-soft bg-paper p-5 transition-all hover:-translate-y-0.5 hover:border-jade-700/20 hover:shadow-[0_8px_24px_-12px_rgba(10,46,34,0.15)]"
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="font-serif text-[13px] italic text-coral-600/85">
                        {eyebrow}
                    </p>
                    <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                        {title}
                    </h3>
                </div>
                <ArrowUpRight
                    size={14}
                    className="shrink-0 text-ink-soft/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-jade-900"
                />
            </div>
            <div className="mt-4">{children}</div>
        </Link>
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
        <li className="flex items-start justify-between gap-2 text-[13px]">
            <span className="inline-flex items-center gap-1.5 text-ink-soft">
                <Icon size={13} className="text-ink-soft/60" />
                {label}
            </span>
            <span className="text-right font-semibold text-jade-950 tabular-nums">
                {value}
            </span>
        </li>
    );
}

function EmptyBlock({
    icon: Icon,
    label,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
}) {
    return (
        <div className="rounded-[10px] border border-dashed border-rule-soft px-4 py-8 text-center">
            <Icon className="mx-auto text-ink-soft/40" size={24} />
            <p className="mt-2 text-[13px] text-ink-soft">{label}</p>
        </div>
    );
}

/** Plain breakdown row — used for rent + service charge. */
function BreakdownRow({ label, value }: { label: string; value: string }) {
    return (
        <tr>
            <td className="px-3.5 py-2 text-ink-soft">{label}</td>
            <td className="px-3.5 py-2 text-right font-semibold tabular-nums text-jade-950">
                {value}
            </td>
        </tr>
    );
}

/**
 * Utility row — icon + label, value dimmed when zero so the "billed" lines
 * stand out from the "not charged" lines.
 */
function UtilityRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string;
}) {
    const n = Number(value);
    const isZero = !n;
    return (
        <tr>
            <td className="px-3.5 py-2">
                <span className="inline-flex items-center gap-1.5 text-ink-soft">
                    <Icon size={12} className="text-ink-soft/60" />
                    {label}
                </span>
            </td>
            <td
                className={cn(
                    "px-3.5 py-2 text-right tabular-nums",
                    isZero ? "text-ink-soft/45" : "font-semibold text-jade-950",
                )}
            >
                {formatMoney(value)}
            </td>
        </tr>
    );
}