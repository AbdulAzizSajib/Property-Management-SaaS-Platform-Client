"use client";

import { BuildingForm } from "@/src/components/dashboard/buildings/BuildingForm";
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
import { useBuildings, useCreateBuilding } from "@/src/hooks/useBuildings";
import { useFloorsByBuilding } from "@/src/hooks/useFloors";
import { cn } from "@/src/lib/utils";
import type { BuildingListItem, BuildingType } from "@/src/types/building.types";
import {
    ArrowRight,
    Building,
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

const typeBadgeStyles: Record<BuildingType, string> = {
    RESIDENTIAL: "bg-indigo-50 text-indigo-700 border-indigo-200",
    COMMERCIAL: "bg-emerald-50 text-emerald-700 border-emerald-200",
    MIXED_USE: "bg-violet-50 text-violet-700 border-violet-200",
};

function typeLabel(t: BuildingType): string {
    return t === "MIXED_USE"
        ? "Mixed Use"
        : t.charAt(0) + t.slice(1).toLowerCase();
}

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
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Buildings
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage all properties in your portfolio.
                    </p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger
                        render={
                            <Button>
                                <Plus size={14} />
                                Add Building
                            </Button>
                        }
                    />
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add new building</DialogTitle>
                            <DialogDescription>
                                Add a property to your portfolio. You can add floors and
                                units after creation.
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
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatTile
                    label="Buildings"
                    value={String(buildings?.length ?? 0)}
                    icon={Building}
                    accent="indigo"
                />
                <StatTile
                    label="Floors"
                    value={String(totalFloors)}
                    icon={Layers}
                    accent="violet"
                />
                <StatTile
                    label="Units"
                    value={String(totalUnits)}
                    icon={DoorOpen}
                    accent="emerald"
                />
            </div>

            {/* Toolbar */}
            <Card className="px-4 py-3">
                <div className="relative">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, address, city, area..."
                        className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
                <div className="mt-2 text-xs text-slate-500 tabular-nums">
                    {filtered.length} {filtered.length === 1 ? "result" : "results"}
                </div>
            </Card>

            {/* Content */}
            {isLoading ? (
                <Skeleton className="h-96 w-full rounded-xl" />
            ) : isError ? (
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load buildings
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Please try again."}
                    </p>
                </Card>
            ) : !buildings || buildings.length === 0 ? (
                <EmptyState onCreate={() => setCreateOpen(true)} />
            ) : filtered.length === 0 ? (
                <Card className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-500">
                        No buildings match &ldquo;{query}&rdquo;.
                    </p>
                </Card>
            ) : (
                <Card className="gap-0 overflow-hidden py-0">
                    {/* Desktop table header */}
                    <div className="hidden grid-cols-[28px_minmax(0,2.5fr)_100px_120px_80px_80px_120px_100px_44px] items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 lg:grid">
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

                    <ul className="divide-y divide-slate-100">
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
                </Card>
            )}
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
            {/* Main row */}
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
                    "group grid cursor-pointer grid-cols-[28px_1fr_auto] items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50 lg:grid-cols-[28px_minmax(0,2.5fr)_100px_120px_80px_80px_120px_100px_44px]",
                    isExpanded && "bg-slate-50",
                )}
            >
                {/* Chevron */}
                <ChevronRight
                    size={14}
                    className={cn(
                        "shrink-0 text-slate-400 transition-transform",
                        isExpanded && "rotate-90 text-indigo-600",
                    )}
                />

                {/* Name + address (always visible) */}
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
                        {building.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                        <MapPin size={10} className="mr-1 inline" />
                        {building.address}
                    </p>
                </div>

                {/* Type */}
                <Badge
                    variant="outline"
                    className={cn(
                        "hidden text-[10px] lg:inline-flex",
                        typeBadgeStyles[building.type],
                    )}
                >
                    {typeLabel(building.type)}
                </Badge>

                {/* City / Area */}
                <div className="hidden min-w-0 text-xs text-slate-600 lg:block">
                    <p className="truncate font-medium text-slate-700">{building.city}</p>
                    {building.area && (
                        <p className="truncate text-[11px] text-slate-500">
                            {building.area}
                        </p>
                    )}
                </div>

                {/* Floors */}
                <div className="hidden text-right tabular-nums lg:block">
                    <p className="text-sm font-semibold text-slate-900">
                        {building._count.floors}
                    </p>
                    <p className="text-[10px] text-slate-500">/ {building.totalFloors}</p>
                </div>

                {/* Units */}
                <p className="hidden text-right text-sm font-semibold tabular-nums text-slate-900 lg:block">
                    {building._count.units}
                </p>

                {/* Caretaker */}
                <div className="hidden text-xs lg:block">
                    {building.caretaker ? (
                        <span className="inline-flex items-center gap-1 truncate text-slate-700">
                            <User size={11} className="text-slate-400" />
                            {building.caretaker.name}
                        </span>
                    ) : (
                        <span className="text-slate-400">—</span>
                    )}
                </div>

                {/* Status */}
                <Badge
                    variant="outline"
                    className={cn(
                        "hidden text-[10px] lg:inline-flex",
                        building.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-600",
                    )}
                >
                    {building.isActive ? "Active" : "Inactive"}
                </Badge>

                {/* Mobile chip strip (replaces desktop columns on small screens) */}
                <div className="flex flex-wrap items-center gap-1.5 lg:hidden">
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-[10px]",
                            typeBadgeStyles[building.type],
                        )}
                    >
                        {typeLabel(building.type)}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <Layers size={10} /> {building._count.floors}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <DoorOpen size={10} /> {building._count.units}
                    </span>
                </div>

                {/* View link */}
                <Link
                    href={`/owner/dashboard/buildings/${building.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto hidden size-7 items-center justify-center rounded-md text-slate-400 hover:bg-white hover:text-indigo-600 lg:flex"
                    aria-label="Open detail"
                >
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* Collapsible panel */}
            {isExpanded && (
                <ExpandedPanel building={building} />
            )}
        </li>
    );
}

function ExpandedPanel({ building }: { building: BuildingListItem }) {
    return (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                {/* Description / about */}
                <div className="lg:col-span-1">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        About
                    </h4>
                    <p className="mt-1.5 text-sm text-slate-700">
                        {building.description || (
                            <span className="text-slate-400">No description added.</span>
                        )}
                    </p>

                    <dl className="mt-3 space-y-1.5 text-xs">
                        <KV label="City" value={building.city} />
                        {building.area && <KV label="Area" value={building.area} />}
                        <KV
                            label="Total floors"
                            value={String(building.totalFloors)}
                        />
                        <KV
                            label="Created"
                            value={new Date(building.createdAt).toLocaleDateString()}
                        />
                    </dl>
                </div>

                {/* Floors mini-list */}
                <div className="lg:col-span-1">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Floors
                    </h4>
                    <FloorsMiniList buildingId={building.id} />
                </div>

                {/* Caretaker + actions */}
                <div className="lg:col-span-1">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Caretaker
                    </h4>
                    {building.caretaker ? (
                        <div className="mt-1.5 rounded-lg border border-slate-200 bg-white p-3 text-xs">
                            <p className="font-medium text-slate-800">
                                {building.caretaker.name}
                            </p>
                            {building.caretaker.email && (
                                <p className="mt-0.5 text-slate-500">
                                    {building.caretaker.email}
                                </p>
                            )}
                            {building.caretaker.contactNumber && (
                                <p className="text-slate-500">
                                    {building.caretaker.contactNumber}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="mt-1.5 text-xs text-slate-400">
                            No caretaker assigned
                        </p>
                    )}

                    <div className="mt-4">
                        <Link
                            href={`/owner/dashboard/buildings/${building.id}`}
                            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
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
                <Skeleton className="h-7 w-full rounded" />
                <Skeleton className="h-7 w-full rounded" />
                <Skeleton className="h-7 w-3/4 rounded" />
            </div>
        );
    }

    if (!floors || floors.length === 0) {
        return (
            <p className="mt-1.5 text-xs text-slate-400">No floors added yet</p>
        );
    }

    const sorted = [...floors].sort((a, b) => a.floorNumber - b.floorNumber);

    return (
        <ul className="mt-1.5 space-y-1">
            {sorted.slice(0, 6).map((f) => (
                <li
                    key={f.id}
                    className="flex items-center justify-between gap-2 rounded-md bg-white px-2 py-1.5 text-xs"
                >
                    <div className="flex items-center gap-2">
                        <span className="flex size-5 items-center justify-center rounded bg-indigo-50 text-[10px] font-semibold text-indigo-700">
                            {f.floorNumber === 0 ? "G" : f.floorNumber}
                        </span>
                        <span className="truncate text-slate-700">{f.name}</span>
                    </div>
                    <span className="text-[10px] tabular-nums text-slate-500">
                        {f._count.units} {f._count.units === 1 ? "unit" : "units"}
                    </span>
                </li>
            ))}
            {sorted.length > 6 && (
                <li className="px-2 text-[10px] text-slate-500">
                    +{sorted.length - 6} more
                </li>
            )}
        </ul>
    );
}

function KV({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-medium text-slate-800">{value}</dd>
        </div>
    );
}

function StatTile({
    label,
    value,
    icon: Icon,
    accent,
}: {
    label: string;
    value: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    accent: "indigo" | "violet" | "emerald";
}) {
    const accents: Record<typeof accent, string> = {
        indigo: "bg-indigo-50 text-indigo-600",
        violet: "bg-violet-50 text-violet-600",
        emerald: "bg-emerald-50 text-emerald-600",
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
                    <Icon size={18} />
                </span>
            </div>
        </Card>
    );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <Card className="px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-indigo-50">
                <Building2 size={28} className="text-indigo-600" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No buildings yet
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Get started by adding your first property to your portfolio.
            </p>
            <div className="mt-5">
                <Button onClick={onCreate}>
                    <Plus size={14} />
                    Add your first building
                </Button>
            </div>
        </Card>
    );
}
