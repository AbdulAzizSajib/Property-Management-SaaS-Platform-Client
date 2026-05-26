"use client";

// src/components/dashboard/complaints/CreateComplaintDialog.tsx

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
import { Textarea } from "@/src/components/ui/textarea";
import { useBuildings } from "@/src/hooks/useBuildings";
import { useCreateComplaint } from "@/src/hooks/useComplaints";
import { useUnits } from "@/src/hooks/useUnits";
import {
    COMPLAINT_CATEGORY_OPTIONS,
    COMPLAINT_PRIORITY_OPTIONS,
    type ComplaintCategory,
    type ComplaintPriority,
} from "@/src/types/complaint.types";
import { useEffect, useState } from "react";

const NO_BUILDING = "__NONE__";
const NO_UNIT = "__NONE__";

interface CreateComplaintDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultBuildingId?: string;
    defaultUnitId?: string;
}

export function CreateComplaintDialog({
    open,
    onOpenChange,
    defaultBuildingId,
    defaultUnitId,
}: CreateComplaintDialogProps) {
    const { data: buildings } = useBuildings();
    const mutation = useCreateComplaint();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<ComplaintCategory>("PLUMBING");
    const [priority, setPriority] = useState<ComplaintPriority>("MEDIUM");
    const [buildingId, setBuildingId] = useState<string>(NO_BUILDING);
    const [unitId, setUnitId] = useState<string>(NO_UNIT);

    const { data: unitsInBuilding } = useUnits(
        buildingId !== NO_BUILDING ? { buildingId } : undefined,
    );

    useEffect(() => {
        if (!open) return;
        setTitle("");
        setDescription("");
        setCategory("PLUMBING");
        setPriority("MEDIUM");
        setBuildingId(defaultBuildingId ?? NO_BUILDING);
        setUnitId(defaultUnitId ?? NO_UNIT);
    }, [open, defaultBuildingId, defaultUnitId]);

    // Clear unit when building changes
    useEffect(() => {
        if (buildingId === NO_BUILDING) {
            setUnitId(NO_UNIT);
        }
    }, [buildingId]);

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        const payload = {
            title: title.trim(),
            description: description.trim(),
            category,
            priority,
            ...(buildingId !== NO_BUILDING && { buildingId }),
            ...(unitId !== NO_UNIT && { unitId }),
        };

        mutation.mutate(payload, {
            onSuccess: () => onOpenChange(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-jade-950">
                        File a complaint
                    </DialogTitle>
                    <DialogDescription className="text-ink-soft">
                        Log a maintenance issue, hazard, or service request so
                        it can be tracked through to resolution.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field label="Title" htmlFor="c-title" required>
                        <Input
                            id="c-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Water leakage in bathroom"
                            required
                            className={fieldClass}
                        />
                    </Field>

                    <Field
                        label="Description"
                        htmlFor="c-description"
                        required
                        hint="What happened, when, and how severe?"
                    >
                        <Textarea
                            id="c-description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="The ceiling is leaking whenever it rains. Started 3 days ago…"
                            required
                            className={`${fieldClass} resize-none`}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category" htmlFor="c-category" required>
                            <Select
                                value={category}
                                onValueChange={(v) =>
                                    setCategory(
                                        (v ?? "PLUMBING") as ComplaintCategory,
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="c-category"
                                    className={`w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COMPLAINT_CATEGORY_OPTIONS.map((opt) => (
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

                        <Field label="Priority" htmlFor="c-priority" required>
                            <Select
                                value={priority}
                                onValueChange={(v) =>
                                    setPriority(
                                        (v ?? "MEDIUM") as ComplaintPriority,
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="c-priority"
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

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Building" htmlFor="c-building">
                            <Select
                                value={buildingId}
                                onValueChange={(v) =>
                                    setBuildingId(v ?? NO_BUILDING)
                                }
                            >
                                <SelectTrigger
                                    id="c-building"
                                    className={`w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="No building" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={NO_BUILDING}>
                                        <span className="text-ink-soft">
                                            None
                                        </span>
                                    </SelectItem>
                                    {(buildings ?? []).map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Unit" htmlFor="c-unit">
                            <Select
                                value={unitId}
                                onValueChange={(v) => setUnitId(v ?? NO_UNIT)}
                                disabled={buildingId === NO_BUILDING}
                            >
                                <SelectTrigger
                                    id="c-unit"
                                    className={`w-full ${fieldClass}`}
                                >
                                    <SelectValue
                                        placeholder={
                                            buildingId === NO_BUILDING
                                                ? "Pick a building first"
                                                : "No unit"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={NO_UNIT}>
                                        <span className="text-ink-soft">
                                            None
                                        </span>
                                    </SelectItem>
                                    {(unitsInBuilding ?? []).map((u) => (
                                        <SelectItem key={u.id} value={u.id}>
                                            Unit {u.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <FormActions
                        submitting={mutation.isPending}
                        submitLabel="File complaint"
                        onCancel={() => onOpenChange(false)}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
