"use client";

// src/app/owner/dashboard/units/page.tsx

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
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useBuildings } from "@/src/hooks/useBuildings";
import { useCreateUnit, useUnits } from "@/src/hooks/useUnits";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import {
  UNIT_STATUS_OPTIONS,
  UNIT_TYPE_OPTIONS,
  type UnitListItem,
  type UnitStatus,
  type UnitType,
} from "@/src/types/unit.types";
import { Bath, Bed, DoorOpen, Plus, Ruler, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ALL = "__ALL__";

export default function UnitsListPage() {
  const [buildingId, setBuildingId] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const [type, setType] = useState<string>(ALL);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filters = {
    ...(buildingId !== ALL && { buildingId }),
    ...(status !== ALL && { status: status as UnitStatus }),
    ...(type !== ALL && { type: type as UnitType }),
  };

  const { data: buildings } = useBuildings();
  const { data: units, isLoading, isError, error } = useUnits(filters);
  const createMutation = useCreateUnit();

  const filtered = (units ?? []).filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.building.name.toLowerCase().includes(q) ||
      u.floor.name.toLowerCase().includes(q)
    );
  });

  const hasActiveFilters =
    buildingId !== ALL || status !== ALL || type !== ALL || query.trim() !== "";

  // Summary scoped to current filters
  const vacantCount = filtered.filter((u) => u.status === "VACANT").length;
  const occupiedCount = filtered.filter((u) => u.status === "OCCUPIED").length;

  function clearFilters() {
    setBuildingId(ALL);
    setStatus(ALL);
    setType(ALL);
    setQuery("");
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-[1280px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Heading */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-[13px] italic text-coral-600/85">
              Across your portfolio
            </p>
            <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
              Units
            </h1>
            <p className="font-bangla mt-1 text-[13px] text-ink-soft">
              সব ফ্ল্যাট, দোকান ও অফিস।
            </p>
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                >
                  <Plus size={14} />
                  Add Unit
                </button>
              }
            />
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-jade-950">Add Unit</DialogTitle>
                <DialogDescription className="text-ink-soft">
                  Add a new flat, shop, office or other rental unit.
                </DialogDescription>
              </DialogHeader>
              <UnitForm
                mode="create"
                submitting={createMutation.isPending}
                submitLabel="Add Unit"
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
        </header>

        {/* Filters */}
        <div className="rounded-[14px] border border-rule-soft bg-paper p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/70"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by unit, building, floor…"
                className="h-9 w-full rounded-md border border-rule-soft bg-paper pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-soft/60 focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
              />
            </div>

            <Select
              value={buildingId}
              onValueChange={(v) => setBuildingId(v ?? ALL)}
            >
              <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                <SelectValue placeholder="Building">
                  {(value) => {
                    if (value === ALL) return "All buildings";
                    return buildings?.find((b) => b.id === value)?.name ?? null;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All buildings</SelectItem>
                {buildings?.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={(v) => setStatus(v ?? ALL)}>
              <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All statuses</SelectItem>
                {UNIT_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={type} onValueChange={(v) => setType(v ?? ALL)}>
              <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All types</SelectItem>
                {UNIT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Result count + active filter chips */}
          {(filtered.length > 0 || hasActiveFilters) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-rule-soft pt-3">
              <span className="text-[12px] text-ink-soft tabular-nums">
                <span className="font-semibold text-ink">
                  {fmtNum(filtered.length)}
                </span>{" "}
                {filtered.length === 1 ? "result" : "results"}
                {filtered.length > 0 && (
                  <>
                    {" "}
                    ·{" "}
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
                  </>
                )}
              </span>

              {hasActiveFilters && (
                <>
                  <span className="text-ink-soft/30">|</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {query.trim() && (
                      <Chip
                        label="Search"
                        value={`"${query.trim()}"`}
                        onRemove={() => setQuery("")}
                      />
                    )}
                    {buildingId !== ALL && (
                      <Chip
                        label="Building"
                        value={
                          buildings?.find((b) => b.id === buildingId)?.name ??
                          buildingId
                        }
                        onRemove={() => setBuildingId(ALL)}
                      />
                    )}
                    {status !== ALL && (
                      <Chip
                        label="Status"
                        value={statusLabel(status as UnitStatus)}
                        onRemove={() => setStatus(ALL)}
                      />
                    )}
                    {type !== ALL && (
                      <Chip
                        label="Type"
                        value={typeLabel(type as UnitType)}
                        onRemove={() => setType(ALL)}
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="ml-auto inline-flex items-center gap-1 text-[12px] font-medium text-ink-soft transition-colors hover:text-coral-600"
                  >
                    Clear all
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-[180px] rounded-[12px] bg-paper" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
            <h2 className="text-[15px] font-bold text-coral-600">
              Couldn&apos;t load units
            </h2>
            <p className="mt-1 text-[13px] text-coral-600/80">
              {error instanceof Error ? error.message : "Please try again."}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onCreate={() => setCreateOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((u) => (
              <UnitCard key={u.id} unit={u} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// UnitCard — visually identical to the panel version so a unit looks
// the same wherever it appears in the app.
// ─────────────────────────────────────────────────────────────────

function UnitCard({ unit }: { unit: UnitListItem }) {
  return (
    <Link
      href={`/owner/dashboard/units/${unit.id}`}
      className="group relative block overflow-hidden rounded-[12px] border border-rule-soft bg-paper p-3.5 transition-all hover:-translate-y-0.5 hover:border-jade-700/20 hover:shadow-[0_8px_24px_-12px_rgba(10,46,34,0.15)]"
    >
      {/* Status accent strip */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-[3px]",
          unitStatusAccent[unit.status],
        )}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[16px] font-bold tracking-[-0.01em] text-jade-950 group-hover:text-jade-900">
            {unit.name}
          </p>
          <p className="truncate text-[11.5px] text-ink-soft">
            {unit.building.name}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            unitStatusStyles[unit.status],
          )}
        >
          {statusLabel(unit.status)}
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span
          className={cn(
            "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            unitTypeStyles[unit.type],
          )}
        >
          {typeLabel(unit.type)}
        </span>
        <span className="text-[11.5px] text-ink-soft">
          {unit.floor.floorNumber === 0
            ? "Ground floor"
            : `Floor ${fmtNum(unit.floor.floorNumber)}`}
        </span>
      </div>

      {(unit.bedrooms !== null ||
        unit.bathrooms !== null ||
        unit.sizeSqft !== null) && (
        <div className="mt-2.5 flex items-center gap-3 text-[11.5px] text-ink-soft">
          {unit.bedrooms !== null && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Bed size={11} className="text-ink-soft/60" />
              {fmtNum(unit.bedrooms)}
            </span>
          )}
          {unit.bathrooms !== null && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Bath size={11} className="text-ink-soft/60" />
              {fmtNum(unit.bathrooms)}
            </span>
          )}
          {unit.sizeSqft !== null && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Ruler size={11} className="text-ink-soft/60" />
              {fmtNum(unit.sizeSqft)} sqft
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-baseline justify-between border-t border-rule-soft pt-2.5">
        <p className="text-[16px] font-bold text-jade-950 tabular-nums">
          {formatMoney(unit.baseRent)}
          <span className="ml-1 text-[10.5px] font-medium text-ink-soft">
            /mo
          </span>
        </p>
        {Number(unit.serviceCharge) > 0 && (
          <p className="text-[10.5px] text-ink-soft tabular-nums">
            + {formatMoney(unit.serviceCharge)} svc
          </p>
        )}
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────
// Filter chip — removable active-filter indicator
// ─────────────────────────────────────────────────────────────────

function Chip({
  label,
  value,
  onRemove,
}: {
  label: string;
  value: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-rule-soft bg-cream/60 py-0.5 pl-2 pr-1 text-[11.5px] text-ink">
      <span className="text-ink-soft">{label}:</span>
      <span className="font-semibold">{value}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="inline-flex size-4 items-center justify-center rounded-sm text-ink-soft transition-colors hover:bg-coral-50 hover:text-coral-600"
      >
        <X size={10} />
      </button>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// Empty state — adapts copy based on whether filters are active
// ─────────────────────────────────────────────────────────────────

function EmptyState({
  hasFilters,
  onClearFilters,
  onCreate,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
        <DoorOpen size={26} className="text-jade-800" />
      </div>
      <h2 className="mt-4 text-[17px] font-bold text-jade-950">
        {hasFilters ? "No units match these filters" : "No units yet"}
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
        {hasFilters
          ? "Try clearing some filters to see more results."
          : "Add your first unit to start tracking rentals."}
      </p>
      {!hasFilters && (
        <p className="font-bangla mt-0.5 text-[12px] text-ink-soft/75">
          আপনার প্রথম ইউনিট যোগ করুন
        </p>
      )}
      <div className="mt-5">
        {hasFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-rule-soft bg-paper px-4 text-[13px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
          >
            <X size={13} /> Clear filters
          </button>
        ) : (
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
          >
            <Plus size={14} /> Add your first unit
          </button>
        )}
      </div>
    </div>
  );
}
