"use client";

// src/app/owner/dashboard/units/[id]/page.tsx

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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useDeleteUnit, useUnit, useUpdateUnit } from "@/src/hooks/useUnits";
import { fmtNum } from "@/src/lib/numerals";
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
import { Link, useRouter } from "@/src/i18n/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";

const leaseStatusTone: Record<string, string> = {
    ACTIVE: "bg-jade-50 text-jade-800 border-jade-100",
    PENDING: "bg-coral-50 text-coral-600 border-coral-100",
    TERMINATED: "bg-cream text-ink-soft border-rule-soft",
    EXPIRED: "bg-cream text-ink-soft border-rule-soft",
};

export default function UnitDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const unitId = params.id;

    const { data: unit, isLoading, isError, error } = useUnit(unitId);

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
            <div className="min-h-screen bg-cream">
                <div className="mx-auto container space-y-5 p-4 sm:p-6 lg:p-8">
                    <Skeleton className="h-5 w-32 bg-paper" />
                    <Skeleton className="h-44 w-full bg-paper rounded-[18px]" />
                    <Skeleton className="h-56 w-full bg-paper rounded-[14px]" />
                </div>
            </div>
        );
    }

    if (isError || !unit) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto container p-4 sm:p-6 lg:p-8">
                    <Link
                        href="/owner/dashboard/units"
                        className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        Back to units
                    </Link>
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load unit
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Unit not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const totalMonthly = Number(unit.baseRent) + Number(unit.serviceCharge);
    const activeLeases = unit.leases.filter((l) => l.status === "ACTIVE").length;

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto container space-y-5 p-4 sm:p-6 lg:p-8">
                {/* Breadcrumb */}
                <nav className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-soft">
                    <Link
                        href="/owner/dashboard/units"
                        className="font-medium text-ink-soft transition-colors hover:text-jade-900"
                    >
                        Units
                    </Link>
                    <span className="text-ink-soft/40">/</span>
                    <Link
                        href={`/owner/dashboard/buildings/${unit.buildingId}`}
                        className="font-medium text-ink-soft transition-colors hover:text-jade-900"
                    >
                        {unit.building.name}
                    </Link>
                    <span className="text-ink-soft/40">/</span>
                    <span className="font-semibold text-ink">{unit.name}</span>
                </nav>

              
                    <div className=" flex itmes-center justify-between gap-4 ">
                        {/* LEFT — identity */}
                        <div className="px-5 flex-1 border rounded-[14px] bg-paper py-5 sm:px-6 sm:py-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-jade-950">
                                            {unit.name}
                                        </h1>
                                        <span
                                            className={cn(
                                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                                unitStatusStyles[unit.status],
                                            )}
                                        >
                                            {statusLabel(unit.status)}
                                        </span>
                                        <span
                                            className={cn(
                                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                                unitTypeStyles[unit.type],
                                            )}
                                        >
                                            {typeLabel(unit.type)}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-ink-soft">
                                        <span className="inline-flex items-center gap-1">
                                            <Building2 size={11} />
                                            {unit.building.name}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Layers size={11} />
                                            {unit.floor.floorNumber === 0
                                                ? "Ground floor"
                                                : `Floor ${fmtNum(unit.floor.floorNumber)}`}
                                            {" · "}
                                            {unit.floor.name}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar size={11} />
                                            Added{" "}
                                            {new Date(unit.createdAt).toLocaleDateString()}
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

                            {unit.description && (
                                <p className="mt-4 rounded-[10px] border-l-[2.5px] border-coral-500 bg-cream/70 px-3 py-2 text-[13.5px] text-ink">
                                    {unit.description}
                                </p>
                            )}
                        </div>

                        {/* RIGHT — the money panel (jade-950, like dashboard HeroKpi) */}
                        <div
                            className="relative w-1/3 overflow-hidden rounded-md bg-jade-800 px-5 py-5 text-paper sm:px-6 sm:py-6"
                            aria-label="Monthly rent summary"
                        >
                            <div
                                aria-hidden
                                className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-50"
                                style={{
                                    background:
                                        "radial-gradient(circle, rgba(255,123,87,0.35), transparent 65%)",
                                }}
                            />

                            <p className="relative font-serif text-[13px]  text-white">
                                Total monthly rent
                            </p>
                         
                            <p className="relative mt-3 text-[36px] font-bold leading-none tracking-[-0.025em] tabular-nums sm:text-[40px]">
                                {formatMoney(totalMonthly)}
                            </p>

                            <div className="relative mt-4 grid grid-cols-2 gap-3 border-t border-paper/10 pt-4 text-[12px]">
                                <div>
                                    <p className="">Base rent</p>
                                    <p className="mt-0.5 font-semibold tabular-nums">
                                        {formatMoney(unit.baseRent)}
                                    </p>
                                </div>
                                <div>
                                    <p className="">Service charge</p>
                                    <p className="mt-0.5 font-semibold tabular-nums">
                                        {Number(unit.serviceCharge) > 0
                                            ? formatMoney(unit.serviceCharge)
                                            : "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-md bg-paper/10 px-2 py-1 text-[11px] font-medium">
                                <FileText size={11} />
                                <span className="tabular-nums">
                                    {fmtNum(activeLeases)}
                                </span>
                                <span className="text-paper/65">
                                    active{" "}
                                    {activeLeases === 1 ? "lease" : "leases"} of{" "}
                                    {fmtNum(unit.leases.length)} total
                                </span>
                            </div>
                        </div>
                    </div>
               

                {/* Specs + Leases */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Specs */}
                    <div className="rounded-[14px] border border-rule-soft bg-paper p-5 lg:col-span-1">
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Physical attributes
                        </p>
                        <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                            Specifications
                        </h3>

                        <ul className="mt-4 divide-y divide-rule-soft">
                            <SpecRow
                                icon={Bed}
                                label="Bedrooms"
                                bn="শোবার ঘর"
                                value={
                                    unit.bedrooms !== null
                                        ? fmtNum(unit.bedrooms)
                                        : "—"
                                }
                            />
                            <SpecRow
                                icon={Bath}
                                label="Bathrooms"
                                bn="বাথরুম"
                                value={
                                    unit.bathrooms !== null
                                        ? fmtNum(unit.bathrooms)
                                        : "—"
                                }
                            />
                            <SpecRow
                                icon={Ruler}
                                label="Size"
                                bn="আয়তন"
                                value={
                                    unit.sizeSqft !== null
                                        ? `${fmtNum(unit.sizeSqft)} sqft`
                                        : "—"
                                }
                            />
                            <SpecRow
                                icon={DoorOpen}
                                label="Type"
                                bn="ধরন"
                                value={typeLabel(unit.type)}
                            />
                        </ul>
                    </div>

                    {/* Lease history */}
                    <div className="rounded-[14px] border border-rule-soft bg-paper p-5 lg:col-span-2">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="font-serif text-[13px] italic text-coral-600/85">
                                    Tenant history
                                </p>
                                <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                                    Leases
                                </h3>
                                <p className="mt-1 text-[12px] text-ink-soft">
                                    {unit.leases.length === 0
                                        ? "No leases recorded yet"
                                        : `${fmtNum(unit.leases.length)} lease${unit.leases.length === 1 ? "" : "s"} on record`}
                                </p>
                            </div>
                            {unit.leases.length > 0 && (
                                <Link
                                    href={`/owner/dashboard/leases?unitId=${unit.id}`}
                                    className="text-[12.5px] font-medium text-jade-900 hover:text-coral-600 transition-colors"
                                >
                                    View all →
                                </Link>
                            )}
                        </div>

                        <div className="mt-4">
                            {unit.leases.length === 0 ? (
                                <div className="rounded-[10px] border border-dashed border-rule-soft px-4 py-8 text-center">
                                    <FileText
                                        className="mx-auto text-ink-soft/40"
                                        size={24}
                                    />
                                    <p className="mt-2 text-[13px] text-ink-soft">
                                        No lease history
                                    </p>
                                   
                                    {unit.status === "VACANT" && (
                                        <Link
                                            href={`/owner/dashboard/leases?unitId=${unit.id}`}
                                            className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-jade-900 hover:text-coral-600 transition-colors"
                                        >
                                            Create a lease →
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <ul className="divide-y divide-rule-soft">
                                    {unit.leases.map((lease) => (
                                        <li
                                            key={lease.id}
                                            className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-[13.5px] font-semibold text-ink">
                                                    Lease #
                                                    {lease.id.slice(-6).toUpperCase()}
                                                </p>
                                                <p className="text-[11.5px] text-ink-soft tabular-nums">
                                                    {new Date(
                                                        lease.startDate,
                                                    ).toLocaleDateString()}{" "}
                                                    –{" "}
                                                    {new Date(
                                                        lease.endDate,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-right">
                                                <p className="text-[14px] font-semibold text-jade-950 tabular-nums">
                                                    {formatMoney(lease.monthlyRent)}
                                                </p>
                                                <span
                                                    className={cn(
                                                        "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                                        leaseStatusTone[lease.status] ??
                                                            leaseStatusTone.TERMINATED,
                                                    )}
                                                >
                                                    {lease.status}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit dialog */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-jade-950">
                                Edit unit
                            </DialogTitle>
                            <DialogDescription className="text-ink-soft">
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
                                if (values.type !== unit.type)
                                    payload.type = values.type;
                                if (values.status !== unit.status)
                                    payload.status = values.status;

                                const baseRentNum = Number(values.baseRent);
                                if (baseRentNum !== Number(unit.baseRent)) {
                                    payload.baseRent = baseRentNum;
                                }
                                const serviceChargeNum = Number(
                                    values.serviceCharge || 0,
                                );
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
                            <AlertDialogTitle className="text-jade-950">
                                Delete this unit?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-ink-soft">
                                This will permanently delete{" "}
                                <strong className="text-ink">{unit.name}</strong>.
                                {unit.leases.length > 0 && (
                                    <>
                                        {" "}
                                        There{" "}
                                        {unit.leases.length === 1 ? "is" : "are"}{" "}
                                        <strong className="text-ink">
                                            {fmtNum(unit.leases.length)} lease
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
                                                router.push(
                                                    "/owner/dashboard/units",
                                                );
                                            },
                                        },
                                    );
                                }}
                                className="bg-coral-600 text-paper hover:bg-coral-700"
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Deleting…
                                    </>
                                ) : (
                                    "Delete unit"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

function SpecRow({
    icon: Icon,
    label,
    bn,
    value,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    bn: string;
    value: string;
}) {
    return (
        <li className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <span className="inline-flex items-center gap-2.5">
                <Icon size={14} className="text-ink-soft/60" />
                <span>
                    <span className="block text-[13px] text-ink">{label}</span>
                    <span className="font-bangla block text-[10.5px] text-ink-soft/70 leading-tight">
                        {bn}
                    </span>
                </span>
            </span>
            <span className="text-[13.5px] font-semibold text-jade-950 tabular-nums">
                {value}
            </span>
        </li>
    );
}