"use client";

// src/components/dashboard/complaints/UpdateComplaintStatusDialog.tsx
//
// Lets the owner move a complaint through its lifecycle and capture a
// resolution note when the work is done.

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { useUpdateComplaint } from "@/src/hooks/useComplaints";
import {
    COMPLAINT_PRIORITY_OPTIONS,
    COMPLAINT_STATUS_OPTIONS,
    type Complaint,
    type ComplaintPriority,
    type ComplaintStatus,
} from "@/src/types/complaint.types";
import { useEffect, useState } from "react";

interface UpdateComplaintStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    complaint: Complaint;
}

export function UpdateComplaintStatusDialog({
    open,
    onOpenChange,
    complaint,
}: UpdateComplaintStatusDialogProps) {
    const mutation = useUpdateComplaint(complaint.id);

    const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
    const [priority, setPriority] = useState<ComplaintPriority>(
        complaint.priority,
    );
    const [resolutionNote, setResolutionNote] = useState(
        complaint.resolutionNote ?? "",
    );

    useEffect(() => {
        if (!open) return;
        setStatus(complaint.status);
        setPriority(complaint.priority);
        setResolutionNote(complaint.resolutionNote ?? "");
    }, [open, complaint]);

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        mutation.mutate(
            {
                status,
                priority,
                ...(resolutionNote.trim() && {
                    resolutionNote: resolutionNote.trim(),
                }),
            },
            { onSuccess: () => onOpenChange(false) },
        );
    }

    const showResolutionField =
        status === "IN_PROGRESS" ||
        status === "RESOLVED" ||
        status === "CLOSED";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-jade-950">
                        Update complaint
                    </DialogTitle>
                    <DialogDescription className="text-ink-soft">
                        Move the complaint forward and document what was done.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Status" htmlFor="c-status" required>
                            <Select
                                value={status}
                                onValueChange={(v) =>
                                    setStatus((v ?? "OPEN") as ComplaintStatus)
                                }
                            >
                                <SelectTrigger
                                    id="c-status"
                                    className={`w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COMPLAINT_STATUS_OPTIONS.map((opt) => (
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

                        <Field label="Priority" htmlFor="c-priority-2" required>
                            <Select
                                value={priority}
                                onValueChange={(v) =>
                                    setPriority(
                                        (v ?? "MEDIUM") as ComplaintPriority,
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="c-priority-2"
                                    className={`w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COMPLAINT_PRIORITY_OPTIONS.map((opt) => (
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

                    {showResolutionField && (
                        <Field
                            label="Resolution note"
                            htmlFor="c-resolution"
                            hint={
                                status === "RESOLVED" || status === "CLOSED"
                                    ? "Describe what was done — required for tracking"
                                    : "Progress update · optional"
                            }
                        >
                            <Textarea
                                id="c-resolution"
                                rows={3}
                                value={resolutionNote}
                                onChange={(e) =>
                                    setResolutionNote(e.target.value)
                                }
                                placeholder="Plumber dispatched, will be fixed by tomorrow."
                                className={`${fieldClass} resize-none`}
                            />
                        </Field>
                    )}

                    <FormActions
                        submitting={mutation.isPending}
                        submitLabel="Save changes"
                        onCancel={() => onOpenChange(false)}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
