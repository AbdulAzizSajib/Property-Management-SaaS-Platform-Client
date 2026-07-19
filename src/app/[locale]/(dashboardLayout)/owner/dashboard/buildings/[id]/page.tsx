"use client";

// src/app/owner/dashboard/buildings/[id]/page.tsx

import { BuildingForm } from "@/src/components/dashboard/buildings/BuildingForm";
import {
    typeBadgeStyles,
    typeLabel,
    statusBadgeStyles,
} from "@/src/components/dashboard/buildings/building-helpers";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
    useBuilding,
    useDeleteBuilding,
    useUpdateBuilding,
} from "@/src/hooks/useBuildings";
import { cn } from "@/src/lib/utils";
import { fmtNum } from "@/src/lib/numerals";
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
import { Link, useRouter } from "@/src/i18n/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";

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
            <div className="min-h-screen bg-cream">
                <div className="mx-auto container space-y-5 p-4 sm:p-6 lg:p-8">
                    <Skeleton className="h-9 w-32 bg-paper" />
                    <Skeleton className="h-56 w-full bg-paper" />
                    <Skeleton className="h-72 w-full bg-paper" />
                </div>
            </div>
        );
    }

    if (isError || !building) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto container p-4 sm:p-6 lg:p-8">
                    <Link
                        href="/owner/dashboard/buildings"
                        className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        Back to buildings
                    </Link>
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/50 px-5 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load building
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Building not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto container space-y-5 p-4 sm:p-6 lg:p-8">
                {/* Back link */}
                <Link
                    href="/owner/dashboard/buildings"
                    className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-jade-900"
                >
                    <ArrowLeft size={12} />
                    All buildings
                </Link>

                {/* HERO — brand-aligned, replaces the indigo→violet→fuchsia gradient */}
                <div
                    className="overflow-hidden rounded-[18px] border border-rule-soft bg-paper"
                    style={{
                        boxShadow:
                            "0 1px 0 rgba(255,255,255,0.6) inset, 0 14px 36px -22px rgba(10,46,34,0.22)",
                    }}
                >
                    <div className="px-5 py-4 sm:px-6 sm:py-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="truncate text-[26px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[28px]">
                                        {building.name}
                                    </h1>
                                    <span
                                        className={cn(
                                            "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                            typeBadgeStyles[building.type],
                                        )}
                                    >
                                        {typeLabel(building.type)}
                                    </span>
                                    <span
                                        className={cn(
                                            "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                            statusBadgeStyles(building.isActive),
                                        )}
                                    >
                                        {building.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <p className="mt-2 text-[13.5px] text-ink-soft">
                                    <MapPin
                                        size={12}
                                        className="mr-1 inline -translate-y-px"
                                    />
                                    {building.address}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-ink-soft">
                                    <span>
                                        <span className="font-semibold text-ink">
                                            City:
                                        </span>{" "}
                                        {building.city}
                                    </span>
                                    {building.area && (
                                        <span>
                                            <span className="font-semibold text-ink">
                                                Area:
                                            </span>{" "}
                                            {building.area}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1">
                                        <Calendar size={11} />
                                        Created{" "}
                                        {new Date(
                                            building.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditOpen(true)}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-rule-soft bg-paper px-3 text-[12.5px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
                                >
                                    <Pencil size={12} />
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteOpen(true)}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-coral-100 bg-coral-50 px-3 text-[12.5px] font-semibold text-coral-600 transition-colors hover:bg-coral-100"
                                >
                                    <Trash2 size={12} />
                                    Delete
                                </button>
                            </div>
                        </div>

                        {building.description && (
                            <p className="mt-3 rounded-[10px] border-l-[2.5px] border-coral-500 bg-cream/70 px-3 py-2 text-[13.5px] text-ink">
                                {building.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Stats — no rainbow, single brand row */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatTile
                        icon={Layers}
                        label="Total floors"
                        value={building.totalFloors}
                    />
                    <StatTile
                        icon={Layers}
                        label="Floors added"
                        value={building.floors.length}
                    />
                    <StatTile
                        icon={DoorOpen}
                        label="Units"
                      
                        value={building.units.length}
                    />
                    <StatTile
                        icon={User}
                        label="Managers"
                      
                        value={building.managers.length}
                    />
                </div>

                {/* Floors + Caretaker */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <FloorsPanel
                        buildingId={building.id}
                        totalFloors={building.totalFloors}
                    />

                    <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
                        <p className="font-serif text-[13px]  text-coral-600/85">
                            On-site contact
                        </p>
                        <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                            Caretaker
                        </h3>

                        {building.caretaker ? (
                            <div className="mt-4 flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-jade-50 text-[12.5px] font-bold text-jade-800">
                                    {building.caretaker.name
                                        .split(" ")
                                        .filter(Boolean)
                                        .map((p) => p[0])
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-[14px] font-semibold text-ink">
                                        {building.caretaker.name}
                                    </p>
                                    {building.caretaker.email && (
                                        <p className="truncate text-[12px] text-ink-soft">
                                            {building.caretaker.email}
                                        </p>
                                    )}
                                    {building.caretaker.contactNumber && (
                                        <p className="text-[12px] text-ink-soft tabular-nums">
                                            {building.caretaker.contactNumber}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 rounded-[10px] border border-dashed border-rule-soft px-4 py-6 text-center">
                                <User
                                    className="mx-auto text-ink-soft/40"
                                    size={22}
                                />
                                <p className="mt-2 text-[13px] text-ink-soft">
                                    No caretaker assigned
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Units */}
                <UnitsPanel buildingId={building.id} />

                {/* Edit dialog */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-jade-950">
                                Edit building
                            </DialogTitle>
                            <DialogDescription className="text-ink-soft">
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
                            <AlertDialogTitle className="text-jade-950">
                                Delete this building?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-ink-soft">
                                This will permanently delete{" "}
                                <strong className="text-ink">
                                    {building.name}
                                </strong>
                                . Floors, units and lease history attached to it may
                                also be affected. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleteMutation.isPending}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                disabled={deleteMutation.isPending}
                                onClick={() => {
                                    deleteMutation.mutate(building.id, {
                                        onSuccess: () => {
                                            setDeleteOpen(false);
                                            router.push(
                                                "/owner/dashboard/buildings",
                                            );
                                        },
                                    });
                                }}
                                className="bg-coral-600 hover:bg-coral-700 text-paper"
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <Loader2
                                            size={14}
                                            className="animate-spin"
                                        />
                                        Deleting…
                                    </>
                                ) : (
                                    "Delete building"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

function StatTile({
    icon: Icon,
    label,
   
    value,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
   
    value: number;
}) {
    return (
        <div className="rounded-[12px] border border-rule-soft bg-paper px-4 py-3">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                        {label}
                    </p>
                </div>
                <Icon size={14} className="text-ink-soft/60 shrink-0" />
            </div>
            <p className="mt-1.5 text-[24px] font-bold tracking-[-0.025em] text-jade-950 tabular-nums leading-none">
                {fmtNum(value)}
            </p>
        </div>
    );
}