"use client";

import { LeaseForm } from "@/src/components/dashboard/leases/LeaseForm";
import {
    leaseStatusLabel,
    leaseStatusStyles,
} from "@/src/components/dashboard/leases/leaseStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
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

    const activeCount = (leases ?? []).filter((l) => l.status === "ACTIVE").length;
    const totalMonthly = (leases ?? [])
        .filter((l) => l.status === "ACTIVE")
        .reduce(
            (sum, l) =>
                sum + Number(l.monthlyRent) + Number(l.serviceCharge),
            0,
        );

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Leases
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Tenant agreements, rent terms and lease history.
                    </p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger
                        render={
                            <Button>
                                <Plus size={14} />
                                New Lease
                            </Button>
                        }
                    />
                    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create new lease</DialogTitle>
                            <DialogDescription>
                                Connect a tenant to a vacant unit. The unit will become
                                occupied and the first invoice will be generated automatically.
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
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatTile
                    label="Total leases"
                    value={String(leases?.length ?? 0)}
                    accent="indigo"
                />
                <StatTile
                    label="Active leases"
                    value={String(activeCount)}
                    accent="emerald"
                />
                <StatTile
                    label="Monthly rent (active)"
                    value={formatMoney(totalMonthly)}
                    accent="violet"
                />
            </div>

            {/* Filters */}
            <Card className="px-4 py-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search
                            size={15}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by tenant, unit, building..."
                            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div className="inline-flex flex-wrap shrink-0 rounded-md border border-slate-200 p-0.5">
                        {(["ALL", ...LEASE_STATUS_OPTIONS.map((o) => o.value)] as StatusFilter[]).map(
                            (s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatusFilter(s)}
                                    className={cn(
                                        "rounded-[6px] px-2.5 py-1 text-[11px] font-medium transition-colors",
                                        statusFilter === s
                                            ? "bg-indigo-600 text-white"
                                            : "text-slate-600 hover:bg-slate-100",
                                    )}
                                >
                                    {s === "ALL" ? "All" : leaseStatusLabel(s)}
                                </button>
                            ),
                        )}
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="tabular-nums">
                        {filtered.length} {filtered.length === 1 ? "result" : "results"}
                    </span>
                    {(query || statusFilter !== "ALL") && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setStatusFilter("ALL");
                            }}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                        >
                            <X size={11} /> Clear
                        </button>
                    )}
                </div>
            </Card>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-40 rounded-xl" />
                    ))}
                </div>
            ) : isError ? (
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load leases
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Please try again."}
                    </p>
                </Card>
            ) : !leases || leases.length === 0 ? (
                <EmptyState onCreate={() => setCreateOpen(true)} />
            ) : filtered.length === 0 ? (
                <Card className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-500">No leases match your filters.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {filtered.map((l) => (
                        <LeaseCard key={l.id} lease={l} />
                    ))}
                </div>
            )}
        </div>
    );
}

function LeaseCard({ lease }: { lease: LeaseListItem }) {
    const total = Number(lease.monthlyRent) + Number(lease.serviceCharge);

    return (
        <Link href={`/owner/dashboard/leases/${lease.id}`} className="group block">
            <Card className="px-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="font-mono text-[11px] text-slate-400">
                            #{lease.id.slice(-8).toUpperCase()}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                            <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-indigo-700">
                                {lease.tenant.name}
                            </h3>
                        </div>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
                            <Phone size={11} />
                            {lease.tenant.phone}
                        </p>
                    </div>
                    <Badge
                        variant="outline"
                        className={cn(
                            "shrink-0 text-[10px]",
                            leaseStatusStyles[lease.status],
                        )}
                    >
                        {leaseStatusLabel(lease.status)}
                    </Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                        <Building size={11} /> {lease.unit.building.name}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <DoorOpen size={11} /> Unit {lease.unit.name}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(lease.startDate).toLocaleDateString()} –{" "}
                        {lease.endDate
                            ? new Date(lease.endDate).toLocaleDateString()
                            : "Open-ended"}
                    </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between border-t border-slate-100 pt-3">
                    <div>
                        <p className="text-lg font-semibold text-slate-900 tabular-nums">
                            {formatMoney(total)}
                        </p>
                        <p className="text-[10px] text-slate-500">
                            {formatMoney(lease.monthlyRent)} rent + {formatMoney(lease.serviceCharge)} svc
                        </p>
                    </div>
                    <span className="text-[11px] text-slate-500">
                        Due day {lease.rentDueDay}
                    </span>
                </div>
            </Card>
        </Link>
    );
}

function StatTile({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent: "indigo" | "emerald" | "violet";
}) {
    const accents: Record<typeof accent, string> = {
        indigo: "text-indigo-700",
        emerald: "text-emerald-700",
        violet: "text-violet-700",
    };
    return (
        <Card className="px-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                {label}
            </p>
            <p
                className={cn(
                    "mt-1 text-2xl font-semibold tabular-nums",
                    accents[accent],
                )}
            >
                {value}
            </p>
        </Card>
    );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <Card className="px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-indigo-50">
                <FileText size={28} className="text-indigo-600" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">No leases yet</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Create your first lease to start tracking rent and tenant agreements.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                <User size={12} />
                Requires an active tenant + vacant unit
            </div>
            <div className="mt-5">
                <Button onClick={onCreate}>
                    <Plus size={14} /> Create your first lease
                </Button>
            </div>
        </Card>
    );
}
