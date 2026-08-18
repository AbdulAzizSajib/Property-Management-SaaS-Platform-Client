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
import { useBuildings } from "@/src/hooks/useBuildings";
import { useFloorsByBuilding } from "@/src/hooks/useFloors";
import { useTenants } from "@/src/hooks/useTenants";
import { useUnits } from "@/src/hooks/useUnits";
import { type CreateLeasePayload } from "@/src/types/lease.types";
import { Info, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
  onSubmit: (payload: CreateLeasePayload) => void;
  onCancel?: () => void;
}

export function LeaseForm({
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: LeaseFormProps) {
  const [values, setValues] = useState<LeaseFormValues>(emptyForm);

  // Track which money fields were auto-filled from unit defaults
  // so we can show a subtle indicator and reset them if the user
  // picks a different unit.
  const [autoFilled, setAutoFilled] = useState<{
    rent: boolean;
    service: boolean;
  }>({ rent: false, service: false });

  // Cascade: Building -> Floor -> vacant Unit -> Tenant (scoped to the
  // selected building, further narrowed by floor). Each step is disabled
  // until its parent is chosen, and changing a parent clears everything
  // that depended on it.
  const [buildingId, setBuildingId] = useState("");
  const [floorId, setFloorId] = useState("");

  const { data: buildings } = useBuildings();
  const { data: floors } = useFloorsByBuilding(buildingId || undefined);
  const { data: vacantUnits } = useUnits(
    { buildingId, floorId: floorId || undefined, status: "VACANT" },
    { enabled: !!buildingId },
  );
  const { data: tenantsRes } = useTenants(
    { buildingId, floorId: floorId || undefined, limit: 1000 },
    { enabled: !!buildingId },
  );
  const tenants = tenantsRes?.data;

  const buildingList = useMemo(() => buildings ?? [], [buildings]);
  const floorList = useMemo(() => floors ?? [], [floors]);
  const unitList = useMemo(() => vacantUnits ?? [], [vacantUnits]);

  // Active tenants assigned to the selected building/floor. The API already
  // scopes this; isActive is filtered client-side since it's not a query param.
  const activeTenants = useMemo(
    () => (tenants ?? []).filter((t) => t.isActive),
    [tenants],
  );

  const selectedUnit = unitList.find((u) => u.id === values.unitId) ?? null;
  const selectedTenant = activeTenants.find((t) => t.id === values.tenantId);

  // Switching building invalidates floor, unit, and tenant selections.
  function handleBuildingChange(id: string) {
    setBuildingId(id);
    setFloorId("");
    setValues((v) => ({ ...v, unitId: "", tenantId: "" }));
    setAutoFilled({ rent: false, service: false });
  }

  // Switching floor invalidates unit and tenant selections.
  function handleFloorChange(id: string) {
    setFloorId(id);
    setValues((v) => ({ ...v, unitId: "", tenantId: "" }));
    setAutoFilled({ rent: false, service: false });
  }

  function set<K extends keyof LeaseFormValues>(
    key: K,
    value: LeaseFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleUnitChange(unitId: string) {
    const unit = unitList.find((u) => u.id === unitId) ?? null;

    setValues((v) => {
      // Replace rent/service if they were either blank OR previously auto-filled
      const shouldReplaceRent = v.monthlyRent === "" || autoFilled.rent;
      const shouldReplaceService = v.serviceCharge === "" || autoFilled.service;

      return {
        ...v,
        unitId,
        // Selecting a different unit invalidates any tenant chosen for the
        // previous unit (tenants aren't scoped to a single unit, but keeping
        // a stale selection around is confusing).
        tenantId: "",
        monthlyRent:
          shouldReplaceRent && unit ? String(unit.baseRent) : v.monthlyRent,
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

  function handleTenantChange(tenantId: string) {
    set("tenantId", tenantId);
  }

  // If the floor list, unit list, or tenant list re-fetches and the current
  // selection is no longer present in the new scope, clear it rather than
  // silently keep a stale id from a previous building/floor.
  useEffect(() => {
    if (floorId && floors && !floors.some((f) => f.id === floorId)) {
      setFloorId("");
    }
  }, [floors, floorId]);

  useEffect(() => {
    if (
      values.unitId &&
      vacantUnits &&
      !vacantUnits.some((u) => u.id === values.unitId)
    ) {
      setValues((v) => ({ ...v, unitId: "", tenantId: "" }));
    }
  }, [vacantUnits, values.unitId]);

  useEffect(() => {
    if (
      values.tenantId &&
      tenants &&
      !tenants.some((t) => t.id === values.tenantId)
    ) {
      setValues((v) => ({ ...v, tenantId: "" }));
    }
  }, [tenants, values.tenantId]);

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

    if (!values.unitId) return;

    const payload: CreateLeasePayload = {
      tenantId: values.tenantId,
      unitId: values.unitId,
      startDate: values.startDate,
      moveInDate: values.moveInDate,
      monthlyRent: Number(values.monthlyRent),
      serviceCharge: Number(values.serviceCharge || 0),
      securityDeposit: Number(values.securityDeposit) || 0,
      rentDueDay: Number(values.rentDueDay) || 1,
      ...(values.endDate && { endDate: values.endDate }),
    };

    onSubmit(payload);
  }

  // Live total for the "first month" preview line.
  const liveMonthlyTotal = useMemo(() => {
    const rent = Number(values.monthlyRent) || 0;
    const svc = Number(values.serviceCharge) || 0;
    return rent + svc;
  }, [values.monthlyRent, values.serviceCharge]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Parties */}
      <FormSection title="Parties">
        <Field label="Building" htmlFor="l-building" required>
          <Select
            value={buildingId}
            onValueChange={(v) => handleBuildingChange(v ?? "")}
          >
            <SelectTrigger id="l-building" className={`w-full ${fieldClass}`}>
              <SelectValue placeholder="Select building">
                {(value) => {
                  const b = buildingList.find((x) => x.id === value);
                  return b ? b.name : null;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {buildingList.length === 0 ? (
                <div className="px-2 py-2 text-[12px] text-ink-soft">
                  No buildings
                </div>
              ) : (
                buildingList.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Floor" htmlFor="l-floor" required>
          <Select
            value={floorId}
            onValueChange={(v) => handleFloorChange(v ?? "")}
            disabled={!buildingId}
          >
            <SelectTrigger id="l-floor" className={`w-full ${fieldClass}`}>
              <SelectValue
                placeholder={
                  buildingId ? "Select floor" : "Select a building first"
                }
              >
                {(value) => {
                  const f = floorList.find((x) => x.id === value);
                  return f ? f.name : null;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {floorList.length === 0 ? (
                <div className="px-2 py-2 text-[12px] text-ink-soft">
                  No floors in this building
                </div>
              ) : (
                floorList.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    <span className="flex w-full items-center justify-between gap-3">
                      <span>{f.name}</span>
                      <span className="text-ink-soft tabular-nums">
                        {f.vacantUnitCount} vacant / {f._count.units}
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
            disabled={!floorId}
          >
            <SelectTrigger id="l-unit" className={`w-full ${fieldClass}`}>
              <SelectValue
                placeholder={floorId ? "Select unit" : "Select a floor first"}
              >
                {(value) => {
                  const u = unitList.find((x) => x.id === value);
                  return u ? u.name : null;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {unitList.length === 0 ? (
                <div className="px-2 py-2 text-[12px] text-ink-soft">
                  No vacant units on this floor
                </div>
              ) : (
                unitList.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    <span className="flex w-full items-center justify-between gap-3">
                      <span>{u.name}</span>
                      <span className="text-ink-soft tabular-nums">
                        {formatMoney(u.baseRent)}
                      </span>
                    </span>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Tenant" htmlFor="l-tenant" required>
          <Select
            value={values.tenantId}
            onValueChange={(v) => handleTenantChange(v ?? "")}
            disabled={!values.unitId}
          >
            <SelectTrigger id="l-tenant" className={`w-full ${fieldClass}`}>
              <SelectValue
                placeholder={
                  values.unitId ? "Select tenant" : "Select a unit first"
                }
              >
                {(value) => {
                  const t = activeTenants.find((x) => x.id === value);
                  return t ? `${t.name} · ${t.phone}` : null;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {activeTenants.length === 0 ? (
                <div className="px-2 py-2 text-[12px] text-ink-soft">
                  No active tenants in this building
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
                      <span>{t.name}</span>
                    </span>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </Field>

        {/* Selected unit's rent/service defaults */}
        {selectedUnit && (
          <div className="flex items-center justify-between gap-3 rounded-[10px] border border-jade-100 bg-jade-50/60 px-3 py-2 text-[12px]">
            <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-jade-700" />
              <span className="text-ink">
                Defaults from{" "}
                <span className="font-semibold text-jade-900">
                  {selectedUnit.floor.name} | {selectedUnit.name}
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
      <FormSection title="Term">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Start date" htmlFor="l-start" required>
            <Input
              id="l-start"
              type="date"
              value={values.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
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
      <FormSection title="Pricing">
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

      {/* Live total — visible whenever we have rent input */}
      {liveMonthlyTotal > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-[10px] border border-jade-100 bg-jade-50/40 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-jade-700" />
            <span className="text-[12.5px] text-ink">First invoice total</span>
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
                {selectedUnit.floor.name} · {selectedUnit.name}
              </span>
            ) : (
              <span>the selected unit</span>
            )}{" "}
            as <span className="font-semibold text-jade-800">OCCUPIED</span>
            {selectedTenant && (
              <>
                {" "}
                under{" "}
                <span className="font-semibold">{selectedTenant.name}</span>
              </>
            )}{" "}
            and generate the first month&apos;s invoice automatically.
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
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
          {title}
        </h3>
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
