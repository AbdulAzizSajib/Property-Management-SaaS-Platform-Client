import type { LeaseSummary } from "./unit.types";

export interface TenantUser {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    image: string | null;
    isActive: boolean;
}

// A tenant's assigned location, as returned by the tenant endpoints.
export interface TenantBuildingSummary {
    id: string;
    name: string;
}
export interface TenantFloorSummary {
    id: string;
    name: string;
}
export interface TenantUnitSummary {
    id: string;
    name: string;
    baseRent: string;
    serviceCharge: string;
    floor: TenantFloorSummary;
}

export interface Tenant {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    nidNumber: string | null;
    emergencyContact: string | null;
    emergencyName: string | null;
    occupation: string | null;
    permanentAddress: string | null;
    photoUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    userId: string | null;
    // Assigned location. buildingId is always set; floor/unit are optional.
    buildingId: string;
    floorId: string | null;
    unitId: string | null;
}

// A tenant's active lease as returned by GET /tenants — includes the unit's
// building so tenants can be grouped/filtered by building on the client.
export interface TenantLeaseSummary extends LeaseSummary {
    unit: {
        id: string;
        name: string;
        building: { id: string; name: string };
    };
}

// GET /tenants — list item shape (with leases array + assigned location)
export interface TenantListItem extends Tenant {
    leases: TenantLeaseSummary[];
    building: TenantBuildingSummary | null;
    floor: TenantFloorSummary | null;
    unit: TenantUnitSummary | null;
}

// GET /tenants/:id — detail shape (with user + leases + assigned location)
export interface TenantDetail extends Tenant {
    user: TenantUser | null;
    leases: LeaseSummary[];
    building: TenantBuildingSummary | null;
    floor: TenantFloorSummary | null;
    unit: TenantUnitSummary | null;
}

// Query params for GET /tenants.
export interface TenantFilters {
    page?: number;
    limit?: number;
    // Scope to tenants assigned to a building (and optionally its floor/unit)
    // — used by the lease-creation cascade.
    buildingId?: string;
    floorId?: string;
    unitId?: string;
}

export interface UpdateTenantPayload {
    name?: string;
    phone?: string;
    email?: string | null;
    nidNumber?: string | null;
    emergencyContact?: string | null;
    emergencyName?: string | null;
    occupation?: string | null;
    permanentAddress?: string | null;
    photoUrl?: string | null;
    buildingId?: string;
    floorId?: string | null;
    unitId?: string | null;
    isActive?: boolean;
}
