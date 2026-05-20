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
import { useGenerateMonthlyBatch } from "@/src/hooks/useInvoices";
import { CalendarRange, Loader2, Zap } from "lucide-react";
import { useEffect, useState } from "react";

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
    const [billingMonth, setBillingMonth] = useState(nextMonthYearMonth());

    useEffect(() => {
        if (open) {
            setBillingMonth(nextMonthYearMonth());
        }
    }, [open]);

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
                    <DialogTitle>Generate monthly invoices</DialogTitle>
                    <DialogDescription>
                        Generate invoices for every active lease for the selected month.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-start gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                        <Zap size={16} className="mt-0.5 shrink-0 text-indigo-600" />
                        <div className="text-xs text-indigo-900">
                            <p className="font-medium">How it works</p>
                            <p className="mt-0.5 text-indigo-700">
                                Every <strong>ACTIVE</strong> lease will get one invoice for the
                                month. Leases that already have an invoice for that month are
                                automatically skipped — safe to re-run.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="b-month">
                            Billing month <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                            <CalendarRange
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <Input
                                id="b-month"
                                type="month"
                                value={billingMonth}
                                onChange={(e) => setBillingMonth(e.target.value)}
                                required
                                className="pl-9"
                            />
                        </div>
                    </div>

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
                            disabled={mutation.isPending || !billingMonth}
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate batch"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
