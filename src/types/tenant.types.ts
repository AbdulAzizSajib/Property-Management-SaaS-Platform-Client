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

// GET /tenants — list item shape (with leases array)
export interface TenantListItem extends Tenant {
    leases: LeaseSummary[];
}

// GET /tenants/:id — detail shape (with user + leases)
export interface TenantDetail extends Tenant {
    user: TenantUser | null;
    leases: LeaseSummary[];
}

export interface CreateTenantPayload {
    name: string;
    phone: string;
    email?: string;
    nidNumber?: string;
    emergencyContact?: string;
    emergencyName?: string;
    occupation?: string;
    permanentAddress?: string;
    photoUrl?: string;
    createLoginAccount?: boolean;
    password?: string;
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
