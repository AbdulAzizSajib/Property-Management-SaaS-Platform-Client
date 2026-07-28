"use client";

// src/app/owner/dashboard/tenants/page.tsx

import {
  TenantForm,
  buildCreateTenantFormData,
} from "@/src/components/dashboard/tenants/TenantForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useCreateTenant, useTenants } from "@/src/hooks/useTenants";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import type { TenantListItem } from "@/src/types/tenant.types";
import {
  Briefcase,
  Building2,
  FileText,
  Mail,
  Phone,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export default function TenantsListPage() {
  const t = useTranslations("tenantsPage");
  const { data: tenants, isLoading, isError, error } = useTenants();
  const createMutation = useCreateTenant();

  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const filtered = (tenants ?? []).filter((t) => {
    if (statusFilter === "ACTIVE" && !t.isActive) return false;
    if (statusFilter === "INACTIVE" && t.isActive) return false;

    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.phone.toLowerCase().includes(q) ||
      (t.email ?? "").toLowerCase().includes(q) ||
      (t.occupation ?? "").toLowerCase().includes(q)
    );
  });

  const totalCount = tenants?.length ?? 0;
  const activeCount = (tenants ?? []).filter((t) => t.isActive).length;
  const withLeaseCount = (tenants ?? []).filter((t) =>
    t.leases.some((l) => l.status === "ACTIVE"),
  ).length;

  const hasActiveFilters = !!query.trim() || statusFilter !== "ALL";

  function clearFilters() {
    setQuery("");
    setStatusFilter("ALL");
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
            <p className="mt-1 text-[13px] text-ink-soft">
              {t("subtitle")}
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
                  {t("addTenant")}
                </button>
              }
            />
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-jade-950">
                  {t("addNewTenant")}
                </DialogTitle>
                <DialogDescription className="text-ink-soft">
                  {t("addNewTenantDescription")}
                </DialogDescription>
              </DialogHeader>
              <TenantForm
                mode="create"
                submitting={createMutation.isPending}
                submitLabel={t("createTenant")}
                onCancel={() => setCreateOpen(false)}
                onSubmit={(values) => {
                  const formData = buildCreateTenantFormData(values);
                  createMutation.mutate(formData, {
                    onSuccess: () => setCreateOpen(false),
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        </header>

        {/* Summary strip — replaces 3 rainbow tiles */}
        <section className="flex flex-wrap items-baseline gap-x-7 gap-y-2 rounded-[14px] border border-rule-soft bg-paper px-5 py-3">
          <SummaryStat label={t("summaryTotal")} value={fmtNum(totalCount)} />
          <SummaryStat label={t("summaryActive")} value={fmtNum(activeCount)} />
          <SummaryStat
            label={t("summaryOnLease")}
            value={fmtNum(withLeaseCount)}
          />
          {activeCount > 0 && (
            <span className="ml-auto hidden text-[12px] text-ink-soft sm:inline tabular-nums">
              {t("leasedPercent", {
                percent: ((withLeaseCount / activeCount) * 100).toFixed(0),
              })}
            </span>
          )}
        </section>

        {/* Toolbar */}
        <div className="">
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

            {/* Segmented filter — brand-aligned */}
            <div className="inline-flex shrink-0 rounded-md border border-rule-soft bg-cream/60 p-0.5">
              {(["ALL", "ACTIVE", "INACTIVE"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "rounded-[6px] px-3 py-1 text-[12px] font-semibold transition-colors",
                    statusFilter === s
                      ? "bg-jade-900 text-paper"
                      : "text-ink-soft hover:bg-paper hover:text-jade-900",
                  )}
                >
                  {s === "ALL"
                    ? t("filterAll")
                    : s === "ACTIVE"
                      ? t("filterActive")
                      : t("filterInactive")}
                </button>
              ))}
            </div>
          </div>

          {/* Result count + clear (only when meaningful) */}
          {(filtered.length > 0 || hasActiveFilters) && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-rule-soft pt-3 text-[12px] text-ink-soft">
              <span className="tabular-nums">
                <span className="font-semibold text-ink">
                  {fmtNum(filtered.length)}
                </span>{" "}
                {t("resultCount", { count: filtered.length })}
                {statusFilter !== "ALL" && (
                  <span className="ml-1.5 text-ink-soft/70">
                    {statusFilter === "ACTIVE"
                      ? t("filteredToActive")
                      : t("filteredToInactive")}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[180px] rounded-[12px] bg-paper" />
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
        ) : !tenants || tenants.length === 0 ? (
          <EmptyState onCreate={() => setCreateOpen(true)} />
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <TenantCard key={t.id} tenant={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TenantCard
//
// Status accent strip on the left (same pattern as UnitCard):
//   active + leased       → jade  (healthy)
//   active + not on lease → coral (potential income, needs a lease)
//   inactive              → ink-soft (archival)
// ─────────────────────────────────────────────────────────────────

function TenantCard({ tenant }: { tenant: TenantListItem }) {
  const t = useTranslations("tenantsPage");
  const initials = (tenant.name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const activeLease = tenant.leases.find((l) => l.status === "ACTIVE");

  let accent = "bg-ink-soft/30";
  if (tenant.isActive) accent = activeLease ? "bg-jade-500" : "bg-coral-500";

  const statusBadge = tenant.isActive
    ? "bg-jade-50 text-jade-800 border-jade-100"
    : "bg-cream text-ink-soft border-rule-soft";

  return (
    <Link
      href={`/owner/dashboard/tenants/${tenant.id}`}
      className="group relative block overflow-hidden  border border-rule-soft bg-paper p-4 transition-all hover:-translate-y-0.5 hover:border-jade-700/20 hover:shadow-[0_8px_24px_-12px_rgba(10,46,34,0.15)]"
    >
      {/* Accent strip */}
      <span
        aria-hidden
        className={cn("absolute inset-y-0 left-0 w-0.75", accent)}
      />

      <div className="flex items-start gap-3">
        {/* Avatar — jade-tinted */}
        <span className="relative inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-jade-50 ring-1 ring-jade-100">
          {tenant.photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={tenant.photoUrl}
              alt={tenant.name}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-[13px] font-bold text-jade-800">
              {initials}
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-[15px] font-bold tracking-[-0.01em] text-jade-950 group-hover:text-jade-900">
              {tenant.name}
            </p>
            <span
              className={cn(
                "shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                statusBadge,
              )}
            >
              {tenant.isActive ? t("active") : t("inactive")}
            </span>
          </div>
          {tenant.occupation && (
            <p className="mt-0.5 truncate text-[12px] text-ink-soft">
              <Briefcase
                size={11}
                className="mr-1 inline -translate-y-px text-ink-soft/60"
              />
              {tenant.occupation}
            </p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-3 space-y-1 border-t border-rule-soft pt-2.5 text-[12px] text-ink-soft">
        <p className="inline-flex items-center gap-1.5 tabular-nums">
          <Phone size={11} className="text-ink-soft/60" />
          {tenant.phone}
        </p>
        {tenant.email && (
          <p className="flex items-center gap-1.5 truncate">
            <Mail size={11} className="shrink-0 text-ink-soft/60" />
            <span className="truncate">{tenant.email}</span>
          </p>
        )}
        {tenant.building && (
          <p className="flex items-center gap-1.5 truncate">
            <Building2 size={11} className="shrink-0 text-ink-soft/60" />
            <span className="truncate">
              {[tenant.building.name, tenant.floor?.name, tenant.unit?.name]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </p>
        )}
      </div>

      {/* Lease footer */}
      <div className="mt-3 flex items-center justify-between border-t border-rule-soft pt-2.5">
        <span className="inline-flex items-center gap-1 text-[11.5px] text-ink-soft tabular-nums">
          <FileText size={11} className="text-ink-soft/60" />
          {t("leaseCount", { count: tenant.leases.length })}
        </span>
        {activeLease ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-jade-100 bg-jade-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-jade-800">
            <span className="size-1 rounded-full bg-jade-700" />
            {t("onLease")}
          </span>
        ) : tenant.isActive ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-coral-100 bg-coral-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-coral-600">
            {t("noLease")}
          </span>
        ) : (
          <span className="text-[11px] text-ink-soft/60">—</span>
        )}
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function SummaryStat({
  label,

  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Users size={15} className="text-ink-soft/70" />
      <div className="flex items-center gap-1.5">
        <span className="text-[16px] font-bold tracking-[-0.02em] text-jade-950 tabular-nums leading-none">
          {value}
        </span>
        <span className="text-[12px] text-ink-soft">{label}</span>
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  const t = useTranslations("tenantsPage");
  return (
    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
        <Users size={26} className="text-jade-800" />
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
          className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
        >
          <Plus size={14} />
          {t("addFirstTenant")}
        </button>
      </div>
    </div>
  );
}
