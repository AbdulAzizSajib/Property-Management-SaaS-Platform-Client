export type { UserRole } from "@/src/lib/authUtils";
import type { UserRole } from "@/src/lib/authUtils";

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    role: UserRole;
    contactNumber: string | null;
    organizationId: string | null;
    isActive: boolean;
    needPasswordChange: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    lastLoginAt: string | null;
};

export type { Organization } from "./organization.types";
import type { Organization } from "./organization.types";

/**
 * Shape returned by GET /auth/me — the authenticated user's full profile.
 * Extends AuthUser with the embedded organization and role-scoped relations
 * the backend attaches (tenant profile, managed/caretaken buildings).
 */
export type CurrentUser = AuthUser & {
    status: string;
    organization: Organization | null;
    tenantProfile: unknown | null;
    managedBuildings: unknown[];
    caretakerOf: unknown[];
};

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    contactNumber: string;
    /**
     * Optional — the backend auto-creates the organization for a new owner,
     * so the registration UI no longer collects org details.
     */
    organization?: {
        name: string;
        slug: string;
        /** Optional — backend accepts org without contact phone. */
        phone?: string;
        /** Optional — backend accepts org without contact email. */
        email?: string;
        address: string;
    };
};

export type LoginPayload = {
    /** Email or Bangladeshi phone number — the backend accepts either. */
    identifier: string;
    password: string;
};

export type AuthData = {
    token: string | null;
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
    organization: Organization | null;
};

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export type ApiErrorBody = {
    success: false;
    message: string;
    errors?: Record<string, string[]> | string[];
    /**
     * Some endpoints (notably auth flows) include a structured `error` block
     * with a machine-readable `code` we can branch on. E.g. login may return
     * `error.body.code === "EMAIL_NOT_VERIFIED"`, in which case the backend
     * also auto-resends a fresh OTP and we should route the user to verify.
     */
    error?: {
        status?: string;
        statusCode?: number;
        body?: {
            code?: string;
            message?: string;
        };
    };
};
