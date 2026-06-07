"use client";

// src/components/dashboard/payments/RecordPaymentDialog.tsx

import {
    Field,
    FormActions,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import { paymentMethodLabel } from "@/src/components/dashboard/payments/paymentStyles";
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
import { Textarea } from "@/src/components/ui/textarea";
import { useInvoices } from "@/src/hooks/useInvoices";
import { useRecordPayment } from "@/src/hooks/usePayments";
import {
    PAYMENT_METHOD_OPTIONS,
    type PaymentMethod,
} from "@/src/types/payment.types";
import { AlertTriangle, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface RecordPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fixedInvoiceId?: string;
}

export function RecordPaymentDialog({
    open,
    onOpenChange,
    fixedInvoiceId,
}: RecordPaymentDialogProps) {
    // Empty string means "all months" — used as the default so the user
    // can scan every outstanding invoice without picking a period first.
    const [billingMonth, setBillingMonth] = useState("");

    const dueFilter = useMemo(
        () => ({
            status: "DUE" as const,
            ...(billingMonth && { billingMonth }),
        }),
        [billingMonth],
    );
    const partialFilter = useMemo(
        () => ({
            status: "PARTIAL" as const,
            ...(billingMonth && { billingMonth }),
        }),
        [billingMonth],
    );

    const { data: dueInvoices } = useInvoices(dueFilter);
    const { data: partialInvoices } = useInvoices(partialFilter);
    const mutation = useRecordPayment();

    const [invoiceId, setInvoiceId] = useState(fixedInvoiceId ?? "");
    const [amount, setAmount] = useState("");
    const [autoFilledAmount, setAutoFilledAmount] = useState(false);
    const [method, setMethod] = useState<PaymentMethod>("BKASH");
    const [transactionId, setTransactionId] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (open) {
            setInvoiceId(fixedInvoiceId ?? "");
            setAmount("");
            setAutoFilledAmount(false);
            setMethod("BKASH");
            setTransactionId("");
            setNotes("");
            setBillingMonth("");
        }
    }, [open, fixedInvoiceId]);

    const outstandingInvoices = useMemo(() => {
        const combined = [...(dueInvoices ?? []), ...(partialInvoices ?? [])];
        const seen = new Set<string>();
        return combined.filter((i) =>
            seen.has(i.id) ? false : (seen.add(i.id), true),
        );
    }, [dueInvoices, partialInvoices]);

    const selectedInvoice = useMemo(
        () => outstandingInvoices.find((i) => i.id === invoiceId),
        [outstandingInvoices, invoiceId],
    );

    // Auto-prefill amount with the outstanding due when invoice is picked
    // and the user hasn't typed anything yet.
    useEffect(() => {
        if (selectedInvoice && (amount === "" || autoFilledAmount)) {
            setAmount(String(selectedInvoice.dueAmount));
            setAutoFilledAmount(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInvoice?.id]);

    function handleAmountChange(value: string) {
        setAmount(value);
        setAutoFilledAmount(false);
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        mutation.mutate(
            {
                invoiceId,
                amount: Number(amount),
                method,
                ...(transactionId.trim() && {
                    transactionId: transactionId.trim(),
                }),
                ...(notes.trim() && { notes: notes.trim() }),
            },
            { onSuccess: () => onOpenChange(false) },
        );
    }

    const showTxnField = method !== "CASH";
    const overage =
        selectedInvoice && Number(amount) > Number(selectedInvoice.dueAmount)
            ? Number(amount) - Number(selectedInvoice.dueAmount)
            : 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-jade-950">
                        Record payment
                    </DialogTitle>
                    <DialogDescription className="text-ink-soft">
                        Apply a payment to an outstanding invoice. The invoice
                        status will update automatically (PARTIAL → PAID).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!fixedInvoiceId && (
                        <Field
                            label="Billing month"
                            htmlFor="p-billing-month"
                            hint="Leave blank to see every outstanding invoice."
                        >
                            <div className="flex gap-2">
                                <Input
                                    id="p-billing-month"
                                    type="month"
                                    value={billingMonth}
                                    onChange={(e) => {
                                        setBillingMonth(e.target.value);
                                        // Clear the picked invoice — it may
                                        // not belong to the new month.
                                        setInvoiceId("");
                                        setAmount("");
                                        setAutoFilledAmount(false);
                                    }}
                                    className={`${fieldClass} tabular-nums`}
                                />
                                {billingMonth && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBillingMonth("");
                                            setInvoiceId("");
                                            setAmount("");
                                            setAutoFilledAmount(false);
                                        }}
                                        className="inline-flex h-8 shrink-0 items-center rounded-md border border-rule-soft bg-paper px-2 text-[12px] text-ink-soft hover:border-jade-700/30 hover:text-jade-900"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </Field>
                    )}

                    <Field label="Invoice" htmlFor="p-invoice" required>
                        <Select
                            value={invoiceId}
                            onValueChange={(v) => setInvoiceId(v ?? "")}
                            disabled={!!fixedInvoiceId}
                        >
                            <SelectTrigger
                                id="p-invoice"
                                className={`w-full ${fieldClass}`}
                            >
                                <SelectValue placeholder="Select an outstanding invoice">
                                    {(value) => {
                                        const i = outstandingInvoices.find(
                                            (x) => x.id === value,
                                        );
                                        return i
                                            ? `${i.invoiceNumber} · ${i.tenant.name}`
                                            : null;
                                    }}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {outstandingInvoices.length === 0 ? (
                                    <div className="px-2 py-2 text-[12px] text-ink-soft">
                                        {billingMonth
                                            ? `No outstanding invoices for ${billingMonth}`
                                            : "No outstanding invoices"}
                                    </div>
                                ) : (
                                    outstandingInvoices.map((i) => (
                                        <SelectItem key={i.id} value={i.id}>
                                            <span className="inline-flex items-center gap-2">
                                                <span className="font-mono text-[11.5px] text-ink">
                                                    {i.invoiceNumber}
                                                </span>
                                                <span className="text-ink-soft">
                                                    · {i.tenant.name}
                                                </span>
                                                <span className="ml-auto font-semibold text-coral-700 tabular-nums">
                                                    {formatMoney(i.dueAmount)}
                                                </span>
                                            </span>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </Field>

                    {/* Selected-invoice summary — confirms what user picked */}
                    {selectedInvoice && (
                        <div className="flex items-center justify-between gap-3 rounded-[10px] border border-jade-100 bg-jade-50/60 px-3 py-2 text-[12px]">
                            <div className="flex items-center gap-2 min-w-0">
                                <Sparkles
                                    size={12}
                                    className="shrink-0 text-jade-700"
                                />
                                <span className="truncate text-ink">
                                    Outstanding on{" "}
                                    <span className="font-mono font-semibold text-jade-900">
                                        {selectedInvoice.invoiceNumber}
                                    </span>
                                </span>
                            </div>
                            <span className="shrink-0 text-ink-soft tabular-nums">
                                <span className="font-bold text-coral-700">
                                    {formatMoney(selectedInvoice.dueAmount)}
                                </span>
                                {" "}of{" "}
                                <span className="font-semibold text-ink">
                                    {formatMoney(selectedInvoice.totalAmount)}
                                </span>
                            </span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Amount"
                            htmlFor="p-amount"
                            required
                            hint={
                                autoFilledAmount && selectedInvoice
                                    ? "Filled from outstanding"
                                    : "BDT"
                            }
                        >
                            <MoneyInput
                                id="p-amount"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="19,500"
                                required
                                hinted={autoFilledAmount}
                            />
                        </Field>
                        <Field label="Method" htmlFor="p-method" required>
                            <Select
                                value={method}
                                onValueChange={(v) =>
                                    setMethod((v ?? "BKASH") as PaymentMethod)
                                }
                            >
                                <SelectTrigger
                                    id="p-method"
                                    className={`w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_METHOD_OPTIONS.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    {showTxnField && (
                        <Field
                            label="Transaction ID"
                            htmlFor="p-txn"
                            hint={`${paymentMethodLabel(method)} reference · optional`}
                        >
                            <Input
                                id="p-txn"
                                value={transactionId}
                                onChange={(e) =>
                                    setTransactionId(e.target.value)
                                }
                                placeholder={
                                    method === "BKASH" ||
                                    method === "NAGAD" ||
                                    method === "ROCKET"
                                        ? "9ABC123XYZ"
                                        : "Reference number"
                                }
                                className={`${fieldClass} font-mono tabular-nums`}
                            />
                        </Field>
                    )}

                    <Field label="Notes" htmlFor="p-notes">
                        <Textarea
                            id="p-notes"
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="June rent…"
                            className={`${fieldClass} resize-none`}
                        />
                    </Field>

                    {/* Overage warning */}
                    {overage > 0 && (
                        <div className="flex items-start gap-2 rounded-[10px] border border-coral-100 bg-coral-50/70 px-3 py-2 text-[12.5px] text-coral-700">
                            <AlertTriangle
                                size={13}
                                className="mt-0.5 shrink-0"
                            />
                            <span>
                                Amount exceeds outstanding by{" "}
                                <strong className="tabular-nums">
                                    {formatMoney(overage)}
                                </strong>
                                . The overage will be applied as an advance
                                balance.
                            </span>
                        </div>
                    )}

                    <FormActions
                        submitting={mutation.isPending}
                        submitLabel="Record payment"
                        onCancel={() => onOpenChange(false)}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}

function MoneyInput({
    id,
    value,
    onChange,
    placeholder,
    required,
    hinted,
}: {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    required?: boolean;
    hinted?: boolean;
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
                required={required}
                className={`${fieldClass} pl-7 tabular-nums ${
                    hinted ? "text-ink/75" : ""
                }`}
            />
        </div>
    );
}