"use client";

import { BuildingForm } from "@/src/components/dashboard/buildings/BuildingForm";
import { FloorsPanel } from "@/src/components/dashboard/floors/FloorsPanel";
import { UnitsPanel } from "@/src/components/dashboard/units/UnitsPanel";
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
import { useBuilding, useDeleteBuilding, useUpdateBuilding } from "@/src/hooks/useBuildings";
import { cn } from "@/src/lib/utils";
import type { BuildingType } from "@/src/types/building.types";
import {
    ArrowLeft,
    Building2,
    Calendar,
    DoorOpen,
    Layers,
    Loader2,
    MapPin,
    Pencil,
    Trash2,
    User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const typeBadgeStyles: Record<BuildingType, string> = {
    RESIDENTIAL: "bg-indigo-50 text-indigo-700 border-indigo-200",
    COMMERCIAL: "bg-emerald-50 text-emerald-700 border-emerald-200",
    MIXED_USE: "bg-violet-50 text-violet-700 border-violet-200",
};

export default function BuildingDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const buildingId = params.id;

    const { data: building, isLoading, isError, error } = useBuilding(buildingId);
    const updateMutation = useUpdateBuilding(buildingId);
    const deleteMutation = useDeleteBuilding();

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-72 w-full" />
            </div>
        );
    }

    if (isError || !building) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <Link
                    href="/owner/dashboard/buildings"
                    className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                    <ArrowLeft size={12} />
                    Back to buildings
                </Link>
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load building
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Building not found."}
                    </p>
                </Card>
            </div>
        );
    }

    const typeLabel =
        building.type === "MIXED_USE"
            ? "Mixed Use"
            : building.type.charAt(0) + building.type.slice(1).toLowerCase();

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Back link */}
            <Link
                href="/owner/dashboard/buildings"
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
            >
                <ArrowLeft size={12} />
                All buildings
            </Link>

            {/* Hero */}
            <Card className="overflow-hidden">
                <div className="relative -mx-px -mt-4 h-44 bg-linear-to-br from-indigo-100 via-violet-100 to-fuchsia-100 sm:h-56">
                    {building.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={building.imageUrl}
                            alt={building.name}
                            className="size-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Building2 size={56} className="text-indigo-300" />
                        </div>
                    )}
                </div>

                <div className="px-6 py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900">
                                    {building.name}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={cn(typeBadgeStyles[building.type])}
                                >
                                    {typeLabel}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={
                                        building.isActive
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border-slate-200 bg-slate-50 text-slate-600"
                                    }
                                >
                                    {building.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>

                            <p className="mt-1.5 text-sm text-slate-500">
                                <MapPin size={12} className="mr-1 inline" />
                                {building.address}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                                <span>
                                    <span className="font-medium text-slate-700">City:</span>{" "}
                                    {building.city}
                                </span>
                                {building.area && (
                                    <span>
                                        <span className="font-medium text-slate-700">Area:</span>{" "}
                                        {building.area}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1">
                                    <Calendar size={11} />
                                    Created {new Date(building.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditOpen(true)}
                            >
                                <Pencil size={13} />
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteOpen(true)}
                            >
                                <Trash2 size={13} />
                                Delete
                            </Button>
                        </div>
                    </div>

                    {building.description && (
                        <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
                            {building.description}
                        </p>
                    )}
                </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatTile
                    icon={Layers}
                    label="Total Floors"
                    value={building.totalFloors}
                    accent="indigo"
                />
                <StatTile
                    icon={Layers}
                    label="Floors Added"
                    value={building.floors.length}
                    accent="violet"
                />
                <StatTile
                    icon={DoorOpen}
                    label="Units"
                    value={building.units.length}
                    accent="emerald"
                />
                <StatTile
                    icon={User}
                    label="Managers"
                    value={building.managers.length}
                    accent="amber"
                />
            </div>

            {/* Floors + Caretaker */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Floors */}
                <FloorsPanel
                    buildingId={building.id}
                    totalFloors={building.totalFloors}
                />

                {/* Caretaker */}
                <Card className="px-6">
                    <CardHeader className="px-0">
                        <CardTitle>Caretaker</CardTitle>
                        <CardDescription>On-site contact for tenants</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        {building.caretaker ? (
                            <div className="flex items-start gap-3">
                                <span className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                                    {building.caretaker.name
                                        .split(" ")
                                        .filter(Boolean)
                                        .map((p) => p[0])
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-800">
                                        {building.caretaker.name}
                                    </p>
                                    {building.caretaker.email && (
                                        <p className="truncate text-xs text-slate-500">
                                            {building.caretaker.email}
                                        </p>
                                    )}
                                    {building.caretaker.contactNumber && (
                                        <p className="text-xs text-slate-500">
                                            {building.caretaker.contactNumber}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center">
                                <User className="mx-auto text-slate-300" size={22} />
                                <p className="mt-2 text-sm text-slate-500">
                                    No caretaker assigned
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Units */}
            <UnitsPanel buildingId={building.id} />

            {/* Edit dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit building</DialogTitle>
                        <DialogDescription>
                            Update details for {building.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <BuildingForm
                        submitting={updateMutation.isPending}
                        submitLabel="Save changes"
                        defaultValues={{
                            name: building.name,
                            type: building.type,
                            address: building.address,
                            city: building.city,
                            area: building.area ?? "",
                            totalFloors: building.totalFloors,
                            description: building.description ?? "",
                            imageUrl: building.imageUrl ?? "",
                        }}
                        onCancel={() => setEditOpen(false)}
                        onSubmit={(payload) => {
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
                        <AlertDialogTitle>Delete this building?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{building.name}</strong>.
                            Floors, units and lease history attached to it may also be affected.
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
                                deleteMutation.mutate(building.id, {
                                    onSuccess: () => {
                                        setDeleteOpen(false);
                                        router.push("/owner/dashboard/buildings");
                                    },
                                });
                            }}
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete building"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function StatTile({
    icon: Icon,
    label,
    value,
    accent,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: number;
    accent: "indigo" | "violet" | "emerald" | "amber";
}) {
    const accents: Record<typeof accent, string> = {
        indigo: "bg-indigo-50 text-indigo-600",
        violet: "bg-violet-50 text-violet-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
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
