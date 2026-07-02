import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    CreateTenantFormPayload,
    TenantForm,
    TenantFormDetail,
    UpdateTenantFormPayload,
} from "@/src/types/tenantForm.types";

/**
 * POST /tenant-forms — Allowed: OWNER, MANAGER, CARETAKER.
 * Creates the intake form (with nested child records) for a tenant.
 * One form per tenant.
 */
export const createTenantForm = async (payload: CreateTenantFormPayload) =>
    httpClient.post<TenantFormDetail>("/tenant-forms", payload);

/** GET /tenant-forms — list all forms in caller's organization. */
export const getTenantForms = async () =>
    httpClient.get<TenantFormDetail[]>("/tenant-forms");

/** GET /tenant-forms/:id — full detail with all child relations. */
export const getTenantFormById = async (id: string) =>
    httpClient.get<TenantFormDetail>(`/tenant-forms/${id}`);

/** PATCH /tenant-forms/:id — partial update of the form's own fields. */
export const updateTenantForm = async (
    id: string,
    payload: UpdateTenantFormPayload,
) => httpClient.patch<TenantForm>(`/tenant-forms/${id}`, payload);

/** DELETE /tenant-forms/:id — deletes the form (children cascade). */
export const deleteTenantForm = async (id: string) =>
    httpClient.delete<{ id: string }>(`/tenant-forms/${id}`);
