"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    CreateTenantPayload,
    Tenant,
    TenantDetail,
    TenantListItem,
    UpdateTenantPayload,
} from "@/src/types/tenant.types";

/**
 * POST /tenants — Allowed: OWNER, MANAGER, CARETAKER.
 * Subscription tenant limit is enforced.
 * When createLoginAccount=true, password is required.
 */
export const createTenant = async (payload: CreateTenantPayload) =>
    httpClient.post<Tenant>("/tenants", payload);

/** GET /tenants — list all tenants in caller's organization. */
export const getTenants = async () =>
    httpClient.get<TenantListItem[]>("/tenants");

/** GET /tenants/:id — full detail with linked user and leases. */
export const getTenantById = async (id: string) =>
    httpClient.get<TenantDetail>(`/tenants/${id}`);

/** PATCH /tenants/:id — partial update. */
export const updateTenant = async (id: string, payload: UpdateTenantPayload) =>
    httpClient.patch<Tenant>(`/tenants/${id}`, payload);

/** DELETE /tenants/:id — soft delete (deactivates the tenant). */
export const deactivateTenant = async (id: string) =>
    httpClient.delete<{ id: string }>(`/tenants/${id}`);
