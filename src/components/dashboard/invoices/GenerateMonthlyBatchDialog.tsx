"use client";

// src/components/dashboard/invoices/GenerateMonthlyBatchDialog.tsx

import {
    Field,
    FormActions,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import {
    formatBillingMonth,
    toBillingMonthDate,
} from "@/src/components/dashboard/invoices/invoiceStyles";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { useGenerateMonthlyBatch } from "@/src/hooks/useInvoices";
import { useLeases } from "@/src/hooks/useLeases";
import { fmtNum } from "@/src/lib/numerals";
import { CalendarRange, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface GenerateMonthlyBatchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function nextMonthYearMonth(): string {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
}

export function GenerateMonthlyBatchDialog({
    open,
    onOpenChange,
}: GenerateMonthlyBatchDialogProps) {
    const mutation = useGenerateMonthlyBatch();
    const { data: leases } = useLeases();
    const [billingMonth, setBillingMonth] = useState(nextMonthYearMonth());

    useEffect(() => {
        if (open) {
            setBillingMonth(nextMonthYearMonth());
        }
    }, [open]);

    const activeLeaseCount = useMemo(
        () => (leases ?? []).filter((l) => l.status === "ACTIVE").length,
        [leases],
    );

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        mutation.mutate(
            { billingMonth: toBillingMonthDate(billingMonth) },
            { onSuccess: () => onOpenChange(false) },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-jade-950">
                        Generate monthly invoices
                    </DialogTitle>
                    <DialogDescription className="text-ink-soft">
                        Generate invoices for every active lease for the selected
                        month.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* How-it-works callout */}
                    <div className="flex items-start gap-2.5 rounded-[10px] border border-jade-100 bg-jade-50/60 p-3">
                        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-jade-900 text-paper">
                            <Zap size={11} />
                        </span>
                        <div className="text-[12px] leading-relaxed">
                            <p className="font-semibold text-jade-950">
                                How it works
                            </p>
                            <p className="mt-0.5 text-ink">
                                Every{" "}
                                <span className="rounded-sm bg-jade-50 px-1 font-semibold text-jade-800">
                                    ACTIVE
                                </span>{" "}
                                lease will get one invoice for the month. Leases
                                that already have an invoice for that month are
                                skipped — safe to re-run.
                            </p>
                            <p className="font-bangla mt-1 text-[11.5px] text-ink-soft">
                                প্রতিটি সক্রিয় লিজের জন্য একটি করে বিল তৈরি হবে।
                            </p>
                        </div>
                    </div>

                    <Field label="Billing month" htmlFor="b-month" required>
                        <div className="relative">
                            <CalendarRange
                                size={14}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/70"
                            />
                            <Input
                                id="b-month"
                                type="month"
                                value={billingMonth}
                                onChange={(e) =>
                                    setBillingMonth(e.target.value)
                                }
                                required
                                className={`${fieldClass} pl-9 tabular-nums`}
                            />
                        </div>
                    </Field>

                    {/* Preview — how many invoices this will create */}
                    {activeLeaseCount > 0 && (
                        <div className="rounded-[10px] border border-rule-soft bg-cream/60 px-3 py-2.5">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                                Preview
                            </p>
                            <p className="mt-1 text-[13px] text-ink">
                                Up to{" "}
                                <span className="font-bold text-jade-950 tabular-nums">
                                    {fmtNum(activeLeaseCount)}
                                </span>{" "}
                                invoice{activeLeaseCount === 1 ? "" : "s"} for{" "}
                                <span className="font-semibold text-jade-900">
                                    {formatBillingMonth(billingMonth)}
                                </span>
                            </p>
                            <p className="mt-0.5 text-[11px] text-ink-soft">
                                Actual count may be lower if some leases already
                                have an invoice for this month.
                            </p>
                        </div>
                    )}

                    {activeLeaseCount === 0 && (
                        <div className="flex items-start gap-2 rounded-[10px] border border-coral-100 bg-coral-50/60 px-3 py-2 text-[12.5px] text-coral-600">
                            <span>
                                No active leases. Generate this batch later once
                                you have active leases on record.
                            </span>
                        </div>
                    )}

                    <FormActions
                        submitting={mutation.isPending}
                        submitLabel="Generate batch"
                        onCancel={() => onOpenChange(false)}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}