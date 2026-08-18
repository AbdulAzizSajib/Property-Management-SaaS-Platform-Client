"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    Payment,
    PaymentDetail,
    PaymentFilters,
    PaymentListItem,
    PaymentSummary,
    PaymentSummaryFilters,
    RecordPaymentPayload,
} from "@/src/types/payment.types";

function buildPaymentQuery(filters?: PaymentFilters): string {
    const params = new URLSearchParams();
    params.set("page", String(filters?.page ?? 1));
    params.set("limit", String(filters?.limit ?? 10));
    if (filters?.leaseId) params.set("leaseId", filters.leaseId);
    if (filters?.tenantId) params.set("tenantId", filters.tenantId);
    if (filters?.invoiceId) params.set("invoiceId", filters.invoiceId);
    if (filters?.buildingId) params.set("buildingId", filters.buildingId);
    if (filters?.floorId) params.set("floorId", filters.floorId);
    if (filters?.unitId) params.set("unitId", filters.unitId);
    return `?${params.toString()}`;
}

/**
 * POST /collections — record a payment against an invoice.
 * Updates the invoice status (PARTIAL/PAID) automatically.
 */
export const recordCollection = async (payload: RecordPaymentPayload) =>
    httpClient.post<Payment>("/collections", payload);

/**
 * GET /collections — paginated list, with optional lease / tenant / invoice /
 * building / floor / unit filters. Defaults to page 1 / limit 10; response
 * `meta` carries { page, limit, total, totalPages }.
 */
export const getCollections = async (filters?: PaymentFilters) =>
    httpClient.get<PaymentListItem[]>(`/collections${buildPaymentQuery(filters)}`);

/**
 * GET /collections/summary — org-wide (or building/floor/unit-scoped)
 * collection stats, independent of pagination. Use for hero/KPI cards.
 */
export const getCollectionSummary = async (filters?: PaymentSummaryFilters) =>
    httpClient.get<PaymentSummary>("/collections/summary", {
        params: {
            ...(filters?.buildingId && { buildingId: filters.buildingId }),
            ...(filters?.floorId && { floorId: filters.floorId }),
            ...(filters?.unitId && { unitId: filters.unitId }),
        },
    });

/** GET /collections/:id — full detail with tenant, invoice, lease. */
export const getCollectionById = async (id: string) =>
    httpClient.get<PaymentDetail>(`/collections/${id}`);
