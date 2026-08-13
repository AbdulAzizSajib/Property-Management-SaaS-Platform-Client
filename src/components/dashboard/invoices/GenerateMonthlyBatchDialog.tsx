"use client";

// src/components/dashboard/invoices/GenerateMonthlyBatchDialog.tsx

import {
  Field,
  FormActions,
  fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import {
  formatBillingMonth,
  toBillingMonthDate,
} from "@/src/components/dashboard/invoices/invoiceStyles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useGenerateMonthlyBatch } from "@/src/hooks/useInvoices";
import { useLeases } from "@/src/hooks/useLeases";
import { fmtNum } from "@/src/lib/numerals";
import { CalendarRange, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface GenerateMonthlyBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function nextMonthYearMonth(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
}

export function GenerateMonthlyBatchDialog({
  open,
  onOpenChange,
}: GenerateMonthlyBatchDialogProps) {
  const mutation = useGenerateMonthlyBatch();
  const { data: leases } = useLeases();
  const [billingMonth, setBillingMonth] = useState(nextMonthYearMonth());
  const [buildingId, setBuildingId] = useState("");
  const [carryForward, setCarryForward] = useState(true);

  useEffect(() => {
    if (open) {
      setBillingMonth(nextMonthYearMonth());
      setBuildingId("");
      setCarryForward(true);
    }
  }, [open]);

  const activeLeases = useMemo(
    () => (leases ?? []).filter((l) => l.status === "ACTIVE"),
    [leases],
  );

  // Unique buildings across active leases — for the optional building filter.
  const buildings = useMemo(() => {
    const map = new Map<string, string>();
    for (const l of activeLeases) {
      if (l.unit?.building) {
        map.set(l.unit.building.id, l.unit.building.name);
      }
    }
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [activeLeases]);

  // How many invoices this run will attempt — narrowed by the building filter.
  const activeLeaseCount = useMemo(
    () =>
      buildingId
        ? activeLeases.filter((l) => l.unit.building.id === buildingId).length
        : activeLeases.length,
    [activeLeases, buildingId],
  );

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    mutation.mutate(
      {
        billingMonth: toBillingMonthDate(billingMonth),
        carryForward,
        ...(buildingId && { buildingId }),
      },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-jade-950">
            Generate monthly invoices
          </DialogTitle>
          <DialogDescription className="text-ink-soft">
            Generate invoices for every active lease for the selected month.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* How-it-works callout */}
          <div className="flex items-start gap-2.5 rounded-[10px] border border-jade-100 bg-jade-50/60 p-3">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-sky-950 text-paper">
              <Zap size={11} />
            </span>
            <div className="text-[12px] leading-relaxed">
              <p className="font-semibold text-jade-950">How it works</p>
              <p className="mt-0.5 text-ink">
                Every{" "}
                <span className="rounded-sm bg-jade-50 px-1 font-semibold text-jade-800">
                  ACTIVE
                </span>{" "}
                lease will get one invoice for the month. Leases that already
                have an invoice for that month are skipped — safe to re-run.
              </p>
            </div>
          </div>

          <Field label="Billing month" htmlFor="b-month" required>
            <div className="relative">
              <CalendarRange
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/70"
              />
              <Input
                id="b-month"
                type="month"
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
                required
                className={`${fieldClass} pl-9 tabular-nums`}
              />
            </div>
          </Field>

          {buildings.length > 1 && (
            <Field label="Building" htmlFor="b-building">
              <Select
                value={buildingId || "All"}
                onValueChange={(v) =>
                  setBuildingId(v === "All" ? "" : (v ?? ""))
                }
              >
                <SelectTrigger
                  id="b-building"
                  className={`w-full ${fieldClass}`}
                >
                  <SelectValue placeholder="All buildings">
                    {(value) =>
                      buildings.find((b) => b.id === value)?.name ??
                      "All buildings"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All buildings</SelectItem>
                  {buildings.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          {/* Carry-forward toggle */}
          <label className="flex cursor-pointer items-start gap-2.5 rounded-[10px] border border-rule-soft bg-paper px-3 py-2.5">
            <input
              type="checkbox"
              checked={carryForward}
              onChange={(e) => setCarryForward(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-jade-800"
            />
            <span className="text-[12.5px] leading-relaxed">
              <span className="font-semibold text-jade-950">
                Carry forward unpaid balances
              </span>
              <span className="mt-0.5 block text-ink-soft">
                Each tenant&apos;s outstanding due is rolled into their new
                invoice (older invoices marked carried forward). Uncheck to bill
                only this month&apos;s rent.
              </span>
            </span>
          </label>

          {/* Preview — how many invoices this will create */}
          {activeLeaseCount > 0 && (
            <div className="rounded-[10px] border border-rule-soft bg-cream/60 px-3 py-2.5">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                Preview
              </p>
              <p className="mt-1 text-[13px] text-ink">
                Up to{" "}
                <span className="font-bold text-jade-950 tabular-nums">
                  {fmtNum(activeLeaseCount)}
                </span>{" "}
                invoice{activeLeaseCount === 1 ? "" : "s"} for{" "}
                <span className="font-semibold text-jade-900">
                  {formatBillingMonth(billingMonth)}
                </span>
              </p>
              <p className="mt-0.5 text-[11px] text-ink-soft">
                Actual count may be lower if some leases already have an invoice
                for this month.
              </p>
            </div>
          )}

          {activeLeaseCount === 0 && (
            <div className="flex items-start gap-2 rounded-[10px] border border-coral-100 bg-coral-50/60 px-3 py-2 text-[12.5px] text-coral-600">
              <span>
                No active leases. Generate this batch later once you have active
                leases on record.
              </span>
            </div>
          )}

          <FormActions
            submitting={mutation.isPending}
            submitLabel="Generate batch"
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
