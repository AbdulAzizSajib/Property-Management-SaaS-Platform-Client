import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    GenerateMonthlyBatchPayload,
    GenerateMonthlyBatchResult,
    GenerateSingleInvoicePayload,
    Invoice,
    InvoiceDetail,
    InvoiceFilters,
    InvoiceListItem,
} from "@/src/types/invoice.types";

function buildInvoiceQuery(filters?: InvoiceFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.leaseId) params.set("leaseId", filters.leaseId);
    if (filters.tenantId) params.set("tenantId", filters.tenantId);
    if (filters.unitId) params.set("unitId", filters.unitId);
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
