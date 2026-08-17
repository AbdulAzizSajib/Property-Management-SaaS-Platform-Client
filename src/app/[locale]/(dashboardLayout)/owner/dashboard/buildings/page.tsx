"use client";

import { BuildingForm } from "@/src/components/dashboard/buildings/BuildingForm";
import {
  typeBadgeStyles,
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
import { cn } from "@/src/lib/utils";
import { fmtNum, fmtTaka } from "@/src/lib/numerals";
import type { BuildingListItem } from "@/src/types/building.types";
import {
  ArrowRight,
  Building2,
  CircleCheck,
  CircleDashed,
  DoorOpen,
  Layers,
  MapPin,
  Plus,
  Search,
  Wallet,
} from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";

export default function BuildingsListPage() {
  const t = useTranslations("buildingsPage");
  const locale = useLocale();
  const bn = locale === "bn";
  const { data: buildings, isLoading, isError, error } = useBuildings();
  const createMutation = useCreateBuilding();

  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");

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
  const portfolioRentRoll = (buildings ?? []).reduce(
    (sum, b) => sum + rentRoll(b),
    0,
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto container space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Heading */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] font-semibold text-coral-600/85 ">
              {t("eyebrow")}
            </p>
            <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
              {t("title")}
            </h1>
            <p className="mt-1 text-[13px] text-ink-soft">
              {t("subtitle")}
            </p>
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-sky-950 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-sky-950"
                >
                  <Plus size={14} />
                  {t("addBuilding")}
                </button>
              }
            />
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="capitalize text-[17px] px-2 py-0.5">
                  {t("addNewBuilding")}
                </DialogTitle>
              </DialogHeader>
              <BuildingForm
                submitting={createMutation.isPending}
                submitLabel={t("createBuilding")}
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
          <section className="flex flex-wrap items-baseline gap-x-7 gap-y-2 rounded-md border border-rule-soft bg-paper px-5 py-3">
            <SummaryStat
              label={t("summaryBuildings")}
              value={fmtNum(buildings?.length ?? 0, bn)}
              icon={Building2}
            />
            <SummaryStat
              label={t("summaryFloors")}
              value={fmtNum(totalFloors, bn)}
              icon={Layers}
            />
            <SummaryStat
              label={t("summaryUnits")}
              value={fmtNum(totalUnits, bn)}
              icon={DoorOpen}
            />
          </section>

          {/* Toolbar */}
       
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/70"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-9 px-5 py-4 w-96  rounded-md border border-rule-soft bg-paper pl-9 pr-3 text-[14px] text-ink placeholder:text-ink-soft/60 focus:border-jade-700 focus:outline-none focus:r1 focus:ring-jade-700/20"
            />
          </div>
          {query && (
            <div className="mt-2 text-[11.5px] text-ink-soft tabular-nums">
              {t("resultCount", { count: filtered.length })}
            </div>
          )}
        </div>
       

        {/* Content */}
        {isLoading ? (
          <Skeleton className="h-96 w-full rounded-[14px] bg-paper" />
        ) : isError ? (
          <ErrorBox
            title={t("errorTitle")}
            message={
              error instanceof Error ? error.message : t("errorFallback")
            }
          />
        ) : !buildings || buildings.length === 0 ? (
          <EmptyState onCreate={() => setCreateOpen(true)} />
        ) : filtered.length === 0 ? (
          <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-12 text-center">
            <p className="text-[13.5px] text-ink-soft">
              {t("noMatch", { query })}
            </p>
          </div>
        ) : (
          <BuildingLedger buildings={filtered} portfolioRentRoll={portfolioRentRoll} />
        )}
      </div>
    </div>
  );
}

function rentRoll(building: BuildingListItem) {
  return (building.units ?? [])
    .filter((u) => u.status === "OCCUPIED")
    .reduce((sum, u) => sum + Number(u.baseRent) + Number(u.serviceCharge), 0);
}

function BuildingLedger({
  buildings,
  portfolioRentRoll,
}: {
  buildings: BuildingListItem[];
  portfolioRentRoll: number;
}) {
  const t = useTranslations("buildingsPage");
  const locale = useLocale();
  const bn = locale === "bn";

  return (
    <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
      {/* Column headers — hairline-divided, mirrors a ledger sheet */}
      <div className="hidden items-center gap-4 border-b border-rule-soft bg-cream/60 px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-soft md:flex">
        <span className="w-[30%]">{t("colBuilding")}</span>
        <span className="w-[14%] text-center">{t("cardFloors")}</span>
        <span className="w-[14%] text-center">{t("cardUnits")}</span>
        <span className="w-[16%] text-center">{t("colOccupancy")}</span>
        <span className="w-[16%] text-right">{t("cardRentRoll")}</span>
        <span className="w-[10%]" />
      </div>

      <div className="divide-y divide-rule-soft">
        {buildings.map((b) => (
          <LedgerRow key={b.id} building={b} />
        ))}
      </div>

      {/* Portfolio total — the ledger's balance line */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-jade-950/15 bg-cream/60 px-5 py-3">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
          {t("portfolioTotal", { count: buildings.length })}
        </span>
        <span className="flex items-center gap-1.5 text-[15px] font-bold tabular-nums text-jade-950">
          <Wallet size={14} className="text-jade-700" />
          {fmtTaka(portfolioRentRoll, { bn, compact: true })}
          <span className="text-[11px] font-medium text-ink-soft">
            /{t("perMonth")}
          </span>
        </span>
      </div>
    </div>
  );
}

function LedgerRow({ building }: { building: BuildingListItem }) {
  const t = useTranslations("buildingsPage");
  const locale = useLocale();
  const bn = locale === "bn";

  const location = [building.address, building.area, building.city]
    .filter(Boolean)
    .join(", ");

  const units = building.units ?? [];
  const occupiedCount = units.filter((u) => u.status === "OCCUPIED").length;
  const vacantCount = units.filter((u) => u.status === "VACANT").length;
  const monthlyRentRoll = rentRoll(building);

  return (
    <Link
      href={`/owner/dashboard/buildings/${building.id}`}
      className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cream/50 md:flex-row md:items-center md:gap-4"
    >
      {/* Building identity */}
      <div className="flex min-w-0 items-start gap-3 md:w-[30%]">
        <span
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[8px] border",
            typeBadgeStyles[building.type],
          )}
        >
          <Building2 size={14} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[14.5px] font-bold tracking-[-0.01em] text-jade-950 group-hover:text-jade-800">
              {building.name}
            </h3>
            {!building.isActive && (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider",
                  statusBadgeStyles(building.isActive),
                )}
              >
                {t("inactive")}
              </span>
            )}
          </div>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-ink-soft">
            <MapPin size={10} className="shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        </div>
      </div>

      {/* Floors / Units — tabular columns on desktop, inline chips on mobile */}
      <div className="flex items-center gap-4 text-[12.5px] text-ink md:w-[28%] md:justify-center md:gap-0">
        <span className="flex items-center gap-1.5 tabular-nums md:w-1/2 md:justify-center">
          <Layers size={11} className="text-ink-soft/70 md:hidden" />
          <span className="font-semibold">
            {fmtNum(building._count.floors, bn)}/{fmtNum(building.totalFloors, bn)}
          </span>
        </span>
        <span className="flex items-center gap-1.5 tabular-nums md:w-1/2 md:justify-center">
          <DoorOpen size={11} className="text-ink-soft/70 md:hidden" />
          <span className="font-semibold">{fmtNum(building._count.units, bn)}</span>
        </span>
      </div>

      {/* Occupancy */}
      <div className="flex items-center gap-3 text-[12px] md:w-[16%] md:justify-center">
        {units.length > 0 ? (
          <>
            <span className="flex items-center gap-1 font-medium text-jade-800">
              <CircleCheck size={12} className="shrink-0" />
              {fmtNum(occupiedCount, bn)}
            </span>
            {vacantCount > 0 && (
              <span className="flex items-center gap-1 text-coral-600">
                <CircleDashed size={12} className="shrink-0" />
                {fmtNum(vacantCount, bn)}
              </span>
            )}
          </>
        ) : (
          <span className="text-ink-soft/60">—</span>
        )}
      </div>

      {/* Rent roll — the balance figure */}
      <div className="flex items-center justify-between gap-3 md:w-[16%] md:justify-end">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft md:hidden">
          {t("cardRentRoll")}
        </span>
        <span className="text-[14px] font-bold tabular-nums text-jade-950">
          {monthlyRentRoll > 0
            ? fmtTaka(monthlyRentRoll, { bn, compact: true })
            : "—"}
        </span>
      </div>

      {/* Action */}
      <div className="flex justify-end md:w-[10%]">
        <span className="inline-flex items-center gap-1 rounded-[8px] bg-sky-950 px-3 py-1.5 text-[12px] font-semibold text-paper transition-colors group-hover:bg-jade-900">
          {t("view")}
          <ArrowRight size={12} />
        </span>
      </div>
    </Link>
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
        <span className="text-[16px] font-semibold tracking-[-0.02em] text-jade-950 tabular-nums leading-none">
          {value}
        </span>
        <span className="text-[12px] text-ink-soft">{label}</span>
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  const t = useTranslations("buildingsPage");
  return (
    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
      <h2 className="mt-4 text-[17px] font-bold text-jade-950 flex items-center justify-center gap-2">
         <Building2 size={26} className="text-jade-800" />
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
          {t("addFirstBuilding")}
        </button>
      </div>
    </div>
  );
}

function ErrorBox({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-[14px] border border-coral-100 bg-coral-50/50 px-6 py-12 text-center">
      <h2 className="text-[15px] font-bold text-coral-600">{title}</h2>
      <p className="mt-1 text-[13px] text-coral-600/80">{message}</p>
    </div>
  );
}
