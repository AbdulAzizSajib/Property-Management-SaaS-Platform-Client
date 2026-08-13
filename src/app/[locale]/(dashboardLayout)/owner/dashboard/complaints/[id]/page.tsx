"use client";

// src/app/owner/dashboard/complaints/[id]/page.tsx

import { AssignComplaintDialog } from "@/src/components/dashboard/complaints/AssignComplaintDialog";
import { UpdateComplaintStatusDialog } from "@/src/components/dashboard/complaints/UpdateComplaintStatusDialog";
import {
    complaintCategoryLabel,
    complaintCategoryStyles,
    complaintPriorityLabel,
    complaintPriorityStyles,
    complaintStatusLabel,
    complaintStatusStyles,
    formatComplaintDate,
    formatRelativeTime,
} from "@/src/components/dashboard/complaints/complaintStyles";
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
import { Skeleton } from "@/src/components/ui/skeleton";
import { useComplaint, useDeleteComplaint } from "@/src/hooks/useComplaints";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    Building,
    Calendar,
    CheckCircle2,
    DoorOpen,
    Loader2,
    MessageSquareWarning,
    Pencil,
    Tag,
    Trash2,
    UserCheck,
    UserCircle,
    UserPlus,
} from "lucide-react";
import { Link, useRouter } from "@/src/i18n/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ComplaintDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const complaintId = params.id;

    const { data: c, isLoading, isError, error } = useComplaint(complaintId);
    const deleteMutation = useDeleteComplaint();

    const [updateOpen, setUpdateOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8">
                    <Skeleton className="h-5 w-32 bg-paper" />
                    <Skeleton className="h-44 w-full rounded-[18px] bg-paper" />
                    <Skeleton className="h-72 w-full rounded-[14px] bg-paper" />
                </div>
            </div>
        );
    }

    if (isError || !c) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] p-4 sm:p-6 lg:p-8">
                    <Link
                        href="/owner/dashboard/complaints"
                        className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        Back to complaints
                    </Link>
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load complaint
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Complaint not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const isResolved = c.status === "RESOLVED" || c.status === "CLOSED";

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8">
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/owner/dashboard/complaints"
                        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        All complaints
                    </Link>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setAssignOpen(true)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-rule-soft bg-paper px-3 text-[12.5px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
                        >
                            <UserPlus size={12} />
                            {c.assignedTo ? "Reassign" : "Assign"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setUpdateOpen(true)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-rule-soft bg-paper px-3 text-[12.5px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
                        >
                            <Pencil size={12} />
                            Update status
                        </button>
                        <button
                            type="button"
                            onClick={() => setDeleteOpen(true)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-coral-100 bg-coral-50/70 px-3 text-[12.5px] font-medium text-coral-600 transition-colors hover:bg-coral-50"
                        >
                            <Trash2 size={12} />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Hero */}
                <div
                    className={cn(
                        "relative overflow-hidden rounded-[18px] px-5 py-5 sm:px-6 sm:py-6",
                        isResolved
                            ? "border border-rule-soft bg-paper"
                            : "bg-sky-950 text-paper",
                    )}
                    style={
                        isResolved
                            ? undefined
                            : {
                                  boxShadow:
                                      "0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 40px -22px rgba(10,46,34,0.5)",
                              }
                    }
                >
                    {!isResolved && (
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-50"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(255,123,87,0.4), transparent 65%)",
                            }}
                        />
                    )}

                    <p
                        className={cn(
                            "relative font-serif text-[13px] italic",
                            isResolved
                                ? "text-coral-600/85"
                                : "text-paper/60",
                        )}
                    >
                        Complaint
                    </p>
                    <h1
                        className={cn(
                            "relative mt-2 text-[22px] font-bold tracking-[-0.02em] sm:text-[26px]",
                            isResolved ? "text-jade-950" : "text-paper",
                        )}
                    >
                        {c.title}
                    </h1>

                    <div className="relative mt-3 flex flex-wrap items-center gap-1.5">
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                complaintStatusStyles[c.status],
                            )}
                        >
                            {complaintStatusLabel(c.status)}
                        </span>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                complaintPriorityStyles[c.priority],
                            )}
                        >
                            {complaintPriorityLabel(c.priority)}
                        </span>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                complaintCategoryStyles[c.category],
                            )}
                        >
                            {complaintCategoryLabel(c.category)}
                        </span>
                        <span
                            className={cn(
                                "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium tabular-nums",
                                isResolved
                                    ? "border-rule-soft bg-cream/60 text-ink-soft"
                                    : "border-paper/15 bg-paper/5 text-paper/85",
                            )}
                        >
                            <Calendar size={11} />
                            {formatRelativeTime(c.createdAt)}
                        </span>
                    </div>

                    <p
                        className={cn(
                            "relative mt-4 whitespace-pre-wrap text-[13.5px] leading-relaxed",
                            isResolved ? "text-ink" : "text-paper/90",
                        )}
                    >
                        {c.description}
                    </p>
                </div>

                {/* Resolution note (if any) */}
                {c.resolutionNote && (
                    <div
                        className={cn(
                            "rounded-[14px] border px-5 py-4",
                            isResolved
                                ? "border-jade-100 bg-jade-50/60"
                                : "border-rule-soft bg-paper",
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2
                                size={14}
                                className={cn(
                                    isResolved
                                        ? "text-jade-700"
                                        : "text-ink-soft",
                                )}
                            />
                            <p className="text-[12.5px] font-semibold text-ink">
                                Resolution note
                            </p>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-[13px] text-ink-soft">
                            {c.resolutionNote}
                        </p>
                        {c.resolvedAt && (
                            <p className="mt-2 text-[11.5px] text-ink-soft/75 tabular-nums">
                                Resolved {formatComplaintDate(c.resolvedAt)}
                            </p>
                        )}
                    </div>
                )}

                {/* Detail rows */}
                <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                    <div className="border-b border-rule-soft px-6 py-4 sm:px-8">
                        <p className="font-serif text-[12.5px] italic text-coral-600/85">
                            Details
                        </p>
                    </div>

                    <dl className="divide-y divide-rule-soft">
                        <DetailRow
                            icon={<Tag size={13} />}
                            label="Category"
                        >
                            <span
                                className={cn(
                                    "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                    complaintCategoryStyles[c.category],
                                )}
                            >
                                {complaintCategoryLabel(c.category)}
                            </span>
                        </DetailRow>
                        <DetailRow
                            icon={<MessageSquareWarning size={13} />}
                            label="Priority"
                        >
                            <span
                                className={cn(
                                    "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                    complaintPriorityStyles[c.priority],
                                )}
                            >
                                {complaintPriorityLabel(c.priority)}
                            </span>
                        </DetailRow>
                        {c.building && (
                            <DetailRow
                                icon={<Building size={13} />}
                                label="Building"
                            >
                                <Link
                                    href={`/owner/dashboard/buildings/${c.building.id}`}
                                    className="text-ink hover:text-jade-900"
                                >
                                    {c.building.name}
                                </Link>
                            </DetailRow>
                        )}
                        {c.unit && (
                            <DetailRow
                                icon={<DoorOpen size={13} />}
                                label="Unit"
                            >
                                <Link
                                    href={`/owner/dashboard/units/${c.unit.id}`}
                                    className="text-ink hover:text-jade-900"
                                >
                                    Unit {c.unit.name}
                                </Link>
                            </DetailRow>
                        )}
                        {c.tenant && (
                            <DetailRow
                                icon={<UserCircle size={13} />}
                                label="Tenant"
                            >
                                <Link
                                    href={`/owner/dashboard/tenants/${c.tenant.id}`}
                                    className="text-ink hover:text-jade-900"
                                >
                                    {c.tenant.name}
                                </Link>
                            </DetailRow>
                        )}
                        <DetailRow
                            icon={<UserCheck size={13} />}
                            label="Assigned to"
                        >
                            {c.assignedTo ? (
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="text-ink">
                                        {c.assignedTo.name}
                                    </span>
                                    {c.assignedTo.role && (
                                        <span className="text-[11px] text-ink-soft">
                                            · {c.assignedTo.role}
                                        </span>
                                    )}
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setAssignOpen(true)}
                                    className="text-[12.5px] font-medium text-coral-600 hover:text-coral-800"
                                >
                                    Unassigned — assign now
                                </button>
                            )}
                        </DetailRow>
                        {c.createdBy && (
                            <DetailRow
                                icon={<UserCircle size={13} />}
                                label="Filed by"
                            >
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="text-ink">
                                        {c.createdBy.name}
                                    </span>
                                    {c.createdBy.role && (
                                        <span className="text-[11px] text-ink-soft">
                                            · {c.createdBy.role}
                                        </span>
                                    )}
                                </span>
                            </DetailRow>
                        )}
                        <DetailRow
                            icon={<Calendar size={13} />}
                            label="Filed"
                        >
                            <span className="tabular-nums text-ink">
                                {formatComplaintDate(c.createdAt)}
                                <span className="ml-1.5 text-ink-soft/70">
                                    · {formatRelativeTime(c.createdAt)}
                                </span>
                            </span>
                        </DetailRow>
                    </dl>

                    <div className="border-t border-rule-soft bg-cream/40 px-6 py-3 sm:px-8">
                        <p className="text-[11px] text-ink-soft tabular-nums">
                            Last updated{" "}
                            <span className="text-ink">
                                {new Date(c.updatedAt).toLocaleString()}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Dialogs */}
                <UpdateComplaintStatusDialog
                    open={updateOpen}
                    onOpenChange={setUpdateOpen}
                    complaint={c}
                />
                <AssignComplaintDialog
                    open={assignOpen}
                    onOpenChange={setAssignOpen}
                    complaint={c}
                />

                {/* Delete confirmation */}
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-jade-950">
                                Delete this complaint?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-ink-soft">
                                This will permanently delete{" "}
                                <strong className="text-ink">{c.title}</strong>{" "}
                                and any resolution notes. This action cannot be
                                undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                disabled={deleteMutation.isPending}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                disabled={deleteMutation.isPending}
                                onClick={() => {
                                    deleteMutation.mutate(c.id, {
                                        onSuccess: () => {
                                            setDeleteOpen(false);
                                            router.push(
                                                "/owner/dashboard/complaints",
                                            );
                                        },
                                    });
                                }}
                                className="bg-coral-600 text-paper hover:bg-coral-700"
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
                                    "Delete complaint"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

function DetailRow({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <dt className="flex items-center gap-2 text-[12px] text-ink-soft">
                <span className="text-ink-soft/60">{icon}</span>
                <span className="font-semibold text-ink">{label}</span>
            </dt>
            <dd className="text-[13px]">{children}</dd>
        </div>
    );
}
