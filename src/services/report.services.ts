import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    FinancialReport,
    FinancialReportFilters,
} from "@/src/types/report.types";

function buildFinancialReportQuery(filters: FinancialReportFilters): string {
    const params = new URLSearchParams();
    params.set("from", filters.from);
    params.set("to", filters.to);
    return `?${params.toString()}`;
}

/** GET /reports/financial — income / expense / net profit over a date range. */
export const getFinancialReport = async (filters: FinancialReportFilters) =>
    httpClient.get<FinancialReport>(
        `/reports/financial${buildFinancialReportQuery(filters)}`,
    );
