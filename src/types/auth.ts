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

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    contactNumber: string;
    organization: {
        name: string;
        slug: string;
        phone: string;
        email: string;
        address: string;
    };
};

export type LoginPayload = {
    email: string;
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
};
