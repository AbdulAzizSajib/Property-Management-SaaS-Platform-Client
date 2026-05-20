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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useCreateUnit, useUnits } from "@/src/hooks/useUnits";
import { cn } from "@/src/lib/utils";
import { Bath, Bed, DoorOpen, Plus, Ruler } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface UnitsPanelProps {
    buildingId: string;
}

export function UnitsPanel({ buildingId }: UnitsPanelProps) {
    const { data: units, isLoading, isError, error } = useUnits({ buildingId });
    const createMutation = useCreateUnit();
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <Card className="px-6">
            <CardHeader className="px-0">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle>Units</CardTitle>
                        <CardDescription>
                            {units?.length ?? 0} {units?.length === 1 ? "unit" : "units"} in this building
                        </CardDescription>
                    </div>
                    <Button size="sm" onClick={() => setCreateOpen(true)}>
                        <Plus size={13} />
                        Add Unit
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="px-0">
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32 rounded-lg" />
                        ))}
                    </div>
                ) : isError ? (
                    <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {error instanceof Error ? error.message : "Couldn't load units."}
                    </p>
                ) : !units || units.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
                        <DoorOpen className="mx-auto text-slate-300" size={24} />
                        <p className="mt-2 text-sm text-slate-500">No units yet</p>
                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            <Plus size={12} /> Add your first unit
                        </button>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {units.map((u) => (
                            <li key={u.id}>
                                <Link
                                    href={`/owner/dashboard/units/${u.id}`}
                                    className="group block rounded-lg border border-slate-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
                                                {u.name}
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                {u.floor.floorNumber === 0
                                                    ? "Ground floor"
                                                    : `Floor ${u.floor.floorNumber}`}{" "}
                                                · {u.floor.name}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[10px]",
                                                unitStatusStyles[u.status],
                                            )}
                                        >
                                            {statusLabel(u.status)}
                                        </Badge>
                                    </div>

                                    <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[10px]",
                                                unitTypeStyles[u.type],
                                            )}
                                        >
                                            {typeLabel(u.type)}
                                        </Badge>
                                        {u.bedrooms !== null && (
                                            <span className="inline-flex items-center gap-1">
                                                <Bed size={11} /> {u.bedrooms}
                                            </span>
                                        )}
                                        {u.bathrooms !== null && (
                                            <span className="inline-flex items-center gap-1">
                                                <Bath size={11} /> {u.bathrooms}
                                            </span>
                                        )}
                                        {u.sizeSqft !== null && (
                                            <span className="inline-flex items-center gap-1">
                                                <Ruler size={11} /> {u.sizeSqft} sqft
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 flex items-baseline justify-between border-t border-slate-100 pt-2">
                                        <p className="text-sm font-semibold text-slate-900 tabular-nums">
                                            {formatMoney(u.baseRent)}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                            +{formatMoney(u.serviceCharge)} svc
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>

            {/* Create dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add unit</DialogTitle>
                        <DialogDescription>
                            Add a flat, shop, office or other unit to a floor in this building.
                        </DialogDescription>
                    </DialogHeader>
                    <UnitForm
                        mode="create"
                        fixedBuildingId={buildingId}
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
        </Card>
    );
}
