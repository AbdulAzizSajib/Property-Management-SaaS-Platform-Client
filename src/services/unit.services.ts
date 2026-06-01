import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    CreateUnitPayload,
    Unit,
    UnitDetail,
    UnitFilters,
    UnitListItem,
    UpdateUnitPayload,
} from "@/src/types/unit.types";

function buildUnitQuery(filters?: UnitFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.buildingId) params.set("buildingId", filters.buildingId);
    if (filters.floorId) params.set("floorId", filters.floorId);
    if (filters.status) params.set("status", filters.status);
    if (filters.type) params.set("type", filters.type);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

/** POST /units — Allowed: OWNER, MANAGER. Subscription unit limit is enforced. */
export const createUnit = async (payload: CreateUnitPayload) =>
    httpClient.post<Unit>("/units", payload);

/** GET /units — list with optional buildingId / floorId / status / type filters. */
export const getUnits = async (filters?: UnitFilters) =>
    httpClient.get<UnitListItem[]>(`/units${buildUnitQuery(filters)}`);

/** GET /units/:id — full detail with embedded Building, Floor and leases. */
export const getUnitById = async (id: string) =>
    httpClient.get<UnitDetail>(`/units/${id}`);

/** PATCH /units/:id — partial update. */
export const updateUnit = async (id: string, payload: UpdateUnitPayload) =>
    httpClient.patch<Unit>(`/units/${id}`, payload);

/** DELETE /units/:id */
export const deleteUnit = async (id: string) =>
    httpClient.delete<{ id: string }>(`/units/${id}`);
