"use client";

// src/components/dashboard/leases/LeaseForm.tsx

import {
    Field,
    FormActions,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import { Input } from "@/src/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { useTenants } from "@/src/hooks/useTenants";
import { useUnits } from "@/src/hooks/useUnits";
import { cn } from "@/src/lib/utils";
import {
    BILLING_MODE_OPTIONS,
    type BillingMode,
    type CreateLeasePayload,
} from "@/src/types/lease.types";
import { Droplets, Flame, Info, Layers, Sparkles, Wifi, Zap } from "lucide-react";
import { useMemo, useState } from "react";

export interface LeaseFormValues {
    tenantId: string;
    unitId: string;
    startDate: string;
    endDate: string;
    moveInDate: string;
    monthlyRent: string;
    serviceCharge: string;
    securityDeposit: string;
    rentDueDay: string;
    billingMode: BillingMode;
    gasCharge: string;
    waterCharge: string;
    electricityCharge: string;
    internetCharge: string;
}

const todayISO = () => new Date().toISOString().split("T")[0];

const emptyForm: LeaseFormValues = {
    tenantId: "",
    unitId: "",
    startDate: "",
    endDate: "",
    moveInDate: "",
    monthlyRent: "",
    serviceCharge: "",
    securityDeposit: "",
    rentDueDay: "5",
    billingMode: "INCLUSIVE",
    gasCharge: "",
    waterCharge: "",
    electricityCharge: "",
    internetCharge: "",
};

interface LeaseFormProps {
    submitting: boolean;
    submitLabel: string;
    fixedUnitId?: string;
    fixedTenantId?: string;
    onSubmit: (payload: CreateLeasePayload) => void;
    onCancel?: () => void;
}

export function LeaseForm({
    submitting,
    submitLabel,
    fixedUnitId,
    fixedTenantId,
    onSubmit,
    onCancel,
}: LeaseFormProps) {
    const [values, setValues] = useState<LeaseFormValues>({
        ...emptyForm,
        ...(fixedUnitId && { unitId: fixedUnitId }),
        ...(fixedTenantId && { tenantId: fixedTenantId }),
    });

    // Track which money fields were auto-filled from unit defaults
    // so we can show a subtle indicator and reset them if the user
    // picks a different unit.
    const [autoFilled, setAutoFilled] = useState<{
        rent: boolean;
        service: boolean;
    }>({ rent: false, service: false });

    const { data: allUnits } = useUnits({ status: "VACANT" });
    const { data: tenants } = useTenants();

    const units = useMemo(() => allUnits ?? [], [allUnits]);
    const activeTenants = useMemo(
        () => (tenants ?? []).filter((t) => t.isActive),
        [tenants],
    );

    const selectedUnit = units.find((u) => u.id === values.unitId);
    const selectedTenant = activeTenants.find((t) => t.id === values.tenantId);

    function set<K extends keyof LeaseFormValues>(
        key: K,
        value: LeaseFormValues[K],
    ) {
        setValues((v) => ({ ...v, [key]: value }));
    }

    function handleUnitChange(unitId: string) {
        const unit = units.find((u) => u.id === unitId);

        setValues((v) => {
            // Replace rent/service if they were either blank OR previously auto-filled
            const shouldReplaceRent =
                v.monthlyRent === "" || autoFilled.rent;
            const shouldReplaceService =
                v.serviceCharge === "" || autoFilled.service;

            return {
                ...v,
                unitId,
                monthlyRent:
                    shouldReplaceRent && unit
                        ? String(unit.baseRent)
                        : v.monthlyRent,
                serviceCharge:
                    shouldReplaceService && unit
                        ? String(unit.serviceCharge)
                        : v.serviceCharge,
            };
        });

        setAutoFilled({
            rent: !!unit,
            service: !!unit,
        });
    }

    function handleStartDateChange(value: string) {
        setValues((v) => ({
            ...v,
            startDate: value,
            moveInDate: v.moveInDate === "" ? value : v.moveInDate,
        }));
    }

    // Once the user types in a money field, mark it as no-longer-auto.
    function handleRentChange(value: string) {
        set("monthlyRent", value);
        setAutoFilled((a) => ({ ...a, rent: false }));
    }
    function handleServiceChange(value: string) {
        set("serviceCharge", value);
        setAutoFilled((a) => ({ ...a, service: false }));
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        const isSeparate = values.billingMode === "FIXED_SEPARATE";

        const payload: CreateLeasePayload = {
            tenantId: values.tenantId,
            unitId: values.unitId,
            startDate: values.startDate,
            moveInDate: values.moveInDate,
            monthlyRent: Number(values.monthlyRent),
            serviceCharge: Number(values.serviceCharge || 0),
            securityDeposit: Number(values.securityDeposit) || 0,
            rentDueDay: Number(values.rentDueDay) || 1,
            billingMode: values.billingMode,
            ...(values.endDate && { endDate: values.endDate }),
            // Only send utility fields when the mode actually uses them.
            ...(isSeparate && {
                gasCharge: Number(values.gasCharge) || 0,
                waterCharge: Number(values.waterCharge) || 0,
                electricityCharge: Number(values.electricityCharge) || 0,
                internetCharge: Number(values.internetCharge) || 0,
            }),
        };

        onSubmit(payload);
    }

    // Live total for the "first month" preview line.
    const liveMonthlyTotal = useMemo(() => {
        const rent = Number(values.monthlyRent) || 0;
        const svc = Number(values.serviceCharge) || 0;
        if (values.billingMode === "INCLUSIVE") return rent + svc;
        return (
            rent +
            svc +
            (Number(values.gasCharge) || 0) +
            (Number(values.waterCharge) || 0) +
            (Number(values.electricityCharge) || 0) +
            (Number(values.internetCharge) || 0)
        );
    }, [
        values.monthlyRent,
        values.serviceCharge,
        values.billingMode,
        values.gasCharge,
        values.waterCharge,
        values.electricityCharge,
        values.internetCharge,
    ]);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Parties */}
            <FormSection title="Parties" bn="পক্ষসমূহ">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Tenant" htmlFor="l-tenant" required>
                        <Select
                            value={values.tenantId}
                            onValueChange={(v) => set("tenantId", v ?? "")}
                            disabled={!!fixedTenantId}
                        >
                            <SelectTrigger
                                id="l-tenant"
                                className={`w-full ${fieldClass}`}
                            >
                                <SelectValue placeholder="Select tenant">
                                    {(value) => {
                                        const t = activeTenants.find(
                                            (x) => x.id === value,
                                        );
                                        return t
                                            ? `${t.name} · ${t.phone}`
                                            : null;
                                    }}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {activeTenants.length === 0 ? (
                                    <div className="px-2 py-2 text-[12px] text-ink-soft">
                                        No active tenants
                                    </div>
                                ) : (
                                    activeTenants.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            <span className="inline-flex items-center gap-2">
                                                <span className="inline-flex size-5 items-center justify-center rounded-full bg-jade-50 text-[9.5px] font-bold text-jade-800">
                                                    {t.name
                                                        .split(" ")
                                                        .filter(Boolean)
                                                        .map((p) => p[0])
                                                        .slice(0, 2)
                                                        .join("")
                                                        .toUpperCase()}
                                                </span>
                                                <span>
                                                    {t.name}
                                                    <span className="ml-1.5 text-ink-soft tabular-nums">
                                                        · {t.phone}
                                                    </span>
                                                </span>
                                            </span>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Unit" htmlFor="l-unit" required>
                        <Select
                            value={values.unitId}
                            onValueChange={(v) => handleUnitChange(v ?? "")}
                            disabled={!!fixedUnitId}
                        >
                            <SelectTrigger
                                id="l-unit"
                                className={`w-full ${fieldClass}`}
                            >
                                <SelectValue placeholder="Select vacant unit">
                                    {(value) => {
                                        const u = units.find(
                                            (x) => x.id === value,
                                        );
                                        return u
                                            ? `${u.building.name} · ${u.name}`
                                            : null;
                                    }}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {units.length === 0 ? (
                                    <div className="px-2 py-2 text-[12px] text-ink-soft">
                                        No vacant units available
                                    </div>
                                ) : (
                                    units.map((u) => (
                                        <SelectItem key={u.id} value={u.id}>
                                            {u.building.name} · {u.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>

                {/* Selected unit summary — replaces the bare numeric hint */}
                {selectedUnit && (
                    <div className="flex items-center justify-between gap-3 rounded-[10px] border border-jade-100 bg-jade-50/60 px-3 py-2 text-[12px]">
                        <div className="flex items-center gap-2">
                            <Sparkles
                                size={12}
                                className="text-jade-700"
                            />
                            <span className="text-ink">
                                Defaults from{" "}
                                <span className="font-semibold text-jade-900">
                                    {selectedUnit.building.name} ·{" "}
                                    {selectedUnit.name}
                                </span>
                            </span>
                        </div>
                        <span className="text-ink-soft tabular-nums">
                            Rent{" "}
                            <span className="font-semibold text-ink">
                                {formatMoney(selectedUnit.baseRent)}
                            </span>
                            {Number(selectedUnit.serviceCharge) > 0 && (
                                <>
                                    {" "}
                                    · Service{" "}
                                    <span className="font-semibold text-ink">
                                        {formatMoney(selectedUnit.serviceCharge)}
                                    </span>
                                </>
                            )}
                        </span>
                    </div>
                )}
            </FormSection>

            {/* Term */}
            <FormSection title="Term" bn="মেয়াদ">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Start date" htmlFor="l-start" required>
                        <Input
                            id="l-start"
                            type="date"
                            value={values.startDate}
                            onChange={(e) =>
                                handleStartDateChange(e.target.value)
                            }
                            min={todayISO()}
                            required
                            className={`${fieldClass} tabular-nums`}
                        />
                    </Field>

                    <Field
                        label="End date"
                        htmlFor="l-end"
                        hint="Leave blank for month-to-month"
                    >
                        <Input
                            id="l-end"
                            type="date"
                            value={values.endDate}
                            onChange={(e) => set("endDate", e.target.value)}
                            min={values.startDate || todayISO()}
                            className={`${fieldClass} tabular-nums`}
                        />
                    </Field>

                    <Field label="Move-in date" htmlFor="l-movein" required>
                        <Input
                            id="l-movein"
                            type="date"
                            value={values.moveInDate}
                            onChange={(e) => set("moveInDate", e.target.value)}
                            min={values.startDate || todayISO()}
                            required
                            className={`${fieldClass} tabular-nums`}
                        />
                    </Field>
                </div>
            </FormSection>

            {/* Pricing */}
            <FormSection title="Pricing" bn="ভাড়া">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Field
                        label="Monthly rent"
                        htmlFor="l-rent"
                        required
                        hint={
                            autoFilled.rent && selectedUnit
                                ? "Filled from unit default"
                                : "per month · BDT"
                        }
                    >
                        <MoneyInput
                            id="l-rent"
                            value={values.monthlyRent}
                            onChange={handleRentChange}
                            placeholder="18,000"
                            required
                            hinted={autoFilled.rent}
                        />
                    </Field>

                    <Field
                        label="Service charge"
                        htmlFor="l-svc"
                        required
                        hint={
                            autoFilled.service && selectedUnit
                                ? "Filled from unit default"
                                : "per month · BDT"
                        }
                    >
                        <MoneyInput
                            id="l-svc"
                            value={values.serviceCharge}
                            onChange={handleServiceChange}
                            placeholder="1,500"
                            required
                            hinted={autoFilled.service}
                        />
                    </Field>

                    <Field
                        label="Security deposit"
                        htmlFor="l-deposit"
                        hint="usually 2–3× rent"
                    >
                        <MoneyInput
                            id="l-deposit"
                            value={values.securityDeposit}
                            onChange={(v) => set("securityDeposit", v)}
                            placeholder="36,000"
                        />
                    </Field>

                    <Field
                        label="Rent due day"
                        htmlFor="l-dueday"
                        required
                        hint="Day of month (1–28) · usually 1, 5, or 7"
                    >
                        <Input
                            id="l-dueday"
                            type="number"
                            min={1}
                            max={28}
                            value={values.rentDueDay}
                            onChange={(e) => set("rentDueDay", e.target.value)}
                            placeholder="5"
                            required
                            className={`${fieldClass} tabular-nums`}
                        />
                    </Field>
                </div>
            </FormSection>

            {/* Billing mode */}
            <FormSection title="Billing mode" bn="বিলিং মোড">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {BILLING_MODE_OPTIONS.map((opt) => {
                        const isActive = values.billingMode === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => set("billingMode", opt.value)}
                                aria-pressed={isActive}
                                className={cn(
                                    "group relative flex flex-col items-start gap-1 rounded-[10px] border px-3.5 py-3 text-left transition-all",
                                    isActive
                                        ? "border-jade-700 bg-jade-50/60 ring-2 ring-jade-700/15"
                                        : "border-rule-soft bg-paper hover:border-jade-700/40",
                                )}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <span
                                        className={cn(
                                            "text-[13px] font-bold",
                                            isActive ? "text-jade-950" : "text-ink",
                                        )}
                                    >
                                        {opt.label}
                                    </span>
                                    <span
                                        aria-hidden
                                        className={cn(
                                            "inline-flex size-4 items-center justify-center rounded-full border-2",
                                            isActive
                                                ? "border-jade-700 bg-jade-700"
                                                : "border-rule-soft bg-paper",
                                        )}
                                    >
                                        {isActive && (
                                            <span className="size-1.5 rounded-full bg-paper" />
                                        )}
                                    </span>
                                </div>
                                <span className="text-[11.5px] leading-relaxed text-ink-soft">
                                    {opt.description}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Utility fields — only when FIXED_SEPARATE */}
                {values.billingMode === "FIXED_SEPARATE" && (
                    <div className="space-y-3 rounded-[10px] border border-rule-soft bg-cream/40 px-3.5 py-3">
                        <div className="flex items-center gap-2">
                            <Layers size={12} className="text-ink-soft" />
                            <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                                Monthly utilities
                            </h4>
                            <span className="font-bangla text-[10.5px] text-ink-soft/65">
                                · মাসিক ইউটিলিটি
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <Field label="Gas" htmlFor="l-gas">
                                <UtilityInput
                                    id="l-gas"
                                    icon={Flame}
                                    value={values.gasCharge}
                                    onChange={(v) => set("gasCharge", v)}
                                    placeholder="2,000"
                                />
                            </Field>
                            <Field label="Water" htmlFor="l-water">
                                <UtilityInput
                                    id="l-water"
                                    icon={Droplets}
                                    value={values.waterCharge}
                                    onChange={(v) => set("waterCharge", v)}
                                    placeholder="1,500"
                                />
                            </Field>
                            <Field label="Electricity" htmlFor="l-elec">
                                <UtilityInput
                                    id="l-elec"
                                    icon={Zap}
                                    value={values.electricityCharge}
                                    onChange={(v) =>
                                        set("electricityCharge", v)
                                    }
                                    placeholder="2,500"
                                />
                            </Field>
                            <Field label="Internet" htmlFor="l-net">
                                <UtilityInput
                                    id="l-net"
                                    icon={Wifi}
                                    value={values.internetCharge}
                                    onChange={(v) => set("internetCharge", v)}
                                    placeholder="1,000"
                                />
                            </Field>
                        </div>

                        <p className="text-[11.5px] text-ink-soft">
                            Leave any field at <span className="tabular-nums">0</span> if
                            that utility isn&apos;t billed by you. These are added to the
                            monthly invoice on top of rent + service charge.
                        </p>
                    </div>
                )}
            </FormSection>

            {/* Live total — visible whenever we have rent input */}
            {liveMonthlyTotal > 0 && (
                <div className="flex items-center justify-between gap-3 rounded-[10px] border border-jade-100 bg-jade-50/40 px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                        <Sparkles size={13} className="text-jade-700" />
                        <span className="text-[12.5px] text-ink">
                            First invoice total
                        </span>
                        <span className="font-bangla text-[10.5px] text-ink-soft/65">
                            · প্রথম ইনভয়েস
                        </span>
                    </div>
                    <span className="text-[15px] font-bold text-jade-950 tabular-nums">
                        ৳ {liveMonthlyTotal.toLocaleString()}
                    </span>
                </div>
            )}

            {/* Outcome preview */}
            <div className="flex items-start gap-2.5 rounded-[10px] border-l-[2.5px] border-coral-500 bg-cream/70 px-3 py-2.5">
                <Info size={14} className="mt-0.5 shrink-0 text-coral-600" />
                <div className="text-[12.5px] leading-relaxed text-ink">
                    <p>
                        Creating this lease will mark{" "}
                        {selectedUnit ? (
                            <span className="font-semibold">
                                {selectedUnit.building.name} ·{" "}
                                {selectedUnit.name}
                            </span>
                        ) : (
                            <span>the selected unit</span>
                        )}{" "}
                        as{" "}
                        <span className="font-semibold text-jade-800">
                            OCCUPIED
                        </span>
                        {selectedTenant && (
                            <>
                                {" "}
                                under{" "}
                                <span className="font-semibold">
                                    {selectedTenant.name}
                                </span>
                            </>
                        )}{" "}
                        and generate the first month&apos;s invoice automatically.
                    </p>
                    <p className="font-bangla mt-1 text-[11.5px] text-ink-soft">
                        ইউনিট &quot;ভাড়া&quot; হিসেবে চিহ্নিত হবে ও প্রথম মাসের
                        ইনভয়েস তৈরি হবে।
                    </p>
                </div>
            </div>

            <FormActions
                submitting={submitting}
                submitLabel={submitLabel}
                onCancel={onCancel}
            />
        </form>
    );
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

/**
 * Section header pattern used inside complex forms — keeps the
 * "Parties / Term / Pricing" rhythm visible.
 */
function FormSection({
    title,
    bn,
    children,
}: {
    title: string;
    bn: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-3">
            <div className="flex items-baseline gap-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    {title}
                </h3>
                <span className="font-bangla text-[10.5px] text-ink-soft/65">
                    · {bn}
                </span>
            </div>
            {children}
        </section>
    );
}

/**
 * Money input with ৳ prefix. `hinted` prop dims the value slightly to
 * suggest "this came from a default and you can change it" — disappears
 * the moment the user types.
 */
function MoneyInput({
    id,
    value,
    onChange,
    placeholder,
    required,
    hinted,
}: {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    required?: boolean;
    hinted?: boolean;
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
                className={`${fieldClass} pl-7 tabular-nums ${
                    hinted ? "text-ink/75" : ""
                }`}
            />
        </div>
    );
}

/**
 * Compact utility input — icon on the left, no ৳ prefix (saves horizontal
 * space in the 4-column grid). Zero is acceptable.
 */
function UtilityInput({
    id,
    icon: Icon,
    value,
    onChange,
    placeholder,
}: {
    id: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <div className="relative">
            <Icon
                size={12}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-soft/70"
            />
            <Input
                id={id}
                type="number"
                min={0}
                step="any"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`${fieldClass} pl-7 tabular-nums`}
            />
        </div>
    );
}