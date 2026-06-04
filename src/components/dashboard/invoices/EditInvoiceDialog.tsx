"use client";

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
import { Textarea } from "@/src/components/ui/textarea";
import { useUpdateInvoice } from "@/src/hooks/useInvoices";
import type {
    InvoiceDetail,
    InvoiceUtilities,
    UpdateInvoicePayload,
} from "@/src/types/invoice.types";
import { Droplets, Flame, Loader2, Wifi, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface EditInvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoice: InvoiceDetail;
}

interface UtilityRow {
    key: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    value: string;
}

/**
 * Build the editable utility rows from the invoice's current utilities map.
 * Always includes the four common ones (gas/water/electricity/internet),
 * even if absent from the payload — so the user can add them. Any extra
 * custom keys present on the invoice are also shown.
 */
function buildUtilityRows(utilities?: InvoiceUtilities | null): UtilityRow[] {
    const known: { key: string; label: string; icon: UtilityRow["icon"] }[] = [
        { key: "gas", label: "Gas", icon: Flame },
        { key: "water", label: "Water", icon: Droplets },
        { key: "electricity", label: "Electricity", icon: Zap },
        { key: "internet", label: "Internet", icon: Wifi },
    ];

    const rows: UtilityRow[] = known.map(({ key, label, icon }) => ({
        key,
        label,
        icon,
        value:
            utilities && utilities[key] !== undefined
                ? String(utilities[key])
                : "",
    }));

    // Any custom keys not in the known list — show them too.
    if (utilities) {
        for (const [k, v] of Object.entries(utilities)) {
            if (!known.find((x) => x.key === k)) {
                rows.push({
                    key: k,
                    label: k.charAt(0).toUpperCase() + k.slice(1),
                    icon: Zap,
                    value: String(v),
                });
            }
        }
    }
    return rows;
}

export function EditInvoiceDialog({
    open,
    onOpenChange,
    invoice,
}: EditInvoiceDialogProps) {
    const mutation = useUpdateInvoice(invoice.id);

    const initialUtilityRows = useMemo(
        () => buildUtilityRows(invoice.utilities),
        [invoice.utilities],
    );

    const [dueDate, setDueDate] = useState(invoice.dueDate.split("T")[0]);
    const [penaltyAmount, setPenaltyAmount] = useState(invoice.penaltyAmount);
    const [notes, setNotes] = useState(invoice.notes ?? "");
    const [utilityRows, setUtilityRows] =
        useState<UtilityRow[]>(initialUtilityRows);

    // Reset on every open so the dialog reflects the latest server state.
    useEffect(() => {
        if (open) {
            setDueDate(invoice.dueDate.split("T")[0]);
            setPenaltyAmount(invoice.penaltyAmount);
            setNotes(invoice.notes ?? "");
            setUtilityRows(buildUtilityRows(invoice.utilities));
        }
    }, [
        open,
        invoice.dueDate,
        invoice.penaltyAmount,
        invoice.notes,
        invoice.utilities,
    ]);

    // Has the user actually changed any utility field?
    const utilitiesChanged = useMemo(() => {
        if (utilityRows.length !== initialUtilityRows.length) return true;
        return utilityRows.some((r, i) => r.value !== initialUtilityRows[i].value);
    }, [utilityRows, initialUtilityRows]);

    function setUtility(idx: number, value: string) {
        setUtilityRows((rows) =>
            rows.map((r, i) => (i === idx ? { ...r, value } : r)),
        );
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        const payload: UpdateInvoicePayload = {};
        const originalDue = invoice.dueDate.split("T")[0];

        if (dueDate !== originalDue) payload.dueDate = dueDate;

        if (penaltyAmount !== invoice.penaltyAmount) {
            payload.penaltyAmount = Number(penaltyAmount) || 0;
        }

        if (notes.trim() !== (invoice.notes ?? "")) {
            payload.notes = notes.trim() === "" ? null : notes.trim();
        }

        if (utilitiesChanged) {
            // Only include non-empty entries as numbers. Empty values clear out the line.
            const utilities: InvoiceUtilities = {};
            for (const r of utilityRows) {
                if (r.value !== "") {
                    const n = Number(r.value);
                    if (!Number.isNaN(n)) utilities[r.key] = n;
                }
            }
            payload.utilities = utilities;
        }

        // Nothing changed — just close.
        if (Object.keys(payload).length === 0) {
            onOpenChange(false);
            return;
        }

        mutation.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit invoice</DialogTitle>
                    <DialogDescription>
                        Adjust due date, penalty, notes or the utility breakdown.
                        Totals are recomputed automatically when amounts change.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="e-due">Due date</Label>
                            <Input
                                id="e-due"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="e-penalty">Penalty (BDT)</Label>
                            <Input
                                id="e-penalty"
                                type="number"
                                min={0}
                                step="any"
                                value={penaltyAmount}
                                onChange={(e) => setPenaltyAmount(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Utilities — only meaningful for invoices that already had a breakdown,
                        or for invoices where the user wants to set one for the first time. */}
                    <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Utilities breakdown
                            </p>
                            <p className="text-[10.5px] text-slate-500">
                                Leave blank to remove
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {utilityRows.map((row, idx) => {
                                const Icon = row.icon;
                                return (
                                    <div key={row.key} className="space-y-1">
                                        <Label
                                            htmlFor={`e-util-${row.key}`}
                                            className="inline-flex items-center gap-1.5 text-[11px] text-slate-600"
                                        >
                                            <Icon size={11} />
                                            {row.label}
                                        </Label>
                                        <Input
                                            id={`e-util-${row.key}`}
                                            type="number"
                                            min={0}
                                            step="any"
                                            value={row.value}
                                            onChange={(e) =>
                                                setUtility(idx, e.target.value)
                                            }
                                            placeholder="0"
                                            className="h-8"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="e-notes">Notes</Label>
                        <Textarea
                            id="e-notes"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Extended due date, utility breakdown change, etc."
                        />
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
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
