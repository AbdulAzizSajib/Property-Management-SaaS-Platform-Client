"use client";

// src/app/owner/dashboard/reports/rent-collection/page.tsx
//
// Per-tenant billed / paid / due breakdown over a date range.

import { Skeleton } from "@/src/components/ui/skeleton";
import { useRentCollectionReport } from "@/src/hooks/useReports";
import { cn } from "@/src/lib/utils";
import { Calendar } from "lucide-react";
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

export default function RentCollectionReportPage() {
  const now = useMemo(() => new Date(), []);
  const startOfYear = useMemo(() => new Date(now.getFullYear(), 0, 1), [now]);
  const [fromDate, setFromDate] = useState(toDateInput(startOfYear));
  const [toDate, setToDate] = useState(toDateInput(now));

  const { data, isLoading, isError } = useRentCollectionReport({
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
            Rent collection
          </h1>
          <p className="font-bangla mt-1 text-[13px] text-ink-soft">
            ভাড়াটিয়াভেদে বিল, পেমেন্ট ও বকেয়া
          </p>
        </header>

        {/* Date range */}
        <div className="grid grid-cols-1 gap-3 rounded-[14px] border border-rule-soft bg-paper p-3 sm:grid-cols-2">
          <DateField label="From" value={fromDate} onChange={setFromDate} />
          <DateField label="To" value={toDate} onChange={setToDate} />
        </div>

        {/* Summary */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-[12px] bg-paper" />
            ))}
          </div>
        ) : isError || !data ? (
          <p className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-4 py-8 text-center text-[13px] text-coral-600">
            Couldn&apos;t load report.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Billed" value={fmt(data.summary.totalBilled)} />
              <Stat label="Paid" value={fmt(data.summary.totalPaid)} />
              <Stat
                label="Due"
                value={fmt(data.summary.totalDue)}
                tone="warn"
              />
              <Stat
                label="Collection"
                value={`${data.summary.collectionRate.toFixed(1)}%`}
                tone="good"
              />
            </div>

            <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
              <table className="w-full text-[13px]">
                <thead className="bg-cream/60 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                  <tr>
                    <th className="px-3 py-2 text-left">Tenant</th>
                    <th className="px-3 py-2 text-right">Invoices</th>
                    <th className="px-3 py-2 text-right">Billed</th>
                    <th className="px-3 py-2 text-right">Paid</th>
                    <th className="px-3 py-2 text-right">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule-soft">
                  {data.rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-8 text-center text-ink-soft"
                      >
                        No invoices in this period.
                      </td>
                    </tr>
                  ) : (
                    data.rows.map((r) => (
                      <tr
                        key={r.tenantId}
                        className="bg-paper hover:bg-cream/40"
                      >
                        <td className="px-3 py-2 font-semibold text-ink">
                          {r.tenantName}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {r.invoiceCount}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {fmt(r.totalBilled)}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {fmt(r.totalPaid)}
                        </td>
                        <td
                          className={cn(
                            "px-3 py-2 text-right tabular-nums",
                            Number(r.totalDue) > 0
                              ? "text-coral-600"
                              : "text-ink",
                          )}
                        >
                          {fmt(r.totalDue)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warn" | "good";
}) {
  return (
    <div
      className={cn(
        "rounded-[12px] border px-4 py-3",
        tone === "warn"
          ? "border-coral-100 bg-coral-50/60"
          : tone === "good"
            ? "border-jade-100 bg-jade-50/60"
            : "border-rule-soft bg-paper",
      )}
    >
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-[18px] font-bold tabular-nums tracking-[-0.01em]",
          tone === "warn"
            ? "text-coral-600"
            : tone === "good"
              ? "text-jade-800"
              : "text-jade-950",
        )}
      >
        {value}
      </p>
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
    <label className="block">
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
