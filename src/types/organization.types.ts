import type { Subscription } from "./subscription.types";

export interface Organization {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// GET /organizations/me returns the org with its subscription embedded.
export interface OrganizationWithSubscription extends Organization {
    subscription: Subscription | null;
}

export interface UpdateOrganizationPayload {
    name?: string;
    logoUrl?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
}
