"use client";

import {
    getMyOrganization,
    updateMyOrganization,
} from "@/src/services/organization.services";
import type { UpdateOrganizationPayload } from "@/src/types/organization.types";
import { getErrorMessage } from "@/src/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const organizationKeys = {
    me: ["organization", "me"] as const,
};

export function useOrganization() {
    return useQuery({
        queryKey: organizationKeys.me,
        queryFn: async () => {
            const res = await getMyOrganization();
            return res.data;
        },
    });
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateOrganizationPayload) => {
            const res = await updateMyOrganization(payload);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(organizationKeys.me, data);
            queryClient.invalidateQueries({ queryKey: ["subscription", "me"] });
            toast.success("Organization updated successfully");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to update organization"));
        },
    });
}
