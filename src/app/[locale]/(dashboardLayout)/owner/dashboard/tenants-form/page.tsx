"use client";

import {
    TenantFormForm,
    buildCreateTenantFormPayload,
    buildUpdateTenantFormPayload,
    type TenantFormValues,
} from "@/src/components/dashboard/tenant-forms/TenantFormForm";
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
    DialogTrigger,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
    useCreateTenantForm,
    useDeleteTenantForm,
    useTenantForms,
    useUpdateTenantForm,
} from "@/src/hooks/useTenantForms";
import { useTenants } from "@/src/hooks/useTenants";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import type { TenantFormDetail } from "@/src/types/tenantForm.types";
import {
    FileText,
    Pencil,
    Phone,
    Plus,
    Printer,
    Search,
    ShieldCheck,
    Trash2,
    X,
} from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useState } from "react";

type PoliceFilter = "ALL" | "SUBMITTED" | "PENDING";

export default function TenantFormsPage() {
    const { data: forms, isLoading, isError, error } = useTenantForms();
    const { data: tenants } = useTenants();
    const createMutation = useCreateTenantForm();
    const deleteMutation = useDeleteTenantForm();

    const [createOpen, setCreateOpen] = useState(false);
    const [editing, setEditing] = useState<TenantFormDetail | null>(null);
    const [toDelete, setToDelete] = useState<TenantFormDetail | null>(null);
    const [query, setQuery] = useState("");
    const [policeFilter, setPoliceFilter] = useState<PoliceFilter>("ALL");

    const filtered = (forms ?? []).filter((f) => {
        if (policeFilter === "SUBMITTED" && !f.submittedToPolice) return false;
        if (policeFilter === "PENDING" && f.submittedToPolice) return false;

        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            f.name.toLowerCase().includes(q) ||
            (f.phone ?? "").toLowerCase().includes(q) ||
            (f.nidNumber ?? "").toLowerCase().includes(q) ||
            (f.fatherName ?? "").toLowerCase().includes(q)
        );
    });

    const totalCount = forms?.length ?? 0;
    const submittedCount = (forms ?? []).filter(
        (f) => f.submittedToPolice,
    ).length;
    const pendingCount = totalCount - submittedCount;

    const hasActiveFilters = !!query.trim() || policeFilter !== "ALL";

    function clearFilters() {
        setQuery("");
        setPoliceFilter("ALL");
    }

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto container space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Heading */}
                <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Tenant intake records
                        </p>
                        <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            Tenant Forms
                        </h1>
                        <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                            ভাড়াটিয়ার বিস্তারিত ফর্ম ও পুলিশ ভেরিফিকেশন স্ট্যাটাস।
                        </p>
                    </div>

                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger
                            render={
                                <button
                                    type="button"
                                    className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                                >
                                    <Plus size={14} />
                                    Add form
                                </button>
                            }
                        />
                        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-jade-950">
                                    New tenant form
                                </DialogTitle>
                                <DialogDescription className="text-ink-soft">
                                    Fill the detailed intake form for a tenant.
                                </DialogDescription>
                            </DialogHeader>
                            <TenantFormForm
                                mode="create"
                                tenants={tenants ?? []}
                                submitting={createMutation.isPending}
                                submitLabel="Create form"
                                onCancel={() => setCreateOpen(false)}
                                onSubmit={(values) => {
                                    const payload =
                                        buildCreateTenantFormPayload(values);
                                    createMutation.mutate(payload, {
                                        onSuccess: () => setCreateOpen(false),
                                    });
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </header>

                {/* Summary strip */}
                <section className="flex flex-wrap items-baseline gap-x-7 gap-y-2 rounded-[14px] border border-rule-soft bg-paper px-5 py-3.5">
                    <SummaryStat
                        label="Forms"
                        bn="মোট"
                        value={fmtNum(totalCount)}
                    />
                    <SummaryStat
                        label="Submitted to police"
                        bn="পুলিশে জমা"
                        value={fmtNum(submittedCount)}
                    />
                    <SummaryStat
                        label="Pending"
                        bn="বাকি"
                        value={fmtNum(pendingCount)}
                    />
                    {totalCount > 0 && (
                        <span className="ml-auto hidden text-[12px] text-ink-soft sm:inline tabular-nums">
                            {((submittedCount / totalCount) * 100).toFixed(0)}%
                            submitted
                        </span>
                    )}
                </section>

                {/* Toolbar */}
                <div className="rounded-[14px] border border-rule-soft bg-paper p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/70"
                            />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by name, father's name, phone, NID…"
                                className="h-9 w-full rounded-md border border-rule-soft bg-paper pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-soft/60 focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
                            />
                        </div>

                        <div className="inline-flex shrink-0 rounded-md border border-rule-soft bg-cream/60 p-0.5">
                            {(
                                ["ALL", "SUBMITTED", "PENDING"] as PoliceFilter[]
                            ).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setPoliceFilter(s)}
                                    className={cn(
                                        "rounded-[6px] px-3 py-1 text-[12px] font-semibold transition-colors",
                                        policeFilter === s
                                            ? "bg-jade-900 text-paper"
                                            : "text-ink-soft hover:bg-paper hover:text-jade-900",
                                    )}
                                >
                                    {s === "ALL"
                                        ? "All"
                                        : s === "SUBMITTED"
                                          ? "Submitted"
                                          : "Pending"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(filtered.length > 0 || hasActiveFilters) && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-rule-soft pt-3 text-[12px] text-ink-soft">
                            <span className="tabular-nums">
                                <span className="font-semibold text-ink">
                                    {fmtNum(filtered.length)}
                                </span>{" "}
                                {filtered.length === 1 ? "result" : "results"}
                            </span>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-1 font-medium text-ink-soft transition-colors hover:text-coral-600"
                                >
                                    <X size={11} /> Clear
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-[170px] rounded-[12px] bg-paper"
                            />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load tenant forms
                        </h2>
                        <p className="mt-1 text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Please try again."}
                        </p>
                    </div>
                ) : !forms || forms.length === 0 ? (
                    <EmptyState onCreate={() => setCreateOpen(true)} />
                ) : filtered.length === 0 ? (
                    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-12 text-center">
                        <p className="text-[13.5px] text-ink-soft">
                            No forms match your filters.
                        </p>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-jade-900 hover:text-coral-600 transition-colors"
                        >
                            <X size={12} /> Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((f) => (
                            <FormCard
                                key={f.id}
                                form={f}
                                onEdit={() => setEditing(f)}
                                onDelete={() => setToDelete(f)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Edit dialog */}
            <Dialog
                open={!!editing}
                onOpenChange={(open) => !open && setEditing(null)}
            >
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-jade-950">
                            Edit tenant form
                        </DialogTitle>
                        <DialogDescription className="text-ink-soft">
                            Update the form details.
                        </DialogDescription>
                    </DialogHeader>
                    {editing && (
                        <EditForm
                            form={editing}
                            onDone={() => setEditing(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete confirm */}
            <AlertDialog
                open={!!toDelete}
                onOpenChange={(open) => !open && setToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this form?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete{" "}
                            <span className="font-semibold">
                                {toDelete?.name}
                            </span>
                            &apos;s form and all attached records (emergency
                            contact, family members, etc). This cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                                if (!toDelete) return;
                                deleteMutation.mutate(toDelete.id, {
                                    onSuccess: () => setToDelete(null),
                                });
                            }}
                        >
                            {deleteMutation.isPending ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// ── Edit form wrapper (owns its own mutation, keyed to the id) ──────

function EditForm({
    form,
    onDone,
}: {
    form: TenantFormDetail;
    onDone: () => void;
}) {
    const updateMutation = useUpdateTenantForm(form.id);

    const defaults: Partial<TenantFormValues> = {
        name: form.name,
        fatherName: form.fatherName,
        motherName: form.motherName ?? "",
        dateOfBirth: form.dateOfBirth ? form.dateOfBirth.slice(0, 10) : "",
        maritalStatus: form.maritalStatus ?? "",
        parmanentAddress: form.parmanentAddress ?? "",
        occupationAndAddress: form.occupationAndAddress ?? "",
        religion: form.religion ?? "",
        educationalQualification: form.educationalQualification ?? "",
        phone: form.phone ?? "",
        email: form.email ?? "",
        nidNumber: form.nidNumber ?? "",
        passportNumber: form.passportNumber ?? "",
        reasonForMoving: form.reasonForMoving ?? "",
        rentDate: form.rentDate ? form.rentDate.slice(0, 10) : "",
        submittedToPolice: form.submittedToPolice,
        division: form.division ?? "",
        thana: form.thana ?? "",
        flatFloor: form.flatFloor ?? "",
        houseNo: form.houseNo ?? "",
        roadNo: form.roadNo ?? "",
        areaName: form.areaName ?? "",
        postCode: form.postCode ?? "",

        emName: form.emergencyContact?.name ?? "",
        emPhone: form.emergencyContact?.phone ?? "",
        emAddress: form.emergencyContact?.address ?? "",
        emRelationship: form.emergencyContact?.relationship ?? "",

        maidName: form.maidInfo?.name ?? "",
        maidNid: form.maidInfo?.nidNumber ?? "",
        maidContact: form.maidInfo?.contactNumber ?? "",
        maidAddress: form.maidInfo?.parmanentAddress ?? "",

        driverName: form.driverInfo?.name ?? "",
        driverNid: form.driverInfo?.nidNumber ?? "",
        driverContact: form.driverInfo?.contactNumber ?? "",
        driverAddress: form.driverInfo?.parmanentAddress ?? "",

        presentOwnerName: form.presentHouseOwner?.name ?? "",
        presentOwnerContact: form.presentHouseOwner?.contactNumber ?? "",
        presentOwnerAddress: form.presentHouseOwner?.address ?? "",
        previousOwnerName: form.previousHouseOwner?.name ?? "",
        previousOwnerContact: form.previousHouseOwner?.contactNumber ?? "",
        previousOwnerAddress: form.previousHouseOwner?.address ?? "",

        familyMembers: (form.familyMembers ?? []).map((m) => ({
            name: m.name ?? "",
            age: m.age ? m.age.slice(0, 10) : "",
            occupation: m.occupation ?? "",
            contactNumber: m.contactNumber ?? "",
        })),
    };

    return (
        <TenantFormForm
            mode="edit"
            defaultValues={defaults}
            submitting={updateMutation.isPending}
            submitLabel="Save changes"
            onCancel={onDone}
            onSubmit={(values) => {
                const payload = buildUpdateTenantFormPayload(values);
                updateMutation.mutate(payload, { onSuccess: onDone });
            }}
        />
    );
}

// ── Card ────────────────────────────────────────────────────────────

function FormCard({
    form,
    onEdit,
    onDelete,
}: {
    form: TenantFormDetail;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const initials = form.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const accent = form.submittedToPolice ? "bg-jade-500" : "bg-coral-500";

    return (
        <div className="group relative overflow-hidden rounded-[12px] border border-rule-soft bg-paper p-4 transition-all hover:-translate-y-0.5 hover:border-jade-700/20 hover:shadow-[0_8px_24px_-12px_rgba(10,46,34,0.15)]">
            <span
                aria-hidden
                className={cn("absolute inset-y-0 left-0 w-[3px]", accent)}
            />

            <div className="flex items-start gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-jade-50 ring-1 ring-jade-100">
                    <span className="text-[13px] font-bold text-jade-800">
                        {initials}
                    </span>
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-[15px] font-bold tracking-[-0.01em] text-jade-950">
                            {form.name}
                        </p>
                        <span
                            className={cn(
                                "inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                form.submittedToPolice
                                    ? "border-jade-100 bg-jade-50 text-jade-800"
                                    : "border-coral-100 bg-coral-50 text-coral-600",
                            )}
                        >
                            <ShieldCheck size={11} />
                            {form.submittedToPolice ? "Police" : "Pending"}
                        </span>
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-ink-soft">
                        Father: {form.fatherName}
                    </p>
                </div>
            </div>

            <div className="mt-3 space-y-1 border-t border-rule-soft pt-2.5 text-[12px] text-ink-soft">
                {form.phone && (
                    <p className="inline-flex items-center gap-1.5 tabular-nums">
                        <Phone size={11} className="text-ink-soft/60" />
                        {form.phone}
                    </p>
                )}
                {form.nidNumber && (
                    <p className="flex items-center gap-1.5 truncate">
                        <FileText
                            size={11}
                            className="shrink-0 text-ink-soft/60"
                        />
                        <span className="truncate">NID: {form.nidNumber}</span>
                    </p>
                )}
            </div>

            <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-rule-soft pt-2.5">
                <Link
                    href={`/owner/dashboard/tenants-form/${form.id}/print`}
                    className="inline-flex items-center gap-1 rounded-md border border-rule-soft px-2 py-1 text-[11.5px] font-semibold text-jade-900 transition-colors hover:bg-jade-50"
                >
                    <Printer size={11} /> Print
                </Link>
                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-1 rounded-md border border-rule-soft px-2 py-1 text-[11.5px] font-semibold text-jade-900 transition-colors hover:bg-jade-50"
                >
                    <Pencil size={11} /> Edit
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    className="inline-flex items-center gap-1 rounded-md border border-coral-100 px-2 py-1 text-[11.5px] font-semibold text-coral-600 transition-colors hover:bg-coral-50"
                >
                    <Trash2 size={11} /> Delete
                </button>
            </div>
        </div>
    );
}

// ── Helpers ─────────────────────────────────────────────────────────

function SummaryStat({
    label,
    bn,
    value,
}: {
    label: string;
    bn: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-2.5">
            <FileText size={15} className="text-ink-soft/70" />
            <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold tracking-[-0.02em] text-jade-950 tabular-nums leading-none">
                    {value}
                </span>
                <span className="text-[12px] text-ink-soft">{label}</span>
                <span className="font-bangla text-[10.5px] text-ink-soft/65">
                    · {bn}
                </span>
            </div>
        </div>
    );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
                <FileText size={26} className="text-jade-800" />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-jade-950">
                No tenant forms yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
                Create a detailed intake form for a tenant to track their
                information and police verification status.
            </p>
            <p className="font-bangla mt-0.5 text-[12px] text-ink-soft/75">
                প্রথম ভাড়াটিয়ার ফর্ম তৈরি করুন
            </p>
            <div className="mt-5">
                <button
                    type="button"
                    onClick={onCreate}
                    className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                >
                    <Plus size={14} />
                    Create your first form
                </button>
            </div>
        </div>
    );
}
