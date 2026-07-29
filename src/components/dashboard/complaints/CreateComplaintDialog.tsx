"use client";

// src/components/dashboard/complaints/CreateComplaintDialog.tsx

import {
    Field,
    FormActions,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import {
    BuildingFloorUnitSelect,
    type BuildingFloorUnitValue,
} from "@/src/components/dashboard/forms/BuildingFloorUnitSelect";
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
import { useCreateComplaint } from "@/src/hooks/useComplaints";
import {
    COMPLAINT_CATEGORY_OPTIONS,
    COMPLAINT_PRIORITY_OPTIONS,
    type ComplaintCategory,
    type ComplaintPriority,
} from "@/src/types/complaint.types";
import { useEffect, useState } from "react";

const EMPTY_LOCATION: BuildingFloorUnitValue = {
    buildingId: "",
    floorId: "",
    unitId: "",
};

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
    const mutation = useCreateComplaint();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<ComplaintCategory>("PLUMBING");
    const [priority, setPriority] = useState<ComplaintPriority>("MEDIUM");
    const [location, setLocation] = useState<BuildingFloorUnitValue>(EMPTY_LOCATION);

    useEffect(() => {
        if (!open) return;
        setTitle("");
        setDescription("");
        setCategory("PLUMBING");
        setPriority("MEDIUM");
        setLocation({
            buildingId: defaultBuildingId ?? "",
            floorId: "",
            unitId: defaultUnitId ?? "",
        });
    }, [open, defaultBuildingId, defaultUnitId]);

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        const payload = {
            title: title.trim(),
            description: description.trim(),
            category,
            priority,
            ...(location.buildingId && { buildingId: location.buildingId }),
            ...(location.unitId && { unitId: location.unitId }),
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

                    <div className="space-y-1.5">
                        <p className="text-[12.5px] font-semibold text-ink">
                            Building / floor / unit
                        </p>
                        <BuildingFloorUnitSelect
                            value={location}
                            onChange={setLocation}
                            idPrefix="c"
                        />
                        <p className="text-[11.5px] text-ink-soft/85">
                            Where the issue is — all optional. Floor only
                            narrows the unit list.
                        </p>
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
