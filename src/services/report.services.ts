import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    ExpenseReport,
    ExpenseReportFilters,
    FinancialReport,
    FinancialReportFilters,
    OccupancyReport,
    RentCollectionFilters,
    RentCollectionReport,
} from "@/src/types/report.types";

function buildPeriodQuery(
    filters: { from: string; to: string; buildingId?: string },
): string {
    const params = new URLSearchParams();
    params.set("from", filters.from);
    params.set("to", filters.to);
    if (filters.buildingId) params.set("buildingId", filters.buildingId);
    return `?${params.toString()}`;
}

/** GET /reports/financial — income / expense / net profit over a date range. */
export const getFinancialReport = async (filters: FinancialReportFilters) =>
    httpClient.get<FinancialReport>(
        `/reports/financial${buildPeriodQuery(filters)}`,
    );

/** GET /reports/rent-collection — per-tenant billed / paid / due. */
export const getRentCollectionReport = async (filters: RentCollectionFilters) =>
    httpClient.get<RentCollectionReport>(
        `/reports/rent-collection${buildPeriodQuery(filters)}`,
    );

/** GET /reports/occupancy — building-wise occupancy breakdown. */
export const getOccupancyReport = async () =>
    httpClient.get<OccupancyReport>("/reports/occupancy");

/** GET /reports/expenses — category breakdown with percentages. */
export const getExpenseReport = async (filters: ExpenseReportFilters) =>
    httpClient.get<ExpenseReport>(
        `/reports/expenses${buildPeriodQuery(filters)}`,
    );
