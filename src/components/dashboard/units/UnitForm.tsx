"use client";

import { Button } from "@/src/components/ui/button";
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
import { useBuildings } from "@/src/hooks/useBuildings";
import { useFloorsByBuilding } from "@/src/hooks/useFloors";
import {
    UNIT_STATUS_OPTIONS,
    UNIT_TYPE_OPTIONS,
    type CreateUnitPayload,
    type UnitStatus,
    type UnitType,
} from "@/src/types/unit.types";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export interface UnitFormValues {
    buildingId: string;
    floorId: string;
    name: string;
    type: UnitType;
    status: UnitStatus;
    bedrooms: string;
    bathrooms: string;
    sizeSqft: string;
    baseRent: string;
    serviceCharge: string;
    description: string;
}

const emptyForm: UnitFormValues = {
    buildingId: "",
    floorId: "",
    name: "",
    type: "FLAT",
    status: "VACANT",
    bedrooms: "",
    bathrooms: "",
    sizeSqft: "",
    baseRent: "",
    serviceCharge: "",
    description: "",
};

export interface UnitFormSubmitPayload {
    create: CreateUnitPayload; // full payload when creating
    update: Partial<CreateUnitPayload> & { status?: UnitStatus }; // diff-friendly for PATCH
}

interface UnitFormProps {
    mode: "create" | "edit";
    /** When provided, the buildingId is fixed and not editable. */
    fixedBuildingId?: string;
    /** When provided in create mode, pre-select the floor. */
    fixedFloorId?: string;
    defaultValues?: Partial<UnitFormValues>;
    submitting: boolean;
    submitLabel: string;
    onSubmit: (values: UnitFormValues) => void;
    onCancel?: () => void;
}

export function UnitForm({
    mode,
    fixedBuildingId,
    fixedFloorId,
    defaultValues,
    submitting,
    submitLabel,
    onSubmit,
    onCancel,
}: UnitFormProps) {
    const [values, setValues] = useState<UnitFormValues>({
        ...emptyForm,
        ...(fixedBuildingId && { buildingId: fixedBuildingId }),
        ...(fixedFloorId && { floorId: fixedFloorId }),
        ...defaultValues,
    });

    // Re-hydrate when defaultValues change (e.g. async query load)
    useEffect(() => {
        if (defaultValues) {
            setValues((prev) => ({ ...prev, ...defaultValues }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)]);

    const showBuildingSelect = !fixedBuildingId && mode === "create";

    // Buildings list (only when needed)
    const { data: buildings } = useBuildings();

    // Floors are scoped to the selected building.
    const effectiveBuildingId = values.buildingId;
    const { data: floors } = useFloorsByBuilding(
        effectiveBuildingId || undefined,
    );

    const sortedFloors = useMemo(
        () => (floors ? [...floors].sort((a, b) => a.floorNumber - b.floorNumber) : []),
        [floors],
    );

    // Reset floorId if it doesn't belong to the selected building.
    useEffect(() => {
        if (!floors) return;
        if (values.floorId && !floors.some((f) => f.id === values.floorId)) {
            setValues((v) => ({ ...v, floorId: "" }));
        }
    }, [floors, values.floorId]);

    function set<K extends keyof UnitFormValues>(key: K, value: UnitFormValues[K]) {
        setValues((v) => ({ ...v, [key]: value }));
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        onSubmit(values);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Building + Floor */}
            {(showBuildingSelect || mode === "create") && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {showBuildingSelect && (
                        <div className="space-y-1.5">
                            <Label htmlFor="buildingId">
                                Building <span className="text-rose-500">*</span>
                            </Label>
                            <Select
                                value={values.buildingId}
                                onValueChange={(v) => set("buildingId", v ?? "")}
                            >
                                <SelectTrigger id="buildingId" className="w-full">
                                    <SelectValue placeholder="Select building">
                                        {(value) =>
                                            buildings?.find((b) => b.id === value)?.name ?? null
                                        }
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {buildings?.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className={`space-y-1.5 ${showBuildingSelect ? "" : "sm:col-span-2"}`}>
                        <Label htmlFor="floorId">
                            Floor <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                            value={values.floorId}
                            onValueChange={(v) => set("floorId", v ?? "")}
                            disabled={!effectiveBuildingId || sortedFloors.length === 0}
                        >
                            <SelectTrigger id="floorId" className="w-full">
                                <SelectValue
                                    placeholder={
                                        !effectiveBuildingId
                                            ? "Select a building first"
                                            : sortedFloors.length === 0
                                              ? "No floors available"
                                              : "Select floor"
                                    }
                                >
                                    {(value) => {
                                        const f = sortedFloors.find(
                                            (fl) => fl.id === value,
                                        );
                                        if (!f) return null;
                                        return `${f.floorNumber === 0 ? "G" : f.floorNumber} — ${f.name}`;
                                    }}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {sortedFloors.map((f) => {
                                    const floorLabel = `${f.floorNumber === 0 ? "G" : f.floorNumber} — ${f.name}`;
                                    return (
                                        <SelectItem key={f.id} value={f.id}>
                                            {floorLabel}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Name + Type + Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5 sm:col-span-1">
                    <Label htmlFor="unit-name">
                        Unit name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="unit-name"
                        value={values.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="3A"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="unit-type">
                        Type <span className="text-rose-500">*</span>
                    </Label>
                    <Select
                        value={values.type}
                        onValueChange={(v) => set("type", v as UnitType)}
                    >
                        <SelectTrigger id="unit-type" className="w-full">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {UNIT_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {mode === "edit" && (
                    <div className="space-y-1.5">
                        <Label htmlFor="unit-status">Status</Label>
                        <Select
                            value={values.status}
                            onValueChange={(v) => set("status", v as UnitStatus)}
                        >
                            <SelectTrigger id="unit-status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {UNIT_STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Bedrooms / Bathrooms / Size */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                        id="bedrooms"
                        type="number"
                        min={0}
                        value={values.bedrooms}
                        onChange={(e) => set("bedrooms", e.target.value)}
                        placeholder="3"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                        id="bathrooms"
                        type="number"
                        min={0}
                        value={values.bathrooms}
                        onChange={(e) => set("bathrooms", e.target.value)}
                        placeholder="2"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="sizeSqft">Size (sqft)</Label>
                    <Input
                        id="sizeSqft"
                        type="number"
                        min={0}
                        value={values.sizeSqft}
                        onChange={(e) => set("sizeSqft", e.target.value)}
                        placeholder="1200"
                    />
                </div>
            </div>

            {/* Rent / Service charge */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="baseRent">
                        Base rent (BDT/month) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="baseRent"
                        type="number"
                        min={0}
                        step="any"
                        value={values.baseRent}
                        onChange={(e) => set("baseRent", e.target.value)}
                        placeholder="18000"
                        required
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="serviceCharge">
                        Service charge (BDT/month) 
                    </Label>
                    <Input
                        id="serviceCharge"
                        type="number"
                        min={0}
                        step="any"
                        value={values.serviceCharge}
                        onChange={(e) => set("serviceCharge", e.target.value)}
                        placeholder="1500"
                        
                    />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
                <Label htmlFor="unit-description">Description</Label>
                <Textarea
                    id="unit-description"
                    rows={3}
                    value={values.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="3 bedroom flat with balcony, southern exposure..."
                />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={submitting}>
                    {submitting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Saving...
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </div>
        </form>
    );
}

/**
 * Build a CreateUnitPayload from form values.
 * Trims strings, parses numbers, omits empty optional fields.
 */
export function buildCreatePayload(values: UnitFormValues): CreateUnitPayload {
    return {
        buildingId: values.buildingId,
        floorId: values.floorId,
        name: values.name.trim(),
        type: values.type,
        baseRent: Number(values.baseRent),
        serviceCharge: Number(values.serviceCharge),
        ...(values.bedrooms !== "" && { bedrooms: Number(values.bedrooms) }),
        ...(values.bathrooms !== "" && { bathrooms: Number(values.bathrooms) }),
        ...(values.sizeSqft !== "" && { sizeSqft: Number(values.sizeSqft) }),
        ...(values.description.trim() && {
            description: values.description.trim(),
        }),
    };
}
