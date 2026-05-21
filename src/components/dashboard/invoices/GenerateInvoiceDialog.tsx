"use client";

import { toBillingMonthDate } from "@/src/components/dashboard/invoices/invoiceStyles";
import { Button } from "@/src/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { useGenerateSingleInvoice } from "@/src/hooks/useInvoices";
import { useLeases } from "@/src/hooks/useLeases";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface GenerateInvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Pre-select a lease (e.g. when triggered from lease detail page). */
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

    // Reset state when dialog opens.
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
                    <DialogTitle>Generate invoice</DialogTitle>
                    <DialogDescription>
                        Create a single invoice for a specific lease and billing month.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="g-lease">
                            Lease <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                            value={leaseId}
                            onValueChange={(v) => setLeaseId(v ?? "")}
                            disabled={!!fixedLeaseId}
                        >
                            <SelectTrigger id="g-lease" className="w-full">
                                <SelectValue placeholder="Select an active lease">
                                    {(value) => {
                                        const l = activeLeases.find((x) => x.id === value);
                                        return l
                                            ? `${l.tenant.name} · ${l.unit.building.name} · ${l.unit.name}`
                                            : null;
                                    }}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {activeLeases.length === 0 ? (
                                    <div className="px-2 py-2 text-xs text-slate-500">
                                        No active leases
                                    </div>
                                ) : (
                                    activeLeases.map((l) => (
                                        <SelectItem key={l.id} value={l.id}>
                                            {l.tenant.name} · {l.unit.building.name} ·{" "}
                                            {l.unit.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="g-month">
                            Billing month <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="g-month"
                            type="month"
                            value={billingMonth}
                            onChange={(e) => setBillingMonth(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="g-utility">Utility amount</Label>
                            <Input
                                id="g-utility"
                                type="number"
                                min={0}
                                step="any"
                                value={utilityAmount}
                                onChange={(e) => setUtilityAmount(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="g-penalty">Penalty amount</Label>
                            <Input
                                id="g-penalty"
                                type="number"
                                min={0}
                                step="any"
                                value={penaltyAmount}
                                onChange={(e) => setPenaltyAmount(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                        Rent and service charge are pulled automatically from the lease.
                    </p>

                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={mutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={mutation.isPending || !leaseId || !billingMonth}
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate invoice"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
