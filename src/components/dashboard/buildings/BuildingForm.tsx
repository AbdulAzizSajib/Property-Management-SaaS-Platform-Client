"use client";

// src/components/dashboard/buildings/BuildingForm.tsx

import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Field,
  FormActions,
  fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import {
  BUILDING_TYPE_OPTIONS,
  type BuildingType,
  type CreateBuildingPayload,
} from "@/src/types/building.types";
import { Building2, Layers, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export interface BuildingFormValues {
  name: string;
  type: BuildingType;
  address: string;
  city: string;
  area: string;
  totalFloors: number;
  hasGroundFloor: boolean;
  description: string;
}

export const emptyBuildingForm: BuildingFormValues = {
  name: "",
  type: "RESIDENTIAL",
  address: "",
  city: "",
  area: "",
  totalFloors: 1,
  hasGroundFloor: false,
  description: "",
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
      hasGroundFloor: values.hasGroundFloor,
      ...(values.area.trim() && { area: values.area.trim() }),
      ...(values.description.trim() && {
        description: values.description.trim(),
      }),
    };

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Identity ─────────────────────────────────────────────── */}
      <Section icon={Building2} title="Building" subtitle="ভবন">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Building name" htmlFor="name" required className="sm:col-span-2">
            <Input
              id="name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Lalmatia Block A"
              required
              className={fieldClass}
            />
          </Field>

          <Field label="Type" htmlFor="type" required>
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

          <Field label="Total floors" htmlFor="totalFloors" required>
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

          <label className="flex cursor-pointer items-start gap-2.5 rounded-[10px] border border-rule-soft bg-jade-50/40 px-3 py-2.5 transition-colors hover:border-jade-700/30 sm:col-span-2">
            <input
              type="checkbox"
              checked={values.hasGroundFloor}
              onChange={(e) => set("hasGroundFloor", e.target.checked)}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-rule-soft text-jade-700 accent-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20"
            />
            <span className="text-[12.5px] leading-snug text-ink">
              Has ground floor
              <span className="mt-0.5 block text-[11.5px] text-ink-soft/80">
                Floor 1 will be labeled “Ground Floor”.
              </span>
            </span>
          </label>
        </div>
      </Section>

      {/* ── Location ─────────────────────────────────────────────── */}
      <Section icon={MapPin} title="Location" subtitle="ঠিকানা">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Address" htmlFor="address" required className="sm:col-span-2">
            <Input
              id="address"
              value={values.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="House 12, Road 5, Lalmatia, Dhaka"
              required
              className={fieldClass}
            />
          </Field>

          <Field label="City" htmlFor="city" required>
            <Input
              id="city"
              value={values.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Dhaka"
              required
              className={fieldClass}
            />
          </Field>

          <Field label="Area" htmlFor="area">
            <Input
              id="area"
              value={values.area}
              onChange={(e) => set("area", e.target.value)}
              placeholder="Lalmatia"
              className={fieldClass}
            />
          </Field>
        </div>
      </Section>

      {/* ── Details ──────────────────────────────────────────────── */}
      <Section icon={Layers} title="Details" subtitle="বিবরণ">
        <Field
          label="Description"
          htmlFor="description"
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
      </Section>

      <FormActions
        submitting={submitting}
        submitLabel={submitLabel}
        onCancel={onCancel}
      />
    </form>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-jade-900/8 text-jade-900">
          <Icon size={13} />
        </span>
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink">
          {title}
        </h3>
        {subtitle && (
          <span className="font-bangla text-[12px] text-ink-soft">
            · {subtitle}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
