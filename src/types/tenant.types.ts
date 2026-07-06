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

// GET /tenants — list item shape (with leases array)
export interface TenantListItem extends Tenant {
    leases: TenantLeaseSummary[];
}

// GET /tenants/:id — detail shape (with user + leases)
export interface TenantDetail extends Tenant {
    user: TenantUser | null;
    leases: LeaseSummary[];
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
    isActive?: boolean;
}
