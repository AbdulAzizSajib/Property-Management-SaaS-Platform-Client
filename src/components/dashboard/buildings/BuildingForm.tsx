"use client";

// src/components/dashboard/buildings/BuildingForm.tsx

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

// Shared className for form fields — keeps jade focus consistent without
// editing the shadcn primitives. If your shadcn Input/Textarea/Select already
// expose a `variant` prop, swap these for that.
const fieldClass =
  "border-rule-soft bg-paper text-ink placeholder:text-ink-soft/55 " +
  "focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20";

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

  useEffect(() => {
    if (defaultValues) {
      setValues((prev) => ({ ...prev, ...defaultValues }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValues)]);

  function set<K extends keyof BuildingFormValues>(
    key: K,
    value: BuildingFormValues[K],
  ) {
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
      ...(values.description.trim() && {
        description: values.description.trim(),
      }),
      ...(values.imageUrl.trim() && { imageUrl: values.imageUrl.trim() }),
    };

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Building name" required className="sm:col-span-2">
          <Input
            id="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Lalmatia Block A"
            required
            className={fieldClass}
          />
        </Field>

        <Field label="Type" required>
          <Select
            value={values.type}
            onValueChange={(v) => set("type", v as BuildingType)}
          >
            <SelectTrigger id="type" className={`w-full ${fieldClass}`}>
              <SelectValue placeholder="Select type">
                {(value) => {
                  const opt = BUILDING_TYPE_OPTIONS.find(
                    (o) => o.value === value,
                  );
                  if (!opt) return null;
                  return (
                    <span className="inline-flex items-center gap-2">
                      <span>{opt.label}</span>
                      <span className="font-bangla text-[11.5px] text-ink-soft">
                        · {opt.labelBn}
                      </span>
                    </span>
                  );
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {BUILDING_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="inline-flex items-center gap-2">
                    <span>{opt.label}</span>
                    <span className="font-bangla text-[11.5px] text-ink-soft">
                      · {opt.labelBn}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Total floors" required>
          <Input
            id="totalFloors"
            type="number"
            min={1}
            value={values.totalFloors}
            onChange={(e) => set("totalFloors", Number(e.target.value))}
            required
            className={`${fieldClass} tabular-nums`}
          />
        </Field>

        <Field label="Address" required className="sm:col-span-2">
          <Input
            id="address"
            value={values.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="House 12, Road 5, Lalmatia, Dhaka"
            required
            className={fieldClass}
          />
        </Field>

        <Field label="City" required>
          <Input
            id="city"
            value={values.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Dhaka"
            required
            className={fieldClass}
          />
        </Field>

        <Field label="Area">
          <Input
            id="area"
            value={values.area}
            onChange={(e) => set("area", e.target.value)}
            placeholder="Lalmatia"
            className={fieldClass}
          />
        </Field>

        <Field label="Image URL" className="sm:col-span-2">
          <Input
            id="imageUrl"
            type="url"
            value={values.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="https://example.com/building.png"
            className={fieldClass}
          />
        </Field>

        <Field
          label="Description"
          className="sm:col-span-2"
          hint="A short note shown on the building card."
        >
          <Textarea
            id="description"
            rows={3}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="5-storey residential building, lift available"
            className={`${fieldClass} resize-none`}
          />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-rule-soft pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="inline-flex h-9 items-center rounded-[8px] border border-rule-soft bg-paper px-4 text-[13px] font-medium text-ink-soft transition-colors hover:border-jade-700/30 hover:text-jade-900 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950 disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-[12.5px] font-semibold text-ink">
        {label}
        {required && (
          <span className="ml-1 text-coral-600" aria-label="required">
            *
          </span>
        )}
      </Label>
      {children}
      {hint && <p className="text-[11.5px] text-ink-soft/80">{hint}</p>}
    </div>
  );
}
