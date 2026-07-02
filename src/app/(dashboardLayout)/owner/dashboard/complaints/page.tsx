"use client";

// src/app/owner/dashboard/complaints/page.tsx

import { CreateComplaintDialog } from "@/src/components/dashboard/complaints/CreateComplaintDialog";
import {
  complaintCategoryLabel,
  complaintCategoryStyles,
  complaintPriorityDot,
  complaintPriorityLabel,
  complaintPriorityStyles,
  complaintStatusAccent,
  complaintStatusLabel,
  complaintStatusStyles,
  formatRelativeTime,
} from "@/src/components/dashboard/complaints/complaintStyles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useBuildings } from "@/src/hooks/useBuildings";
import { useComplaints } from "@/src/hooks/useComplaints";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import {
  COMPLAINT_CATEGORY_OPTIONS,
  COMPLAINT_PRIORITY_OPTIONS,
  COMPLAINT_STATUS_OPTIONS,
  type ComplaintCategory,
  type ComplaintListItem,
  type ComplaintPriority,
  type ComplaintStatus,
} from "@/src/types/complaint.types";
import {
  AlertTriangle,
  ArrowUpRight,
  Building,
  DoorOpen,
  MessageSquareWarning,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";

const ALL = "__ALL__";

export default function ComplaintsListPage() {
  return (
    <Suspense fallback={<ListShell />}>
      <ComplaintsListInner />
    </Suspense>
  );
}

function ComplaintsListInner() {
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [priorityFilter, setPriorityFilter] = useState<string>(ALL);
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL);
  const [buildingFilter, setBuildingFilter] = useState<string>(ALL);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filters = {
    ...(statusFilter !== ALL && {
      status: statusFilter as ComplaintStatus,
    }),
    ...(priorityFilter !== ALL && {
      priority: priorityFilter as ComplaintPriority,
    }),
    ...(categoryFilter !== ALL && {
      category: categoryFilter as ComplaintCategory,
    }),
    ...(buildingFilter !== ALL && { buildingId: buildingFilter }),
  };

  const {
    data: complaints,
    isLoading,
    isError,
    error,
  } = useComplaints(filters);
  const { data: buildings } = useBuildings();

  const filtered = useMemo(
    () =>
      (complaints ?? []).filter((c) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.building?.name.toLowerCase().includes(q) ?? false) ||
          (c.unit?.name.toLowerCase().includes(q) ?? false) ||
          (c.tenant?.name.toLowerCase().includes(q) ?? false)
        );
      }),
    [complaints, query],
  );

  const openCount = (complaints ?? []).filter(
    (c) => c.status === "OPEN",
  ).length;
  const inProgressCount = (complaints ?? []).filter(
    (c) => c.status === "IN_PROGRESS",
  ).length;
  const urgentCount = (complaints ?? []).filter(
    (c) =>
      c.priority === "URGENT" &&
      (c.status === "OPEN" || c.status === "IN_PROGRESS"),
  ).length;
  const resolvedCount = (complaints ?? []).filter(
    (c) => c.status === "RESOLVED" || c.status === "CLOSED",
  ).length;

  const hasActiveFilters =
    statusFilter !== ALL ||
    priorityFilter !== ALL ||
    categoryFilter !== ALL ||
    buildingFilter !== ALL ||
    query.trim() !== "";

  const hasUnresolved = openCount + inProgressCount > 0;

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto container space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Heading */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-[13px] italic text-coral-600/85">
              Issues &amp; service requests
            </p>
            <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
              Complaints
            </h1>
            <p className="font-bangla mt-1 text-[13px] text-ink-soft">
              অভিযোগ ও মেরামতের অনুরোধ।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
          >
            <Plus size={14} />
            File complaint
          </button>
        </header>

        {/* Hero — open complaints is THE number */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div
            className={cn(
              "relative overflow-hidden rounded-[18px] px-5 py-5 sm:px-6 sm:py-6",
              hasUnresolved
                ? "bg-jade-950 text-paper"
                : "border border-rule-soft bg-paper",
            )}
            style={
              hasUnresolved
                ? {
                    boxShadow:
                      "0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 40px -22px rgba(10,46,34,0.5)",
                  }
                : undefined
            }
          >
            {hasUnresolved && (
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
                "relative font-serif text-[13px] italic",
                hasUnresolved ? "text-paper/60" : "text-coral-600/85",
              )}
            >
              Needs attention
            </p>
            <p
              className={cn(
                "font-bangla relative mt-0.5 text-[11.5px]",
                hasUnresolved ? "text-paper/45" : "text-ink-soft/65",
              )}
            >
              মনোযোগ প্রয়োজন
            </p>
            <p
              className={cn(
                "relative mt-3 text-[40px] font-bold leading-none tracking-[-0.025em] tabular-nums sm:text-[46px]",
                hasUnresolved ? "text-coral-400" : "text-jade-950",
              )}
            >
              {hasUnresolved
                ? fmtNum(openCount + inProgressCount)
                : "All clear"}
            </p>
            <p
              className={cn(
                "relative mt-3 text-[12.5px]",
                hasUnresolved ? "text-paper/70" : "text-ink-soft",
              )}
            >
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  hasUnresolved ? "text-paper" : "text-ink",
                )}
              >
                {fmtNum(openCount)}
              </span>{" "}
              open
              {" · "}
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  hasUnresolved ? "text-paper" : "text-ink",
                )}
              >
                {fmtNum(inProgressCount)}
              </span>{" "}
              in progress
            </p>

            {urgentCount > 0 && (
              <div
                className={cn(
                  "relative mt-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium",
                  hasUnresolved
                    ? "bg-coral-500/15 text-coral-300"
                    : "bg-coral-50 text-coral-600",
                )}
              >
                <AlertTriangle size={11} />
                <span className="tabular-nums">{fmtNum(urgentCount)}</span>
                <span>urgent · awaiting action</span>
              </div>
            )}
          </div>

          {/* Supporting */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <MiniStat
              label="Resolved"
              bn="সমাধান হয়েছে"
              value={fmtNum(resolvedCount)}
              sub="resolved or closed"
              tone="good"
            />
            <MiniStat
              label="Total"
              bn="মোট"
              value={fmtNum(complaints?.length ?? 0)}
              sub="all statuses"
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
                placeholder="Search by title, description, building, unit, tenant…"
                className="h-9 w-full rounded-md border border-rule-soft bg-paper pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-soft/60 focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
              />
            </div>

            <div className="w-full sm:w-40">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v ?? ALL)}
              >
                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All statuses</SelectItem>
                  {COMPLAINT_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-40">
              <Select
                value={priorityFilter}
                onValueChange={(v) => setPriorityFilter(v ?? ALL)}
              >
                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All priorities</SelectItem>
                  {COMPLAINT_PRIORITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-44">
              <Select
                value={categoryFilter}
                onValueChange={(v) => setCategoryFilter(v ?? ALL)}
              >
                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All categories</SelectItem>
                  {COMPLAINT_CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-44">
              <Select
                value={buildingFilter}
                onValueChange={(v) => setBuildingFilter(v ?? ALL)}
              >
                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                  <SelectValue placeholder="Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All buildings</SelectItem>
                  {(buildings ?? []).map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
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
                {filtered.length === 1 ? "result" : "results"}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter(ALL);
                    setPriorityFilter(ALL);
                    setCategoryFilter(ALL);
                    setBuildingFilter(ALL);
                  }}
                  className="inline-flex items-center gap-1 font-medium text-ink-soft transition-colors hover:text-coral-600"
                >
                  <X size={11} /> Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <ListShell />
        ) : isError ? (
          <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
            <h2 className="text-[15px] font-bold text-coral-600">
              Couldn&apos;t load complaints
            </h2>
            <p className="mt-1 text-[13px] text-coral-600/80">
              {error instanceof Error ? error.message : "Please try again."}
            </p>
          </div>
        ) : !complaints || complaints.length === 0 ? (
          <EmptyState onFile={() => setCreateOpen(true)} />
        ) : filtered.length === 0 ? (
          <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-12 text-center">
            <p className="text-[13.5px] text-ink-soft">
              No complaints match your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
            <ul className="divide-y divide-rule-soft">
              {filtered.map((c) => (
                <ComplaintRow key={c.id} complaint={c} />
              ))}
            </ul>
          </div>
        )}

        {/* Dialog */}
        <CreateComplaintDialog open={createOpen} onOpenChange={setCreateOpen} />
      </div>
    </div>
  );
}

function ComplaintRow({ complaint }: { complaint: ComplaintListItem }) {
  return (
    <li>
      <Link
        href={`/owner/dashboard/complaints/${complaint.id}`}
        className="group relative flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cream/60 sm:flex-row sm:items-start"
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0 w-[3px]",
            complaintStatusAccent[complaint.status],
          )}
        />

        {/* Priority dot */}
        <span
          aria-hidden
          title={complaintPriorityLabel(complaint.priority)}
          className={cn(
            "mt-1 ml-2 h-2 w-2 shrink-0 rounded-full",
            complaintPriorityDot[complaint.priority],
          )}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-[13.5px] font-semibold text-jade-950 group-hover:text-jade-900">
              {complaint.title}
            </p>
            <span
              className={cn(
                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                complaintStatusStyles[complaint.status],
              )}
            >
              {complaintStatusLabel(complaint.status)}
            </span>
            <span
              className={cn(
                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                complaintPriorityStyles[complaint.priority],
              )}
            >
              {complaintPriorityLabel(complaint.priority)}
            </span>
            <span
              className={cn(
                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                complaintCategoryStyles[complaint.category],
              )}
            >
              {complaintCategoryLabel(complaint.category)}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-[12.5px] text-ink-soft">
            {complaint.description}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-soft">
            {complaint.building && (
              <span className="inline-flex items-center gap-1">
                <Building size={11} className="text-ink-soft/60" />
                {complaint.building.name}
              </span>
            )}
            {complaint.unit && (
              <span className="inline-flex items-center gap-1">
                <DoorOpen size={11} className="text-ink-soft/60" />
                Unit {complaint.unit.name}
              </span>
            )}
            {complaint.assignedTo && (
              <span className="inline-flex items-center gap-1">
                <User size={11} className="text-ink-soft/60" />
                <span className="text-ink">{complaint.assignedTo.name}</span>
              </span>
            )}
            <span className="tabular-nums">
              · {formatRelativeTime(complaint.createdAt)}
            </span>
          </div>
        </div>

        <ArrowUpRight
          size={14}
          className="shrink-0 self-center text-ink-soft/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-jade-900"
        />
      </Link>
    </li>
  );
}

function MiniStat({
  label,
  bn,
  value,
  sub,
  tone,
}: {
  label: string;
  bn: string;
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
        <p className="font-bangla text-[10.5px] text-ink-soft/65">{bn}</p>
      </div>
      <p
        className={cn(
          "mt-1.5 text-[20px] font-bold leading-none tracking-[-0.025em] tabular-nums",
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
        <Skeleton key={i} className="h-[88px] w-full rounded-[10px] bg-paper" />
      ))}
    </div>
  );
}

function EmptyState({ onFile }: { onFile: () => void }) {
  return (
    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
        <MessageSquareWarning size={26} className="text-jade-800" />
      </div>
      <h2 className="mt-4 text-[17px] font-bold text-jade-950">
        No complaints filed
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
        Log maintenance issues, hazards, or tenant complaints so they can be
        tracked, assigned, and resolved.
      </p>
      <p className="font-bangla mt-0.5 text-[12px] text-ink-soft/75">
        প্রথম অভিযোগ যুক্ত করুন
      </p>
      <div className="mt-5 flex items-center justify-center">
        <button
          type="button"
          onClick={onFile}
          className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
        >
          <Plus size={14} />
          File complaint
        </button>
      </div>
    </div>
  );
}
