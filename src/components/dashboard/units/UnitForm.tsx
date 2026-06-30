"use client";

// src/components/dashboard/units/UnitForm.tsx

import {
  Field,
  FormActions,
  fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
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
import { useFloorsByBuilding } from "@/src/hooks/useFloors";
import {
  UNIT_STATUS_OPTIONS,
  UNIT_TYPE_OPTIONS,
  type CreateUnitPayload,
  type UnitStatus,
  type UnitType,
} from "@/src/types/unit.types";
import { useEffect, useMemo, useState } from "react";

export interface UnitFormValues {
  buildingId: string;
  floorId: string;
  name: string;
  type: UnitType;
  status: UnitStatus;
  //   bedrooms: string;
  //   bathrooms: string;
  //   drawingRooms: string;
  //   diningRooms: string;
  //   kitchens: string;
  //   balconies: string;
  //   sizeSqft: string;
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
  // bedrooms: "",
  // bathrooms: "",
  // drawingRooms: "",
  // diningRooms: "",
  // kitchens: "",
  // balconies: "",
  // sizeSqft: "",
  baseRent: "",
  serviceCharge: "",
  description: "",
};

export interface UnitFormSubmitPayload {
  create: CreateUnitPayload;
  update: Partial<CreateUnitPayload> & { status?: UnitStatus };
}

interface UnitFormProps {
  mode: "create" | "edit";
  fixedBuildingId?: string;
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

  useEffect(() => {
    if (defaultValues) {
      setValues((prev) => ({ ...prev, ...defaultValues }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValues)]);

  const showBuildingSelect = !fixedBuildingId && mode === "create";

  const { data: buildings } = useBuildings();

  const effectiveBuildingId = values.buildingId;
  const { data: floors } = useFloorsByBuilding(
    effectiveBuildingId || undefined,
  );

  const sortedFloors = useMemo(
    () =>
      floors ? [...floors].sort((a, b) => a.floorNumber - b.floorNumber) : [],
    [floors],
  );

  useEffect(() => {
    if (!floors) return;
    if (values.floorId && !floors.some((f) => f.id === values.floorId)) {
      setValues((v) => ({ ...v, floorId: "" }));
    }
  }, [floors, values.floorId]);

  function set<K extends keyof UnitFormValues>(
    key: K,
    value: UnitFormValues[K],
  ) {
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
            <Field label="Building" htmlFor="buildingId" required>
              <Select
                value={values.buildingId}
                onValueChange={(v) => set("buildingId", v ?? "")}
              >
                <SelectTrigger
                  id="buildingId"
                  className={`w-full ${fieldClass}`}
                >
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
            </Field>
          )}

          <Field
            label="Floor"
            htmlFor="floorId"
            required
            className={showBuildingSelect ? "" : "sm:col-span-2"}
          >
            <Select
              value={values.floorId}
              onValueChange={(v) => set("floorId", v ?? "")}
              disabled={!effectiveBuildingId || sortedFloors.length === 0}
            >
              <SelectTrigger id="floorId" className={`w-full ${fieldClass}`}>
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
                    const f = sortedFloors.find((fl) => fl.id === value);
                    if (!f) return null;
                    return <FloorOption num={f.floorNumber} name={f.name} />;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sortedFloors.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    <FloorOption num={f.floorNumber} name={f.name} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      )}

      {/* Name + Type + Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Unit name" htmlFor="unit-name" required>
          <Input
            id="unit-name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="3A"
            required
            className={fieldClass}
          />
        </Field>

        <Field label="Type" htmlFor="unit-type" required>
          <Select
            value={values.type}
            onValueChange={(v) => set("type", v as UnitType)}
          >
            <SelectTrigger id="unit-type" className={`w-full ${fieldClass}`}>
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
        </Field>

        {mode === "edit" && (
          <Field label="Status" htmlFor="unit-status">
            <Select
              value={values.status}
              onValueChange={(v) => set("status", v as UnitStatus)}
            >
              <SelectTrigger
                id="unit-status"
                className={`w-full ${fieldClass}`}
              >
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
          </Field>
        )}
      </div>

      {/* Bedrooms / Bathrooms / Size */}
      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Bedrooms" htmlFor="bedrooms">
          <Input
            id="bedrooms"
            type="number"
            min={0}
            value={values.bedrooms}
            onChange={(e) => set("bedrooms", e.target.value)}
            placeholder="3"
            className={`${fieldClass} tabular-nums`}
          />
        </Field>
        <Field label="Bathrooms" htmlFor="bathrooms">
          <Input
            id="bathrooms"
            type="number"
            min={0}
            value={values.bathrooms}
            onChange={(e) => set("bathrooms", e.target.value)}
            placeholder="2"
            className={`${fieldClass} tabular-nums`}
          />
        </Field>
        <Field label="Size (sqft)" htmlFor="sizeSqft">
          <Input
            id="sizeSqft"
            type="number"
            min={0}
            value={values.sizeSqft}
            onChange={(e) => set("sizeSqft", e.target.value)}
            placeholder="1200"
            className={`${fieldClass} tabular-nums`}
          />
        </Field>
      </div> */}

      {/* Drawing / Dining / Kitchens / Balconies */}
      {/* <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Drawing rooms" htmlFor="drawingRooms">
          <Input
            id="drawingRooms"
            type="number"
            min={0}
            value={values.drawingRooms}
            onChange={(e) => set("drawingRooms", e.target.value)}
            placeholder="1"
            className={`${fieldClass} tabular-nums`}
          />
        </Field>
        <Field label="Dining rooms" htmlFor="diningRooms">
          <Input
            id="diningRooms"
            type="number"
            min={0}
            value={values.diningRooms}
            onChange={(e) => set("diningRooms", e.target.value)}
            placeholder="1"
            className={`${fieldClass} tabular-nums`}
          />
        </Field>
        <Field label="Kitchens" htmlFor="kitchens">
          <Input
            id="kitchens"
            type="number"
            min={0}
            value={values.kitchens}
            onChange={(e) => set("kitchens", e.target.value)}
            placeholder="1"
            className={`${fieldClass} tabular-nums`}
          />
        </Field>
        <Field label="Balconies" htmlFor="balconies">
          <Input
            id="balconies"
            type="number"
            min={0}
            value={values.balconies}
            onChange={(e) => set("balconies", e.target.value)}
            placeholder="2"
            className={`${fieldClass} tabular-nums`}
          />
        </Field>
      </div> */}

      {/* Rent / Service charge — with ৳ prefix */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Base rent"
          htmlFor="baseRent"
          required
          hint="per month · BDT"
        >
          <MoneyInput
            id="baseRent"
            value={values.baseRent}
            onChange={(v) => set("baseRent", v)}
            placeholder="18,000"
            required
          />
        </Field>
        <Field
          label="Service charge"
          htmlFor="serviceCharge"
          hint="per month · optional"
        >
          <MoneyInput
            id="serviceCharge"
            value={values.serviceCharge}
            onChange={(v) => set("serviceCharge", v)}
            placeholder="1,500"
          />
        </Field>
      </div>

      {/* Description */}
      <Field
        label="Description"
        htmlFor="unit-description"
        hint="A short note — shown on the unit card."
      >
        <Textarea
          id="unit-description"
          rows={3}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="3 bedroom flat with balcony, southern exposure…"
          className={`${fieldClass} resize-none`}
        />
      </Field>

      <FormActions
        submitting={submitting}
        submitLabel={submitLabel}
        onCancel={onCancel}
      />
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────
// Helper components
// ─────────────────────────────────────────────────────────────────

/**
 * Inline floor option — shows the floor number badge so the dropdown
 * looks like the FloorsPanel rows, not a flat string.
 */
function FloorOption({ num, name }: { num: number; name: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex size-5 items-center justify-center rounded-[5px] bg-jade-50 text-[10.5px] font-bold text-jade-800 tabular-nums">
        {num === 0 ? "G" : num}
      </span>
      <span className="text-[13px] text-ink">{name}</span>
    </span>
  );
}

/**
 * Money input with a ৳ prefix indicator inside the field.
 * Wraps a regular Input so it still inherits fieldClass focus styles.
 */
function MoneyInput({
  id,
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-ink-soft"
      >
        ৳
      </span>
      <Input
        id={id}
        type="number"
        min={0}
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`${fieldClass} pl-7 tabular-nums`}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Payload builder
// ─────────────────────────────────────────────────────────────────

export function buildCreatePayload(values: UnitFormValues): CreateUnitPayload {
  return {
    buildingId: values.buildingId,
    floorId: values.floorId,
    name: values.name.trim(),
    type: values.type,
    baseRent: Number(values.baseRent),
    serviceCharge: Number(values.serviceCharge || 0),
    description: values.description.trim(),
  };
}
