"use client";

// src/components/dashboard/forms/BuildingFloorUnitSelect.tsx
//
// Shared cascading Building → Floor → Unit picker. Floor only narrows the
// Unit list — it isn't sent anywhere by itself unless the caller uses it.
// Selecting a building resets floor + unit; selecting a floor resets unit.

import { Field, fieldClass } from "@/src/components/dashboard/forms/form-primitives";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { useBuildings } from "@/src/hooks/useBuildings";
import { useFloorsByBuilding } from "@/src/hooks/useFloors";
import { useUnits } from "@/src/hooks/useUnits";
import type { UnitStatus } from "@/src/types/unit.types";

const NONE = "__NONE__";

export interface BuildingFloorUnitValue {
    buildingId: string;
    floorId: string;
    unitId: string;
}

interface BuildingFloorUnitSelectProps {
    value: BuildingFloorUnitValue;
    onChange: (value: BuildingFloorUnitValue) => void;
    /** Restrict the unit list to a status (e.g. "VACANT" for move-in flows). */
    unitStatus?: UnitStatus;
    /** Show a "no floor / not building-specific" opt-out on the building field. */
    buildingOptional?: boolean;
    floorOptional?: boolean;
    unitOptional?: boolean;
    idPrefix?: string;
}

/**
 * Cascading Building → Floor → Unit selector, styled to match the dashboard
 * form primitives (Field / fieldClass). Emits only IDs — callers decide what
 * to persist (e.g. Expense only stores buildingId + unitId, not floorId).
 */
export function BuildingFloorUnitSelect({
    value,
    onChange,
    unitStatus,
    buildingOptional = true,
    floorOptional = true,
    unitOptional = true,
    idPrefix = "bfu",
}: BuildingFloorUnitSelectProps) {
    const { data: buildings } = useBuildings();
    const { data: floors } = useFloorsByBuilding(value.buildingId || undefined);
    const { data: units } = useUnits(
        value.buildingId
            ? {
                  buildingId: value.buildingId,
                  ...(value.floorId && { floorId: value.floorId }),
                  ...(unitStatus && { status: unitStatus }),
              }
            : undefined,
    );

    function handleBuildingChange(id: string) {
        const buildingId = id === NONE ? "" : id;
        onChange({ buildingId, floorId: "", unitId: "" });
    }

    function handleFloorChange(id: string) {
        const floorId = id === NONE ? "" : id;
        onChange({ ...value, floorId, unitId: "" });
    }

    function handleUnitChange(id: string) {
        const unitId = id === NONE ? "" : id;
        onChange({ ...value, unitId });
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Building" htmlFor={`${idPrefix}-building`}>
                <Select
                    value={value.buildingId || NONE}
                    onValueChange={(v) => handleBuildingChange(v ?? NONE)}
                >
                    <SelectTrigger
                        id={`${idPrefix}-building`}
                        className={`w-full ${fieldClass}`}
                    >
                        <SelectValue placeholder="Select building">
                            {(id) =>
                                (buildings ?? []).find((b) => b.id === id)
                                    ?.name ?? null
                            }
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {buildingOptional && (
                            <SelectItem value={NONE}>
                                <span className="text-ink-soft">
                                    Organization-wide
                                </span>
                            </SelectItem>
                        )}
                        {(buildings ?? []).map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                                {b.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>

            <Field label="Floor" htmlFor={`${idPrefix}-floor`}>
                <Select
                    value={value.floorId || NONE}
                    onValueChange={(v) => handleFloorChange(v ?? NONE)}
                    disabled={!value.buildingId}
                >
                    <SelectTrigger
                        id={`${idPrefix}-floor`}
                        className={`w-full ${fieldClass}`}
                    >
                        <SelectValue
                            placeholder={
                                value.buildingId
                                    ? "Select floor"
                                    : "Select a building first"
                            }
                        >
                            {(id) =>
                                (floors ?? []).find((f) => f.id === id)
                                    ?.name ?? null
                            }
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {floorOptional && (
                            <SelectItem value={NONE}>
                                <span className="text-ink-soft">
                                    All floors
                                </span>
                            </SelectItem>
                        )}
                        {(floors ?? []).length === 0 ? (
                            <div className="px-2 py-2 text-[12px] text-ink-soft">
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
            </Field>

            <Field label="Unit" htmlFor={`${idPrefix}-unit`}>
                <Select
                    value={value.unitId || NONE}
                    onValueChange={(v) => handleUnitChange(v ?? NONE)}
                    disabled={!value.buildingId}
                >
                    <SelectTrigger
                        id={`${idPrefix}-unit`}
                        className={`w-full ${fieldClass}`}
                    >
                        <SelectValue
                            placeholder={
                                value.buildingId
                                    ? "Select unit"
                                    : "Select a building first"
                            }
                        >
                            {(id) =>
                                (units ?? []).find((u) => u.id === id)?.name ??
                                null
                            }
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {unitOptional && (
                            <SelectItem value={NONE}>
                                <span className="text-ink-soft">
                                    No specific unit
                                </span>
                            </SelectItem>
                        )}
                        {(units ?? []).length === 0 ? (
                            <div className="px-2 py-2 text-[12px] text-ink-soft">
                                No units
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
            </Field>
        </div>
    );
}
