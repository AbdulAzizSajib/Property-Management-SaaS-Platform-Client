"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    CancelInvoicePayload,
    GenerateMonthlyBatchPayload,
    GenerateMonthlyBatchResult,
    GenerateSingleInvoicePayload,
    Invoice,
    InvoiceDetail,
    InvoiceFilters,
    InvoiceListItem,
    UpdateInvoicePayload,
} from "@/src/types/invoice.types";

function buildInvoiceQuery(filters?: InvoiceFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.leaseId) params.set("leaseId", filters.leaseId);
    if (filters.tenantId) params.set("tenantId", filters.tenantId);
    if (filters.unitId) params.set("unitId", filters.unitId);
    if (filters.buildingId) params.set("buildingId", filters.buildingId);
    if (filters.billingMonth) params.set("billingMonth", filters.billingMonth);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

/** POST /invoices/generate — generate a single invoice for a lease + billing month. */
export const generateSingleInvoice = async (
    payload: GenerateSingleInvoicePayload,
) => httpClient.post<Invoice>("/invoices/generate", payload);

/**
 * POST /invoices/generate-monthly — bulk-generate invoices for all ACTIVE leases
 * for the given billing month. Skips leases that already have an invoice that month.
 */
export const generateMonthlyBatch = async (
    payload: GenerateMonthlyBatchPayload,
) =>
    httpClient.post<GenerateMonthlyBatchResult>(
        "/invoices/generate-monthly",
        payload,
    );

/** GET /invoices — list with optional status / lease / tenant / unit filters. */
export const getInvoices = async (filters?: InvoiceFilters) =>
    httpClient.get<InvoiceListItem[]>(`/invoices${buildInvoiceQuery(filters)}`);

/** GET /invoices/:id — full detail with embedded tenant, unit, lease, payments. */
export const getInvoiceById = async (id: string) =>
    httpClient.get<InvoiceDetail>(`/invoices/${id}`);

/**
 * PATCH /invoices/:id — update due date, penalty, notes, and/or utilities breakdown.
 * Backend recomputes totalAmount + dueAmount when amounts change.
 */
export const updateInvoice = async (id: string, payload: UpdateInvoicePayload) =>
    httpClient.patch<Invoice>(`/invoices/${id}`, payload);

/**
 * PATCH /invoices/:id/cancel — soft-cancels an invoice with an audit-trail reason.
 * Allowed: OWNER, MANAGER. Cannot cancel invoices with recorded payments.
 */
export const cancelInvoice = async (id: string, payload: CancelInvoicePayload) =>
    httpClient.patch<Invoice>(`/invoices/${id}/cancel`, payload);

/**
 * DELETE /invoices/:id — hard delete. SUPER_ADMIN only.
 * For organization-side cleanup, use cancelInvoice() instead.
 */
export const deleteInvoice = async (id: string) =>
    httpClient.delete<{ id: string }>(`/invoices/${id}`);
