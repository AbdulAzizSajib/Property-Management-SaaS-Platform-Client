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
import { useTenants } from "@/src/hooks/useTenants";
import { useUnits } from "@/src/hooks/useUnits";
import type { CreateLeasePayload } from "@/src/types/lease.types";
import { Loader2 } from "lucide-react";
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
};

interface LeaseFormProps {
    submitting: boolean;
    submitLabel: string;
    /** Pre-select a unit (e.g. when creating from a unit detail page). */
    fixedUnitId?: string;
    /** Pre-select a tenant. */
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

    // Only show vacant units for new leases — but always include a fixed one even if not vacant.
    const { data: allUnits } = useUnits({ status: "VACANT" });
    const { data: tenants } = useTenants();

    const units = useMemo(() => allUnits ?? [], [allUnits]);
    const activeTenants = useMemo(
        () => (tenants ?? []).filter((t) => t.isActive),
        [tenants],
    );

    // When a unit is picked, prefill rent + service charge from the unit defaults.
    const selectedUnit = units.find((u) => u.id === values.unitId);

    function set<K extends keyof LeaseFormValues>(
        key: K,
        value: LeaseFormValues[K],
    ) {
        setValues((v) => ({ ...v, [key]: value }));
    }

    function handleUnitChange(unitId: string) {
        const unit = units.find((u) => u.id === unitId);
        setValues((v) => ({
            ...v,
            unitId,
            // Auto-prefill if the user hasn't typed anything yet.
            monthlyRent: v.monthlyRent === "" && unit ? String(unit.baseRent) : v.monthlyRent,
            serviceCharge:
                v.serviceCharge === "" && unit
                    ? String(unit.serviceCharge)
                    : v.serviceCharge,
        }));
    }

    function handleStartDateChange(value: string) {
        setValues((v) => ({
            ...v,
            startDate: value,
            // Default move-in to start date if not yet set
            moveInDate: v.moveInDate === "" ? value : v.moveInDate,
        }));
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        const payload: CreateLeasePayload = {
            tenantId: values.tenantId,
            unitId: values.unitId,
            startDate: values.startDate,
            endDate: values.endDate,
            moveInDate: values.moveInDate,
            monthlyRent: Number(values.monthlyRent),
            serviceCharge: Number(values.serviceCharge),
            securityDeposit: Number(values.securityDeposit) || 0,
            rentDueDay: Number(values.rentDueDay) || 1,
        };

        onSubmit(payload);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tenant + Unit */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Parties
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="l-tenant">
                            Tenant <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                            value={values.tenantId}
                            onValueChange={(v) => set("tenantId", v ?? "")}
                            disabled={!!fixedTenantId}
                        >
                            <SelectTrigger id="l-tenant" className="w-full">
                                <SelectValue placeholder="Select tenant" />
                            </SelectTrigger>
                            <SelectContent>
                                {activeTenants.length === 0 ? (
                                    <div className="px-2 py-2 text-xs text-slate-500">
                                        No active tenants
                                    </div>
                                ) : (
                                    activeTenants.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name} — {t.phone}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="l-unit">
                            Unit <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                            value={values.unitId}
                            onValueChange={(v) => handleUnitChange(v ?? "")}
                            disabled={!!fixedUnitId}
                        >
                            <SelectTrigger id="l-unit" className="w-full">
                                <SelectValue placeholder="Select vacant unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {units.length === 0 ? (
                                    <div className="px-2 py-2 text-xs text-slate-500">
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
                        {selectedUnit && (
                            <p className="text-[11px] text-slate-500">
                                Default rent: {selectedUnit.baseRent} · service:{" "}
                                {selectedUnit.serviceCharge}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Dates */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Term
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="l-start">
                            Start date <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="l-start"
                            type="date"
                            value={values.startDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            min={todayISO()}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="l-end">
                            End date <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="l-end"
                            type="date"
                            value={values.endDate}
                            onChange={(e) => set("endDate", e.target.value)}
                            min={values.startDate || todayISO()}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="l-movein">
                            Move-in date <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="l-movein"
                            type="date"
                            value={values.moveInDate}
                            onChange={(e) => set("moveInDate", e.target.value)}
                            min={values.startDate || todayISO()}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Money */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Pricing
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="l-rent">
                            Monthly rent <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="l-rent"
                            type="number"
                            min={0}
                            step="any"
                            value={values.monthlyRent}
                            onChange={(e) => set("monthlyRent", e.target.value)}
                            placeholder="18000"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="l-svc">
                            Service charge <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="l-svc"
                            type="number"
                            min={0}
                            step="any"
                            value={values.serviceCharge}
                            onChange={(e) => set("serviceCharge", e.target.value)}
                            placeholder="1500"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="l-deposit">Security deposit</Label>
                        <Input
                            id="l-deposit"
                            type="number"
                            min={0}
                            step="any"
                            value={values.securityDeposit}
                            onChange={(e) => set("securityDeposit", e.target.value)}
                            placeholder="36000"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="l-dueday">
                            Rent due day <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="l-dueday"
                            type="number"
                            min={1}
                            max={28}
                            value={values.rentDueDay}
                            onChange={(e) => set("rentDueDay", e.target.value)}
                            placeholder="5"
                            required
                        />
                        <p className="text-[11px] text-slate-500">Day of month (1–28)</p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <strong>Note:</strong> Creating this lease will mark the unit as{" "}
                <span className="font-medium text-emerald-700">OCCUPIED</span> and generate
                the first month&apos;s invoice automatically.
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
