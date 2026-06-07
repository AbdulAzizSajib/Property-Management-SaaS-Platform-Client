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

// ─── Rent collection ────────────────────────────────────────────

export interface RentCollectionRow {
    tenantId: string;
    tenantName: string;
    /** All money values are Prisma Decimal strings. */
    totalBilled: string;
    totalPaid: string;
    totalDue: string;
    invoiceCount: number;
}

export interface RentCollectionSummary {
    totalBilled: string;
    totalPaid: string;
    totalDue: string;
    collectionRate: number; // 0..100
}

export interface RentCollectionReport {
    period: FinancialReportPeriod;
    summary: RentCollectionSummary;
    rows: RentCollectionRow[];
}

export interface RentCollectionFilters {
    from: string;
    to: string;
    buildingId?: string;
}

// ─── Occupancy ──────────────────────────────────────────────────

export interface OccupancyBuilding {
    buildingId: string;
    buildingName: string;
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    maintenanceUnits: number;
    reservedUnits: number;
    occupancyRate: number; // 0..100
}

export interface OccupancyReport {
    summary: {
        totalUnits: number;
        occupiedUnits: number;
        vacantUnits: number;
        occupancyRate: number;
    };
    buildings: OccupancyBuilding[];
}

// ─── Expense by category ────────────────────────────────────────

export interface ExpenseCategoryRow {
    category: string;
    totalAmount: string;
    percentage: number;
    count: number;
}

export interface ExpenseReport {
    period: FinancialReportPeriod;
    totalExpense: string;
    categories: ExpenseCategoryRow[];
}

export interface ExpenseReportFilters {
    from: string;
    to: string;
    buildingId?: string;
}
