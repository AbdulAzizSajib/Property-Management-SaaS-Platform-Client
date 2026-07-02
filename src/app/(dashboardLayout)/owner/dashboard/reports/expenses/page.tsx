"use client";

// src/app/owner/dashboard/reports/expenses/page.tsx
//
// Expense breakdown by category with percentages.

import { Skeleton } from "@/src/components/ui/skeleton";
import { useExpenseReport } from "@/src/hooks/useReports";
import { cn } from "@/src/lib/utils";
import { Calendar, Receipt } from "lucide-react";
import { useMemo, useState } from "react";

const fmt = (n: number | string) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(typeof n === "string" ? Number(n) : n);

function toDateInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function ExpenseReportPage() {
  const now = useMemo(() => new Date(), []);
  const startOfYear = useMemo(() => new Date(now.getFullYear(), 0, 1), [now]);
  const [fromDate, setFromDate] = useState(toDateInput(startOfYear));
  const [toDate, setToDate] = useState(toDateInput(now));

  const { data, isLoading, isError } = useExpenseReport({
    from: new Date(`${fromDate}T00:00:00Z`).toISOString(),
    to: new Date(`${toDate}T23:59:59Z`).toISOString(),
  });

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto container space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header>
          <p className="font-serif text-[13px] italic text-coral-600/85">
            Reports
          </p>
          <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
            Expenses by category
          </h1>
          <p className="font-bangla mt-1 text-[13px] text-ink-soft">
            ক্যাটাগরি অনুসারে ব্যয়ের বিশ্লেষণ
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 rounded-[14px] border border-rule-soft bg-paper p-3 sm:grid-cols-2">
          <DateField label="From" value={fromDate} onChange={setFromDate} />
          <DateField label="To" value={toDate} onChange={setToDate} />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 rounded-[14px] bg-paper" />
            <Skeleton className="h-48 rounded-[14px] bg-paper" />
          </div>
        ) : isError || !data ? (
          <p className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-4 py-8 text-center text-[13px] text-coral-600">
            Couldn&apos;t load report.
          </p>
        ) : (
          <>
            <div className="rounded-[14px] border border-rule-soft bg-paper px-4 py-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                Total expense
              </p>
              <p className="mt-1 text-[28px] font-bold tabular-nums text-jade-950">
                {fmt(data.totalExpense)}
              </p>
            </div>

            <ul className="space-y-2">
              {data.categories.length === 0 ? (
                <li className="rounded-[14px] border border-dashed border-rule-soft bg-paper px-6 py-8 text-center text-ink-soft">
                  <Receipt size={20} className="mx-auto opacity-60" />
                  <p className="mt-2 text-[13px]">
                    No expenses in this period.
                  </p>
                </li>
              ) : (
                data.categories.map((c) => (
                  <li
                    key={c.category}
                    className="rounded-[12px] border border-rule-soft bg-paper p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[13.5px] font-semibold text-ink">
                        {c.category}
                      </p>
                      <p className="text-[14px] font-bold tabular-nums text-jade-950">
                        {fmt(c.totalAmount)}
                      </p>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream">
                      <div
                        className="h-full rounded-full bg-jade-700"
                        style={{
                          width: `${c.percentage}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-ink-soft">
                      {c.percentage.toFixed(1)}% · {c.count} item
                      {c.count === 1 ? "" : "s"}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className={cn("block")}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
        {label}
      </span>
      <div className="relative mt-1">
        <Calendar
          size={14}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-soft/70"
        />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full rounded-md border border-rule-soft bg-cream/40 pl-7 pr-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-jade-700/30"
        />
      </div>
    </label>
  );
}
