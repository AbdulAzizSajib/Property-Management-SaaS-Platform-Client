"use client";

import { UnitForm, buildCreatePayload } from "@/src/components/dashboard/units/UnitForm";
import {
    formatMoney,
    statusLabel,
    typeLabel,
    unitStatusStyles,
    unitTypeStyles,
} from "@/src/components/dashboard/units/unitStyles";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useBuildings } from "@/src/hooks/useBuildings";
import { useCreateUnit, useUnits } from "@/src/hooks/useUnits";
import { cn } from "@/src/lib/utils";
import {
    UNIT_STATUS_OPTIONS,
    UNIT_TYPE_OPTIONS,
    type UnitListItem,
    type UnitStatus,
    type UnitType,
} from "@/src/types/unit.types";
import { Bath, Bed, DoorOpen, Plus, Ruler, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ALL = "__ALL__";

export default function UnitsListPage() {
    const [buildingId, setBuildingId] = useState<string>(ALL);
    const [status, setStatus] = useState<string>(ALL);
    const [type, setType] = useState<string>(ALL);
    const [query, setQuery] = useState("");
    const [createOpen, setCreateOpen] = useState(false);

    const filters = {
        ...(buildingId !== ALL && { buildingId }),
        ...(status !== ALL && { status: status as UnitStatus }),
        ...(type !== ALL && { type: type as UnitType }),
    };

    const { data: buildings } = useBuildings();
    const { data: units, isLoading, isError, error } = useUnits(filters);
    const createMutation = useCreateUnit();

    const filtered = (units ?? []).filter((u) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            u.name.toLowerCase().includes(q) ||
            u.building.name.toLowerCase().includes(q) ||
            u.floor.name.toLowerCase().includes(q)
        );
    });

    const hasActiveFilters =
        buildingId !== ALL || status !== ALL || type !== ALL || query.trim() !== "";

    function clearFilters() {
        setBuildingId(ALL);
        setStatus(ALL);
        setType(ALL);
        setQuery("");
    }

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Units
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Every flat, shop and office across your portfolio.
                    </p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger
                        render={
                            <Button>
                                <Plus size={14} />
                                Add Unit
                            </Button>
                        }
                    />
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add unit</DialogTitle>
                            <DialogDescription>
                                Add a new flat, shop, office or other rental unit.
                            </DialogDescription>
                        </DialogHeader>
                        <UnitForm
                            mode="create"
                            submitting={createMutation.isPending}
                            submitLabel="Add unit"
                            onCancel={() => setCreateOpen(false)}
                            onSubmit={(values) => {
                                const payload = buildCreatePayload(values);
                                createMutation.mutate(payload, {
                                    onSuccess: () => setCreateOpen(false),
                                });
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card className="px-4 py-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="relative lg:col-span-2">
                        <Search
                            size={15}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by unit, building, floor..."
                            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <Select
                        value={buildingId}
                        onValueChange={(v) => setBuildingId(v ?? ALL)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Building" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All buildings</SelectItem>
                            {buildings?.map((b) => (
                                <SelectItem key={b.id} value={b.id}>
                                    {b.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={status} onValueChange={(v) => setStatus(v ?? ALL)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All statuses</SelectItem>
                            {UNIT_STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={type} onValueChange={(v) => setType(v ?? ALL)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All types</SelectItem>
                            {UNIT_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="tabular-nums">
                        {filtered.length} {filtered.length === 1 ? "result" : "results"}
                    </span>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                        >
                            <X size={11} /> Clear filters
                        </button>
                    )}
                </div>
            </Card>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Skeleton key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            ) : isError ? (
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load units
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Please try again."}
                    </p>
                </Card>
            ) : filtered.length === 0 ? (
                <Card className="px-6 py-16 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-indigo-50">
                        <DoorOpen size={28} className="text-indigo-600" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        {hasActiveFilters ? "No units match these filters" : "No units yet"}
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                        {hasActiveFilters
                            ? "Try clearing some filters to see more results."
                            : "Add your first unit to start tracking rentals."}
                    </p>
                    {!hasActiveFilters && (
                        <div className="mt-5">
                            <Button onClick={() => setCreateOpen(true)}>
                                <Plus size={14} /> Add your first unit
                            </Button>
                        </div>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((u) => (
                        <UnitCard key={u.id} unit={u} />
                    ))}
                </div>
            )}
        </div>
    );
}

function UnitCard({ unit }: { unit: UnitListItem }) {
    return (
        <Link
            href={`/owner/dashboard/units/${unit.id}`}
            className="group block"
        >
            <Card className="px-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-slate-900 group-hover:text-indigo-700">
                            {unit.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                            {unit.building.name}
                        </p>
                    </div>
                    <Badge
                        variant="outline"
                        className={cn("text-[10px]", unitStatusStyles[unit.status])}
                    >
                        {statusLabel(unit.status)}
                    </Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge
                        variant="outline"
                        className={cn("text-[10px]", unitTypeStyles[unit.type])}
                    >
                        {typeLabel(unit.type)}
                    </Badge>
                    <span className="text-[11px] text-slate-500">
                        {unit.floor.floorNumber === 0
                            ? "Ground floor"
                            : `Floor ${unit.floor.floorNumber}`}
                    </span>
                </div>

                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
                    {unit.bedrooms !== null && (
                        <span className="inline-flex items-center gap-1">
                            <Bed size={11} /> {unit.bedrooms}
                        </span>
                    )}
                    {unit.bathrooms !== null && (
                        <span className="inline-flex items-center gap-1">
                            <Bath size={11} /> {unit.bathrooms}
                        </span>
                    )}
                    {unit.sizeSqft !== null && (
                        <span className="inline-flex items-center gap-1">
                            <Ruler size={11} /> {unit.sizeSqft} sqft
                        </span>
                    )}
                </div>

                <div className="mt-3 flex items-baseline justify-between border-t border-slate-100 pt-3">
                    <div>
                        <p className="text-lg font-semibold text-slate-900 tabular-nums">
                            {formatMoney(unit.baseRent)}
                        </p>
                        <p className="text-[10px] text-slate-500">/month</p>
                    </div>
                    <p className="text-[11px] text-slate-500">
                        +{formatMoney(unit.serviceCharge)} svc
                    </p>
                </div>
            </Card>
        </Link>
    );
}
