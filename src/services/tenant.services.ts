"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    Tenant,
    TenantDetail,
    TenantFilters,
    TenantListItem,
} from "@/src/types/tenant.types";

/**
 * POST /tenants — multipart upload. Allowed: OWNER, MANAGER, CARETAKER.
 * Subscription tenant limit is enforced.
 * FormData fields: `data` (JSON string of the tenant fields) and an optional
 * `photo` file. When createLoginAccount=true, password is required inside `data`.
 */
export const createTenant = async (formData: FormData) =>
    httpClient.upload<Tenant>("/tenants", formData);

/**
 * GET /tenants — paginated list of tenants in caller's organization.
 * Defaults to page 1 / limit 10 when no filters are given; response `meta`
 * carries { page, limit, total, totalPages }. Pass buildingId (+ optional
 * floorId/unitId) to scope to tenants assigned to that building, e.g. for
 * the lease-creation tenant picker.
 */
export const getTenants = async (filters?: TenantFilters) =>
    httpClient.get<TenantListItem[]>("/tenants", {
        params: {
            page: filters?.page ?? 1,
            limit: filters?.limit ?? 10,
            ...(filters?.buildingId && { buildingId: filters.buildingId }),
            ...(filters?.floorId && { floorId: filters.floorId }),
            ...(filters?.unitId && { unitId: filters.unitId }),
        },
    });

/** GET /tenants/:id — full detail with linked user and leases. */
export const getTenantById = async (id: string) =>
    httpClient.get<TenantDetail>(`/tenants/${id}`);

/**
 * PATCH /tenants/:id — partial update, multipart.
 * FormData fields: `data` (JSON string of changed fields) and an optional
 * `photo` file to replace the tenant's photo.
 */
export const updateTenant = async (id: string, formData: FormData) =>
    httpClient.upload<Tenant>(`/tenants/${id}`, formData, { method: "PATCH" });

/** DELETE /tenants/:id — soft delete (deactivates the tenant). */
export const deactivateTenant = async (id: string) =>
    httpClient.delete<{ id: string }>(`/tenants/${id}`);
