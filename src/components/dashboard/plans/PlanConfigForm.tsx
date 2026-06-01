"use client";

// src/components/dashboard/plans/PlanConfigForm.tsx
//
// Create/edit form for a PlanConfig. Used inside a Dialog. In "create"
// mode the `plan` enum is editable; in "edit" mode it's locked (the
// server treats it as immutable).

import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { cn } from "@/src/lib/utils";
import type {
    CreatePlanConfigPayload,
    PlanConfig,
    UpdatePlanConfigPayload,
} from "@/src/types/planConfig.types";
import {
    PLAN_ORDER,
    type SubscriptionPlan,
} from "@/src/types/subscription.types";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface PlanConfigFormProps {
    /** Existing plan being edited. Omit for create mode. */
    initial?: PlanConfig;
    submitting: boolean;
    onCancel: () => void;
    onSubmit: (
        payload: CreatePlanConfigPayload | UpdatePlanConfigPayload,
        mode: "create" | "edit",
    ) => void;
}

type FormState = {
    plan: SubscriptionPlan;
    displayName: string;
    description: string;
    buildingLimit: string;
    floorLimit: string;
    unitLimit: string;
    tenantLimit: string;
    priceMonthly: string;
    trialDays: string;
    smsEnabled: boolean;
    customBranding: boolean;
    multiAdmin: boolean;
    isPopular: boolean;
    isActive: boolean;
    features: string[];
};

const emptyState: FormState = {
    plan: "BASIC",
    displayName: "",
    description: "",
    buildingLimit: "",
    floorLimit: "",
    unitLimit: "",
    tenantLimit: "",
    priceMonthly: "",
    trialDays: "",
    smsEnabled: false,
    customBranding: false,
    multiAdmin: false,
    isPopular: false,
    isActive: true,
    features: [],
};

function toFormState(p: PlanConfig): FormState {
    return {
        plan: p.plan,
        displayName: p.displayName,
        description: p.description,
        buildingLimit: String(p.buildingLimit),
        floorLimit: String(p.floorLimit),
        unitLimit: String(p.unitLimit),
        tenantLimit: String(p.tenantLimit),
        priceMonthly: p.priceMonthly,
        trialDays: p.trialDays === null ? "" : String(p.trialDays),
        smsEnabled: p.smsEnabled,
        customBranding: p.customBranding,
        multiAdmin: p.multiAdmin,
        isPopular: p.isPopular,
        isActive: p.isActive,
        features: [...p.features],
    };
}

export function PlanConfigForm({
    initial,
    submitting,
    onCancel,
    onSubmit,
}: PlanConfigFormProps) {
    const mode: "create" | "edit" = initial ? "edit" : "create";
    const [form, setForm] = useState<FormState>(() =>
        initial ? toFormState(initial) : emptyState,
    );
    const [featureDraft, setFeatureDraft] = useState("");
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
        {},
    );

    useEffect(() => {
        setForm(initial ? toFormState(initial) : emptyState);
        setErrors({});
        setFeatureDraft("");
    }, [initial]);

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm((s) => ({ ...s, [key]: value }));

    const addFeature = () => {
        const trimmed = featureDraft.trim();
        if (!trimmed) return;
        if (form.features.includes(trimmed)) {
            setFeatureDraft("");
            return;
        }
        set("features", [...form.features, trimmed]);
        setFeatureDraft("");
    };

    const removeFeature = (idx: number) =>
        set(
            "features",
            form.features.filter((_, i) => i !== idx),
        );

    const validate = (): boolean => {
        const e: Partial<Record<keyof FormState, string>> = {};
        if (!form.displayName.trim()) e.displayName = "Required";
        if (!form.description.trim()) e.description = "Required";

        const numericFields: (keyof FormState)[] = [
            "buildingLimit",
            "floorLimit",
            "unitLimit",
            "tenantLimit",
            "priceMonthly",
        ];
        for (const f of numericFields) {
            const v = form[f] as string;
            if (v === "" || v === null) {
                e[f] = "Required";
                continue;
            }
            const n = Number(v);
            if (!Number.isFinite(n) || n < 0) {
                e[f] = "Must be a non-negative number";
            }
        }

        if (form.trialDays !== "") {
            const n = Number(form.trialDays);
            if (!Number.isInteger(n) || n < 0) {
                e.trialDays = "Whole number ≥ 0";
            }
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const base = {
            displayName: form.displayName.trim(),
            description: form.description.trim(),
            buildingLimit: Number(form.buildingLimit),
            floorLimit: Number(form.floorLimit),
            unitLimit: Number(form.unitLimit),
            tenantLimit: Number(form.tenantLimit),
            priceMonthly: Number(form.priceMonthly),
            smsEnabled: form.smsEnabled,
            customBranding: form.customBranding,
            multiAdmin: form.multiAdmin,
            isPopular: form.isPopular,
            isActive: form.isActive,
            trialDays:
                form.trialDays === "" ? null : Number(form.trialDays),
            features: form.features,
        };

        if (mode === "create") {
            onSubmit({ plan: form.plan, ...base }, "create");
        } else {
            onSubmit(base, "edit");
        }
    };

    const planLabel = useMemo(
        () => form.plan.replace("_", " "),
        [form.plan],
    );

    return (
        <div className="flex max-h-[calc(100vh-8rem)] flex-col">
            {/* Header */}
            <div className="border-b border-rule-soft px-5 py-4">
                <h2 className="text-[18px] font-bold tracking-[-0.01em] text-jade-950">
                    {mode === "create" ? "Create plan" : `Edit ${planLabel}`}
                </h2>
                <p className="font-bangla mt-0.5 text-[12px] text-ink-soft">
                    {mode === "create"
                        ? "নতুন প্ল্যান তৈরি করুন"
                        : "প্ল্যান আপডেট করুন"}
                </p>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                {/* Identity */}
                <Section title="Identity" bn="পরিচয়">
                    <FieldGrid>
                        <Field
                            label="Plan key"
                            bn="প্ল্যান কী"
                            required
                            hint={
                                mode === "edit"
                                    ? "Immutable after creation."
                                    : "The enum key used by the backend."
                            }
                        >
                            <select
                                value={form.plan}
                                disabled={mode === "edit"}
                                onChange={(e) =>
                                    set(
                                        "plan",
                                        e.target.value as SubscriptionPlan,
                                    )
                                }
                                className={cn(
                                    "h-8 w-full rounded-lg border border-rule-soft bg-paper px-2 text-[13px] text-ink",
                                    "focus:outline-none focus:ring-2 focus:ring-jade-700/30",
                                    "disabled:cursor-not-allowed disabled:bg-cream disabled:text-ink-soft",
                                )}
                            >
                                {PLAN_ORDER.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field
                            label="Display name"
                            bn="প্রদর্শন নাম"
                            required
                            error={errors.displayName}
                        >
                            <Input
                                value={form.displayName}
                                onChange={(e) =>
                                    set("displayName", e.target.value)
                                }
                                placeholder="e.g. Professional"
                            />
                        </Field>
                    </FieldGrid>

                    <Field
                        label="Description"
                        bn="বিবরণ"
                        required
                        error={errors.description}
                    >
                        <Textarea
                            value={form.description}
                            onChange={(e) =>
                                set("description", e.target.value)
                            }
                            placeholder="Short tagline shown on the pricing page"
                            rows={2}
                        />
                    </Field>
                </Section>

                {/* Pricing */}
                <Section title="Pricing & trial" bn="মূল্য ও ট্রায়াল">
                    <FieldGrid>
                        <Field
                            label="Price / month (BDT)"
                            bn="মাসিক মূল্য"
                            required
                            error={errors.priceMonthly}
                        >
                            <Input
                                type="number"
                                min={0}
                                value={form.priceMonthly}
                                onChange={(e) =>
                                    set("priceMonthly", e.target.value)
                                }
                                placeholder="0"
                            />
                        </Field>
                        <Field
                            label="Trial days"
                            bn="ট্রায়াল দিন"
                            hint="Leave blank for no trial"
                            error={errors.trialDays}
                        >
                            <Input
                                type="number"
                                min={0}
                                value={form.trialDays}
                                onChange={(e) =>
                                    set("trialDays", e.target.value)
                                }
                                placeholder="—"
                            />
                        </Field>
                    </FieldGrid>
                </Section>

                {/* Limits */}
                <Section title="Limits" bn="সীমা">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <Field
                            label="Buildings"
                            bn="বিল্ডিং"
                            required
                            error={errors.buildingLimit}
                        >
                            <Input
                                type="number"
                                min={0}
                                value={form.buildingLimit}
                                onChange={(e) =>
                                    set("buildingLimit", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Floors"
                            bn="তলা"
                            required
                            error={errors.floorLimit}
                        >
                            <Input
                                type="number"
                                min={0}
                                value={form.floorLimit}
                                onChange={(e) =>
                                    set("floorLimit", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Units"
                            bn="ইউনিট"
                            required
                            error={errors.unitLimit}
                        >
                            <Input
                                type="number"
                                min={0}
                                value={form.unitLimit}
                                onChange={(e) =>
                                    set("unitLimit", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Tenants"
                            bn="ভাড়াটিয়া"
                            required
                            error={errors.tenantLimit}
                        >
                            <Input
                                type="number"
                                min={0}
                                value={form.tenantLimit}
                                onChange={(e) =>
                                    set("tenantLimit", e.target.value)
                                }
                            />
                        </Field>
                    </div>
                </Section>

                {/* Capabilities */}
                <Section title="Capabilities" bn="ফিচার সক্ষমতা">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <ToggleRow
                            label="SMS notifications"
                            bn="এসএমএস নোটিফিকেশন"
                            checked={form.smsEnabled}
                            onChange={(v) => set("smsEnabled", v)}
                        />
                        <ToggleRow
                            label="Custom branding"
                            bn="কাস্টম ব্র্যান্ডিং"
                            checked={form.customBranding}
                            onChange={(v) => set("customBranding", v)}
                        />
                        <ToggleRow
                            label="Multiple admins"
                            bn="একাধিক অ্যাডমিন"
                            checked={form.multiAdmin}
                            onChange={(v) => set("multiAdmin", v)}
                        />
                        <ToggleRow
                            label="Mark as popular"
                            bn="জনপ্রিয় হিসাবে চিহ্নিত করুন"
                            checked={form.isPopular}
                            onChange={(v) => set("isPopular", v)}
                        />
                        <ToggleRow
                            label="Active (visible publicly)"
                            bn="সক্রিয় (পাবলিক)"
                            checked={form.isActive}
                            onChange={(v) => set("isActive", v)}
                        />
                    </div>
                </Section>

                {/* Features list */}
                <Section
                    title="Feature bullets"
                    bn="ফিচার তালিকা"
                    description="Shown line-by-line on the pricing card."
                >
                    <div className="flex gap-2">
                        <Input
                            value={featureDraft}
                            onChange={(e) => setFeatureDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addFeature();
                                }
                            }}
                            placeholder="e.g. Auto SMS rent reminders"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addFeature}
                            disabled={!featureDraft.trim()}
                        >
                            <Plus size={14} />
                            Add
                        </Button>
                    </div>
                    {form.features.length === 0 ? (
                        <p className="mt-2 rounded-md border border-dashed border-rule-soft bg-cream/50 px-3 py-2 text-[12px] text-ink-soft">
                            No features added yet.
                        </p>
                    ) : (
                        <ul className="mt-2 space-y-1.5">
                            {form.features.map((f, i) => (
                                <li
                                    key={`${f}-${i}`}
                                    className="flex items-center justify-between gap-2 rounded-md border border-rule-soft bg-cream/40 px-2.5 py-1.5 text-[13px] text-ink"
                                >
                                    <span className="truncate">{f}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(i)}
                                        aria-label={`Remove "${f}"`}
                                        className="inline-flex size-6 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-coral-50 hover:text-coral-700"
                                    >
                                        <X size={13} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-rule-soft bg-cream/40 px-5 py-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-jade-900 text-paper hover:bg-jade-950"
                >
                    {submitting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Saving…
                        </>
                    ) : mode === "create" ? (
                        "Create plan"
                    ) : (
                        "Save changes"
                    )}
                </Button>
            </div>
        </div>
    );
}

// ─── atoms ───────────────────────────────────────────────────────

function Section({
    title,
    bn,
    description,
    children,
}: {
    title: string;
    bn: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-2.5">
            <div>
                <h3 className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                    {title}
                </h3>
                <p className="font-bangla text-[10.5px] text-ink-soft/70">
                    {bn}
                </p>
                {description && (
                    <p className="mt-0.5 text-[11.5px] text-ink-soft">
                        {description}
                    </p>
                )}
            </div>
            <div className="space-y-3">{children}</div>
        </section>
    );
}

function FieldGrid({
    children,
    columns = 2,
}: {
    children: React.ReactNode;
    columns?: 2 | 3;
}) {
    return (
        <div
            className={cn(
                "grid gap-3",
                columns === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-3",
            )}
        >
            {children}
        </div>
    );
}

function Field({
    label,
    bn,
    required,
    hint,
    error,
    children,
}: {
    label: string;
    bn?: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block space-y-1">
            <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-semibold text-ink">
                    {label}
                    {required && (
                        <span className="ml-0.5 text-coral-600">*</span>
                    )}
                </span>
                {bn && (
                    <span className="font-bangla text-[10.5px] text-ink-soft/70">
                        {bn}
                    </span>
                )}
            </div>
            {children}
            {error ? (
                <p className="text-[11px] font-medium text-coral-700">
                    {error}
                </p>
            ) : hint ? (
                <p className="text-[11px] text-ink-soft">{hint}</p>
            ) : null}
        </label>
    );
}

function ToggleRow({
    label,
    bn,
    checked,
    onChange,
}: {
    label: string;
    bn: string;
    checked: boolean;
    onChange: (next: boolean) => void;
}) {
    return (
        <label
            className={cn(
                "flex cursor-pointer items-start gap-2.5 rounded-md border px-2.5 py-2 transition-colors",
                checked
                    ? "border-jade-100 bg-jade-50/60"
                    : "border-rule-soft bg-cream/40 hover:border-jade-700/30",
            )}
        >
            <Checkbox
                checked={checked}
                onCheckedChange={(next) => onChange(Boolean(next))}
                className="mt-0.5"
            />
            <div className="min-w-0">
                <p className="text-[12.5px] font-semibold text-ink">{label}</p>
                <p className="font-bangla text-[10.5px] text-ink-soft/75">
                    {bn}
                </p>
            </div>
        </label>
    );
}
