"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    Payment,
    PaymentDetail,
    PaymentFilters,
    PaymentListItem,
    RecordPaymentPayload,
} from "@/src/types/payment.types";

function buildPaymentQuery(filters?: PaymentFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.leaseId) params.set("leaseId", filters.leaseId);
    if (filters.tenantId) params.set("tenantId", filters.tenantId);
    if (filters.invoiceId) params.set("invoiceId", filters.invoiceId);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

/**
 * POST /collections — record a payment against an invoice.
 * Updates the invoice status (PARTIAL/PAID) automatically.
 */
export const recordCollection = async (payload: RecordPaymentPayload) =>
    httpClient.post<Payment>("/collections", payload);

/** GET /collections — list with optional lease / tenant / invoice filters. */
export const getCollections = async (filters?: PaymentFilters) =>
    httpClient.get<PaymentListItem[]>(`/collections${buildPaymentQuery(filters)}`);

/** GET /collections/:id — full detail with tenant, invoice, lease. */
export const getCollectionById = async (id: string) =>
    httpClient.get<PaymentDetail>(`/collections/${id}`);
