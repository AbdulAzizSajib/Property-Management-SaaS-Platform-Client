"use client";

// src/app/owner/dashboard/buildings/page.tsx

import { BuildingForm } from "@/src/components/dashboard/buildings/BuildingForm";
import {
  typeBadgeStyles,
  typeLabel,
  statusBadgeStyles,
} from "@/src/components/dashboard/buildings/building-helpers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useBuildings, useCreateBuilding } from "@/src/hooks/useBuildings";
import { useFloorsByBuilding } from "@/src/hooks/useFloors";
import { cn } from "@/src/lib/utils";
import { fmtNum } from "@/src/lib/numerals";
import type { BuildingListItem } from "@/src/types/building.types";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  DoorOpen,
  Layers,
  MapPin,
  Plus,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BuildingsListPage() {
  const { data: buildings, isLoading, isError, error } = useBuildings();
  const createMutation = useCreateBuilding();

  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = (buildings ?? []).filter((b) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      (b.area ?? "").toLowerCase().includes(q)
    );
  });

  const totalFloors = (buildings ?? []).reduce(
    (sum, b) => sum + b._count.floors,
    0,
  );
  const totalUnits = (buildings ?? []).reduce(
    (sum, b) => sum + b._count.units,
    0,
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto container space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Heading */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-[13px] italic text-coral-600/85">
              Your real estate
            </p>
            <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
              Buildings
            </h1>
            <p className="font-bangla mt-1 text-[13px] text-ink-soft">
              সব বিল্ডিং এক জায়গায়।
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
                  Add building
                </button>
              }
            />
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-jade-950">
                  Add new building
                </DialogTitle>
                <DialogDescription className="text-ink-soft">
                  আপনার তালিকায় নতুন বিল্ডিং যোগ করুন — তৈরির পর floors আর
                  units যোগ করতে পারবেন।
                </DialogDescription>
              </DialogHeader>
              <BuildingForm
                submitting={createMutation.isPending}
                submitLabel="Create building"
                onCancel={() => setCreateOpen(false)}
                onSubmit={(payload) => {
                  createMutation.mutate(payload, {
                    onSuccess: () => setCreateOpen(false),
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        </header>

        <div className="flex items-center justify-between">
          {/* Summary strip — replaces 3 rainbow stat tiles with a single quiet info row */}
          <section className="flex flex-wrap items-baseline gap-x-7 gap-y-2 rounded-[14px] border border-rule-soft bg-paper px-5 py-3">
            <SummaryStat
              label="Buildings"
              value={fmtNum(buildings?.length ?? 0)}
              icon={Building2}
            />
            <SummaryStat
              label="Floors"
              value={fmtNum(totalFloors)}
              icon={Layers}
            />
            <SummaryStat
              label="Units"
              value={fmtNum(totalUnits)}
              icon={DoorOpen}
            />
            <span className="font-bangla ml-auto hidden text-[12px] text-ink-soft sm:inline">
              মোট সম্পত্তি
            </span>
          </section>

          {/* Toolbar */}
          {/* <div className="rounded-[14px] border border-rule-soft bg-paper px-5 py-3"> */}
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/70"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by building name, address, city, area…"
              className="h-9 px-5 py-3 w-full  rounded-md border border-rule-soft bg-paper pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-soft/60 focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
            />
          </div>
          {query && (
            <div className="mt-2 text-[11.5px] text-ink-soft tabular-nums">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </div>
          )}
        </div>
        {/* </div> */}

        {/* Content */}
        {isLoading ? (
          <Skeleton className="h-96 w-full rounded-[14px] bg-paper" />
        ) : isError ? (
          <ErrorBox
            message={
              error instanceof Error ? error.message : "Please try again."
            }
          />
        ) : !buildings || buildings.length === 0 ? (
          <EmptyState onCreate={() => setCreateOpen(true)} />
        ) : filtered.length === 0 ? (
          <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-12 text-center">
            <p className="text-[13.5px] text-ink-soft">
              No buildings match &ldquo;{query}&rdquo;.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
            {/* Desktop table header */}
            <div className="hidden grid-cols-[28px_minmax(0,2.5fr)_110px_140px_80px_80px_140px_100px_44px] items-center gap-3 border-b border-rule-soft bg-cream/60 px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft lg:grid">
              <span />
              <span>Name &amp; address</span>
              <span>Type</span>
              <span>City / Area</span>
              <span className="text-right">Floors</span>
              <span className="text-right">Units</span>
              <span>Caretaker</span>
              <span>Status</span>
              <span />
            </div>

            <ul className="divide-y divide-rule-soft">
              {filtered.map((b) => (
                <BuildingRow
                  key={b.id}
                  building={b}
                  isExpanded={expandedId === b.id}
                  onToggle={() =>
                    setExpandedId((cur) => (cur === b.id ? null : b.id))
                  }
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function BuildingRow({
  building,
  isExpanded,
  onToggle,
}: {
  building: BuildingListItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cn(
          "group grid cursor-pointer grid-cols-[28px_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-cream/60 lg:grid-cols-[28px_minmax(0,2.5fr)_110px_140px_80px_80px_140px_100px_44px]",
          isExpanded && "bg-cream/60",
        )}
      >
        <ChevronRight
          size={14}
          className={cn(
            "shrink-0 text-ink-soft/60 transition-transform",
            isExpanded && "rotate-90 text-coral-600",
          )}
        />

        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-ink group-hover:text-jade-900">
            {building.name}
          </p>
          <p className="truncate text-[11.5px] text-ink-soft">
            <MapPin size={10} className="mr-1 inline" />
            {building.address}
          </p>
        </div>

        <span
          className={cn(
            "hidden rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider lg:inline-flex",
            typeBadgeStyles[building.type],
          )}
        >
          {typeLabel(building.type)}
        </span>

        <div className="hidden min-w-0 text-[12px] lg:block">
          <p className="truncate font-medium text-ink">{building.city}</p>
          {building.area && (
            <p className="truncate text-[11px] text-ink-soft">
              {building.area}
            </p>
          )}
        </div>

        <div className="hidden text-right tabular-nums lg:block">
          <p className="text-[14px] font-semibold text-jade-950">
            {building._count.floors}
          </p>
          <p className="text-[10px] text-ink-soft">/ {building.totalFloors}</p>
        </div>

        <p className="hidden text-right text-[14px] font-semibold tabular-nums text-jade-950 lg:block">
          {building._count.units}
        </p>

        <div className="hidden text-[12px] lg:block">
          {building.caretaker ? (
            <span className="inline-flex items-center gap-1 truncate text-ink">
              <User size={11} className="text-ink-soft/60" />
              <span className="truncate">{building.caretaker.name}</span>
            </span>
          ) : (
            <span className="text-ink-soft/50">—</span>
          )}
        </div>

        <span
          className={cn(
            "hidden rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider lg:inline-flex",
            statusBadgeStyles(building.isActive),
          )}
        >
          {building.isActive ? "Active" : "Inactive"}
        </span>

        {/* Mobile chip strip */}
        <div className="flex flex-wrap items-center gap-1.5 lg:hidden">
          <span
            className={cn(
              "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              typeBadgeStyles[building.type],
            )}
          >
            {typeLabel(building.type)}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-ink-soft tabular-nums">
            <Layers size={10} /> {building._count.floors}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-ink-soft tabular-nums">
            <DoorOpen size={10} /> {building._count.units}
          </span>
        </div>

        <Link
          href={`/owner/dashboard/buildings/${building.id}`}
          onClick={(e) => e.stopPropagation()}
          className="ml-auto hidden size-7 items-center justify-center rounded-md text-ink-soft/70 hover:bg-paper hover:text-jade-900 lg:flex"
          aria-label="Open detail"
        >
          <ArrowRight size={14} />
        </Link>
      </div>

      {isExpanded && <ExpandedPanel building={building} />}
    </li>
  );
}

function ExpandedPanel({ building }: { building: BuildingListItem }) {
  return (
    <div className="border-t border-rule-soft bg-cream/40 px-4 py-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* About */}
        <div>
          <SectionLabel>About</SectionLabel>
          <p className="mt-1.5 text-[13px] text-ink">
            {building.description || (
              <span className="text-ink-soft/60">No description added.</span>
            )}
          </p>

          <dl className="mt-3 space-y-1.5 text-[12px]">
            <KV label="City" value={building.city} />
            {building.area && <KV label="Area" value={building.area} />}
            <KV label="Total floors" value={String(building.totalFloors)} />
            <KV
              label="Created"
              value={new Date(building.createdAt).toLocaleDateString()}
            />
          </dl>
        </div>

        <div>
          <SectionLabel>Floors</SectionLabel>
          <FloorsMiniList buildingId={building.id} />
        </div>

        <div>
          <SectionLabel>Caretaker</SectionLabel>
          {building.caretaker ? (
            <div className="mt-1.5 rounded-[10px] border border-rule-soft bg-paper p-3 text-[12px]">
              <p className="font-semibold text-ink">
                {building.caretaker.name}
              </p>
              {building.caretaker.email && (
                <p className="mt-0.5 text-ink-soft">
                  {building.caretaker.email}
                </p>
              )}
              {building.caretaker.contactNumber && (
                <p className="text-ink-soft tabular-nums">
                  {building.caretaker.contactNumber}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-1.5 text-[12px] text-ink-soft/60">
              No caretaker assigned
            </p>
          )}

          <div className="mt-4">
            <Link
              href={`/owner/dashboard/buildings/${building.id}`}
              className="inline-flex items-center gap-1.5 rounded-[8px] bg-jade-900 px-3 py-1.5 text-[12px] font-semibold text-paper transition-colors hover:bg-jade-950"
            >
              View full details
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloorsMiniList({ buildingId }: { buildingId: string }) {
  const { data: floors, isLoading } = useFloorsByBuilding(buildingId);

  if (isLoading) {
    return (
      <div className="mt-1.5 space-y-1.5">
        <Skeleton className="h-7 w-full rounded bg-paper" />
        <Skeleton className="h-7 w-full rounded bg-paper" />
        <Skeleton className="h-7 w-3/4 rounded bg-paper" />
      </div>
    );
  }

  if (!floors || floors.length === 0) {
    return (
      <p className="mt-1.5 text-[12px] text-ink-soft/60">No floors added yet</p>
    );
  }

  const sorted = [...floors].sort((a, b) => a.floorNumber - b.floorNumber);

  return (
    <ul className="mt-1.5 space-y-1">
      {sorted.slice(0, 6).map((f) => (
        <li
          key={f.id}
          className="flex items-center justify-between gap-2 rounded-md bg-paper px-2 py-1.5 text-[12px]"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded bg-jade-50 text-[10.5px] font-bold text-jade-800">
              {f.floorNumber === 0 ? "G" : f.floorNumber}
            </span>
            <span className="truncate text-ink">{f.name}</span>
          </div>
          <span className="text-[10.5px] tabular-nums text-ink-soft">
            {f._count.units} {f._count.units === 1 ? "unit" : "units"}
          </span>
        </li>
      ))}
      {sorted.length > 6 && (
        <li className="px-2 text-[10.5px] text-ink-soft">
          +{sorted.length - 6} more
        </li>
      )}
    </ul>
  );
}

function SummaryStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={15} className="text-ink-soft/70" />
      <div className="flex items-baseline gap-1.5">
        <span className="text-[20px] font-bold tracking-[-0.02em] text-jade-950 tabular-nums leading-none">
          {value}
        </span>
        <span className="text-[12px] text-ink-soft">{label}</span>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
      {children}
    </h4>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
        <Building2 size={26} className="text-jade-800" />
      </div>
      <h2 className="mt-4 text-[17px] font-bold text-jade-950">
        No buildings yet
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
        Get started by adding your first property to your portfolio.
      </p>
      <p className="font-bangla mt-0.5 text-[12px] text-ink-soft/75">
        আপনার প্রথম বিল্ডিং যোগ করুন
      </p>
      <div className="mt-5">
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
        >
          <Plus size={14} />
          Add your first building
        </button>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-[14px] border border-coral-100 bg-coral-50/50 px-6 py-12 text-center">
      <h2 className="text-[15px] font-bold text-coral-700">
        Couldn&apos;t load buildings
      </h2>
      <p className="mt-1 text-[13px] text-coral-700/80">{message}</p>
    </div>
  );
}
