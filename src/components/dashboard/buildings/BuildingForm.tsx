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
import {
    BUILDING_TYPE_OPTIONS,
    type BuildingType,
    type CreateBuildingPayload,
} from "@/src/types/building.types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface BuildingFormValues {
    name: string;
    type: BuildingType;
    address: string;
    city: string;
    area: string;
    totalFloors: number;
    description: string;
    imageUrl: string;
}

export const emptyBuildingForm: BuildingFormValues = {
    name: "",
    type: "RESIDENTIAL",
    address: "",
    city: "",
    area: "",
    totalFloors: 1,
    description: "",
    imageUrl: "",
};

interface BuildingFormProps {
    defaultValues?: Partial<BuildingFormValues>;
    submitting: boolean;
    submitLabel: string;
    onSubmit: (payload: CreateBuildingPayload) => void;
    onCancel?: () => void;
}

export function BuildingForm({
    defaultValues,
    submitting,
    submitLabel,
    onSubmit,
    onCancel,
}: BuildingFormProps) {
    const [values, setValues] = useState<BuildingFormValues>({
        ...emptyBuildingForm,
        ...defaultValues,
    });

    // Re-hydrate if defaultValues change (e.g. detail page query loaded after mount)
    useEffect(() => {
        if (defaultValues) {
            setValues((prev) => ({ ...prev, ...defaultValues }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)]);

    function set<K extends keyof BuildingFormValues>(key: K, value: BuildingFormValues[K]) {
        setValues((v) => ({ ...v, [key]: value }));
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        const payload: CreateBuildingPayload = {
            name: values.name.trim(),
            type: values.type,
            address: values.address.trim(),
            city: values.city.trim(),
            totalFloors: Number(values.totalFloors) || 1,
            ...(values.area.trim() && { area: values.area.trim() }),
            ...(values.description.trim() && { description: values.description.trim() }),
            ...(values.imageUrl.trim() && { imageUrl: values.imageUrl.trim() }),
        };

        onSubmit(payload);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="name">
                        Building name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        value={values.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Lalmatia Block A"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="type">
                        Type <span className="text-rose-500">*</span>
                    </Label>
                    <Select
                        value={values.type}
                        onValueChange={(v) => set("type", v as BuildingType)}
                    >
                        <SelectTrigger id="type" className="w-full">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {BUILDING_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="totalFloors">
                        Total floors <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="totalFloors"
                        type="number"
                        min={1}
                        value={values.totalFloors}
                        onChange={(e) => set("totalFloors", Number(e.target.value))}
                        required
                    />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="address">
                        Address <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="address"
                        value={values.address}
                        onChange={(e) => set("address", e.target.value)}
                        placeholder="House 12, Road 5, Lalmatia, Dhaka"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="city">
                        City <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="city"
                        value={values.city}
                        onChange={(e) => set("city", e.target.value)}
                        placeholder="Dhaka"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="area">Area</Label>
                    <Input
                        id="area"
                        value={values.area}
                        onChange={(e) => set("area", e.target.value)}
                        placeholder="Lalmatia"
                    />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                        id="imageUrl"
                        type="url"
                        value={values.imageUrl}
                        onChange={(e) => set("imageUrl", e.target.value)}
                        placeholder="https://example.com/building.png"
                    />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        rows={3}
                        value={values.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="5-storey residential building"
                    />
                </div>
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
