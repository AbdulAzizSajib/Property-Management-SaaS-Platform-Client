// Users module — platform-level user records (login-capable accounts).
// Distinct from Tenant which is the renter profile (may or may not have
// an account). Endpoints under /users handle staff + user CRUD.

import type { UserRole } from "@/src/lib/authUtils";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    contactNumber: string | null;
    image: string | null;
    emailVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    organizationId: string | null;
}

export interface CreateStaffPayload {
    password: string;
    role: "MANAGER" | "CARETAKER";
    user: {
        name: string;
        email: string;
        contactNumber?: string;
        image?: string;
    };
    /** Buildings to attach this staff member to (managers/caretakers). */
    buildingIds?: string[];
}

export interface CreateTenantUserPayload {
    tenant: {
        name: string;
        phone: string;
        email?: string;
        nidNumber?: string;
        emergencyContact?: string;
        emergencyName?: string;
        occupation?: string;
        permanentAddress?: string;
        photoUrl?: string;
    };
    createLoginAccount: boolean;
    /** Required when createLoginAccount is true. */
    password?: string;
}

export interface UpdateUserPayload {
    name?: string;
    contactNumber?: string | null;
    image?: string | null;
    isActive?: boolean;
}

export interface UserFilters {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
}

export interface PaginatedUsers {
    items: User[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
