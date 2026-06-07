"use client";

import { getActivityLogs } from "@/src/services/activityLog.services";
import type { ActivityLogFilters } from "@/src/types/activityLog.types";
import { useQuery } from "@tanstack/react-query";

export const activityLogKeys = {
    all: ["activity-logs"] as const,
    list: (filters?: ActivityLogFilters) =>
        [...activityLogKeys.all, "list", filters ?? {}] as const,
};

export function useActivityLogs(filters?: ActivityLogFilters) {
    return useQuery({
        queryKey: activityLogKeys.list(filters),
        queryFn: async () => {
            const res = await getActivityLogs(filters);
            return res.data;
        },
    });
}
