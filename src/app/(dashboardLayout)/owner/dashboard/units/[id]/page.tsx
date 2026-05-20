"use client";

import { UnitForm } from "@/src/components/dashboard/units/UnitForm";
import {
    formatMoney,
    statusLabel,
    typeLabel,
    unitStatusStyles,
    unitTypeStyles,
} from "@/src/components/dashboard/units/unitStyles";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
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
import { useDeleteUnit, useUnit, useUpdateUnit } from "@/src/hooks/useUnits";
import { cn } from "@/src/lib/utils";
import type { UpdateUnitPayload } from "@/src/types/unit.types";
import {
    ArrowLeft,
    Bath,
    Bed,
    Building2,
    Calendar,
    DoorOpen,
    FileText,
    Layers,
    Loader2,
    Pencil,
    Ruler,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function UnitDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const unitId = params.id;

    const { data: unit, isLoading, isError, error } = useUnit(unitId);

    // Hooks must be called unconditionally — feed them sentinel values when unit is undefined.
    const updateMutation = useUpdateUnit(
        unitId,
        unit?.buildingId ?? "",
        unit?.floorId ?? "",
    );
    const deleteMutation = useDeleteUnit();

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-44 w-full" />
                <div className="grid gap-4 sm:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError || !unit) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <Link
                    href="/owner/dashboard/units"
                    className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                    <ArrowLeft size={12} />
                    Back to units
                </Link>
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load unit
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Unit not found."}
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <Link
                    href="/owner/dashboard/units"
                    className="font-medium text-slate-500 hover:text-slate-700"
                >
                    Units
                </Link>
                <span>/</span>
                <Link
                    href={`/owner/dashboard/buildings/${unit.buildingId}`}
                    className="font-medium text-slate-500 hover:text-slate-700"
                >
                    {unit.building.name}
                </Link>
                <span>/</span>
                <span className="font-medium text-slate-700">{unit.name}</span>
            </div>

            {/* Hero */}
            <Card className="px-6 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                {unit.name}
                            </h1>
                            <Badge
                                variant="outline"
                                className={cn(unitStatusStyles[unit.status])}
                            >
                                {statusLabel(unit.status)}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={cn(unitTypeStyles[unit.type])}
                            >
                                {typeLabel(unit.type)}
                            </Badge>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                                <Building2 size={11} />
                                {unit.building.name}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Layers size={11} />
                                {unit.floor.floorNumber === 0
                                    ? "Ground floor"
                                    : `Floor ${unit.floor.floorNumber}`}{" "}
                                · {unit.floor.name}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Calendar size={11} />
                                Added {new Date(unit.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditOpen(true)}
                        >
                            <Pencil size={13} /> Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 size={13} /> Delete
                        </Button>
                    </div>
                </div>

                {unit.description && (
                    <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        {unit.description}
                    </p>
                )}
            </Card>

            {/* Money KPIs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MoneyTile
                    label="Base rent"
                    value={formatMoney(unit.baseRent)}
                    sublabel="/month"
                    accent="emerald"
                />
                <MoneyTile
                    label="Service charge"
                    value={formatMoney(unit.serviceCharge)}
                    sublabel="/month"
                    accent="amber"
                />
                <MoneyTile
                    label="Total monthly"
                    value={formatMoney(
                        Number(unit.baseRent) + Number(unit.serviceCharge),
                    )}
                    sublabel="rent + service"
                    accent="indigo"
                />
                <MoneyTile
                    label="Active leases"
                    value={String(
                        unit.leases.filter((l) => l.status === "ACTIVE").length,
                    )}
                    sublabel={`of ${unit.leases.length} total`}
                    accent="violet"
                />
            </div>

            {/* Specs + Leases */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="px-6 lg:col-span-1">
                    <CardHeader className="px-0">
                        <CardTitle>Specifications</CardTitle>
                        <CardDescription>Physical attributes of this unit</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <ul className="divide-y divide-slate-100">
                            <SpecRow
                                icon={Bed}
                                label="Bedrooms"
                                value={unit.bedrooms !== null ? String(unit.bedrooms) : "—"}
                            />
                            <SpecRow
                                icon={Bath}
                                label="Bathrooms"
                                value={
                                    unit.bathrooms !== null ? String(unit.bathrooms) : "—"
                                }
                            />
                            <SpecRow
                                icon={Ruler}
                                label="Size"
                                value={
                                    unit.sizeSqft !== null ? `${unit.sizeSqft} sqft` : "—"
                                }
                            />
                            <SpecRow icon={DoorOpen} label="Type" value={typeLabel(unit.type)} />
                        </ul>
                    </CardContent>
                </Card>

                <Card className="px-6 lg:col-span-2">
                    <CardHeader className="px-0">
                        <CardTitle>Lease history</CardTitle>
                        <CardDescription>
                            {unit.leases.length === 0
                                ? "No leases recorded yet"
                                : `${unit.leases.length} lease${unit.leases.length === 1 ? "" : "s"} on record`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        {unit.leases.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
                                <FileText className="mx-auto text-slate-300" size={24} />
                                <p className="mt-2 text-sm text-slate-500">
                                    No lease history
                                </p>
                                {unit.status === "VACANT" && (
                                    <Link
                                        href={`/owner/dashboard/leases?unitId=${unit.id}`}
                                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                        Create a lease →
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {unit.leases.map((lease) => (
                                    <li
                                        key={lease.id}
                                        className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-800">
                                                Lease #{lease.id.slice(-6).toUpperCase()}
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                {new Date(lease.startDate).toLocaleDateString()}{" "}
                                                – {new Date(lease.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900 tabular-nums">
                                                {formatMoney(lease.monthlyRent)}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="text-[10px]"
                                            >
                                                {lease.status}
                                            </Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit unit</DialogTitle>
                        <DialogDescription>
                            Update details for unit {unit.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <UnitForm
                        mode="edit"
                        fixedBuildingId={unit.buildingId}
                        submitting={updateMutation.isPending}
                        submitLabel="Save changes"
                        defaultValues={{
                            buildingId: unit.buildingId,
                            floorId: unit.floorId,
                            name: unit.name,
                            type: unit.type,
                            status: unit.status,
                            bedrooms: unit.bedrooms !== null ? String(unit.bedrooms) : "",
                            bathrooms: unit.bathrooms !== null ? String(unit.bathrooms) : "",
                            sizeSqft: unit.sizeSqft !== null ? String(unit.sizeSqft) : "",
                            baseRent: unit.baseRent,
                            serviceCharge: unit.serviceCharge,
                            description: unit.description ?? "",
                        }}
                        onCancel={() => setEditOpen(false)}
                        onSubmit={(values) => {
                            const payload: UpdateUnitPayload = {};

                            if (values.name.trim() !== unit.name) {
                                payload.name = values.name.trim();
                            }
                            if (values.type !== unit.type) payload.type = values.type;
                            if (values.status !== unit.status) payload.status = values.status;

                            const bedroomsNum =
                                values.bedrooms === "" ? null : Number(values.bedrooms);
                            if (bedroomsNum !== unit.bedrooms) {
                                payload.bedrooms = bedroomsNum;
                            }

                            const bathroomsNum =
                                values.bathrooms === "" ? null : Number(values.bathrooms);
                            if (bathroomsNum !== unit.bathrooms) {
                                payload.bathrooms = bathroomsNum;
                            }

                            const sizeNum =
                                values.sizeSqft === "" ? null : Number(values.sizeSqft);
                            if (sizeNum !== unit.sizeSqft) payload.sizeSqft = sizeNum;

                            const baseRentNum = Number(values.baseRent);
                            if (baseRentNum !== Number(unit.baseRent)) {
                                payload.baseRent = baseRentNum;
                            }
                            const serviceChargeNum = Number(values.serviceCharge);
                            if (serviceChargeNum !== Number(unit.serviceCharge)) {
                                payload.serviceCharge = serviceChargeNum;
                            }

                            const desc = values.description.trim();
                            const currentDesc = unit.description ?? "";
                            if (desc !== currentDesc) {
                                payload.description = desc || null;
                            }

                            if (Object.keys(payload).length === 0) {
                                setEditOpen(false);
                                return;
                            }

                            updateMutation.mutate(payload, {
                                onSuccess: () => setEditOpen(false),
                            });
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete confirmation */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this unit?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{unit.name}</strong>.
                            {unit.leases.length > 0 && (
                                <>
                                    {" "}
                                    There {unit.leases.length === 1 ? "is" : "are"}{" "}
                                    <strong>
                                        {unit.leases.length} lease
                                        {unit.leases.length === 1 ? "" : "s"}
                                    </strong>{" "}
                                    on record for this unit.
                                </>
                            )}{" "}
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                                deleteMutation.mutate(
                                    {
                                        unitId: unit.id,
                                        buildingId: unit.buildingId,
                                        floorId: unit.floorId,
                                    },
                                    {
                                        onSuccess: () => {
                                            setDeleteOpen(false);
                                            router.push("/owner/dashboard/units");
                                        },
                                    },
                                );
                            }}
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete unit"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function MoneyTile({
    label,
    value,
    sublabel,
    accent,
}: {
    label: string;
    value: string;
    sublabel: string;
    accent: "emerald" | "amber" | "indigo" | "violet";
}) {
    const accents: Record<typeof accent, string> = {
        emerald: "bg-emerald-50 text-emerald-700",
        amber: "bg-amber-50 text-amber-700",
        indigo: "bg-indigo-50 text-indigo-700",
        violet: "bg-violet-50 text-violet-700",
    };

    return (
        <Card className="px-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {label}
            </p>
            <p className="mt-1.5 text-xl font-semibold text-slate-900 tabular-nums">
                {value}
            </p>
            <span
                className={cn(
                    "mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                    accents[accent],
                )}
            >
                {sublabel}
            </span>
        </Card>
    );
}

function SpecRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <li className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                <Icon size={14} className="text-slate-400" />
                {label}
            </span>
            <span className="text-sm font-medium text-slate-900">{value}</span>
        </li>
    );
}
