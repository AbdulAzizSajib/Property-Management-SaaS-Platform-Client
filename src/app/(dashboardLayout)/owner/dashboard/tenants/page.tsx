"use client";

import {
    TenantForm,
    buildCreateTenantPayload,
} from "@/src/components/dashboard/tenants/TenantForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
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
import { useCreateTenant, useTenants } from "@/src/hooks/useTenants";
import { cn } from "@/src/lib/utils";
import type { TenantListItem } from "@/src/types/tenant.types";
import { Briefcase, FileText, Mail, Phone, Plus, Search, Users, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export default function TenantsListPage() {
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

    const activeCount = (tenants ?? []).filter((t) => t.isActive).length;
    const withLeaseCount = (tenants ?? []).filter((t) =>
        t.leases.some((l) => l.status === "ACTIVE"),
    ).length;

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Tenants
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage tenants, contact details and emergency information.
                    </p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger
                        render={
                            <Button>
                                <Plus size={14} />
                                Add Tenant
                            </Button>
                        }
                    />
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add new tenant</DialogTitle>
                            <DialogDescription>
                                Create a tenant record. Optionally create a portal login so they
                                can pay rent online.
                            </DialogDescription>
                        </DialogHeader>
                        <TenantForm
                            mode="create"
                            submitting={createMutation.isPending}
                            submitLabel="Create tenant"
                            onCancel={() => setCreateOpen(false)}
                            onSubmit={(values) => {
                                const payload = buildCreateTenantPayload(values);
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
                    label="Total tenants"
                    value={tenants?.length ?? 0}
                    accent="indigo"
                />
                <StatTile label="Active" value={activeCount} accent="emerald" />
                <StatTile
                    label="With active lease"
                    value={withLeaseCount}
                    accent="violet"
                />
            </div>

            {/* Toolbar */}
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
                            placeholder="Search by name, phone, email, occupation..."
                            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div className="inline-flex shrink-0 rounded-md border border-slate-200 p-0.5">
                        {(["ALL", "ACTIVE", "INACTIVE"] as StatusFilter[]).map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setStatusFilter(s)}
                                className={cn(
                                    "rounded-[6px] px-3 py-1 text-xs font-medium transition-colors",
                                    statusFilter === s
                                        ? "bg-indigo-600 text-white"
                                        : "text-slate-600 hover:bg-slate-100",
                                )}
                            >
                                {s === "ALL" ? "All" : s === "ACTIVE" ? "Active" : "Inactive"}
                            </button>
                        ))}
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-40 rounded-xl" />
                    ))}
                </div>
            ) : isError ? (
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load tenants
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Please try again."}
                    </p>
                </Card>
            ) : !tenants || tenants.length === 0 ? (
                <EmptyState onCreate={() => setCreateOpen(true)} />
            ) : filtered.length === 0 ? (
                <Card className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-500">No tenants match your filters.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((t) => (
                        <TenantCard key={t.id} tenant={t} />
                    ))}
                </div>
            )}
        </div>
    );
}

function TenantCard({ tenant }: { tenant: TenantListItem }) {
    const initials = tenant.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const activeLease = tenant.leases.find((l) => l.status === "ACTIVE");

    return (
        <Link href={`/owner/dashboard/tenants/${tenant.id}`} className="group block">
            <Card className="px-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                <div className="flex items-start gap-3">
                    <Avatar className="size-12 ring-2 ring-slate-100">
                        {tenant.photoUrl && (
                            <AvatarImage src={tenant.photoUrl} alt={tenant.name} />
                        )}
                        <AvatarFallback className="bg-indigo-100 text-sm font-semibold text-indigo-700">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-base font-semibold text-slate-900 group-hover:text-indigo-700">
                                {tenant.name}
                            </p>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "shrink-0 text-[10px]",
                                    tenant.isActive
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-slate-200 bg-slate-50 text-slate-600",
                                )}
                            >
                                {tenant.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        {tenant.occupation && (
                            <p className="truncate text-xs text-slate-500">
                                <Briefcase size={11} className="mr-1 inline" />
                                {tenant.occupation}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <p className="inline-flex items-center gap-1.5">
                        <Phone size={11} className="text-slate-400" />
                        {tenant.phone}
                    </p>
                    {tenant.email && (
                        <p className="inline-flex items-center gap-1.5 truncate">
                            <Mail size={11} className="text-slate-400" />
                            {tenant.email}
                        </p>
                    )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
                    <span className="inline-flex items-center gap-1 text-slate-500">
                        <FileText size={11} />
                        {tenant.leases.length}{" "}
                        {tenant.leases.length === 1 ? "lease" : "leases"}
                    </span>
                    {activeLease ? (
                        <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
                        >
                            Has active lease
                        </Badge>
                    ) : (
                        <span className="text-slate-400">No active lease</span>
                    )}
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
    value: number;
    accent: "indigo" | "emerald" | "violet";
}) {
    const accents: Record<typeof accent, string> = {
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        violet: "bg-violet-50 text-violet-600",
    };

    return (
        <Card className="px-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">
                        {value}
                    </p>
                </div>
                <span
                    className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg",
                        accents[accent],
                    )}
                >
                    <Users size={18} />
                </span>
            </div>
        </Card>
    );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <Card className="px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-indigo-50">
                <Users size={28} className="text-indigo-600" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">No tenants yet</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Add your first tenant to start tracking leases and rent collection.
            </p>
            <div className="mt-5">
                <Button onClick={onCreate}>
                    <Plus size={14} />
                    Add your first tenant
                </Button>
            </div>
        </Card>
    );
}
