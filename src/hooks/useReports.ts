"use client";

import { getFinancialReport } from "@/src/services/report.services";
import type { FinancialReportFilters } from "@/src/types/report.types";
import { useQuery } from "@tanstack/react-query";

export const reportKeys = {
    all: ["reports"] as const,
    financial: (filters: FinancialReportFilters) =>
        [...reportKeys.all, "financial", filters] as const,
};

export function useFinancialReport(filters: FinancialReportFilters) {
    return useQuery({
        queryKey: reportKeys.financial(filters),
        queryFn: async () => {
            const res = await getFinancialReport(filters);
            return res.data;
        },
        enabled: !!filters.from && !!filters.to,
    });
}
