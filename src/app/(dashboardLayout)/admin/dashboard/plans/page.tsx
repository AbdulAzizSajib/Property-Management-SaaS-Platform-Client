"use client";

// src/app/(dashboardLayout)/admin/dashboard/plans/page.tsx
//
// Plan-config CRUD for SUPER_ADMIN. Catalog page listing every plan,
// with create / edit (dialog) and delete (alert dialog) actions.

import { PlanConfigForm } from "@/src/components/dashboard/plans/PlanConfigForm";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogPortal } from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
    useCreatePlanConfig,
    useDeletePlanConfig,
    usePlanConfigs,
    useUpdatePlanConfig,
} from "@/src/hooks/usePlanConfigs";
import { cn } from "@/src/lib/utils";
import type {
    CreatePlanConfigPayload,
    PlanConfig,
    UpdatePlanConfigPayload,
} from "@/src/types/planConfig.types";
import { PLAN_ORDER } from "@/src/types/subscription.types";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import {
    Check,
    Loader2,
    Palette,
    Pencil,
    Plus,
    Sparkles,
    Trash2,
    UsersRound,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";

const fmt = (n: number) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(n);

export default function AdminPlansPage() {
    const { data: plans, isLoading, isError, error } = usePlanConfigs();

    // Dialog state — either a plan (edit) or "new" (create) or null (closed)
    const [editing, setEditing] = useState<PlanConfig | null>(null);
    const [creating, setCreating] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<PlanConfig | null>(null);

    const createMut = useCreatePlanConfig();
    const updateMut = useUpdatePlanConfig(editing?.id ?? "");
    const deleteMut = useDeletePlanConfig();

    const sortedPlans = useMemo(() => {
        if (!plans) return [];
        const rank = (p: string) => {
            const i = PLAN_ORDER.indexOf(p as (typeof PLAN_ORDER)[number]);
            return i === -1 ? PLAN_ORDER.length : i;
        };
        return [...plans].sort((a, b) => rank(a.plan) - rank(b.plan));
    }, [plans]);

    const closeForm = () => {
        setEditing(null);
        setCreating(false);
    };

    const handleFormSubmit = (
        payload: CreatePlanConfigPayload | UpdatePlanConfigPayload,
        mode: "create" | "edit",
    ) => {
        if (mode === "create") {
            createMut.mutate(payload as CreatePlanConfigPayload, {
                onSuccess: () => closeForm(),
            });
        } else if (editing) {
            updateMut.mutate(payload as UpdatePlanConfigPayload, {
                onSuccess: () => closeForm(),
            });
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteMut.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1240px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Header */}
                <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Pricing catalog
                        </p>
                        <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            Plans
                        </h1>
                        <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                            সাবস্ক্রিপশন প্ল্যান কনফিগারেশন পরিচালনা করুন।
                        </p>
                    </div>
                    <Button
                        onClick={() => setCreating(true)}
                        className="bg-jade-900 text-paper hover:bg-jade-950"
                    >
                        <Plus size={14} />
                        New plan
                    </Button>
                </header>

                {/* States */}
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-[420px] rounded-[14px] bg-paper"
                            />
                        ))}
                    </div>
                ) : isError ? (
                    <ErrorBlock message={errorMessage(error)} />
                ) : sortedPlans.length === 0 ? (
                    <EmptyBlock onCreate={() => setCreating(true)} />
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {sortedPlans.map((p) => (
                            <PlanCard
                                key={p.id}
                                plan={p}
                                onEdit={() => setEditing(p)}
                                onDelete={() => setDeleteTarget(p)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create / edit dialog */}
            <Dialog
                open={creating || editing !== null}
                onOpenChange={(open) => {
                    if (!open) closeForm();
                }}
            >
                <DialogPortal>
                    <DialogPrimitive.Backdrop className="fixed inset-0 isolate z-50 bg-black/20 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
                    <DialogPrimitive.Popup
                        className={cn(
                            "fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2",
                            "overflow-hidden rounded-xl border border-rule-soft bg-paper shadow-2xl outline-none",
                            "sm:max-w-2xl data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                        )}
                    >
                        <DialogPrimitive.Title className="sr-only">
                            {editing ? "Edit plan" : "Create plan"}
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Description className="sr-only">
                            Configure a subscription plan that organizations can
                            subscribe to.
                        </DialogPrimitive.Description>
                        <PlanConfigForm
                            initial={editing ?? undefined}
                            submitting={
                                createMut.isPending || updateMut.isPending
                            }
                            onCancel={closeForm}
                            onSubmit={handleFormSubmit}
                        />
                    </DialogPrimitive.Popup>
                </DialogPortal>
            </Dialog>

            {/* Delete confirmation */}
            <AlertDialog
                open={deleteTarget !== null}
                onOpenChange={(open) => {
                    if (!open && !deleteMut.isPending) setDeleteTarget(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteTarget && (
                                <>
                                    <span className="block">
                                        <span className="font-semibold text-ink">
                                            {deleteTarget.displayName}
                                        </span>{" "}
                                        <span className="text-ink-soft">
                                            ({deleteTarget.plan})
                                        </span>
                                    </span>
                                    <span className="mt-1 block text-[12.5px] text-ink-soft">
                                        Server will reject this if any active
                                        subscription references the plan, or if
                                        it is the FREE_TRIAL preset. Prefer{" "}
                                        <em>disable</em> over hard delete to
                                        soft-hide it from public pricing.
                                    </span>
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            variant="outline"
                            disabled={deleteMut.isPending}
                            onClick={() => setDeleteTarget(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleteMut.isPending}
                            onClick={confirmDelete}
                        >
                            {deleteMut.isPending ? (
                                <>
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                    Deleting…
                                </>
                            ) : (
                                <>
                                    <Trash2 size={14} />
                                    Delete plan
                                </>
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// ─── pieces ──────────────────────────────────────────────────────

function PlanCard({
    plan,
    onEdit,
    onDelete,
}: {
    plan: PlanConfig;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const price = parseFloat(plan.priceMonthly) || 0;
    const featureCount = plan.features.length;

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-[14px] border bg-paper p-5 transition-all",
                plan.isPopular
                    ? "border-coral-100 shadow-[0_20px_50px_-30px_rgba(232,93,68,0.35)]"
                    : "border-rule-soft",
                !plan.isActive && "opacity-75",
            )}
        >
            {plan.isPopular && (
                <span className="absolute -top-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-coral-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-paper shadow-[0_4px_12px_-4px_rgba(232,93,68,0.6)]">
                    <Sparkles size={9} />
                    Popular
                </span>
            )}

            {/* Status row */}
            <div className="mb-3 flex items-center justify-between">
                <span className="rounded-md bg-jade-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-jade-800">
                    {plan.plan.replace("_", " ")}
                </span>
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        plan.isActive
                            ? "border-jade-100 bg-jade-50/60 text-jade-700"
                            : "border-rule-soft bg-cream text-ink-soft",
                    )}
                >
                    <span
                        className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            plan.isActive ? "bg-jade-600" : "bg-ink-soft/50",
                        )}
                    />
                    {plan.isActive ? "Active" : "Inactive"}
                </span>
            </div>

            {/* Name + description */}
            <div className="mb-3">
                <h3 className="text-[18px] font-bold tracking-[-0.01em] text-jade-950">
                    {plan.displayName}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-[12.5px] text-ink-soft">
                    {plan.description}
                </p>
            </div>

            {/* Price */}
            <div className="mb-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-[26px] font-bold leading-none tracking-[-0.025em] text-jade-950 tabular-nums">
                        {price === 0 ? "Free" : fmt(price)}
                    </span>
                    {price > 0 && (
                        <span className="text-[12px] text-ink-soft">/mo</span>
                    )}
                </div>
                {plan.trialDays !== null && plan.trialDays > 0 && (
                    <p className="mt-0.5 text-[11.5px] font-medium text-coral-600">
                        {plan.trialDays}-day trial
                    </p>
                )}
            </div>

            {/* Limits */}
            <ul className="mb-3 space-y-1.5 text-[12.5px] text-ink">
                <LimitRow label="Buildings" value={plan.buildingLimit} />
                <LimitRow label="Floors" value={plan.floorLimit} />
                <LimitRow label="Units" value={plan.unitLimit} />
                <LimitRow label="Tenants" value={plan.tenantLimit} />
            </ul>

            {/* Capabilities pills */}
            <div className="mb-3 flex flex-wrap gap-1">
                <CapPill
                    label="SMS"
                    icon={Check}
                    on={plan.smsEnabled}
                />
                <CapPill
                    label="Branding"
                    icon={Palette}
                    on={plan.customBranding}
                />
                <CapPill
                    label="Multi-admin"
                    icon={UsersRound}
                    on={plan.multiAdmin}
                />
            </div>

            <p className="text-[11px] text-ink-soft">
                {featureCount === 0
                    ? "No feature bullets"
                    : `${featureCount} feature${featureCount === 1 ? "" : "s"}`}
            </p>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2 border-t border-rule-soft pt-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                    className="flex-1"
                >
                    <Pencil size={12} />
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    aria-label={`Delete ${plan.displayName}`}
                    className="text-coral-700 hover:bg-coral-50 hover:text-coral-700"
                >
                    <Trash2 size={13} />
                </Button>
            </div>
        </div>
    );
}

function LimitRow({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <li className="flex items-center justify-between gap-2">
            <span className="text-ink-soft">{label}</span>
            <span className="font-semibold tabular-nums text-jade-950">
                {value.toLocaleString()}
            </span>
        </li>
    );
}

function CapPill({
    label,
    icon: Icon,
    on,
}: {
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    on: boolean;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium",
                on
                    ? "border-jade-100 bg-jade-50 text-jade-800"
                    : "border-rule-soft bg-cream/50 text-ink-soft",
            )}
        >
            <Icon size={10} className={on ? "text-jade-700" : "text-ink-soft/60"} />
            {label}
            {on ? null : (
                <X size={9} className="text-ink-soft/50" />
            )}
        </span>
    );
}

function EmptyBlock({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="rounded-[14px] border border-dashed border-rule-soft bg-paper px-6 py-12 text-center">
            <h2 className="text-[15px] font-bold text-jade-950">
                No plans yet
            </h2>
            <p className="mt-1 text-[13px] text-ink-soft">
                Create your first plan to populate the public pricing page.
            </p>
            <p className="font-bangla mt-0.5 text-[11.5px] text-ink-soft/75">
                প্রথম প্ল্যান তৈরি করুন
            </p>
            <Button
                onClick={onCreate}
                className="mt-4 bg-jade-900 text-paper hover:bg-jade-950"
            >
                <Plus size={14} />
                New plan
            </Button>
        </div>
    );
}

function ErrorBlock({ message }: { message: string }) {
    return (
        <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
            <h2 className="text-[15px] font-bold text-coral-700">
                Couldn&apos;t load plans
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-700/80">
                {message}
            </p>
        </div>
    );
}

function errorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Something went wrong. Please try again.";
}
