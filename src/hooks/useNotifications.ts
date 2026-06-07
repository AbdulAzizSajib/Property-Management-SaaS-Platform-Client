"use client";

import { getErrorMessage } from "@/src/lib/utils";
import {
    getMyNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from "@/src/services/notification.services";
import type { NotificationFilters } from "@/src/types/notification.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const notificationKeys = {
    all: ["notifications"] as const,
    list: (filters?: NotificationFilters) =>
        [...notificationKeys.all, "list", filters ?? {}] as const,
};

export function useNotifications(filters?: NotificationFilters) {
    return useQuery({
        queryKey: notificationKeys.list(filters),
        queryFn: async () => {
            const res = await getMyNotifications(filters);
            return res.data;
        },
        // Poll every 60s so the bell badge stays roughly current.
        refetchInterval: 60_000,
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await markNotificationRead(id);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to mark notification as read"),
            );
        },
    });
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await markAllNotificationsRead();
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
            toast.success("All notifications marked as read");
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to mark all as read"),
            );
        },
    });
}
