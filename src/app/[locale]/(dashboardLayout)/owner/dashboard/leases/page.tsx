"use client";

// src/app/owner/dashboard/leases/page.tsx

import { LeaseForm } from "@/src/components/dashboard/leases/LeaseForm";
import {
  leaseStatusLabel,
  leaseStatusStyles,
} from "@/src/components/dashboard/leases/leaseStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import { Button } from "@/src/components/ui/button";
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
import { DataTable } from "@/src/components/ui/data-table";
import { useBuildings } from "@/src/hooks/useBuildings";
import { useFloorsByBuilding } from "@/src/hooks/useFloors";
import { useCreateLease, useLeaseSummary, useLeases } from "@/src/hooks/useLeases";
import { useUnits } from "@/src/hooks/useUnits";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import {
  LEASE_STATUS_OPTIONS,
  type LeaseListItem,
  type LeaseStatus,
} from "@/src/types/lease.types";
import {
  Building,
  Calendar,
  DoorOpen,
  FileText,
  Phone,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "@/src/i18n/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type StatusFilter = "ALL" | LeaseStatus;

const ALL = "ALL";
const PAGE_SIZE = 10;

export default function LeasesListPage() {
  const t = useTranslations("leasesPage");

  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  // Cascade: Building -> Floor -> Unit. Each step is disabled until its
  // parent is chosen, and changing a parent clears everything that depended
  // on it — same pattern as LeaseForm's picker.
  const [buildingFilter, setBuildingFilter] = useState<string>(ALL);
  const [floorFilter, setFloorFilter] = useState<string>(ALL);
  const [unitFilter, setUnitFilter] = useState<string>(ALL);
  const [page, setPage] = useState(1);

  const { data: buildings } = useBuildings();
  const { data: floors } = useFloorsByBuilding(
    buildingFilter !== ALL ? buildingFilter : undefined,
  );
  const { data: units } = useUnits(
    {
      buildingId: buildingFilter !== ALL ? buildingFilter : undefined,
      floorId: floorFilter !== ALL ? floorFilter : undefined,
    },
    { enabled: buildingFilter !== ALL },
  );

  const createMutation = useCreateLease();

  const filters = {
    page,
    limit: PAGE_SIZE,
    ...(statusFilter !== ALL && { status: statusFilter }),
    ...(buildingFilter !== ALL && { buildingId: buildingFilter }),
    ...(floorFilter !== ALL && { floorId: floorFilter }),
    ...(unitFilter !== ALL && { unitId: unitFilter }),
  };

  const { data: res, isLoading, isError, error } = useLeases(filters);
  const leases = res?.data;
  const meta = res?.meta;

  // Hero/KPI stats — org-wide (scoped to the building/floor/unit filter, but
  // not status/search/page), so the numbers don't fluctuate as the user
  // pages through the table.
  const { data: summary } = useLeaseSummary({
    ...(buildingFilter !== ALL && { buildingId: buildingFilter }),
    ...(floorFilter !== ALL && { floorId: floorFilter }),
    ...(unitFilter !== ALL && { unitId: unitFilter }),
  });

  function handleBuildingChange(value: string) {
    setBuildingFilter(value);
    setFloorFilter(ALL);
    setUnitFilter(ALL);
    setPage(1);
  }

  function handleFloorChange(value: string) {
    setFloorFilter(value);
    setUnitFilter(ALL);
    setPage(1);
  }

  function handleUnitChange(value: string) {
    setUnitFilter(value);
    setPage(1);
  }

  function handleStatusChange(s: StatusFilter) {
    setStatusFilter(s);
    setPage(1);
  }

  // Search only refines the leases already loaded on this page — the API
  // paginates server-side and doesn't take a search param.
  const filtered = (leases ?? []).filter((l) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      l.tenant.name.toLowerCase().includes(q) ||
      l.tenant.phone.toLowerCase().includes(q) ||
      l.unit.name.toLowerCase().includes(q) ||
      l.unit.building.name.toLowerCase().includes(q)
    );
  });

  const totalCount = summary?.totalCount ?? meta?.total ?? 0;
  const activeCount = summary?.activeCount ?? 0;
  const pendingCount = summary?.pendingCount ?? 0;
  const totalMonthly = Number(summary?.totalMonthlyRent ?? 0);

  const hasActiveFilters =
    !!query.trim() ||
    statusFilter !== ALL ||
    buildingFilter !== ALL ||
    floorFilter !== ALL ||
    unitFilter !== ALL;

  function clearFilters() {
    setQuery("");
    setStatusFilter(ALL);
    setBuildingFilter(ALL);
    setFloorFilter(ALL);
    setUnitFilter(ALL);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto container space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Heading */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-[13px]  text-coral-600/85">
              {t("eyebrow")}
            </p>
            <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
              {t("title")}
            </h1>
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-sky-950 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-sky-950"
                >
                  <Plus size={14} />
                  {t("newLease")}
                </button>
              }
            />
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-jade-950">
                  {t("createNewLease")}
                </DialogTitle>
                <DialogDescription className="text-ink-soft">
                  {t("createNewLeaseDescription")}
                </DialogDescription>
              </DialogHeader>
              <LeaseForm
                submitting={createMutation.isPending}
                submitLabel={t("createLease")}
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

        {/* Money hero — promotes monthly cash flow to the primary KPI */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div
            className="relative overflow-hidden rounded-[18px] bg-sky-950 px-5 py-5 text-white sm:px-6 sm:py-6"
            style={{
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 40px -22px rgba(10,46,34,0.5)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-50"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,123,87,0.35), transparent 65%)",
              }}
            />
            <p className="relative font-serif text-[13px]  text-white">
              {t("heroLabel")}
            </p>

            <p className="relative mt-3 text-[40px] font-bold leading-none tracking-tight tabular-nums sm:text-[46px]">
              {totalMonthly > 0 ? formatMoney(totalMonthly) : "—"}
            </p>
            <p className="relative mt-3 text-[12.5px] text-paper/70">
              {t("heroFrom")}{" "}
              <span className="font-semibold text-paper tabular-nums">
                {fmtNum(activeCount)}
              </span>{" "}
              {t("heroActiveLeases", { count: activeCount })} ·{" "}
              <span className="tabular-nums">{fmtNum(totalCount)}</span>{" "}
              {t("heroOnRecord")}
            </p>

            {pendingCount > 0 && (
              <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-md bg-coral-500/15 px-2 py-1 text-[11.5px] font-medium text-coral-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-coral-400 opacity-70" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-coral-400" />
                </span>
                <span className="tabular-nums">{fmtNum(pendingCount)}</span>
                <span>{t("pendingAwaiting", { count: pendingCount })}</span>
              </div>
            )}
          </div>

          {/* Supporting context */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <SmallStat
              label={t("statActive")}

              value={fmtNum(activeCount)}
              sub={t("statActiveSub")}
              tone="jade"
            />
            <SmallStat
              label={t("statPending")}

              value={fmtNum(pendingCount)}
              sub={
                pendingCount === 0
                  ? t("statPendingNone")
                  : t("statPendingSome")
              }
              tone={pendingCount > 0 ? "coral" : "neutral"}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/70"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-9 w-full rounded-md border border-rule-soft bg-paper pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-soft/60 focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
              />
            </div>

            {/* Segmented status filter */}
            <div className="inline-flex flex-wrap shrink-0 rounded-md border border-rule-soft bg-cream/60 p-0.5">
              {(
                [
                  "ALL",
                  ...LEASE_STATUS_OPTIONS.map((o) => o.value),
                ] as StatusFilter[]
              ).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusChange(s)}
                  className={cn(
                    "rounded-[6px] px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
                    statusFilter === s
                      ? "bg-sky-950 text-paper"
                      : "text-ink-soft hover:bg-paper hover:text-jade-900",
                  )}
                >
                  {s === "ALL" ? t("filterAll") : leaseStatusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          {/* Cascading location filter: Building -> Floor -> Unit */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select
              value={buildingFilter}
              onValueChange={(v) => handleBuildingChange(v ?? ALL)}
            >
              <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                <SelectValue placeholder={t("buildingPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{t("allBuildings")}</SelectItem>
                {(buildings ?? []).map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={floorFilter}
              onValueChange={(v) => handleFloorChange(v ?? ALL)}
              disabled={buildingFilter === ALL}
            >
              <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                <SelectValue
                  placeholder={
                    buildingFilter === ALL
                      ? t("selectBuildingFirst")
                      : t("floorPlaceholder")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{t("allFloors")}</SelectItem>
                {(floors ?? []).map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={unitFilter}
              onValueChange={(v) => handleUnitChange(v ?? ALL)}
              disabled={buildingFilter === ALL}
            >
              <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                <SelectValue
                  placeholder={
                    buildingFilter === ALL
                      ? t("selectBuildingFirst")
                      : t("unitPlaceholder")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{t("allUnits")}</SelectItem>
                {(units ?? []).map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(filtered.length > 0 || hasActiveFilters) && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rule-soft pt-3 text-[12px] text-ink-soft">
              <span className="tabular-nums">
                <span className="font-semibold text-ink">
                  {fmtNum(filtered.length)}
                </span>{" "}
                {t("resultCount", { count: filtered.length })}
                {statusFilter !== "ALL" && (
                  <span className="ml-1.5 text-ink-soft/70">
                    {t("onlySuffix", { label: leaseStatusLabel(statusFilter) })}
                  </span>
                )}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 font-medium text-ink-soft transition-colors hover:text-coral-600"
                >
                  <X size={11} /> {t("clear")}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 rounded-[10px] bg-paper" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
            <h2 className="text-[15px] font-bold text-coral-600">
              {t("errorTitle")}
            </h2>
            <p className="mt-1 text-[13px] text-coral-600/80">
              {error instanceof Error ? error.message : t("errorFallback")}
            </p>
          </div>
        ) : !leases || leases.length === 0 ? (
          page > 1 || hasActiveFilters ? (
            <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-12 text-center">
              <p className="text-[13.5px] text-ink-soft">{t("noMatch")}</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-jade-900 hover:text-coral-600 transition-colors"
              >
                <X size={12} /> {t("clearFilters")}
              </button>
            </div>
          ) : (
            <EmptyState onCreate={() => setCreateOpen(true)} />
          )
        ) : filtered.length === 0 ? (
          <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-12 text-center">
            <p className="text-[13.5px] text-ink-soft">{t("noMatch")}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-jade-900 hover:text-coral-600 transition-colors"
            >
              <X size={12} /> {t("clearFilters")}
            </button>
          </div>
        ) : (
          <LeasesTable leases={filtered} />
        )}

        {/* Pagination — server-side, 10 leases per page */}
        {!isLoading && !isError && !!meta?.totalPages && meta.totalPages > 1 && (
          <PaginationBar
            page={page}
            totalPages={meta.totalPages}
            total={meta.total ?? 0}
            onPageChange={setPage}
            label={t("pageOf", { page, totalPages: meta.totalPages })}
            totalLabel={t("resultCount", { count: meta.total ?? 0 })}
            previousLabel={t("previous")}
            nextLabel={t("next")}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LeasesTable — same TanStack DataTable pattern as the Tenants list
// ─────────────────────────────────────────────────────────────────

function LeasesTable({ leases }: { leases: LeaseListItem[] }) {
  const t = useTranslations("leasesPage");
  const router = useRouter();

  const columns = useMemo<ColumnDef<LeaseListItem>[]>(
    () => [
      {
        id: "tenant",
        accessorFn: (lease) => lease.tenant.name,
        header: t("colTenant"),
        cell: ({ row }) => {
          const lease = row.original;
          const initials = lease.tenant.name
            .split(" ")
            .filter(Boolean)
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
          return (
            <div className="flex items-center gap-2.5">
              <span className="relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-jade-50 text-[11px] font-bold text-jade-800">
                {lease.tenant.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={lease.tenant.photoUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  initials
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-bold tracking-[-0.01em] text-jade-950">
                  {lease.tenant.name}
                </p>
                <p className="inline-flex items-center gap-1 text-[11.5px] text-ink-soft tabular-nums">
                  <Phone size={10} className="text-ink-soft/60" />
                  {lease.tenant.phone}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        id: "property",
        accessorFn: (lease) => `${lease.unit.building.name} ${lease.unit.name}`,
        header: t("colProperty"),
        cell: ({ row }) => {
          const lease = row.original;
          return (
            <div className="space-y-0.5 text-[12px] text-ink-soft">
              <p className="flex items-center gap-1.5 truncate">
                <Building size={11} className="shrink-0 text-ink-soft/60" />
                <span className="truncate">{lease.unit.building.name}</span>
              </p>
              <p className="flex items-center gap-1.5 truncate">
                <DoorOpen size={11} className="shrink-0 text-ink-soft/60" />
                <span className="truncate">
                  {t("unitPrefix", { name: lease.unit.name })}
                </span>
              </p>
            </div>
          );
        },
      },
      {
        id: "term",
        accessorKey: "startDate",
        header: t("colTerm"),
        cell: ({ row }) => {
          const lease = row.original;
          return (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-soft tabular-nums">
              <Calendar size={11} className="shrink-0 text-ink-soft/60" />
              {new Date(lease.startDate).toLocaleDateString()}
              {" – "}
              {lease.endDate
                ? new Date(lease.endDate).toLocaleDateString()
                : t("openEnded")}
            </span>
          );
        },
      },
      {
        id: "rent",
        accessorFn: (lease) =>
          Number(lease.monthlyRent) + Number(lease.serviceCharge),
        header: t("colRent"),
        cell: ({ row }) => {
          const lease = row.original;
          const total = Number(lease.monthlyRent) + Number(lease.serviceCharge);
          return (
            <div>
              <p className="text-[13.5px] font-bold text-jade-950 tabular-nums">
                {formatMoney(total)}
                <span className="ml-1 text-[10.5px] font-medium text-ink-soft">
                  {t("perMonth")}
                </span>
              </p>
              <p className="text-[10.5px] text-ink-soft tabular-nums">
                {t("dueDay")}{" "}
                <span className="font-semibold text-ink">
                  {lease.rentDueDay}
                </span>
              </p>
            </div>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("colStatus"),
        cell: ({ row }) => {
          const lease = row.original;
          return (
            <span
              className={cn(
                "inline-flex shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                leaseStatusStyles[lease.status],
              )}
            >
              {leaseStatusLabel(lease.status)}
            </span>
          );
        },
      },
      {
        id: "id",
        header: t("colId"),
        cell: ({ row }) => (
          <span className="font-mono text-[10.5px] text-ink-soft/65">
            #{row.original.id.slice(-6).toUpperCase()}
          </span>
        ),
      },
    ],
    [t],
  );

  return (
    <DataTable
      columns={columns}
      data={leases}
      onRowClick={(lease) =>
        router.push(`/owner/dashboard/leases/${lease.id}`)
      }
      emptyMessage={t("noMatch")}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function SmallStat({
  label,

  value,
  sub,
  tone,
}: {
  label: string;

  value: string;
  sub: string;
  tone: "jade" | "coral" | "neutral";
}) {
  const valueTone =
    tone === "coral"
      ? "text-coral-600"
      : tone === "jade"
        ? "text-jade-950"
        : "text-ink-soft/80";

  return (
    <div className="rounded-[14px] border border-rule-soft bg-paper px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          {label}
        </p>

      </div>
      <p
        className={cn(
          "mt-1.5 text-[26px] font-bold leading-none tracking-tight tabular-nums",
          valueTone,
        )}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[12px] text-ink-soft">{sub}</p>
    </div>
  );
}

function PaginationBar({
  page,
  totalPages,
  total,
  onPageChange,
  label,
  totalLabel,
  previousLabel,
  nextLabel,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (updater: (p: number) => number) => void;
  label: string;
  totalLabel: string;
  previousLabel: string;
  nextLabel: string;
}) {
  return (
    <div className="flex items-center justify-between text-[12px] text-ink-soft">
      <span className="tabular-nums">
        {label} · {fmtNum(total)} {totalLabel}
      </span>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange((p) => Math.max(1, p - 1))}
        >
          {previousLabel}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange((p) => p + 1)}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  const t = useTranslations("leasesPage");
  return (
    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
        <FileText size={26} className="text-jade-800" />
      </div>
      <h2 className="mt-4 text-[17px] font-bold text-jade-950">
        {t("emptyTitle")}
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
        {t("emptySubtitle")}
      </p>


      <div className="mt-5">
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-sky-950 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-sky-950"
        >
          <Plus size={14} />
          {t("emptyCreateFirst")}
        </button>
      </div>
    </div>
  );
}
