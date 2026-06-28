"use client";

import {
    Field,
    FormActions,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
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
import {
    useCreateSubscriptionRequest,
    useSubscriptionPaymentInfo,
} from "@/src/hooks/useSubscriptionRequests";
import type { Plan } from "@/src/types/subscription.types";
import {
    REQUEST_PAYMENT_METHODS,
    type RequestPaymentMethod,
} from "@/src/types/subscriptionRequest.types";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

const fmt = (n: number) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(n);

interface RequestPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: Plan | null;
}

export function RequestPaymentDialog({
    open,
    onOpenChange,
    plan,
}: RequestPaymentDialogProps) {
    const { data: info } = useSubscriptionPaymentInfo();
    const mutation = useCreateSubscriptionRequest();

    const [method, setMethod] = useState<RequestPaymentMethod>("BKASH");
    const [senderNumber, setSenderNumber] = useState("");
    const [transactionId, setTransactionId] = useState("");

    useEffect(() => {
        if (open) {
            setMethod("BKASH");
            setSenderNumber("");
            setTransactionId("");
        }
    }, [open]);

    if (!plan) return null;
    const amount = parseFloat(plan.priceMonthly) || 0;

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        if (!plan) return;
        mutation.mutate(
            {
                targetPlan: plan.plan,
                method,
                senderNumber: senderNumber.trim(),
                transactionId: transactionId.trim(),
            },
            { onSuccess: () => onOpenChange(false) },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-jade-950">
                        Upgrade to {plan.displayName}
                    </DialogTitle>
                    <DialogDescription className="text-ink-soft">
                        Pay manually, then submit your transaction id. An admin
                        verifies and activates your plan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Step 1 — pay */}
                    <div className="rounded-[10px] border border-jade-100 bg-jade-50/60 px-3.5 py-3">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-jade-800">
                            Step 1 · Send Money
                        </p>
                        <div className="mt-1.5 flex items-baseline justify-between">
                            <span className="text-[13px] text-ink">
                                Send{" "}
                                <span className="font-bold text-jade-950 tabular-nums">
                                    {fmt(amount)}
                                </span>{" "}
                                to
                            </span>
                            <span className="font-mono text-[15px] font-bold text-jade-950 tabular-nums">
                                {info?.bkashNumber ?? "…"}
                            </span>
                        </div>
                        <p className="font-bangla mt-1 text-[11px] text-ink-soft/80">
                            উপরের নম্বরে Send Money করুন, তারপর নিচে TrxID দিন।
                        </p>
                    </div>

                    {/* Step 2 — submit proof */}
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                        Step 2 · Submit proof
                    </p>

                    <Field label="Payment method" htmlFor="r-method" required>
                        <Select
                            value={method}
                            onValueChange={(v) =>
                                setMethod((v as RequestPaymentMethod) ?? "BKASH")
                            }
                        >
                            <SelectTrigger
                                id="r-method"
                                className={`w-full ${fieldClass}`}
                            >
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                {REQUEST_PAYMENT_METHODS.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Sender number"
                            htmlFor="r-sender"
                            required
                        >
                            <Input
                                id="r-sender"
                                value={senderNumber}
                                onChange={(e) =>
                                    setSenderNumber(e.target.value)
                                }
                                placeholder="01XXXXXXXXX"
                                required
                                className={`${fieldClass} tabular-nums`}
                            />
                        </Field>
                        <Field
                            label="Transaction ID"
                            htmlFor="r-trx"
                            required
                        >
                            <Input
                                id="r-trx"
                                value={transactionId}
                                onChange={(e) =>
                                    setTransactionId(e.target.value)
                                }
                                placeholder="TrxID"
                                required
                                className={`${fieldClass} uppercase`}
                            />
                        </Field>
                    </div>

                    <div className="flex items-start gap-2 rounded-[10px] border-l-[2.5px] border-coral-500 bg-cream/70 px-3 py-2 text-[12px] text-ink">
                        <Info
                            size={13}
                            className="mt-0.5 shrink-0 text-coral-600"
                        />
                        <span>
                            Your plan activates only after an admin verifies the
                            payment. You&apos;ll keep your current plan until
                            then.
                        </span>
                    </div>

                    <FormActions
                        submitting={mutation.isPending}
                        submitLabel="Submit payment request"
                        onCancel={() => onOpenChange(false)}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
