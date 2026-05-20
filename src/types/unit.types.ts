import type { Building } from "./building.types";
import type { Floor } from "./floor.types";

export type UnitType = "FLAT" | "STUDIO" | "SHOP" | "OFFICE" | "WAREHOUSE";

export type UnitStatus =
    | "VACANT"
    | "OCCUPIED"
    | "UNDER_MAINTENANCE"
    | "RESERVED";

export const UNIT_TYPE_OPTIONS: { value: UnitType; label: string }[] = [
    { value: "FLAT", label: "Flat" },
    { value: "STUDIO", label: "Studio" },
    { value: "SHOP", label: "Shop" },
    { value: "OFFICE", label: "Office" },
    { value: "WAREHOUSE", label: "Warehouse" },
];

export const UNIT_STATUS_OPTIONS: { value: UnitStatus; label: string }[] = [
    { value: "VACANT", label: "Vacant" },
    { value: "OCCUPIED", label: "Occupied" },
    { value: "UNDER_MAINTENANCE", label: "Under maintenance" },
    { value: "RESERVED", label: "Reserved" },
];

export interface LeaseSummary {
    id: string;
    status: string;
    startDate: string;
    endDate: string;
    monthlyRent: string;
    tenantId: string;
}

// Backend returns Prisma Decimal as a string for baseRent/serviceCharge.
export interface Unit {
    id: string;
    name: string;
    type: UnitType;
    status: UnitStatus;
    bedrooms: number | null;
    bathrooms: number | null;
    sizeSqft: number | null;
    baseRent: string;
    serviceCharge: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    buildingId: string;
    floorId: string;
}

export interface UnitBuildingSummary {
    id: string;
    name: string;
}

export interface UnitFloorSummary {
    id: string;
    name: string;
    floorNumber: number;
}

// GET /units — list item shape
export interface UnitListItem extends Unit {
    building: UnitBuildingSummary;
    floor: UnitFloorSummary;
    leases: LeaseSummary[];
}

// GET /units/:id — detail shape (full Building + full Floor)
export interface UnitDetail extends Unit {
    building: Building;
    floor: Floor;
    leases: LeaseSummary[];
}

export interface CreateUnitPayload {
    buildingId: string;
    floorId: string;
    name: string;
    type: UnitType;
    bedrooms?: number;
    bathrooms?: number;
    sizeSqft?: number;
    baseRent: number;
    serviceCharge: number;
    description?: string;
}

export interface UpdateUnitPayload {
    name?: string;
    type?: UnitType;
    status?: UnitStatus;
    bedrooms?: number | null;
    bathrooms?: number | null;
    sizeSqft?: number | null;
    baseRent?: number;
    serviceCharge?: number;
    description?: string | null;
}

export interface UnitFilters {
    buildingId?: string;
    floorId?: string;
    status?: UnitStatus;
    type?: UnitType;
}
