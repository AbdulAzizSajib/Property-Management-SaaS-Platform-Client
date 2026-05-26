// Backend returns money as a Prisma Decimal string.

export interface FinancialReportPeriod {
    from: string;
    to: string;
}

export interface FinancialReportSummary {
    totalIncome: string;
    totalExpense: string;
    netProfit: string;
}

export interface FinancialReportMonthly {
    /** "YYYY-MM" */
    month: string;
    income: string;
    expense: string;
    net: string;
}

export interface FinancialReport {
    period: FinancialReportPeriod;
    summary: FinancialReportSummary;
    monthly: FinancialReportMonthly[];
}

export interface FinancialReportFilters {
    from: string;
    to: string;
}
