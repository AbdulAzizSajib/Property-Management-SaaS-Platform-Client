"use client";

// src/components/dashboard/floors/FloorsPanel.tsx

import { FloorForm, type FloorFormValues } from "@/src/components/dashboard/floors/FloorForm";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
    useCreateFloor,
    useDeleteFloor,
    useFloorsByBuilding,
    useUpdateFloor,
} from "@/src/hooks/useFloors";
import { fmtNum } from "@/src/lib/numerals";
import type { FloorListItem } from "@/src/types/floor.types";
import {
    DoorOpen,
    Layers,
    Loader2,
    MoreHorizontal,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { useState } from "react";

interface FloorsPanelProps {
    buildingId: string;
    totalFloors: number;
}

export function FloorsPanel({ buildingId, totalFloors }: FloorsPanelProps) {
    const { data: floors, isLoading, isError, error } = useFloorsByBuilding(buildingId);
    const createMutation = useCreateFloor();

    const [createOpen, setCreateOpen] = useState(false);
    const [editing, setEditing] = useState<FloorListItem | null>(null);
    const [deleting, setDeleting] = useState<FloorListItem | null>(null);

    const nextFloorNumber =
        floors && floors.length > 0
            ? Math.max(...floors.map((f) => f.floorNumber)) + 1
            : 0;

    const sorted = floors
        ? [...floors].sort((a, b) => a.floorNumber - b.floorNumber)
        : [];

    const added = floors?.length ?? 0;
    const pct = totalFloors > 0 ? Math.min(100, (added / totalFloors) * 100) : 0;
    const complete = added >= totalFloors && totalFloors > 0;

    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper p-5 lg:col-span-2">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 ">
                <div className="min-w-0  flex-1">
                    <p className="font-serif text-[13px]  text-coral-600/85">
                        Building structure
                    </p>
                    <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                        Floors
                    </h3>

                    {/* Progress sentence + bar — replaces the bare "5 of 8" text */}
                    <div className="mt-2.5  ">
                        <div className="flex items-center justify-between  text-[12px]">
                            <span className="text-ink-soft">
                                <span className="font-semibold text-ink tabular-nums">
                                    {fmtNum(added)}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-ink tabular-nums">
                                    {fmtNum(totalFloors)}
                                </span>{" "}
                                floors added
                            </span>
                            {complete && (
                                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-jade-800">
                                    Complete
                                </span>
                            )}
                        </div>
                        <div className="mt-1.5 h-1 w-full max-w-55 overflow-hidden rounded-full bg-cream">
                            <div
                                className="h-full rounded-full bg-jade-700 transition-[width] duration-500"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] bg-sky-950 px-3 text-[12.5px] font-semibold text-paper transition-colors hover:bg-sky-950"
                >
                    <Plus size={13} />
                    Add floor
                </button>
            </div>

            {/* Body */}
            <div className="mt-4">
                {isLoading ? (
                    <ul className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-12 w-full rounded-[10px] bg-cream"
                            />
                        ))}
                    </ul>
                ) : isError ? (
                    <div className="rounded-[10px] border border-coral-100 bg-coral-50/60 px-3 py-2.5 text-[13px] text-coral-600">
                        {error instanceof Error
                            ? error.message
                            : "Couldn't load floors."}
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="rounded-[10px] border border-dashed border-rule-soft px-4 py-8 text-center">
                        <Layers
                            className="mx-auto text-ink-soft/40"
                            size={24}
                        />
                        <p className="mt-2 text-[13px] text-ink-soft">
                            No floors yet
                        </p>
                      
                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-jade-900 hover:text-coral-600 transition-colors"
                        >
                            <Plus size={12} /> Add your first floor
                        </button>
                    </div>
                ) : (
                    <ul className="divide-y divide-rule-soft">
                        {sorted.map((floor) => (
                            <FloorRow
                                key={floor.id}
                                floor={floor}
                                onEdit={() => setEditing(floor)}
                                onDelete={() => setDeleting(floor)}
                            />
                        ))}
                    </ul>
                )}
            </div>

            {/* Create dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-jade-950">
                            Add floor
                        </DialogTitle>
                        <DialogDescription className="text-ink-soft">
                            Floors are numbered from 0 (ground) upward.
                        </DialogDescription>
                    </DialogHeader>
                    <FloorForm
                        submitting={createMutation.isPending}
                        submitLabel="Add floor"
                        defaultValues={{ name: "", floorNumber: nextFloorNumber }}
                        onCancel={() => setCreateOpen(false)}
                        onSubmit={(values) => {
                            createMutation.mutate(
                                { ...values, buildingId },
                                { onSuccess: () => setCreateOpen(false) },
                            );
                        }}
                    />
                </DialogContent>
            </Dialog>

            <EditFloorDialog
                floor={editing}
                buildingId={buildingId}
                onClose={() => setEditing(null)}
            />

            <DeleteFloorDialog
                floor={deleting}
                buildingId={buildingId}
                onClose={() => setDeleting(null)}
            />
        </div>
    );
}

function FloorRow({
    floor,
    onEdit,
    onDelete,
}: {
    floor: FloorListItem;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const isGround = floor.floorNumber === 0;

    return (
        <li className="group flex items-center gap-3 py-3 first:pt-2 last:pb-1">
            {/* Floor badge — coral dot below if ground floor */}
            <div className="relative flex shrink-0 flex-col items-center">
                <span className="flex size-9 items-center justify-center rounded-[9px] bg-jade-50 text-[12.5px] font-bold text-jade-800 tabular-nums">
                    {isGround ? "G" : floor.floorNumber}
                </span>
                {isGround && (
                    <span
                        aria-hidden
                        className="absolute -bottom-1 h-1 w-1 rounded-full bg-coral-600"
                    />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">
                    {floor.name}
                </p>
                <p className="text-[11px] text-ink-soft">
                    Floor #{fmtNum(floor.floorNumber)}
                </p>
            </div>

            <div className="hidden text-right sm:block">
                <p className="inline-flex items-center gap-1 text-[11.5px] text-ink-soft tabular-nums">
                    <DoorOpen size={11} />
                    {fmtNum(floor._count.units)}{" "}
                    {floor._count.units === 1 ? "unit" : "units"}
                </p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label="Floor actions"
                    className="inline-flex size-7 items-center justify-center rounded-md text-ink-soft/70 transition-colors hover:bg-cream hover:text-jade-900 group-hover:text-ink-soft data-[state=open]:bg-cream data-[state=open]:text-jade-900"
                >
                    <MoreHorizontal size={15} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={onEdit}>
                        <Pencil size={13} className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={onDelete}
                        className="text-coral-600 focus:bg-coral-50 focus:text-coral-600"
                    >
                        <Trash2 size={13} className="mr-2" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </li>
    );
}

function EditFloorDialog({
    floor,
    buildingId,
    onClose,
}: {
    floor: FloorListItem | null;
    buildingId: string;
    onClose: () => void;
}) {
    const update = useUpdateFloor(floor?.id ?? "", buildingId);

    return (
        <Dialog open={!!floor} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-jade-950">Edit floor</DialogTitle>
                    <DialogDescription className="text-ink-soft">
                        Update floor name or number.
                    </DialogDescription>
                </DialogHeader>
                {floor && (
                    <FloorForm
                        submitting={update.isPending}
                        submitLabel="Save changes"
                        defaultValues={{
                            name: floor.name,
                            floorNumber: floor.floorNumber,
                        }}
                        onCancel={onClose}
                        onSubmit={(values: FloorFormValues) => {
                            const payload: Partial<FloorFormValues> = {};
                            if (values.name !== floor.name) payload.name = values.name;
                            if (values.floorNumber !== floor.floorNumber)
                                payload.floorNumber = values.floorNumber;

                            if (Object.keys(payload).length === 0) {
                                onClose();
                                return;
                            }

                            update.mutate(payload, { onSuccess: onClose });
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

function DeleteFloorDialog({
    floor,
    buildingId,
    onClose,
}: {
    floor: FloorListItem | null;
    buildingId: string;
    onClose: () => void;
}) {
    const remove = useDeleteFloor(buildingId);

    return (
        <AlertDialog open={!!floor} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-jade-950">
                        Delete this floor?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-ink-soft">
                        {floor ? (
                            <>
                                This will permanently delete{" "}
                                <strong className="text-ink">{floor.name}</strong>
                                {floor._count.units > 0 && (
                                    <>
                                        {" "}
                                        and may affect{" "}
                                        <strong className="text-ink">
                                            {floor._count.units}{" "}
                                            {floor._count.units === 1 ? "unit" : "units"}
                                        </strong>
                                    </>
                                )}
                                . This action cannot be undone.
                            </>
                        ) : (
                            "This action cannot be undone."
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={remove.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={remove.isPending}
                        onClick={() => {
                            if (!floor) return;
                            remove.mutate(floor.id, { onSuccess: onClose });
                        }}
                        className="bg-coral-600 text-paper hover:bg-coral-700"
                    >
                        {remove.isPending ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Deleting…
                            </>
                        ) : (
                            "Delete floor"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}