import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    OrganizationWithSubscription,
    UpdateOrganizationPayload,
} from "@/src/types/organization.types";

/**
 * GET /organizations/me
 * Allowed: OWNER, MANAGER, CARETAKER.
 * Returns the caller's organization with its subscription embedded.
 */
export const getMyOrganization = async () =>
    httpClient.get<OrganizationWithSubscription>("/organizations/me");

/**
 * PATCH /organizations/me
 * Allowed: OWNER only. All fields optional.
 */
export const updateMyOrganization = async (payload: UpdateOrganizationPayload) =>
    httpClient.patch<OrganizationWithSubscription>("/organizations/me", payload);
