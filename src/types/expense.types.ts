import type { PaymentMethod } from "./payment.types";

export type ExpenseCategory =
    | "ELECTRICITY"
    | "WATER"
    | "GAS"
    | "GENERATOR_FUEL"
    | "INTERNET"
    | "MAINTENANCE"
    | "REPAIR"
    | "CLEANING"
    | "SECURITY"
    | "WASTE_MANAGEMENT"
    | "LIFT_MAINTENANCE"
    | "PROPERTY_TAX"
    | "LEGAL_FEES"
    | "SALARY"
    | "OTHER";

export const EXPENSE_CATEGORY_OPTIONS: {
    value: ExpenseCategory;
    label: string;
}[] = [
    { value: "ELECTRICITY", label: "Electricity" },
    { value: "WATER", label: "Water" },
    { value: "GAS", label: "Gas" },
    { value: "GENERATOR_FUEL", label: "Generator fuel" },
    { value: "INTERNET", label: "Internet" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "REPAIR", label: "Repair" },
    { value: "CLEANING", label: "Cleaning" },
    { value: "SECURITY", label: "Security" },
    { value: "WASTE_MANAGEMENT", label: "Waste management" },
    { value: "LIFT_MAINTENANCE", label: "Lift maintenance" },
    { value: "PROPERTY_TAX", label: "Property tax" },
    { value: "LEGAL_FEES", label: "Legal fees" },
    { value: "SALARY", label: "Salary" },
    { value: "OTHER", label: "Other" },
];

export interface ExpenseBuildingSummary {
    id: string;
    name: string;
}

export interface ExpenseUnitSummary {
    id: string;
    name: string;
}

// Backend returns Prisma Decimal as a string.
export interface Expense {
    id: string;
    title: string;
    category: ExpenseCategory;
    amount: string;
    expenseDate: string;
    paidTo: string | null;
    paymentMethod: PaymentMethod;
    receiptUrl: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    buildingId: string | null;
    unitId: string | null;
    building: ExpenseBuildingSummary | null;
    unit: ExpenseUnitSummary | null;
}

export type ExpenseListItem = Expense;
export type ExpenseDetail = Expense;

export interface CreateExpensePayload {
    title: string;
    category: ExpenseCategory;
    amount: number;
    expenseDate: string;
    paymentMethod: PaymentMethod;
    paidTo?: string;
    notes?: string;
    receiptUrl?: string;
    buildingId?: string;
    unitId?: string;
}

export type UpdateExpensePayload = Partial<CreateExpensePayload>;

export interface ExpenseFilters {
    buildingId?: string;
    category?: ExpenseCategory;
    /** ISO date string — inclusive lower bound on expenseDate. */
    from?: string;
    /** ISO date string — inclusive upper bound on expenseDate. */
    to?: string;
}
