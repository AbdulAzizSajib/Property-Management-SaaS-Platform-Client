"use client";

import {
    getExpenseReport,
    getFinancialReport,
    getOccupancyReport,
    getRentCollectionReport,
} from "@/src/services/report.services";
import type {
    ExpenseReportFilters,
    FinancialReportFilters,
    RentCollectionFilters,
} from "@/src/types/report.types";
import { useQuery } from "@tanstack/react-query";

export const reportKeys = {
    all: ["reports"] as const,
    financial: (filters: FinancialReportFilters) =>
        [...reportKeys.all, "financial", filters] as const,
    rentCollection: (filters: RentCollectionFilters) =>
        [...reportKeys.all, "rent-collection", filters] as const,
    occupancy: () => [...reportKeys.all, "occupancy"] as const,
    expenses: (filters: ExpenseReportFilters) =>
        [...reportKeys.all, "expenses", filters] as const,
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

export function useRentCollectionReport(filters: RentCollectionFilters) {
    return useQuery({
        queryKey: reportKeys.rentCollection(filters),
        queryFn: async () => {
            const res = await getRentCollectionReport(filters);
            return res.data;
        },
        enabled: !!filters.from && !!filters.to,
    });
}

export function useOccupancyReport() {
    return useQuery({
        queryKey: reportKeys.occupancy(),
        queryFn: async () => {
            const res = await getOccupancyReport();
            return res.data;
        },
    });
}

export function useExpenseReport(filters: ExpenseReportFilters) {
    return useQuery({
        queryKey: reportKeys.expenses(filters),
        queryFn: async () => {
            const res = await getExpenseReport(filters);
            return res.data;
        },
        enabled: !!filters.from && !!filters.to,
    });
}
