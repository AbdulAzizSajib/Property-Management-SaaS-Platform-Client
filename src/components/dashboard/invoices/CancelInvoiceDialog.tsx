"use client";

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
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useCancelInvoice } from "@/src/hooks/useInvoices";
import type { InvoiceDetail } from "@/src/types/invoice.types";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CancelInvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoice: InvoiceDetail;
}

export function CancelInvoiceDialog({
    open,
    onOpenChange,
    invoice,
}: CancelInvoiceDialogProps) {
    const mutation = useCancelInvoice(invoice.id);
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (open) setReason("");
    }, [open]);

    const hasPayments = invoice.payments.length > 0;
    const paidAmount = Number(invoice.paidAmount) || 0;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this invoice?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Marks <strong>{invoice.invoiceNumber}</strong> as{" "}
                        <strong>CANCELED</strong>. The invoice stays in your records
                        for audit but no longer counts toward outstanding balance.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {hasPayments && (
                    <div className="flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
                        <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                        <p>
                            This invoice already has{" "}
                            <strong>
                                {invoice.payments.length} payment
                                {invoice.payments.length === 1 ? "" : "s"}
                            </strong>{" "}
                            ({paidAmount.toLocaleString("en-BD")} BDT collected).
                            The backend may reject cancellation — you might need to
                            refund payments first.
                        </p>
                    </div>
                )}

                <div className="space-y-1.5">
                    <Label htmlFor="cancel-reason">
                        Reason <span className="text-rose-500">*</span>
                    </Label>
                    <Textarea
                        id="cancel-reason"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Tenant disputed gas charge; regenerating with corrected breakdown"
                        required
                    />
                    <p className="text-[11px] text-slate-500">
                        Recorded in the audit trail. Make it specific enough that
                        someone reading later understands why.
                    </p>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>
                        Keep invoice
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={mutation.isPending || !reason.trim()}
                        onClick={() => {
                            mutation.mutate(
                                { reason: reason.trim() },
                                { onSuccess: () => onOpenChange(false) },
                            );
                        }}
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Canceling...
                            </>
                        ) : (
                            "Cancel invoice"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
