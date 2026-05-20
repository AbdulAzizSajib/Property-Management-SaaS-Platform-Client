"use client";

import { buildingKeys } from "@/src/hooks/useBuildings";
import {
    createFloor,
    deleteFloor,
    getFloorById,
    getFloorsByBuilding,
    updateFloor,
} from "@/src/services/floor.services";
import type {
    CreateFloorPayload,
    UpdateFloorPayload,
} from "@/src/types/floor.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const floorKeys = {
    all: ["floors"] as const,
    listByBuilding: (buildingId: string) =>
        [...floorKeys.all, "list", { buildingId }] as const,
    detail: (id: string) => [...floorKeys.all, "detail", id] as const,
};

export function useFloorsByBuilding(buildingId: string | undefined) {
    return useQuery({
        queryKey: buildingId
            ? floorKeys.listByBuilding(buildingId)
            : ["floors", "list", "_none"],
        queryFn: async () => {
            if (!buildingId) throw new Error("buildingId is required");
            const res = await getFloorsByBuilding(buildingId);
            return res.data;
        },
        enabled: !!buildingId,
    });
}

export function useFloor(id: string | undefined) {
    return useQuery({
        queryKey: id ? floorKeys.detail(id) : ["floors", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Floor id is required");
            const res = await getFloorById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCreateFloor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateFloorPayload) => {
            const res = await createFloor(payload);
            return res.data;
        },
        onSuccess: (data) => {
            // Refresh floors for the parent building and the building detail
            // (which embeds floors[] and floor counts).
            queryClient.invalidateQueries({
                queryKey: floorKeys.listByBuilding(data.buildingId),
            });
            queryClient.invalidateQueries({
                queryKey: buildingKeys.detail(data.buildingId),
            });
            queryClient.invalidateQueries({ queryKey: buildingKeys.list() });
            toast.success("Floor created");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to create floor",
            );
        },
    });
}

export function useUpdateFloor(floorId: string, buildingId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateFloorPayload) => {
            const res = await updateFloor(floorId, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: floorKeys.detail(floorId) });
            queryClient.invalidateQueries({
                queryKey: floorKeys.listByBuilding(buildingId),
            });
            queryClient.invalidateQueries({
                queryKey: buildingKeys.detail(buildingId),
            });
            toast.success("Floor updated");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to update floor",
            );
        },
    });
}

export function useDeleteFloor(buildingId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (floorId: string) => {
            await deleteFloor(floorId);
            return floorId;
        },
        onSuccess: (floorId) => {
            queryClient.removeQueries({ queryKey: floorKeys.detail(floorId) });
            queryClient.invalidateQueries({
                queryKey: floorKeys.listByBuilding(buildingId),
            });
            queryClient.invalidateQueries({
                queryKey: buildingKeys.detail(buildingId),
            });
            queryClient.invalidateQueries({ queryKey: buildingKeys.list() });
            toast.success("Floor deleted");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete floor",
            );
        },
    });
}
