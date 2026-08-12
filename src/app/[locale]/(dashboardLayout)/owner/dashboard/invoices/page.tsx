"use client";

// src/app/owner/dashboard/invoices/page.tsx

import { GenerateInvoiceDialog } from "@/src/components/dashboard/invoices/GenerateInvoiceDialog";
import { GenerateMonthlyBatchDialog } from "@/src/components/dashboard/invoices/GenerateMonthlyBatchDialog";
import {
  formatBillingMonth,
  invoiceStatusAccent,
  invoiceStatusLabel,
  invoiceStatusStyles,
  invoiceTypeLabel,
  invoiceTypeStyles,
} from "@/src/components/dashboard/invoices/invoiceStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useBuildings } from "@/src/hooks/useBuildings";
import { useInvoices } from "@/src/hooks/useInvoices";
import { groupByTenant } from "@/src/lib/groupByTenant";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import {
  INVOICE_STATUS_OPTIONS,
  type InvoiceListItem,
  type InvoiceStatus,
  type InvoiceTenantSummary,
} from "@/src/types/invoice.types";
import {
  AlertTriangle,
  ChevronDown,
  Plus,
  Receipt,
  Search,
  X,
  Zap,
} from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useMemo, useState } from "react";

const ALL = "All";

export default function InvoicesListPage() {
  return (
    <Suspense fallback={<ListShell />}>
      <InvoicesListInner />
    </Suspense>
  );
}

function InvoicesListInner() {
  const t = useTranslations("invoicesPage");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [buildingFilter, setBuildingFilter] = useState<string>(ALL);
  const [query, setQuery] = useState("");
  const [generateOpen, setGenerateOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);

  const { data: buildings } = useBuildings();

  const filters = {
    ...(statusFilter !== ALL && { status: statusFilter as InvoiceStatus }),
    ...(buildingFilter !== ALL && { buildingId: buildingFilter }),
  };

  const { data: invoices, isLoading, isError, error } = useInvoices(filters);

  const filtered = useMemo(
    () =>
      (invoices ?? []).filter((i) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.tenant.name.toLowerCase().includes(q) ||
          i.tenant.phone.toLowerCase().includes(q) ||
          i.unit.name.toLowerCase().includes(q) ||
          i.unit.building.name.toLowerCase().includes(q)
        );
      }),
    [invoices, query],
  );

  const totalDue = (invoices ?? []).reduce(
    (sum, i) => sum + Number(i.dueAmount),
    0,
  );
  const totalPaid = (invoices ?? []).reduce(
    (sum, i) => sum + Number(i.paidAmount),
    0,
  );
  const overdueCount = (invoices ?? []).filter(
    (i) => i.status === "OVERDUE",
  ).length;

  const hasActiveFilters =
    statusFilter !== ALL || buildingFilter !== ALL || query.trim() !== "";

  const selectedBuildingName =
    buildingFilter !== ALL
      ? buildings?.find((b) => b.id === buildingFilter)?.name
      : undefined;

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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBatchOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-rule-soft bg-paper px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
            >
              <Zap size={14} />
              {t("monthlyBatch")}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                  >
                    <Plus size={14} />
                    {t("generate")}
                    <ChevronDown size={13} />
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setGenerateOpen(true)}>
                  <Receipt size={13} className="mr-2" />
                  {t("singleInvoice")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBatchOpen(true)}>
                  <Zap size={13} className="mr-2" />
                  {t("monthlyBatch")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Money hero — Outstanding is THE number on this page */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* Outstanding hero */}
          <div
            className={cn(
              "relative overflow-hidden rounded-[18px] px-5 py-5 sm:px-6 sm:py-6",
              totalDue > 0
                ? "bg-jade-900 text-paper"
                : "border border-rule-soft bg-paper",
            )}
            style={
              totalDue > 0
                ? {
                    boxShadow:
                      "0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 40px -22px rgba(10,46,34,0.5)",
                  }
                : undefined
            }
          >
            {totalDue > 0 && (
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-50"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,123,87,0.4), transparent 65%)",
                }}
              />
            )}

            <p
              className={cn(
                "relative font-serif text-[13px] ",
                totalDue > 0 ? "text-paper/60" : "text-coral-600/85",
              )}
            >
              {t("heroLabel")}
            </p>
            <p
              className={cn(
                "relative mt-3 text-[40px] font-bold leading-none tracking-[-0.025em] tabular-nums sm:text-[46px]",
                totalDue > 0 ? "text-coral-400" : "text-jade-950",
              )}
            >
              {totalDue > 0 ? formatMoney(totalDue) : t("heroAllClear")}
            </p>
            <p
              className={cn(
                "relative mt-3 text-[12.5px]",
                totalDue > 0 ? "text-paper/70" : "text-ink-soft",
              )}
            >
              {t("heroAcross")}{" "}
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  totalDue > 0 ? "text-paper" : "text-ink",
                )}
              >
                {fmtNum(invoices?.length ?? 0)}
              </span>{" "}
              {t("heroInvoices", { count: invoices?.length ?? 0 })}
              {totalPaid > 0 && (
                <>
                  {" · "}
                  <span
                    className={totalDue > 0 ? "text-jade-300" : "text-jade-700"}
                  >
                    {t("heroCollected", { amount: formatMoney(totalPaid) })}
                  </span>
                </>
              )}
            </p>

            {overdueCount > 0 && (
              <div
                className={cn(
                  "relative mt-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium",
                  totalDue > 0
                    ? "bg-coral-500/15 text-coral-300"
                    : "bg-coral-50 text-coral-600",
                )}
              >
                <AlertTriangle size={11} />
                <span className="tabular-nums">{fmtNum(overdueCount)}</span>
                <span>{t("overdueCount", { count: overdueCount })}</span>
              </div>
            )}
          </div>

          {/* Supporting context */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <MiniStat
              label={t("statCollected")}
              value={formatMoney(totalPaid)}
              sub={t("statCollectedSub")}
              tone="good"
            />
            <MiniStat
              label={t("statTotal")}
              value={fmtNum(invoices?.length ?? 0)}
              sub={t("statTotalSub")}
              tone="neutral"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-[14px] border border-rule-soft bg-paper p-4">
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

            <div className="w-full sm:w-52">
              <Select
                value={buildingFilter}
                onValueChange={(v) => setBuildingFilter(v ?? ALL)}
              >
                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                  <SelectValue placeholder={t("buildingPlaceholder")}>
                    {(value) =>
                      value === ALL
                        ? t("allBuildings")
                        : (buildings?.find((b) => b.id === value)?.name ??
                          t("buildingPlaceholder"))
                    }
                  </SelectValue>
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
            </div>

            <div className="w-full sm:w-48">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v ?? ALL)}
              >
                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                  <SelectValue placeholder={t("statusPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>{t("allStatuses")}</SelectItem>
                  {INVOICE_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(filtered.length > 0 || hasActiveFilters) && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-rule-soft pt-3 text-[12px] text-ink-soft">
              <span className="tabular-nums">
                <span className="font-semibold text-ink">
                  {fmtNum(filtered.length)}
                </span>{" "}
                {t("resultCount", { count: filtered.length })}
                {selectedBuildingName && (
                  <span className="ml-1.5 text-ink-soft/70">
                    · {selectedBuildingName}
                  </span>
                )}
                {statusFilter !== ALL && (
                  <span className="ml-1.5 text-ink-soft/70">
                    {t("onlySuffix", {
                      label: invoiceStatusLabel(statusFilter as InvoiceStatus),
                    })}
                  </span>
                )}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter(ALL);
                    setBuildingFilter(ALL);
                  }}
                  className="inline-flex items-center gap-1 font-medium text-ink-soft transition-colors hover:text-coral-600"
                >
                  <X size={11} /> {t("clearFilters")}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <ListShell />
        ) : isError ? (
          <div className=" border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
            <h2 className="text-[15px] font-bold text-coral-600">
              {t("errorTitle")}
            </h2>
            <p className="mt-1 text-[13px] text-coral-600/80">
              {error instanceof Error ? error.message : t("errorFallback")}
            </p>
          </div>
        ) : !invoices || invoices.length === 0 ? (
          <EmptyState
            onGenerate={() => setGenerateOpen(true)}
            onBatch={() => setBatchOpen(true)}
          />
        ) : filtered.length === 0 ? (
          <div className=" border border-rule-soft bg-paper px-6 py-12 text-center">
            <p className="text-[13.5px] text-ink-soft">{t("noMatch")}</p>
          </div>
        ) : (
          <InvoicesAccordion invoices={filtered} />
        )}

        {/* Dialogs */}
        <GenerateInvoiceDialog 
          open={generateOpen}
          onOpenChange={setGenerateOpen}
        />
        <GenerateMonthlyBatchDialog
          open={batchOpen}
          onOpenChange={setBatchOpen}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// InvoicesAccordion — one collapsed entry per tenant, sorted A→Z;
// expanding reveals that tenant's month-by-month invoice timeline.
// ─────────────────────────────────────────────────────────────────

function InvoicesAccordion({ invoices }: { invoices: InvoiceListItem[] }) {
  const t = useTranslations("invoicesPage");
  const groups = useMemo(
    () => groupByTenant<InvoiceTenantSummary, InvoiceListItem>(invoices),
    [invoices],
  );

  return (
    <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
      <Accordion multiple>
        {groups.map(({ tenant, items }) => {
          const outstanding = items.reduce(
            (sum, inv) => sum + Number(inv.dueAmount),
            0,
          );
          return (
            <AccordionItem key={tenant.id} value={tenant.id}>
              <AccordionTrigger className="px-4 py-3.5 hover:bg-cream/60 sm:px-5 sm:py-4">
                <TenantSummaryHeader
                  tenant={tenant}
                  count={items.length}
                  countLabel={t("invoiceCount", { count: items.length })}
                  amount={outstanding > 0 ? formatMoney(outstanding) : null}
                  amountLabel={t("stillDueLabel")}
                />
              </AccordionTrigger>
              <AccordionPanel>
                <ul className="divide-y divide-rule-soft border-t border-rule-soft">
                  {items.map((inv) => (
                    <InvoiceRow key={inv.id} invoice={inv} />
                  ))}
                </ul>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

// Shared collapsed-header layout: avatar, name, phone, record count, and an
// optional trailing amount (outstanding due / total collected).
function TenantSummaryHeader({
  tenant,
  count,
  countLabel,
  amount,
  amountLabel,
}: {
  tenant: InvoiceTenantSummary;
  count: number;
  countLabel: string;
  amount: string | null;
  amountLabel: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-3 sm:gap-4">
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-jade-50 text-[13px] font-bold text-jade-800 sm:size-10 sm:text-[14px]">
        {tenant.photoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={tenant.photoUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          tenantInitials(tenant.name)
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold text-jade-950">
          {tenant.name}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-ink-soft">
          {tenant.phone} · {countLabel}
        </p>
      </div>

      {amount && (
        <div className="shrink-0 text-right">
          <p className="text-[15px] font-bold tabular-nums text-coral-600 sm:text-[16px]">
            {amount}
          </p>
          <p className="mt-0.5 text-[10.5px] font-medium text-ink-soft">
            {amountLabel}
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// InvoiceRow — status accent strip + clean data row
// ─────────────────────────────────────────────────────────────────

function InvoiceRow({ invoice }: { invoice: InvoiceListItem }) {
  const t = useTranslations("invoicesPage");
  const due = Number(invoice.dueAmount);
  const hasDue = Number.isFinite(due) && due > 0;
  const isCarried = invoice.status === "CARRIED_FORWARD";

  return (
    <li>
      <Link
        href={`/owner/dashboard/invoices/${invoice.id}`}
        className="group relative flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-cream/60 sm:gap-4 sm:px-5 sm:py-4"
      >
        {/* Status accent */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0 w-[3px]",
            invoiceStatusAccent[invoice.status],
          )}
        />

        {/* Avatar — instantly says "who" */}
        <span
          aria-hidden
          className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-jade-50 text-[13px] font-bold text-jade-800 sm:size-10 sm:text-[14px]"
        >
          {invoice.tenant.photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={invoice.tenant.photoUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            tenantInitials(invoice.tenant.name)
          )}
        </span>

        {/* WHO + WHAT, in plain words */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate text-[14px] font-bold text-jade-950 group-hover:text-jade-900">
              {invoice.tenant.name}
            </p>
            <span
              className={cn(
                "rounded-full border px-2 py-px text-[10.5px] font-semibold",
                invoiceTypeStyles[invoice.type],
              )}
            >
              {invoiceTypeLabel(invoice.type)}
            </span>
            <span
              className={cn(
                "rounded-full border px-2 py-px text-[10.5px] font-semibold",
                invoiceStatusStyles[invoice.status],
              )}
            >
              {invoiceStatusLabel(invoice.status)}
            </span>
          </div>

          <p className="mt-1 truncate text-[12.5px] text-ink-soft">
            <span className="font-medium text-ink">
              {invoice.unit.building.name} ·{" "}
              {t("unitPrefix", { name: invoice.unit.name })}
            </span>
            {" · "}
            <span>{formatBillingMonth(invoice.billingMonth)}</span>
          </p>

          {/* Code demoted to a quiet footnote */}
          <p className="mt-0.5 truncate font-mono text-[10.5px] text-ink-soft/55">
            {invoice.invoiceNumber}
          </p>
        </div>

        {/* HOW MUCH + what's left */}
        <div className="text-right">
          <p className="text-[17px] font-bold leading-none tabular-nums text-jade-950 sm:text-[18px]">
            {formatMoney(invoice.totalAmount)}
          </p>
          {isCarried ? (
            <p className="mt-1 text-[11px] font-medium text-ink-soft">
              {t("carriedForward")}
              {invoice.carriedForwardTo && (
                <span className="font-mono text-ink-soft/70">
                  {" → "}
                  {invoice.carriedForwardTo.invoiceNumber.slice(-5)}
                </span>
              )}
            </p>
          ) : hasDue ? (
            <p className="mt-1 text-[11px] font-semibold tabular-nums text-coral-600">
              {t("stillDue", { amount: formatMoney(due) })}
            </p>
          ) : (
            <p className="mt-1 text-[11px] font-medium text-jade-700">
              {t("fullyPaid")}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}

// First letters of the first and last name words — "Mr Akash" → "MA".
function tenantInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]![0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? "") : "";
  return (first + last).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function MiniStat({
  label,

  value,
  sub,
  tone,
}: {
  label: string;

  value: string;
  sub: string;
  tone: "good" | "warn" | "neutral";
}) {
  const valueTone =
    tone === "warn"
      ? "text-coral-600"
      : tone === "good"
        ? "text-jade-950"
        : "text-ink-soft/85";

  return (
    <div className="rounded-[14px] border border-rule-soft bg-paper px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          {label}
        </p>
      </div>
      <p
        className={cn(
          "mt-1.5 text-[20px] font-bold leading-none tracking-tight tabular-nums",
          valueTone,
        )}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[11.5px] text-ink-soft">{sub}</p>
    </div>
  );
}

function ListShell() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-[72px] w-full rounded-[10px] bg-paper" />
      ))}
    </div>
  );
}

function EmptyState({
  onGenerate,
  onBatch,
}: {
  onGenerate: () => void;
  onBatch: () => void;
}) {
  const t = useTranslations("invoicesPage");
  return (
    <div className=" border border-rule-soft bg-paper px-6 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
        <Receipt size={26} className="text-jade-800" />
      </div>
      <h2 className="mt-4 text-[17px] font-bold text-jade-950">
        {t("emptyTitle")}
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
        {t("emptySubtitle")}
      </p>
      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onBatch}
          className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-rule-soft bg-paper px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
        >
          <Zap size={14} />
          {t("monthlyBatch")}
        </button>
        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
        >
          <Plus size={14} />
          {t("generateInvoice")}
        </button>
      </div>
    </div>
  );
}
