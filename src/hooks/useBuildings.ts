"use client";

import {
    assignCaretaker,
    createBuilding,
    deleteBuilding,
    getBuildingById,
    getBuildings,
    updateBuilding,
} from "@/src/services/building.services";
import type {
    AssignCaretakerPayload,
    CreateBuildingPayload,
    UpdateBuildingPayload,
} from "@/src/types/building.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const buildingKeys = {
    all: ["buildings"] as const,
    list: () => [...buildingKeys.all, "list"] as const,
    detail: (id: string) => [...buildingKeys.all, "detail", id] as const,
};

export function useBuildings() {
    return useQuery({
        queryKey: buildingKeys.list(),
        queryFn: async () => {
            const res = await getBuildings();
            return res.data;
        },
    });
}

export function useBuilding(id: string | undefined) {
    return useQuery({
        queryKey: id ? buildingKeys.detail(id) : ["buildings", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Building id is required");
            const res = await getBuildingById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCreateBuilding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateBuildingPayload) => {
            const res = await createBuilding(payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: buildingKeys.list() });
            toast.success("Building created");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to create building",
            );
        },
    });
}

export function useUpdateBuilding(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateBuildingPayload) => {
            const res = await updateBuilding(id, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: buildingKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: buildingKeys.list() });
            toast.success("Building updated");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to update building",
            );
        },
    });
}

export function useDeleteBuilding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteBuilding(id);
            return id;
        },
        onSuccess: (id) => {
            queryClient.removeQueries({ queryKey: buildingKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: buildingKeys.list() });
            toast.success("Building deleted");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete building",
            );
        },
    });
}

export function useAssignCaretaker(buildingId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: AssignCaretakerPayload) => {
            const res = await assignCaretaker(buildingId, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: buildingKeys.detail(buildingId) });
            queryClient.invalidateQueries({ queryKey: buildingKeys.list() });
            toast.success("Caretaker updated");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to update caretaker",
            );
        },
    });
}
