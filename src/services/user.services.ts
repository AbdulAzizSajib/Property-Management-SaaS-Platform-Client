import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    CreateStaffPayload,
    CreateTenantUserPayload,
    PaginatedUsers,
    UpdateUserPayload,
    User,
    UserFilters,
} from "@/src/types/user.types";

function buildUserQuery(filters?: UserFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.role) params.set("role", filters.role);
    if (filters.search) params.set("search", filters.search);
    const q = params.toString();
    return q ? `?${q}` : "";
}

/**
 * POST /users/create-staff
 * Allowed: OWNER, SUPER_ADMIN. Role must be MANAGER or CARETAKER.
 */
export const createStaff = async (payload: CreateStaffPayload) =>
    httpClient.post<User>("/users/create-staff", payload);

/**
 * POST /users/create-tenant
 * Allowed: OWNER, MANAGER, CARETAKER.
 */
export const createTenantUser = async (payload: CreateTenantUserPayload) =>
    httpClient.post<User>("/users/create-tenant", payload);

/** GET /users — paginated user list with optional role/search filter. */
export const getUsers = async (filters?: UserFilters) =>
    httpClient.get<PaginatedUsers>(`/users${buildUserQuery(filters)}`);

export const getUserById = async (id: string) =>
    httpClient.get<User>(`/users/${id}`);

export const updateUser = async (id: string, payload: UpdateUserPayload) =>
    httpClient.patch<User>(`/users/${id}`, payload);

/** DELETE /users/:id — soft delete. */
export const deleteUser = async (id: string) =>
    httpClient.delete<{ id: string }>(`/users/${id}`);
