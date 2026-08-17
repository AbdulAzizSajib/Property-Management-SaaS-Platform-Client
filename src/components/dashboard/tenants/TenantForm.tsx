"use client";

import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
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
import { useUnits } from "@/src/hooks/useUnits";
import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface TenantFormValues {
    name: string;
    phone: string;
    email: string;
    nidNumber: string;
    occupation: string;
    emergencyContact: string;
    emergencyName: string;
    permanentAddress: string;
    // Assigned location — buildingId is required, floor/unit optional.
    buildingId: string;
    floorId: string;
    unitId: string;
    photoUrl: string;
    // Create-only: uploaded photo file (sent as multipart `photo`).
    photoFile: File | null;
    // Create-only:
    createLoginAccount: boolean;
    password: string;
}

const emptyForm: TenantFormValues = {
    name: "",
    phone: "",
    email: "",
    nidNumber: "",
    occupation: "",
    emergencyContact: "",
    emergencyName: "",
    permanentAddress: "",
    buildingId: "",
    floorId: "",
    unitId: "",
    photoUrl: "",
    photoFile: null,
    createLoginAccount: false,
    password: "",
};

interface TenantFormProps {
    mode: "create" | "edit";
    defaultValues?: Partial<TenantFormValues>;
    // Edit mode: the tenant's current floor/unit names, used as a display
    // fallback since an occupied unit won't appear in the vacant-only lists.
    currentFloorName?: string | null;
    currentUnitName?: string | null;
    submitting: boolean;
    submitLabel: string;
    onSubmit: (values: TenantFormValues) => void;
    onCancel?: () => void;
}

export function TenantForm({
    mode,
    defaultValues,
    currentFloorName,
    currentUnitName,
    submitting,
    submitLabel,
    onSubmit,
    onCancel,
}: TenantFormProps) {
    const [values, setValues] = useState<TenantFormValues>({
        ...emptyForm,
        ...defaultValues,
    });
    const photoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (defaultValues) {
            setValues((prev) => ({ ...prev, ...defaultValues }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)]);

    function set<K extends keyof TenantFormValues>(
        key: K,
        value: TenantFormValues[K],
    ) {
        setValues((v) => ({ ...v, [key]: value }));
    }

    // ── Location cascade: Building → Floor → Unit ──────────────────────
    const { data: buildings } = useBuildings();
    const { data: floors } = useFloorsByBuilding(values.buildingId || undefined);
    // Vacant units in the chosen building (and floor, if picked). Falls back to
    // all vacant units in the building until a floor is selected.
    const { data: units } = useUnits(
        values.buildingId
            ? {
                  buildingId: values.buildingId,
                  ...(values.floorId ? { floorId: values.floorId } : {}),
                  status: "VACANT",
              }
            : undefined,
    );

    // Changing the building invalidates the floor/unit picked under the old one.
    function handleBuildingChange(id: string) {
        setValues((v) => ({ ...v, buildingId: id, floorId: "", unitId: "" }));
    }
    // Changing the floor invalidates the unit picked under the old one.
    function handleFloorChange(id: string) {
        setValues((v) => ({ ...v, floorId: id, unitId: "" }));
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        onSubmit(values);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identity */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Identity
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="t-name">
                            Full name <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="t-name"
                            value={values.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="Rahim Uddin"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-phone">Phone</Label>
                        <Input
                            id="t-phone"
                            type="tel"
                            value={values.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            placeholder="01711000333"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-email">Email</Label>
                        <Input
                            id="t-email"
                            type="email"
                            value={values.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder="rahim@example.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-nid">NID number</Label>
                        <Input
                            id="t-nid"
                            value={values.nidNumber}
                            onChange={(e) => set("nidNumber", e.target.value)}
                            placeholder="1234567890"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-occupation">Occupation</Label>
                        <Input
                            id="t-occupation"
                            value={values.occupation}
                            onChange={(e) => set("occupation", e.target.value)}
                            placeholder="Software Engineer"
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="t-photo">Photo</Label>
                        {!values.photoFile ? (
                            <label
                                htmlFor="t-photo"
                                className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition-colors hover:border-slate-400 hover:bg-slate-100"
                            >
                                {mode === "edit" && values.photoUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={values.photoUrl}
                                        alt="Current tenant photo"
                                        className="size-10 shrink-0 rounded-md object-cover"
                                    />
                                ) : (
                                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                        <Upload size={16} className="text-slate-500" />
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-slate-700">
                                        {mode === "edit" && values.photoUrl
                                            ? "Click to replace photo"
                                            : "Click to select a photo"}
                                    </p>
                                    <p className="text-[11.5px] text-slate-500">
                                        JPG or PNG · up to 5 MB
                                    </p>
                                </div>
                                <input
                                    id="t-photo"
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        set("photoFile", e.target.files?.[0] ?? null)
                                    }
                                    className="sr-only"
                                />
                            </label>
                        ) : (
                            <div className="flex items-center gap-3 rounded-[10px] border border-slate-200 bg-white px-3 py-2.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={URL.createObjectURL(values.photoFile)}
                                    alt="Tenant photo preview"
                                    className="size-10 shrink-0 rounded-md object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-semibold text-slate-800">
                                        {values.photoFile.name}
                                    </p>
                                    <p className="text-[11.5px] text-slate-500 tabular-nums">
                                        {(values.photoFile.size / 1024).toFixed(0)} KB
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        set("photoFile", null);
                                        if (photoInputRef.current)
                                            photoInputRef.current.value = "";
                                    }}
                                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-600"
                                    aria-label="Remove photo"
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Location — which building/floor/unit this tenant belongs to */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Location
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="t-building">
                            Building <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                            value={values.buildingId}
                            onValueChange={(v) => handleBuildingChange(v ?? "")}
                        >
                            <SelectTrigger id="t-building" className="w-full">
                                <SelectValue placeholder="Select building">
                                    {(value) =>
                                        (buildings ?? []).find(
                                            (b) => b.id === value,
                                        )?.name ?? null
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {(buildings ?? []).length === 0 ? (
                                    <div className="px-2 py-2 text-[12px] text-slate-500">
                                        No buildings
                                    </div>
                                ) : (
                                    (buildings ?? []).map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            {b.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {/* Native required-field guard: keeps the form from
                            submitting without a building even though the visible
                            control is a custom Select. */}
                        <input
                            tabIndex={-1}
                            aria-hidden
                            className="sr-only"
                            required
                            value={values.buildingId}
                            onChange={() => {}}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-floor">
                            Floor{" "}
                            <span className="text-[11px] font-normal text-slate-400">
                                (optional)
                            </span>
                        </Label>
                        <Select
                            value={values.floorId}
                            onValueChange={(v) => handleFloorChange(v ?? "")}
                            disabled={!values.buildingId}
                        >
                            <SelectTrigger id="t-floor" className="w-full">
                                <SelectValue
                                    placeholder={
                                        values.buildingId
                                            ? "Select floor"
                                            : "Select a building first"
                                    }
                                >
                                    {(value) =>
                                        (floors ?? []).find(
                                            (f) => f.id === value,
                                        )?.name ??
                                        currentFloorName ??
                                        null
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {(floors ?? []).length === 0 ? (
                                    <div className="px-2 py-2 text-[12px] text-slate-500">
                                        No floors
                                    </div>
                                ) : (
                                    (floors ?? []).map((f) => (
                                        <SelectItem key={f.id} value={f.id}>
                                            {f.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-unit">
                            Unit{" "}
                            <span className="text-[11px] font-normal text-slate-400">
                                (optional)
                            </span>
                        </Label>
                        <Select
                            value={values.unitId}
                            onValueChange={(v) => set("unitId", v ?? "")}
                            disabled={!values.buildingId}
                        >
                            <SelectTrigger id="t-unit" className="w-full">
                                <SelectValue
                                    placeholder={
                                        values.buildingId
                                            ? "Select vacant unit"
                                            : "Select a building first"
                                    }
                                >
                                    {(value) =>
                                        (units ?? []).find(
                                            (u) => u.id === value,
                                        )?.name ??
                                        currentUnitName ??
                                        null
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {(units ?? []).length === 0 ? (
                                    <div className="px-2 py-2 text-[12px] text-slate-500">
                                        No vacant units
                                    </div>
                                ) : (
                                    (units ?? []).map((u) => (
                                        <SelectItem key={u.id} value={u.id}>
                                            {u.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <p className="text-[11.5px] text-slate-500">
                    Building tells us where this tenant belongs. Floor and unit are
                    optional — the actual unit is confirmed when you create their
                    lease.
                </p>
            </div>

            {/* Emergency contact */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Emergency contact
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="t-em-name">Name</Label>
                        <Input
                            id="t-em-name"
                            value={values.emergencyName}
                            onChange={(e) => set("emergencyName", e.target.value)}
                            placeholder="Karim Uddin"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-em-phone">Phone</Label>
                        <Input
                            id="t-em-phone"
                            type="tel"
                            value={values.emergencyContact}
                            onChange={(e) => set("emergencyContact", e.target.value)}
                            placeholder="01711000444"
                        />
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Address
                </h3>
                <div className="space-y-1.5">
                    <Label htmlFor="t-address">Permanent address</Label>
                    <Textarea
                        id="t-address"
                        rows={2}
                        value={values.permanentAddress}
                        onChange={(e) => set("permanentAddress", e.target.value)}
                        placeholder="Lalmatia, Dhaka"
                    />
                </div>
            </div>

            {/* Login account (create-only) */}
            {mode === "create" && (
                <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                        <Checkbox
                            checked={values.createLoginAccount}
                            onCheckedChange={(checked) =>
                                set("createLoginAccount", checked === true)
                            }
                            className="mt-0.5"
                        />
                        <div className="space-y-0.5">
                            <p className="text-sm font-medium text-slate-800">
                                Create tenant login account
                            </p>
                            <p className="text-xs text-slate-500">
                                Lets this tenant sign in to the tenant portal to see invoices and
                                pay rent. Requires email above.
                            </p>
                        </div>
                    </label>

                    {values.createLoginAccount && (
                        <div className="space-y-1.5 pl-7">
                            <Label htmlFor="t-password">
                                Initial password <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="t-password"
                                type="text"
                                value={values.password}
                                onChange={(e) => set("password", e.target.value)}
                                placeholder="Minimum 8 characters"
                                required={values.createLoginAccount}
                                minLength={8}
                            />
                            <p className="text-[11px] text-slate-500">
                                Share securely with the tenant. They&apos;ll be prompted to
                                change it on first sign-in.
                            </p>
                        </div>
                    )}
                </div>
            )}

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
 * Build the multipart FormData for POST /tenants: a JSON `data` field with the
 * trimmed tenant values (empty optionals omitted) plus an optional `photo` file.
 */
export function buildCreateTenantFormData(values: TenantFormValues): FormData {
    const data = {
        name: values.name.trim(),
        ...(values.phone.trim() && { phone: values.phone.trim() }),
        ...(values.email.trim() && { email: values.email.trim() }),
        ...(values.nidNumber.trim() && { nidNumber: values.nidNumber.trim() }),
        ...(values.occupation.trim() && { occupation: values.occupation.trim() }),
        ...(values.emergencyContact.trim() && {
            emergencyContact: values.emergencyContact.trim(),
        }),
        ...(values.emergencyName.trim() && {
            emergencyName: values.emergencyName.trim(),
        }),
        ...(values.permanentAddress.trim() && {
            permanentAddress: values.permanentAddress.trim(),
        }),
        buildingId: values.buildingId,
        ...(values.floorId && { floorId: values.floorId }),
        ...(values.unitId && { unitId: values.unitId }),
        createLoginAccount: values.createLoginAccount,
        ...(values.createLoginAccount && { password: values.password }),
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (values.photoFile) formData.append("photo", values.photoFile);
    return formData;
}

/**
 * Build the multipart FormData for PATCH /tenants/:id: a JSON `data` field with
 * only the changed fields plus an optional `photo` file when a new one is picked.
 */
export function buildUpdateTenantFormData(
    changed: object,
    photoFile: File | null,
): FormData {
    const formData = new FormData();
    formData.append("data", JSON.stringify(changed));
    if (photoFile) formData.append("photo", photoFile);
    return formData;
}
