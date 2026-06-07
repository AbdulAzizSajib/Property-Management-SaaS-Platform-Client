import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    ActivityLog,
    ActivityLogFilters,
} from "@/src/types/activityLog.types";

function buildActivityLogQuery(filters?: ActivityLogFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.userId) params.set("userId", filters.userId);
    if (filters.entityType) params.set("entityType", filters.entityType);
    if (filters.action) params.set("action", filters.action);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    if (filters.limit) params.set("limit", String(filters.limit));
    const q = params.toString();
    return q ? `?${q}` : "";
}

/**
 * GET /activity-logs — audit trail. Allowed: OWNER, MANAGER (and admins).
 */
export const getActivityLogs = async (filters?: ActivityLogFilters) =>
    httpClient.get<ActivityLog[]>(
        `/activity-logs${buildActivityLogQuery(filters)}`,
    );
