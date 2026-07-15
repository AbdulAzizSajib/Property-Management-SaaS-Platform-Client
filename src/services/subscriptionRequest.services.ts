"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    AdminSubscriptionRequest,
    CreateSubscriptionRequestPayload,
    ReviewRequestPayload,
    SubscriptionPaymentInfo,
    SubscriptionRequest,
    SubscriptionRequestStatus,
} from "@/src/types/subscriptionRequest.types";

/** GET /subscription-requests/payment-info — the platform's receiving number. */
export const getSubscriptionPaymentInfo = async () =>
    httpClient.get<SubscriptionPaymentInfo>(
        "/subscription-requests/payment-info",
    );

/** POST /subscription-requests — OWNER submits a manual payment for a plan. */
export const createSubscriptionRequest = async (
    payload: CreateSubscriptionRequestPayload,
) =>
    httpClient.post<SubscriptionRequest>("/subscription-requests", payload);

/** GET /subscription-requests/me — caller's org requests (latest first). */
export const getMySubscriptionRequests = async () =>
    httpClient.get<SubscriptionRequest[]>("/subscription-requests/me");

/** GET /subscription-requests/all — ADMIN/SUPER_ADMIN, optional status filter. */
export const listSubscriptionRequests = async (
    status?: SubscriptionRequestStatus,
) =>
    httpClient.get<AdminSubscriptionRequest[]>(
        `/subscription-requests/all${status ? `?status=${status}` : ""}`,
    );

/** PATCH /subscription-requests/:id/approve — verifies payment + activates plan. */
export const approveSubscriptionRequest = async (
    id: string,
    payload: ReviewRequestPayload,
) =>
    httpClient.patch<SubscriptionRequest>(
        `/subscription-requests/${id}/approve`,
        payload,
    );

/** PATCH /subscription-requests/:id/reject — rejects with a reason. */
export const rejectSubscriptionRequest = async (
    id: string,
    payload: ReviewRequestPayload,
) =>
    httpClient.patch<SubscriptionRequest>(
        `/subscription-requests/${id}/reject`,
        payload,
    );
