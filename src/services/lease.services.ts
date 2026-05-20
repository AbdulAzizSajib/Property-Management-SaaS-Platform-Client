"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    CreateLeasePayload,
    Lease,
    LeaseDetail,
    LeaseListItem,
    TerminateLeasePayload,
} from "@/src/types/lease.types";

/**
 * POST /leases — Allowed: OWNER, MANAGER.
 * Creates the lease, marks the unit OCCUPIED, and auto-generates the first month's invoice.
 */
export const createLease = async (payload: CreateLeasePayload) =>
    httpClient.post<Lease>("/leases", payload);

/** GET /leases — list leases for caller's organization. */
export const getLeases = async () =>
    httpClient.get<LeaseListItem[]>("/leases");

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
