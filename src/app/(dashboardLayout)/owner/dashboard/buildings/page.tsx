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
import { cn } from "@/src/lib/utils";
import type { BuildingListItem, BuildingType } from "@/src/types/building.types";
import {
    Building,
    Building2,
    DoorOpen,
    Layers,
    MapPin,
    Plus,
    Search,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const typeBadgeStyles: Record<BuildingType, string> = {
    RESIDENTIAL: "bg-indigo-50 text-indigo-700 border-indigo-200",
    COMMERCIAL: "bg-emerald-50 text-emerald-700 border-emerald-200",
    MIXED_USE: "bg-violet-50 text-violet-700 border-violet-200",
};

export default function BuildingsListPage() {
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
                                Add a property to your portfolio. You can add floors and units after
                                creation.
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

            {/* Toolbar */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-md">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, address, city..."
                        className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
                <span className="text-xs text-slate-500 tabular-nums">
                    {filtered.length} {filtered.length === 1 ? "result" : "results"}
                </span>
            </div>

            {/* Content */}
            {isLoading ? (
                <BuildingsGridSkeleton />
            ) : isError ? (
                <ErrorState
                    message={
                        error instanceof Error
                            ? error.message
                            : "Couldn't load buildings. Please try again."
                    }
                />
            ) : !buildings || buildings.length === 0 ? (
                <EmptyState onCreate={() => setCreateOpen(true)} />
            ) : filtered.length === 0 ? (
                <Card className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-500">
                        No buildings match &ldquo;{query}&rdquo;.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((b) => (
                        <BuildingCard key={b.id} building={b} />
                    ))}
                </div>
            )}
        </div>
    );
}

function BuildingCard({ building }: { building: BuildingListItem }) {
    const typeLabel =
        building.type === "MIXED_USE"
            ? "Mixed Use"
            : building.type.charAt(0) + building.type.slice(1).toLowerCase();

    return (
        <Link
            href={`/owner/dashboard/buildings/${building.id}`}
            className="group block"
        >
            <Card className="overflow-hidden transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                {/* Cover */}
                <div className="relative -mx-px -mt-4 h-32 bg-linear-to-br from-indigo-100 via-violet-100 to-fuchsia-100">
                    {building.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={building.imageUrl}
                            alt={building.name}
                            className="size-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Building2 size={32} className="text-indigo-300" />
                        </div>
                    )}
                    <Badge
                        variant="outline"
                        className={cn(
                            "absolute right-2 top-2",
                            typeBadgeStyles[building.type],
                        )}
                    >
                        {typeLabel}
                    </Badge>
                </div>

                {/* Body */}
                <div className="px-5">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 text-base font-semibold text-slate-900 group-hover:text-indigo-700">
                            {building.name}
                        </h3>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        <MapPin size={11} className="mr-1 inline" />
                        {[building.area, building.city].filter(Boolean).join(", ") ||
                            building.address}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                        <Stat icon={Layers} label="Floors" value={building._count.floors} />
                        <Stat icon={DoorOpen} label="Units" value={building._count.units} />
                        <Stat
                            icon={Users}
                            label="Caretaker"
                            value={building.caretaker ? "Yes" : "—"}
                            small
                        />
                    </div>
                </div>
            </Card>
        </Link>
    );
}

function Stat({
    icon: Icon,
    label,
    value,
    small,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: number | string;
    small?: boolean;
}) {
    return (
        <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                <Icon size={10} />
                {label}
            </div>
            <p
                className={cn(
                    "mt-0.5 font-semibold text-slate-900 tabular-nums",
                    small ? "text-sm" : "text-base",
                )}
            >
                {value}
            </p>
        </div>
    );
}

function BuildingsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
        </div>
    );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <Card className="px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-indigo-50">
                <Building size={28} className="text-indigo-600" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">No buildings yet</h2>
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

function ErrorState({ message }: { message: string }) {
    return (
        <Card className="px-6 py-12 text-center">
            <h2 className="text-base font-semibold text-slate-900">
                Couldn&apos;t load buildings
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{message}</p>
        </Card>
    );
}
