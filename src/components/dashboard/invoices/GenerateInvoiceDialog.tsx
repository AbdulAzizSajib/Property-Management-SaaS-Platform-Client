"use client";

// src/components/dashboard/invoices/GenerateInvoiceDialog.tsx

import {
    Field,
    FormActions,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import {
    formatBillingMonth,
    toBillingMonthDate,
} from "@/src/components/dashboard/invoices/invoiceStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { useGenerateSingleInvoice, useInvoices } from "@/src/hooks/useInvoices";
import { useLeases } from "@/src/hooks/useLeases";
import { Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface GenerateInvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fixedLeaseId?: string;
}

function currentYearMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function GenerateInvoiceDialog({
    open,
    onOpenChange,
    fixedLeaseId,
}: GenerateInvoiceDialogProps) {
    const { data: leases } = useLeases();
    const mutation = useGenerateSingleInvoice();

    const [leaseId, setLeaseId] = useState(fixedLeaseId ?? "");
    const [billingMonth, setBillingMonth] = useState(currentYearMonth());
    // Building filter — narrows the lease dropdown to one building.
    const [buildingId, setBuildingId] = useState("");
    // Which earlier unpaid invoices the owner chose to roll into this one.
    const [carryIds, setCarryIds] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            setLeaseId(fixedLeaseId ?? "");
            setBillingMonth(currentYearMonth());
            setBuildingId("");
        }
    }, [open, fixedLeaseId]);

    const activeLeases = useMemo(
        () => (leases ?? []).filter((l) => l.status === "ACTIVE"),
        [leases],
    );

    // Unique buildings across the active leases — for the building filter.
    const buildings = useMemo(() => {
        const map = new Map<string, string>();
        for (const l of activeLeases) {
            if (l.unit?.building) {
                map.set(l.unit.building.id, l.unit.building.name);
            }
        }
        return Array.from(map, ([id, name]) => ({ id, name }));
    }, [activeLeases]);

    // Leases shown in the dropdown, optionally filtered by the chosen building.
    const visibleLeases = useMemo(
        () =>
            buildingId
                ? activeLeases.filter((l) => l.unit.building.id === buildingId)
                : activeLeases,
        [activeLeases, buildingId],
    );

    const selectedLease = activeLeases.find((l) => l.id === leaseId);

    // Earlier unpaid invoices of the selected lease — the owner picks which to
    // carry forward. Fetched only once a lease is chosen.
    const { data: leaseInvoices } = useInvoices(
        leaseId ? { leaseId } : undefined,
        { enabled: !!leaseId },
    );

    const carryCandidates = useMemo(() => {
        if (!leaseId) return [];
        return (leaseInvoices ?? [])
            .filter(
                (i) =>
                    (i.status === "DUE" ||
                        i.status === "PARTIAL" ||
                        i.status === "OVERDUE") &&
                    Number(i.dueAmount) > 0 &&
                    // strictly earlier than the month being billed
                    i.billingMonth.slice(0, 7) < billingMonth,
            )
            .sort((a, b) => a.billingMonth.localeCompare(b.billingMonth));
    }, [leaseInvoices, leaseId, billingMonth]);

    // Reset the selection whenever the candidate set changes (lease / month).
    useEffect(() => {
        setCarryIds([]);
    }, [leaseId, billingMonth]);

    function toggleCarry(id: string) {
        setCarryIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    }

    const selectedDue = carryCandidates
        .filter((c) => carryIds.includes(c.id))
        .reduce((sum, c) => sum + Number(c.dueAmount), 0);
    const hasCarry = selectedDue > 0;

    // Preview of this month's own charges
    const previewTotal = selectedLease
        ? Number(selectedLease.monthlyRent) +
          Number(selectedLease.serviceCharge)
        : 0;

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        mutation.mutate(
            {
                leaseId,
                billingMonth: toBillingMonthDate(billingMonth),
                ...(carryIds.length > 0 && {
                    carryForwardInvoiceIds: carryIds,
                }),
            },
            { onSuccess: () => onOpenChange(false) },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-jade-950">
                        Generate invoice
                    </DialogTitle>
                    <DialogDescription className="text-ink-soft">
                        Create a single invoice for a specific lease and billing
                        month.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!fixedLeaseId && buildings.length > 1 && (
                        <Field label="Building" htmlFor="g-building">
                            <Select
                                value={buildingId || "__all__"}
                                onValueChange={(v) => {
                                    const next = v === "__all__" ? "" : (v ?? "");
                                    setBuildingId(next);
                                    // Clear the lease if it no longer belongs to
                                    // the chosen building.
                                    if (
                                        next &&
                                        selectedLease &&
                                        selectedLease.unit.building.id !== next
                                    ) {
                                        setLeaseId("");
                                    }
                                }}
                            >
                                <SelectTrigger
                                    id="g-building"
                                    className={`w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="All buildings">
                                        {(value) =>
                                            buildings.find((b) => b.id === value)
                                                ?.name ?? "All buildings"
                                        }
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__all__">
                                        All buildings
                                    </SelectItem>
                                    {buildings.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    )}

                    <Field label="Lease" htmlFor="g-lease" required>
                        <Select
                            value={leaseId}
                            onValueChange={(v) => setLeaseId(v ?? "")}
                            disabled={!!fixedLeaseId}
                        >
                            <SelectTrigger
                                id="g-lease"
                                className={`w-full ${fieldClass}`}
                            >
                                <SelectValue placeholder="Select an active lease">
                                    {(value) => {
                                        const l = activeLeases.find(
                                            (x) => x.id === value,
                                        );
                                        return l
                                            ? `${l.tenant.name} · ${l.unit.building.name} · ${l.unit.name}`
                                            : null;
                                    }}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {visibleLeases.length === 0 ? (
                                    <div className="px-2 py-2 text-[12px] text-ink-soft">
                                        No active leases
                                    </div>
                                ) : (
                                    visibleLeases.map((l) => {
                                        const initials = l.tenant.name
                                            .split(" ")
                                            .filter(Boolean)
                                            .map((p) => p[0])
                                            .slice(0, 2)
                                            .join("")
                                            .toUpperCase();
                                        const leaseDue = Number(l.totalDue ?? 0);
                                        return (
                                            <SelectItem key={l.id} value={l.id}>
                                                <span className="inline-flex w-full items-center gap-2">
                                                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-jade-50 text-[9.5px] font-bold text-jade-800">
                                                        {initials}
                                                    </span>
                                                    <span>
                                                        {l.tenant.name}
                                                        <span className="ml-1.5 text-ink-soft">
                                                            · {l.unit.building.name} ·{" "}
                                                            {l.unit.name}
                                                        </span>
                                                    </span>
                                                    {leaseDue > 0 && (
                                                        <span className="ml-auto shrink-0 rounded-full bg-coral-50 px-1.5 py-px text-[10px] font-semibold tabular-nums text-coral-600">
                                                            {formatMoney(leaseDue)} due
                                                        </span>
                                                    )}
                                                </span>
                                            </SelectItem>
                                        );
                                    })
                                )}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field
                        label="Billing month"
                        htmlFor="g-month"
                        required
                    >
                        <Input
                            id="g-month"
                            type="month"
                            value={billingMonth}
                            onChange={(e) => setBillingMonth(e.target.value)}
                            required
                            className={`${fieldClass} tabular-nums`}
                        />
                    </Field>

                    {/* Previous due — owner picks which earlier unpaid invoices
                        to roll into this bill. Nothing selected = current month
                        only; the older dues stay as their own invoices. */}
                    {selectedLease && carryCandidates.length > 0 && (
                        <div className="rounded-[10px] border border-coral-100 bg-coral-50/40 px-3 py-2.5">
                            <p className="text-[12.5px] font-semibold text-coral-600">
                                Carry previous due into this bill?
                            </p>
                            <p className="font-bangla mt-0.5 text-[11px] text-ink-soft/80">
                                যে বকেয়া যোগ করতে চান বেছে নিন — না করলে শুধু এই মাসের
                                ভাড়া।
                            </p>
                            <ul className="mt-2 space-y-1.5">
                                {carryCandidates.map((c) => {
                                    const checked = carryIds.includes(c.id);
                                    return (
                                        <li key={c.id}>
                                            <label className="flex cursor-pointer items-center gap-2.5 rounded-[8px] border border-rule-soft bg-paper px-2.5 py-2 transition-colors hover:border-coral-200">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() =>
                                                        toggleCarry(c.id)
                                                    }
                                                    className="size-4 shrink-0 accent-jade-800"
                                                />
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-[12.5px] font-medium text-ink">
                                                        {formatBillingMonth(
                                                            c.billingMonth,
                                                        )}
                                                    </span>
                                                    <span className="block truncate font-mono text-[10px] text-ink-soft/60">
                                                        {c.invoiceNumber}
                                                    </span>
                                                </span>
                                                <span className="shrink-0 text-[12.5px] font-semibold tabular-nums text-coral-600">
                                                    {formatMoney(c.dueAmount)}
                                                </span>
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {/* Preview */}
                    {selectedLease ? (
                        <div className="rounded-[10px] border border-jade-100 bg-jade-50/60 px-3 py-2.5 text-[12px]">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-jade-800">
                                Invoice preview
                            </p>
                            <ul className="mt-1.5 space-y-0.5 text-ink">
                                <li className="flex justify-between tabular-nums">
                                    <span>Base rent</span>
                                    <span>
                                        {formatMoney(selectedLease.monthlyRent)}
                                    </span>
                                </li>
                                <li className="flex justify-between tabular-nums">
                                    <span>Service charge</span>
                                    <span>
                                        {formatMoney(selectedLease.serviceCharge)}
                                    </span>
                                </li>
                            </ul>

                            {hasCarry ? (
                                <>
                                    {/* This month's charges, then carried-over due */}
                                    <div className="mt-2 flex justify-between border-t border-jade-100 pt-1.5 tabular-nums text-ink">
                                        <span>This month</span>
                                        <span>{formatMoney(previewTotal)}</span>
                                    </div>
                                    <div className="mt-0.5 flex justify-between tabular-nums text-coral-600">
                                        <span>Previous due</span>
                                        <span>+ {formatMoney(selectedDue)}</span>
                                    </div>
                                    <div className="mt-1.5 flex items-baseline justify-between border-t border-jade-100 pt-1.5 text-[13.5px] font-bold tabular-nums text-jade-950">
                                        <span>
                                            Total payable
                                            <span className="font-bangla ml-1.5 text-[10.5px] font-normal text-ink-soft">
                                                সর্বমোট
                                            </span>
                                        </span>
                                        <span>
                                            {formatMoney(previewTotal + selectedDue)}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="mt-2 flex justify-between border-t border-jade-100 pt-1.5 text-[13.5px] font-bold tabular-nums text-jade-950">
                                    <span>Total</span>
                                    <span>{formatMoney(previewTotal)}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-start gap-2 rounded-[10px] border-l-[2.5px] border-coral-500 bg-cream/70 px-3 py-2 text-[12.5px] text-ink">
                            <Info
                                size={13}
                                className="mt-0.5 shrink-0 text-coral-600"
                            />
                            <span>
                                Rent and service charge are pulled automatically
                                from the lease.
                            </span>
                        </div>
                    )}

                    <FormActions
                        submitting={mutation.isPending}
                        submitLabel="Generate invoice"
                        onCancel={() => onOpenChange(false)}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}