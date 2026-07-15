"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    CreateRentAgreementPayload,
    RentAgreement,
    SignRentAgreementPayload,
} from "@/src/types/rentAgreement.types";

/** GET /rent-agreements/:leaseId — fetch the agreement attached to a lease. */
export const getAgreementByLease = async (leaseId: string) =>
    httpClient.get<RentAgreement>(`/rent-agreements/${leaseId}`);

/** POST /rent-agreements/:leaseId — create a DRAFT agreement (one per lease). */
export const createAgreement = async (
    leaseId: string,
    payload: CreateRentAgreementPayload,
) => httpClient.post<RentAgreement>(`/rent-agreements/${leaseId}`, payload);

/**
 * PATCH /rent-agreements/:leaseId/sign
 * Sign as "owner" or "tenant". Status becomes SIGNED once both have signed.
 */
export const signAgreement = async (
    leaseId: string,
    payload: SignRentAgreementPayload,
) =>
    httpClient.patch<RentAgreement>(
        `/rent-agreements/${leaseId}/sign`,
        payload,
    );
