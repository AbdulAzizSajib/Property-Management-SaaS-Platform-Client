import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    AppNotification,
    NotificationFilters,
} from "@/src/types/notification.types";

function buildNotificationQuery(filters?: NotificationFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.limit) params.set("limit", String(filters.limit));
    const q = params.toString();
    return q ? `?${q}` : "";
}

/** GET /notifications — notifications for the logged-in user (default limit 50). */
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
