"use client";

import { buildingKeys } from "@/src/hooks/useBuildings";
import { floorKeys } from "@/src/hooks/useFloors";
import {
    createUnit,
    deleteUnit,
    getUnitById,
    getUnits,
    updateUnit,
} from "@/src/services/unit.services";
import type {
    CreateUnitPayload,
    UnitFilters,
    UpdateUnitPayload,
} from "@/src/types/unit.types";
import { getErrorMessage } from "@/src/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const unitKeys = {
    all: ["units"] as const,
    list: (filters?: UnitFilters) =>
        [...unitKeys.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...unitKeys.all, "detail", id] as const,
};

export function useUnits(filters?: UnitFilters) {
    return useQuery({
        queryKey: unitKeys.list(filters),
        queryFn: async () => {
            const res = await getUnits(filters);
            return res.data;
        },
    });
}

export function useUnit(id: string | undefined) {
    return useQuery({
        queryKey: id ? unitKeys.detail(id) : ["units", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Unit id is required");
            const res = await getUnitById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

// Refresh anything that embeds a unit count or list.
function invalidateUnitDependents(
    queryClient: ReturnType<typeof useQueryClient>,
    buildingId: string,
    floorId: string,
) {
    queryClient.invalidateQueries({ queryKey: unitKeys.all });
    queryClient.invalidateQueries({
        queryKey: floorKeys.listByBuilding(buildingId),
    });
    queryClient.invalidateQueries({ queryKey: floorKeys.detail(floorId) });
    queryClient.invalidateQueries({ queryKey: buildingKeys.detail(buildingId) });
    queryClient.invalidateQueries({ queryKey: buildingKeys.list() });
}

export function useCreateUnit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateUnitPayload) => {
            const res = await createUnit(payload);
            return res.data;
        },
        onSuccess: (data) => {
            invalidateUnitDependents(queryClient, data.buildingId, data.floorId);
            toast.success("Unit created");
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to create unit"),
            );
        },
    });
}

export function useUpdateUnit(unitId: string, buildingId: string, floorId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateUnitPayload) => {
            const res = await updateUnit(unitId, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: unitKeys.detail(unitId) });
            invalidateUnitDependents(queryClient, buildingId, floorId);
            toast.success("Unit updated");
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to update unit"),
            );
        },
    });
}

export function useDeleteUnit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            unitId,
        }: {
            unitId: string;
            buildingId: string;
            floorId: string;
        }) => {
            await deleteUnit(unitId);
            return unitId;
        },
        onSuccess: (unitId, variables) => {
            queryClient.removeQueries({ queryKey: unitKeys.detail(unitId) });
            invalidateUnitDependents(
                queryClient,
                variables.buildingId,
                variables.floorId,
            );
            toast.success("Unit deleted");
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to delete unit"),
            );
        },
    });
}
