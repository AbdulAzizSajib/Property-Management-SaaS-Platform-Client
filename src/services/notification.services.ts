"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    AppNotification,
    NotificationFilters,
} from "@/src/types/notification.types";

function buildNotificationQuery(filters?: NotificationFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.type) params.set("type", filters.type);
    if (filters.channel) params.set("channel", filters.channel);
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    const q = params.toString();
    return q ? `?${q}` : "";
}

/** GET /notifications — paginated notifications for the logged-in user (default limit 10). */
export const getMyNotifications = async (filters?: NotificationFilters) =>
    httpClient.get<AppNotification[]>(
        `/notifications${buildNotificationQuery(filters)}`,
    );

/** PATCH /notifications/:id/read */
export const markNotificationRead = async (id: string) =>
    httpClient.patch<AppNotification>(`/notifications/${id}/read`, {});

/** PATCH /notifications/read-all */
export const markAllNotificationsRead = async () =>
    httpClient.patch<{ count: number }>("/notifications/read-all", {});
