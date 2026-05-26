"use client";

// src/components/dashboard/invoices/GenerateInvoiceDialog.tsx

import {
    Field,
    FormActions,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import { toBillingMonthDate } from "@/src/components/dashboard/invoices/invoiceStyles";
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
import { useGenerateSingleInvoice } from "@/src/hooks/useInvoices";
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
    const [utilityAmount, setUtilityAmount] = useState("");
    const [penaltyAmount, setPenaltyAmount] = useState("");

    useEffect(() => {
        if (open) {
            setLeaseId(fixedLeaseId ?? "");
            setBillingMonth(currentYearMonth());
            setUtilityAmount("");
            setPenaltyAmount("");
        }
    }, [open, fixedLeaseId]);

    const activeLeases = useMemo(
        () => (leases ?? []).filter((l) => l.status === "ACTIVE"),
        [leases],
    );

    const selectedLease = activeLeases.find((l) => l.id === leaseId);

    // Preview of the resulting invoice total
    const previewTotal = selectedLease
        ? Number(selectedLease.monthlyRent) +
          Number(selectedLease.serviceCharge) +
          Number(utilityAmount || 0) +
          Number(penaltyAmount || 0)
        : 0;

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        mutation.mutate(
            {
                leaseId,
                billingMonth: toBillingMonthDate(billingMonth),
                ...(utilityAmount && { utilityAmount: Number(utilityAmount) }),
                ...(penaltyAmount && { penaltyAmount: Number(penaltyAmount) }),
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
                                {activeLeases.length === 0 ? (
                                    <div className="px-2 py-2 text-[12px] text-ink-soft">
                                        No active leases
                                    </div>
                                ) : (
                                    activeLeases.map((l) => {
                                        const initials = l.tenant.name
                                            .split(" ")
                                            .filter(Boolean)
                                            .map((p) => p[0])
                                            .slice(0, 2)
                                            .join("")
                                            .toUpperCase();
                                        return (
                                            <SelectItem key={l.id} value={l.id}>
                                                <span className="inline-flex items-center gap-2">
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

                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Utility"
                            htmlFor="g-utility"
                            hint="optional · BDT"
                        >
                            <MoneyInput
                                id="g-utility"
                                value={utilityAmount}
                                onChange={setUtilityAmount}
                                placeholder="0"
                            />
                        </Field>
                        <Field
                            label="Penalty"
                            htmlFor="g-penalty"
                            hint="optional · BDT"
                        >
                            <MoneyInput
                                id="g-penalty"
                                value={penaltyAmount}
                                onChange={setPenaltyAmount}
                                placeholder="0"
                            />
                        </Field>
                    </div>

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
                                {Number(utilityAmount) > 0 && (
                                    <li className="flex justify-between tabular-nums">
                                        <span>Utility</span>
                                        <span>
                                            {formatMoney(Number(utilityAmount))}
                                        </span>
                                    </li>
                                )}
                                {Number(penaltyAmount) > 0 && (
                                    <li className="flex justify-between tabular-nums text-coral-700">
                                        <span>Penalty</span>
                                        <span>
                                            {formatMoney(Number(penaltyAmount))}
                                        </span>
                                    </li>
                                )}
                            </ul>
                            <div className="mt-2 flex justify-between border-t border-jade-100 pt-1.5 text-[13.5px] font-bold tabular-nums text-jade-950">
                                <span>Total</span>
                                <span>{formatMoney(previewTotal)}</span>
                            </div>
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

// Local money input with ৳ prefix
function MoneyInput({
    id,
    value,
    onChange,
    placeholder,
}: {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <div className="relative">
            <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-ink-soft"
            >
                ৳
            </span>
            <Input
                id={id}
                type="number"
                min={0}
                step="any"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`${fieldClass} pl-7 tabular-nums`}
            />
        </div>
    );
}