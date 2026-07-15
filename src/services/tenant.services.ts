"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    Tenant,
    TenantDetail,
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

/** GET /tenants — list all tenants in caller's organization. */
export const getTenants = async () =>
    httpClient.get<TenantListItem[]>("/tenants");

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
