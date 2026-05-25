"use client";

// src/app/owner/dashboard/leases/page.tsx

import { LeaseForm } from "@/src/components/dashboard/leases/LeaseForm";
import {
    leaseStatusAccent,
    leaseStatusLabel,
    leaseStatusStyles,
} from "@/src/components/dashboard/leases/leaseStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useCreateLease, useLeases } from "@/src/hooks/useLeases";
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
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type StatusFilter = "ALL" | LeaseStatus;

export default function LeasesListPage() {
    const { data: leases, isLoading, isError, error } = useLeases();
    const createMutation = useCreateLease();

    const [createOpen, setCreateOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

    const filtered = (leases ?? []).filter((l) => {
        if (statusFilter !== "ALL" && l.status !== statusFilter) return false;

        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            l.tenant.name.toLowerCase().includes(q) ||
            l.tenant.phone.toLowerCase().includes(q) ||
            l.unit.name.toLowerCase().includes(q) ||
            l.unit.building.name.toLowerCase().includes(q)
        );
    });

    const totalCount = leases?.length ?? 0;
    const activeCount = (leases ?? []).filter((l) => l.status === "ACTIVE").length;
    const pendingCount = (leases ?? []).filter((l) => l.status === "PENDING").length;
    const totalMonthly = (leases ?? [])
        .filter((l) => l.status === "ACTIVE")
        .reduce(
            (sum, l) => sum + Number(l.monthlyRent) + Number(l.serviceCharge),
            0,
        );

    const hasActiveFilters = !!query.trim() || statusFilter !== "ALL";

    function clearFilters() {
        setQuery("");
        setStatusFilter("ALL");
    }

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1240px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Heading */}
                <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Tenant agreements
                        </p>
                        <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            Leases
                        </h1>
                        <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                            লিজ ও ভাড়াটিয়া চুক্তি।
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
                                    New lease
                                </button>
                            }
                        />
                        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-jade-950">
                                    Create new lease
                                </DialogTitle>
                                <DialogDescription className="text-ink-soft">
                                    Connect a tenant to a vacant unit. The unit will
                                    become occupied and the first invoice will be
                                    generated automatically.
                                </DialogDescription>
                            </DialogHeader>
                            <LeaseForm
                                submitting={createMutation.isPending}
                                submitLabel="Create lease"
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
                        className="relative overflow-hidden rounded-[18px] bg-jade-950 px-5 py-5 text-paper sm:px-6 sm:py-6"
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
                        <p className="relative font-serif text-[13px] italic text-paper/60">
                            Monthly rent from active leases
                        </p>
                        <p className="font-bangla relative mt-0.5 text-[11.5px] text-paper/45">
                            সক্রিয় লিজ থেকে মাসিক ভাড়া
                        </p>
                        <p className="relative mt-3 text-[40px] font-bold leading-none tracking-[-0.025em] tabular-nums sm:text-[46px]">
                            {totalMonthly > 0 ? formatMoney(totalMonthly) : "—"}
                        </p>
                        <p className="relative mt-3 text-[12.5px] text-paper/70">
                            from{" "}
                            <span className="font-semibold text-paper tabular-nums">
                                {fmtNum(activeCount)}
                            </span>{" "}
                            active{" "}
                            {activeCount === 1 ? "lease" : "leases"} ·{" "}
                            <span className="tabular-nums">
                                {fmtNum(totalCount)}
                            </span>{" "}
                            on record
                        </p>

                        {pendingCount > 0 && (
                            <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-md bg-coral-500/15 px-2 py-1 text-[11.5px] font-medium text-coral-300">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inset-0 animate-ping rounded-full bg-coral-400 opacity-70" />
                                    <span className="relative h-1.5 w-1.5 rounded-full bg-coral-400" />
                                </span>
                                <span className="tabular-nums">
                                    {fmtNum(pendingCount)}
                                </span>
                                <span>
                                    pending{" "}
                                    {pendingCount === 1 ? "lease" : "leases"}{" "}
                                    awaiting action
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Supporting context */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <SmallStat
                            label="Active"
                            bn="সক্রিয়"
                            value={fmtNum(activeCount)}
                            sub="generating rent"
                            tone="jade"
                        />
                        <SmallStat
                            label="Pending"
                            bn="অপেক্ষমান"
                            value={fmtNum(pendingCount)}
                            sub={
                                pendingCount === 0
                                    ? "nothing waiting"
                                    : "needs your attention"
                            }
                            tone={pendingCount > 0 ? "coral" : "neutral"}
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
                                placeholder="Search by tenant, unit, building…"
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
                                    onClick={() => setStatusFilter(s)}
                                    className={cn(
                                        "rounded-[6px] px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
                                        statusFilter === s
                                            ? "bg-jade-900 text-paper"
                                            : "text-ink-soft hover:bg-paper hover:text-jade-900",
                                    )}
                                >
                                    {leaseStatusLabel(s)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(filtered.length > 0 || hasActiveFilters) && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-rule-soft pt-3 text-[12px] text-ink-soft">
                            <span className="tabular-nums">
                                <span className="font-semibold text-ink">
                                    {fmtNum(filtered.length)}
                                </span>{" "}
                                {filtered.length === 1 ? "result" : "results"}
                                {statusFilter !== "ALL" && (
                                    <span className="ml-1.5 text-ink-soft/70">
                                        · {leaseStatusLabel(statusFilter)} only
                                    </span>
                                )}
                            </span>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-1 font-medium text-ink-soft transition-colors hover:text-coral-600"
                                >
                                    <X size={11} /> Clear
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-[180px] rounded-[12px] bg-paper"
                            />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-700">
                            Couldn&apos;t load leases
                        </h2>
                        <p className="mt-1 text-[13px] text-coral-700/80">
                            {error instanceof Error
                                ? error.message
                                : "Please try again."}
                        </p>
                    </div>
                ) : !leases || leases.length === 0 ? (
                    <EmptyState onCreate={() => setCreateOpen(true)} />
                ) : filtered.length === 0 ? (
                    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-12 text-center">
                        <p className="text-[13.5px] text-ink-soft">
                            No leases match your filters.
                        </p>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-jade-900 hover:text-coral-600 transition-colors"
                        >
                            <X size={12} /> Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {filtered.map((l) => (
                            <LeaseCard key={l.id} lease={l} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// LeaseCard — visually structured the same way as UnitCard / TenantCard
// ─────────────────────────────────────────────────────────────────

function LeaseCard({ lease }: { lease: LeaseListItem }) {
    const total = Number(lease.monthlyRent) + Number(lease.serviceCharge);

    const initials = lease.tenant.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <Link
            href={`/owner/dashboard/leases/${lease.id}`}
            className="group relative block overflow-hidden rounded-[12px] border border-rule-soft bg-paper p-4 transition-all hover:-translate-y-0.5 hover:border-jade-700/20 hover:shadow-[0_8px_24px_-12px_rgba(10,46,34,0.15)]"
        >
            {/* Status accent strip */}
            <span
                aria-hidden
                className={cn(
                    "absolute inset-y-0 left-0 w-[3px]",
                    leaseStatusAccent[lease.status],
                )}
            />

            <div className="flex items-start gap-3">
                {/* Tenant avatar */}
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-jade-50 text-[12px] font-bold text-jade-800">
                    {initials}
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <p className="truncate text-[15px] font-bold tracking-[-0.01em] text-jade-950 group-hover:text-jade-900">
                                {lease.tenant.name}
                            </p>
                            <p className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-ink-soft tabular-nums">
                                <Phone size={11} className="text-ink-soft/60" />
                                {lease.tenant.phone}
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                            <span
                                className={cn(
                                    "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                    leaseStatusStyles[lease.status],
                                )}
                            >
                                {leaseStatusLabel(lease.status)}
                            </span>
                            <span className="font-mono text-[10px] text-ink-soft/65">
                                #{lease.id.slice(-6).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property + dates */}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-rule-soft pt-3 text-[11.5px] text-ink-soft">
                <span className="inline-flex items-center gap-1">
                    <Building size={11} className="text-ink-soft/60" />
                    {lease.unit.building.name}
                </span>
                <span className="inline-flex items-center gap-1">
                    <DoorOpen size={11} className="text-ink-soft/60" />
                    Unit {lease.unit.name}
                </span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                    <Calendar size={11} className="text-ink-soft/60" />
                    {new Date(lease.startDate).toLocaleDateString()}
                    {" – "}
                    {lease.endDate
                        ? new Date(lease.endDate).toLocaleDateString()
                        : "Open-ended"}
                </span>
            </div>

            {/* Money + due day */}
            <div className="mt-3 flex items-baseline justify-between border-t border-rule-soft pt-3">
                <div>
                    <p className="text-[18px] font-bold text-jade-950 tabular-nums">
                        {formatMoney(total)}
                        <span className="ml-1 text-[10.5px] font-medium text-ink-soft">
                            /mo
                        </span>
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-ink-soft tabular-nums">
                        {formatMoney(lease.monthlyRent)} rent
                        {Number(lease.serviceCharge) > 0 && (
                            <>
                                {" "}
                                + {formatMoney(lease.serviceCharge)} svc
                            </>
                        )}
                    </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 text-[11px] font-medium text-ink-soft">
                    <Calendar size={10} />
                    Due day{" "}
                    <span className="font-bold text-ink tabular-nums">
                        {lease.rentDueDay}
                    </span>
                </span>
            </div>
        </Link>
    );
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function SmallStat({
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
    tone: "jade" | "coral" | "neutral";
}) {
    const valueTone =
        tone === "coral"
            ? "text-coral-700"
            : tone === "jade"
                ? "text-jade-950"
                : "text-ink-soft/80";

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
                    "mt-1.5 text-[26px] font-bold leading-none tracking-[-0.025em] tabular-nums",
                    valueTone,
                )}
            >
                {value}
            </p>
            <p className="mt-1.5 text-[12px] text-ink-soft">{sub}</p>
        </div>
    );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
                <FileText size={26} className="text-jade-800" />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-jade-950">
                No leases yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
                Create your first lease to start tracking rent and tenant
                agreements.
            </p>
            <p className="font-bangla mt-0.5 text-[12px] text-ink-soft/75">
                আপনার প্রথম লিজ তৈরি করুন
            </p>
            <div className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md border border-rule-soft bg-cream/60 px-2.5 py-1 text-[11.5px] text-ink-soft">
                <User size={11} />
                Requires an active tenant + vacant unit
            </div>
            <div className="mt-5">
                <button
                    type="button"
                    onClick={onCreate}
                    className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                >
                    <Plus size={14} />
                    Create your first lease
                </button>
            </div>
        </div>
    );
}