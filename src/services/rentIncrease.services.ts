import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    CreateRentIncreasePayload,
    RentIncrease,
} from "@/src/types/rentIncrease.types";

/**
 * POST /rent-increases/:leaseId
 * Allowed: OWNER, MANAGER. Records the increase and updates lease.monthlyRent.
 * `newRent` must be greater than current rent.
 */
export const createRentIncrease = async (
    leaseId: string,
    payload: CreateRentIncreasePayload,
) => httpClient.post<RentIncrease>(`/rent-increases/${leaseId}`, payload);

/** GET /rent-increases/:leaseId — full history, newest first. */
export const getRentIncreasesByLease = async (leaseId: string) =>
    httpClient.get<RentIncrease[]>(`/rent-increases/${leaseId}`);
