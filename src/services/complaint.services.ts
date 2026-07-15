"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    AssignComplaintPayload,
    Complaint,
    ComplaintDetail,
    ComplaintFilters,
    ComplaintListItem,
    CreateComplaintPayload,
    UpdateComplaintPayload,
} from "@/src/types/complaint.types";

function buildComplaintQuery(filters?: ComplaintFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.category) params.set("category", filters.category);
    if (filters.buildingId) params.set("buildingId", filters.buildingId);
    if (filters.unitId) params.set("unitId", filters.unitId);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

/** POST /complaints — file a new complaint. */
export const createComplaint = async (payload: CreateComplaintPayload) =>
    httpClient.post<Complaint>("/complaints", payload);

/** GET /complaints — list with optional status / priority / building filters. */
export const getComplaints = async (filters?: ComplaintFilters) =>
    httpClient.get<ComplaintListItem[]>(
        `/complaints${buildComplaintQuery(filters)}`,
    );

/** GET /complaints/:id — full detail with embedded building, unit, tenant, createdBy, assignedTo. */
export const getComplaintById = async (id: string) =>
    httpClient.get<ComplaintDetail>(`/complaints/${id}`);

/** PATCH /complaints/:id — partial update (status, priority, resolutionNote, …). */
export const updateComplaint = async (
    id: string,
    payload: UpdateComplaintPayload,
) => httpClient.patch<Complaint>(`/complaints/${id}`, payload);

/** PATCH /complaints/:id/assign — assign to a user. */
export const assignComplaint = async (
    id: string,
    payload: AssignComplaintPayload,
) => httpClient.patch<Complaint>(`/complaints/${id}/assign`, payload);

/** DELETE /complaints/:id. */
export const deleteComplaint = async (id: string) =>
    httpClient.delete<{ id: string }>(`/complaints/${id}`);
