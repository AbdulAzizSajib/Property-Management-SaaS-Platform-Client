"use client";

// src/components/dashboard/complaints/AssignComplaintDialog.tsx
//
// Assigns a complaint to a user. For now we surface caretakers attached
// to the owner's buildings as the picker pool — that covers the common
// case ("send this to the building caretaker"). A free-text User ID
// fallback supports anyone else (managers, vendors) until a dedicated
// staff picker exists.

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
import { useBuildings } from "@/src/hooks/useBuildings";
import { useAssignComplaint } from "@/src/hooks/useComplaints";
import type { Complaint } from "@/src/types/complaint.types";
import { useEffect, useMemo, useState } from "react";

const MANUAL = "__MANUAL__";

interface AssignComplaintDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    complaint: Complaint;
}

export function AssignComplaintDialog({
    open,
    onOpenChange,
    complaint,
}: AssignComplaintDialogProps) {
    const { data: buildings } = useBuildings();
    const mutation = useAssignComplaint(complaint.id);

    // Build a deduped list of caretakers from all buildings
    const assignees = useMemo(() => {
        const map = new Map<
            string,
            { id: string; name: string; building: string }
        >();
        for (const b of buildings ?? []) {
            if (b.caretaker) {
                if (!map.has(b.caretaker.id)) {
                    map.set(b.caretaker.id, {
                        id: b.caretaker.id,
                        name: b.caretaker.name,
                        building: b.name,
                    });
                }
            }
        }
        return [...map.values()];
    }, [buildings]);

    const [selected, setSelected] = useState<string>(
        complaint.assignedToId ?? "",
    );
    const [manualId, setManualId] = useState("");

    useEffect(() => {
        if (!open) return;
        setSelected(complaint.assignedToId ?? "");
        setManualId("");
    }, [open, complaint.assignedToId]);

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        const assignedToId =
            selected === MANUAL ? manualId.trim() : selected;

        if (!assignedToId) return;

        mutation.mutate(
            { assignedToId },
            { onSuccess: () => onOpenChange(false) },
        );
    }

    const submitDisabled =
        selected === ""
            ? true
            : selected === MANUAL
                ? manualId.trim() === ""
                : false;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-jade-950">
                        Assign complaint
                    </DialogTitle>
                    <DialogDescription className="text-ink-soft">
                        Hand this off to a caretaker or other staff member so
                        they can follow up.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field
                        label="Assignee"
                        htmlFor="c-assignee"
                        required
                        hint={
                            assignees.length === 0
                                ? "No caretakers found — use a manual User ID below"
                                : "Caretakers attached to your buildings"
                        }
                    >
                        <Select
                            value={selected}
                            onValueChange={(v) => setSelected(v ?? "")}
                        >
                            <SelectTrigger
                                id="c-assignee"
                                className={`w-full ${fieldClass}`}
                            >
                                <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                {assignees.map((a) => (
                                    <SelectItem key={a.id} value={a.id}>
                                        <span className="inline-flex items-center gap-2">
                                            <span className="font-medium text-ink">
                                                {a.name}
                                            </span>
                                            <span className="text-[11px] text-ink-soft">
                                                · {a.building}
                                            </span>
                                        </span>
                                    </SelectItem>
                                ))}
                                <SelectItem value={MANUAL}>
                                    <span className="text-ink-soft">
                                        Enter user ID manually…
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    {selected === MANUAL && (
                        <Field
                            label="User ID"
                            htmlFor="c-manual-id"
                            required
                            hint="Paste the user ID for the manager / staff member"
                        >
                            <Input
                                id="c-manual-id"
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value)}
                                placeholder="whq3YROhwrB5If6OhXkMo5SxSsh50lD5"
                                required
                                className={`${fieldClass} font-mono tabular-nums`}
                            />
                        </Field>
                    )}

                    <FormActions
                        submitting={mutation.isPending || submitDisabled}
                        submitLabel="Assign"
                        onCancel={() => onOpenChange(false)}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
