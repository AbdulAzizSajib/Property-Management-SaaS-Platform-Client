"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    AssignCaretakerPayload,
    Building,
    BuildingDetail,
    BuildingListItem,
    CreateBuildingPayload,
    UpdateBuildingPayload,
} from "@/src/types/building.types";

/** POST /buildings — Allowed: OWNER. Subscription building limit is enforced. */
export const createBuilding = async (payload: CreateBuildingPayload) =>
    httpClient.post<Building>("/buildings", payload);

/** GET /buildings — list all buildings for caller's organization. */
export const getBuildings = async () =>
    httpClient.get<BuildingListItem[]>("/buildings");

/** GET /buildings/:id — full detail with floors, units and managers. */
export const getBuildingById = async (id: string) =>
    httpClient.get<BuildingDetail>(`/buildings/${id}`);

/** PATCH /buildings/:id — partial update. */
export const updateBuilding = async (id: string, payload: UpdateBuildingPayload) =>
    httpClient.patch<Building>(`/buildings/${id}`, payload);

/** PATCH /buildings/:id/assign-caretaker — pass null to unassign. */
export const assignCaretaker = async (id: string, payload: AssignCaretakerPayload) =>
    httpClient.patch<Building>(`/buildings/${id}/assign-caretaker`, payload);

/** DELETE /buildings/:id — soft delete. */
export const deleteBuilding = async (id: string) =>
    httpClient.delete<{ id: string }>(`/buildings/${id}`);
