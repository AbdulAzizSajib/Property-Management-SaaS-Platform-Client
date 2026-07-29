"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import type {
    CreateExpensePayload,
    Expense,
    ExpenseDetail,
    ExpenseFilters,
    ExpenseListItem,
    UpdateExpensePayload,
} from "@/src/types/expense.types";

function buildExpenseQuery(filters?: ExpenseFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.buildingId) params.set("buildingId", filters.buildingId);
    if (filters.unitId) params.set("unitId", filters.unitId);
    if (filters.category) params.set("category", filters.category);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

/** POST /expenses — record a new expense. */
export const createExpense = async (payload: CreateExpensePayload) =>
    httpClient.post<Expense>("/expenses", payload);

/** GET /expenses — list with optional building / category / date-range filters. */
export const getExpenses = async (filters?: ExpenseFilters) =>
    httpClient.get<ExpenseListItem[]>(`/expenses${buildExpenseQuery(filters)}`);

/** GET /expenses/:id — full detail with embedded building + unit. */
export const getExpenseById = async (id: string) =>
    httpClient.get<ExpenseDetail>(`/expenses/${id}`);

/** PATCH /expenses/:id — partial update. */
export const updateExpense = async (
    id: string,
    payload: UpdateExpensePayload,
) => httpClient.patch<Expense>(`/expenses/${id}`, payload);

/** DELETE /expenses/:id. */
export const deleteExpense = async (id: string) =>
    httpClient.delete<{ id: string }>(`/expenses/${id}`);
