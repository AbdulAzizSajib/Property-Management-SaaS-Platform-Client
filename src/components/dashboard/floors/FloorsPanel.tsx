"use client";

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
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
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

    // Suggest the next floor number when adding (max + 1, or 0 if empty)
    const nextFloorNumber = floors && floors.length > 0
        ? Math.max(...floors.map((f) => f.floorNumber)) + 1
        : 0;

    const sorted = floors ? [...floors].sort((a, b) => a.floorNumber - b.floorNumber) : [];

    return (
        <Card className="px-6 lg:col-span-2">
            <CardHeader className="px-0">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle>Floors</CardTitle>
                        <CardDescription>
                            {floors?.length ?? 0} of {totalFloors} floors added
                        </CardDescription>
                    </div>
                    <Button size="sm" onClick={() => setCreateOpen(true)}>
                        <Plus size={13} />
                        Add Floor
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="px-0">
                {isLoading ? (
                    <ul className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </ul>
                ) : isError ? (
                    <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {error instanceof Error
                            ? error.message
                            : "Couldn't load floors."}
                    </p>
                ) : sorted.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
                        <Layers className="mx-auto text-slate-300" size={24} />
                        <p className="mt-2 text-sm text-slate-500">No floors yet</p>
                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            <Plus size={12} /> Add your first floor
                        </button>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
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
            </CardContent>

            {/* Create dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add floor</DialogTitle>
                        <DialogDescription>
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

            {/* Edit dialog */}
            <EditFloorDialog
                floor={editing}
                buildingId={buildingId}
                onClose={() => setEditing(null)}
            />

            {/* Delete confirmation */}
            <DeleteFloorDialog
                floor={deleting}
                buildingId={buildingId}
                onClose={() => setDeleting(null)}
            />
        </Card>
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
    return (
        <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-semibold text-indigo-700">
                {floor.floorNumber === 0 ? "G" : floor.floorNumber}
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{floor.name}</p>
                <p className="text-[11px] text-slate-500">
                    Floor #{floor.floorNumber}
                </p>
            </div>
            <div className="hidden text-right sm:block">
                <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <DoorOpen size={11} />
                    {floor._count.units} {floor._count.units === 1 ? "unit" : "units"}
                </p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label="Floor actions"
                    className="inline-flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                >
                    <MoreHorizontal size={15} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={onEdit}>
                        <Pencil size={13} className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={onDelete}>
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
    // Hooks must run unconditionally — guard the mutation call instead.
    const update = useUpdateFloor(floor?.id ?? "", buildingId);

    return (
        <Dialog open={!!floor} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit floor</DialogTitle>
                    <DialogDescription>
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

                            // No changes — just close.
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
                    <AlertDialogTitle>Delete this floor?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {floor ? (
                            <>
                                This will permanently delete{" "}
                                <strong>{floor.name}</strong>
                                {floor._count.units > 0 && (
                                    <>
                                        {" "}
                                        and may affect{" "}
                                        <strong>
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
                    <AlertDialogCancel disabled={remove.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={remove.isPending}
                        onClick={() => {
                            if (!floor) return;
                            remove.mutate(floor.id, { onSuccess: onClose });
                        }}
                    >
                        {remove.isPending ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Deleting...
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
