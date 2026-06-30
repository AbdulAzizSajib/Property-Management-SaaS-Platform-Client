"use client";

// src/components/dashboard/units/UnitsPanel.tsx

import {
  UnitForm,
  buildCreatePayload,
} from "@/src/components/dashboard/units/UnitForm";
import {
  formatMoney,
  statusLabel,
  typeLabel,
  unitStatusAccent,
  unitStatusStyles,
  unitTypeStyles,
} from "@/src/components/dashboard/units/unitStyles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useCreateUnit, useUnits } from "@/src/hooks/useUnits";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import { Bath, Bed, DoorOpen, Plus, Ruler } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface UnitsPanelProps {
  buildingId: string;
}

export function UnitsPanel({ buildingId }: UnitsPanelProps) {
  const { data: units, isLoading, isError, error } = useUnits({ buildingId });
  const createMutation = useCreateUnit();
  const [createOpen, setCreateOpen] = useState(false);

  const vacantCount = units?.filter((u) => u.status === "VACANT").length ?? 0;
  const occupiedCount =
    units?.filter((u) => u.status === "OCCUPIED").length ?? 0;

  return (
    <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-serif text-[13px] italic text-coral-600/85">
            Units in this building
          </p>
          <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
            Units
          </h3>

          {/* Quick summary line */}
          {units && units.length > 0 && (
            <p className="mt-1.5 text-[12px] text-ink-soft">
              <span className="font-semibold text-ink tabular-nums">
                {fmtNum(units.length)}
              </span>{" "}
              {units.length === 1 ? "unit" : "units"} ·{" "}
              <span
                className={cn(
                  "tabular-nums",
                  vacantCount > 0 && "font-semibold text-coral-600",
                )}
              >
                {fmtNum(vacantCount)} vacant
              </span>{" "}
              ·{" "}
              <span className="tabular-nums">
                {fmtNum(occupiedCount)} occupied
              </span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] bg-jade-900 px-3 text-[12.5px] font-semibold text-paper transition-colors hover:bg-jade-950"
        >
          <Plus size={13} />
          Add unit
        </button>
      </div>

      {/* Body */}
      <div className="mt-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[136px] rounded-[12px] bg-cream" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[10px] border border-coral-100 bg-coral-50/60 px-3 py-2.5 text-[13px] text-coral-600">
            {error instanceof Error ? error.message : "Couldn't load units."}
          </div>
        ) : !units || units.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-rule-soft px-4 py-8 text-center">
            <DoorOpen className="mx-auto text-ink-soft/40" size={24} />
            <p className="mt-2 text-[13px] text-ink-soft">No units yet</p>
            <p className="font-bangla mt-0.5 text-[11.5px] text-ink-soft/70">
              কোনো ইউনিট নেই
            </p>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-jade-900 hover:text-coral-600 transition-colors"
            >
              <Plus size={12} /> Add your first unit
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            {units.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/owner/dashboard/units/${u.id}`}
                  className="group relative block overflow-hidden rounded-[12px] border border-rule-soft bg-paper p-3.5 transition-all hover:-translate-y-0.5 hover:border-jade-700/20 hover:shadow-[0_8px_24px_-12px_rgba(10,46,34,0.15)]"
                >
                  {/* Status accent strip — coral for VACANT, etc. Pulls the eye to actionable units. */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-0 left-0 w-[3px]",
                      unitStatusAccent[u.status],
                    )}
                  />

                  {/* Header: unit name + status */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 truncate text-[15px] font-bold tracking-[-0.01em] text-jade-950 group-hover:text-jade-900">
                      {u.name}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        unitStatusStyles[u.status],
                      )}
                    >
                      {statusLabel(u.status)}
                    </span>
                  </div>

                  {/* Floor + type — floor shown once, as a numbered badge */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11.5px]">
                    <span className="inline-flex items-center gap-1.5 text-ink-soft">
                      <span className="inline-flex size-4 items-center justify-center rounded-[5px] bg-jade-50 text-[9.5px] font-bold text-jade-800 tabular-nums">
                        {u.floor.floorNumber === 0
                          ? "G"
                          : fmtNum(u.floor.floorNumber)}
                      </span>
                      {u.floor.name}
                    </span>
                    <span
                      className={cn(
                        "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        unitTypeStyles[u.type],
                      )}
                    >
                      {typeLabel(u.type)}
                    </span>
                  </div>

                  {/* Room/size details — only when the data exists */}
                  {(u.bedrooms !== null ||
                    u.bathrooms !== null ||
                    u.sizeSqft !== null) && (
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-soft">
                      {u.bedrooms !== null && (
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Bed size={11} className="text-ink-soft/60" />
                          {fmtNum(u.bedrooms)} bed
                        </span>
                      )}
                      {u.bathrooms !== null && (
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Bath size={11} className="text-ink-soft/60" />
                          {fmtNum(u.bathrooms)} bath
                        </span>
                      )}
                      {u.sizeSqft !== null && (
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Ruler size={11} className="text-ink-soft/60" />
                          {fmtNum(u.sizeSqft)} sqft
                        </span>
                      )}
                    </div>
                  )}

                  {/* Rent */}
                  <div className="mt-3 flex items-baseline justify-between border-t border-rule-soft pt-2.5">
                    <p className="flex items-baseline gap-1 text-[15px] font-bold text-jade-950 tabular-nums">
                      {formatMoney(u.baseRent)}
                      <span className="text-[10.5px] font-medium text-ink-soft">
                        /mo
                      </span>
                    </p>
                    {Number(u.serviceCharge) > 0 && (
                      <p className="text-[10.5px] text-ink-soft tabular-nums">
                        + {formatMoney(u.serviceCharge)} service
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-jade-950">Add unit</DialogTitle>
            <DialogDescription className="text-ink-soft">
              Add a flat, shop, office or other unit to a floor in this
              building.
            </DialogDescription>
          </DialogHeader>
          <UnitForm
            mode="create"
            fixedBuildingId={buildingId}
            submitting={createMutation.isPending}
            submitLabel="Add unit"
            onCancel={() => setCreateOpen(false)}
            onSubmit={(values) => {
              const payload = buildCreatePayload(values);
              createMutation.mutate(payload, {
                onSuccess: () => setCreateOpen(false),
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
