import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    CreateFloorPayload,
    Floor,
    FloorDetail,
    FloorListItem,
    UpdateFloorPayload,
} from "@/src/types/floor.types";

/** POST /floors — Allowed: OWNER, MANAGER. */
export const createFloor = async (payload: CreateFloorPayload) =>
    httpClient.post<Floor>("/floors", payload);

/** GET /floors?buildingId=... — list floors for a building. */
export const getFloorsByBuilding = async (buildingId: string) =>
    httpClient.get<FloorListItem[]>(`/floors?buildingId=${buildingId}`);

/** GET /floors/:id — full detail with units. */
export const getFloorById = async (id: string) =>
    httpClient.get<FloorDetail>(`/floors/${id}`);

/** PATCH /floors/:id — partial update. */
export const updateFloor = async (id: string, payload: UpdateFloorPayload) =>
    httpClient.patch<Floor>(`/floors/${id}`, payload);

/** DELETE /floors/:id */
export const deleteFloor = async (id: string) =>
    httpClient.delete<{ id: string }>(`/floors/${id}`);
