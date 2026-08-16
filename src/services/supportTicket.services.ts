"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    CreateSupportTicketMessagePayload,
    CreateSupportTicketPayload,
    SupportTicket,
    SupportTicketFilters,
    UpdateSupportTicketStatusPayload,
} from "@/src/types/supportTicket.types";

function buildSupportTicketQuery(filters?: SupportTicketFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.category) params.set("category", filters.category);
    if (filters.organizationId)
        params.set("organizationId", filters.organizationId);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

// ─── Owner ──────────────────────────────────────────────────────

/** POST /support-tickets — OWNER/MANAGER files a new support ticket. */
export const createSupportTicket = async (
    payload: CreateSupportTicketPayload,
) => httpClient.post<SupportTicket>("/support-tickets", payload);

/** GET /support-tickets/me — caller's organization's tickets. */
export const getMySupportTickets = async (filters?: SupportTicketFilters) =>
    httpClient.get<SupportTicket[]>(
        `/support-tickets/me${buildSupportTicketQuery(filters)}`,
    );

/** GET /support-tickets/me/:id — full detail with message thread, own org only. */
export const getMySupportTicketById = async (id: string) =>
    httpClient.get<SupportTicket>(`/support-tickets/me/${id}`);

/** POST /support-tickets/me/:id/messages — reply on caller's own org's ticket. */
export const addMySupportTicketMessage = async (
    id: string,
    payload: CreateSupportTicketMessagePayload,
) =>
    httpClient.post<SupportTicket>(
        `/support-tickets/me/${id}/messages`,
        payload,
    );

// ─── Admin ──────────────────────────────────────────────────────

/** GET /support-tickets — ADMIN/SUPER_ADMIN, tickets across all organizations. */
export const listAllSupportTickets = async (
    filters?: SupportTicketFilters,
) =>
    httpClient.get<SupportTicket[]>(
        `/support-tickets${buildSupportTicketQuery(filters)}`,
    );

/** GET /support-tickets/:id — ADMIN/SUPER_ADMIN, any ticket regardless of org. */
export const getSupportTicketById = async (id: string) =>
    httpClient.get<SupportTicket>(`/support-tickets/${id}`);

/** POST /support-tickets/:id/messages — admin reply; may auto-advance OPEN → IN_PROGRESS. */
export const addSupportTicketMessage = async (
    id: string,
    payload: CreateSupportTicketMessagePayload,
) =>
    httpClient.post<SupportTicket>(`/support-tickets/${id}/messages`, payload);

/** PATCH /support-tickets/:id/status — admin sets OPEN/IN_PROGRESS/RESOLVED/CLOSED. */
export const updateSupportTicketStatus = async (
    id: string,
    payload: UpdateSupportTicketStatusPayload,
) =>
    httpClient.patch<SupportTicket>(
        `/support-tickets/${id}/status`,
        payload,
    );
