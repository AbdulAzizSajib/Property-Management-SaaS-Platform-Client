"use client";

import {
    paymentMethodLabel,
} from "@/src/components/dashboard/payments/paymentStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
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
import { Textarea } from "@/src/components/ui/textarea";
import { useInvoices } from "@/src/hooks/useInvoices";
import { useRecordPayment } from "@/src/hooks/usePayments";
import {
    PAYMENT_METHOD_OPTIONS,
    type PaymentMethod,
} from "@/src/types/payment.types";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface RecordPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Pre-select an invoice (e.g. from invoice detail "Record payment" link). */
    fixedInvoiceId?: string;
}

export function RecordPaymentDialog({
    open,
    onOpenChange,
    fixedInvoiceId,
}: RecordPaymentDialogProps) {
    // Show outstanding invoices for the picker. If invoiceId is fixed, we still
    // load the list so we can preselect + show its outstanding amount.
    const { data: dueInvoices } = useInvoices({ status: "DUE" });
    const { data: partialInvoices } = useInvoices({ status: "PARTIAL" });
    const mutation = useRecordPayment();

    const [invoiceId, setInvoiceId] = useState(fixedInvoiceId ?? "");
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<PaymentMethod>("BKASH");
    const [transactionId, setTransactionId] = useState("");
    const [notes, setNotes] = useState("");

    // Reset state on open and apply fixedInvoiceId.
    useEffect(() => {
        if (open) {
            setInvoiceId(fixedInvoiceId ?? "");
            setAmount("");
            setMethod("BKASH");
            setTransactionId("");
            setNotes("");
        }
    }, [open, fixedInvoiceId]);

    const outstandingInvoices = useMemo(() => {
        const combined = [...(dueInvoices ?? []), ...(partialInvoices ?? [])];
        // De-dupe just in case the API returns overlap.
        const seen = new Set<string>();
        return combined.filter((i) =>
            seen.has(i.id) ? false : (seen.add(i.id), true),
        );
    }, [dueInvoices, partialInvoices]);

    const selectedInvoice = useMemo(
        () => outstandingInvoices.find((i) => i.id === invoiceId),
        [outstandingInvoices, invoiceId],
    );

    // Auto-prefill amount with the outstanding due when an invoice is picked
    // and the user hasn't typed anything yet.
    useEffect(() => {
        if (selectedInvoice && amount === "") {
            setAmount(String(selectedInvoice.dueAmount));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInvoice?.id]);

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        mutation.mutate(
            {
                invoiceId,
                amount: Number(amount),
                method,
                ...(transactionId.trim() && { transactionId: transactionId.trim() }),
                ...(notes.trim() && { notes: notes.trim() }),
            },
            { onSuccess: () => onOpenChange(false) },
        );
    }

    const showTxnField = method !== "CASH";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Record payment</DialogTitle>
                    <DialogDescription>
                        Apply a payment to an outstanding invoice. The invoice status will
                        update automatically (PARTIAL → PAID).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="p-invoice">
                            Invoice <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                            value={invoiceId}
                            onValueChange={(v) => setInvoiceId(v ?? "")}
                            disabled={!!fixedInvoiceId}
                        >
                            <SelectTrigger id="p-invoice" className="w-full">
                                <SelectValue placeholder="Select an outstanding invoice" />
                            </SelectTrigger>
                            <SelectContent>
                                {outstandingInvoices.length === 0 ? (
                                    <div className="px-2 py-2 text-xs text-slate-500">
                                        No outstanding invoices
                                    </div>
                                ) : (
                                    outstandingInvoices.map((i) => (
                                        <SelectItem key={i.id} value={i.id}>
                                            {i.invoiceNumber} · {i.tenant.name} ·{" "}
                                            {formatMoney(i.dueAmount)} due
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {selectedInvoice && (
                            <p className="text-[11px] text-slate-500">
                                Outstanding: {formatMoney(selectedInvoice.dueAmount)} of{" "}
                                {formatMoney(selectedInvoice.totalAmount)} total
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="p-amount">
                                Amount <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="p-amount"
                                type="number"
                                min={0}
                                step="any"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="19500"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="p-method">
                                Method <span className="text-rose-500">*</span>
                            </Label>
                            <Select
                                value={method}
                                onValueChange={(v) =>
                                    setMethod((v ?? "BKASH") as PaymentMethod)
                                }
                            >
                                <SelectTrigger id="p-method" className="w-full">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_METHOD_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {showTxnField && (
                        <div className="space-y-1.5">
                            <Label htmlFor="p-txn">Transaction ID</Label>
                            <Input
                                id="p-txn"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder={
                                    method === "BKASH" || method === "NAGAD" || method === "ROCKET"
                                        ? "9ABC123XYZ"
                                        : "Reference number"
                                }
                            />
                            <p className="text-[11px] text-slate-500">
                                {paymentMethodLabel(method)} reference (optional).
                            </p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor="p-notes">Notes</Label>
                        <Textarea
                            id="p-notes"
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="June rent..."
                        />
                    </div>

                    {selectedInvoice &&
                        Number(amount) > 0 &&
                        Number(amount) > Number(selectedInvoice.dueAmount) && (
                            <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
                                <strong>Heads up:</strong> Amount exceeds outstanding by{" "}
                                {formatMoney(
                                    Number(amount) - Number(selectedInvoice.dueAmount),
                                )}
                                . The overage will be applied as an advance balance.
                            </div>
                        )}

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
                            disabled={
                                mutation.isPending ||
                                !invoiceId ||
                                !amount ||
                                Number(amount) <= 0
                            }
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Recording...
                                </>
                            ) : (
                                "Record payment"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
