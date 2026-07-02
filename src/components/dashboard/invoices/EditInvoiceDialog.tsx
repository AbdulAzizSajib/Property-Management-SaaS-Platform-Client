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
    UpdateInvoicePayload,
} from "@/src/types/invoice.types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EditInvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoice: InvoiceDetail;
}

export function EditInvoiceDialog({
    open,
    onOpenChange,
    invoice,
}: EditInvoiceDialogProps) {
    const mutation = useUpdateInvoice(invoice.id);

    const [dueDate, setDueDate] = useState(invoice.dueDate.split("T")[0]);
    const [notes, setNotes] = useState(invoice.notes ?? "");

    // Reset on every open so the dialog reflects the latest server state.
    useEffect(() => {
        if (open) {
            setDueDate(invoice.dueDate.split("T")[0]);
            setNotes(invoice.notes ?? "");
        }
    }, [open, invoice.dueDate, invoice.notes]);

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        const payload: UpdateInvoicePayload = {};
        const originalDue = invoice.dueDate.split("T")[0];

        if (dueDate !== originalDue) payload.dueDate = dueDate;

        if (notes.trim() !== (invoice.notes ?? "")) {
            payload.notes = notes.trim() === "" ? null : notes.trim();
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
                        Adjust the due date or notes for this invoice.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <Label htmlFor="e-notes">Notes</Label>
                        <Textarea
                            id="e-notes"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Extended due date, special arrangement, etc."
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
