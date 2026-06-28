"use client";

import { getDashboardOverview } from "@/src/services/dashboard.services";
import { useQuery } from "@tanstack/react-query";

export const dashboardKeys = {
    all: ["dashboard"] as const,
    overview: () => [...dashboardKeys.all, "overview"] as const,
};

/**
 * Single source for the owner dashboard home page. Every widget calls this;
 * react-query dedupes them into one network request.
 */
export function useDashboardOverview() {
    return useQuery({
        queryKey: dashboardKeys.overview(),
        queryFn: async () => {
            const res = await getDashboardOverview();
            return res.data;
        },
    });
}
