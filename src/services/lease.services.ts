"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    CreateLeasePayload,
    Lease,
    LeaseDetail,
    LeaseFilters,
    LeaseListItem,
    LeaseSummary,
    LeaseSummaryFilters,
    TerminateLeasePayload,
} from "@/src/types/lease.types";

/**
 * POST /leases — Allowed: OWNER, MANAGER.
 * Creates the lease, marks the unit OCCUPIED, and auto-generates the first month's invoice.
 */
export const createLease = async (payload: CreateLeasePayload) =>
    httpClient.post<Lease>("/leases", payload);

/**
 * GET /leases — paginated list of leases for caller's organization.
 * Defaults to page 1 / limit 10 when no filters are given; response `meta`
 * carries { page, limit, total, totalPages }. buildingId/floorId scope via
 * the unit relation (unit.buildingId / unit.floorId on the backend).
 */
export const getLeases = async (filters?: LeaseFilters) =>
    httpClient.get<LeaseListItem[]>("/leases", {
        params: {
            page: filters?.page ?? 1,
            limit: filters?.limit ?? 10,
            ...(filters?.status && { status: filters.status }),
            ...(filters?.buildingId && { "unit.buildingId": filters.buildingId }),
            ...(filters?.floorId && { "unit.floorId": filters.floorId }),
            ...(filters?.unitId && { unitId: filters.unitId }),
            ...(filters?.tenantId && { tenantId: filters.tenantId }),
        },
    });

/**
 * GET /leases/summary — org-wide (or building/floor/unit-scoped) lease
 * stats, independent of pagination. Use for hero/KPI cards on the list page
 * so counts don't fluctuate as the user pages through the table.
 */
export const getLeaseSummary = async (filters?: LeaseSummaryFilters) =>
    httpClient.get<LeaseSummary>("/leases/summary", {
        params: {
            ...(filters?.buildingId && { "unit.buildingId": filters.buildingId }),
            ...(filters?.floorId && { "unit.floorId": filters.floorId }),
            ...(filters?.unitId && { unitId: filters.unitId }),
        },
    });

/** GET /leases/:id — full detail with tenant, unit, invoices, payments. */
export const getLeaseById = async (id: string) =>
    httpClient.get<LeaseDetail>(`/leases/${id}`);

/**
 * PATCH /leases/:id/terminate — marks the lease TERMINATED and the unit VACANT.
 */
export const terminateLease = async (
    id: string,
    payload: TerminateLeasePayload,
) =>
    httpClient.patch<Lease>(`/leases/${id}/terminate`, payload);
