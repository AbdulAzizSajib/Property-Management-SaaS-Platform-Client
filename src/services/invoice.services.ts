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
    InvoiceSummary,
    InvoiceSummaryFilters,
    UpdateInvoicePayload,
} from "@/src/types/invoice.types";

function buildInvoiceQuery(filters?: InvoiceFilters): string {
    const params = new URLSearchParams();
    params.set("page", String(filters?.page ?? 1));
    params.set("limit", String(filters?.limit ?? 10));
    if (filters?.status) params.set("status", filters.status);
    if (filters?.leaseId) params.set("leaseId", filters.leaseId);
    if (filters?.tenantId) params.set("tenantId", filters.tenantId);
    if (filters?.unitId) params.set("unitId", filters.unitId);
    if (filters?.buildingId) params.set("buildingId", filters.buildingId);
    if (filters?.floorId) params.set("floorId", filters.floorId);
    if (filters?.billingMonth) params.set("billingMonth", filters.billingMonth);
    return `?${params.toString()}`;
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

/**
 * GET /invoices/summary — org-wide (or building/floor/unit-scoped) invoice
 * stats, independent of pagination. Use for hero/KPI cards on the list page
 * so numbers don't fluctuate as the user pages through the table.
 */
export const getInvoiceSummary = async (filters?: InvoiceSummaryFilters) =>
    httpClient.get<InvoiceSummary>("/invoices/summary", {
        params: {
            ...(filters?.buildingId && { buildingId: filters.buildingId }),
            ...(filters?.floorId && { floorId: filters.floorId }),
            ...(filters?.unitId && { unitId: filters.unitId }),
        },
    });

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
