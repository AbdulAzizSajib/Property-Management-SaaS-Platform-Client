"use client";

// src/app/owner/dashboard/expenses/[id]/page.tsx

import { RecordExpenseDialog } from "@/src/components/dashboard/expenses/RecordExpenseDialog";
import {
    expenseCategoryLabel,
    expenseCategoryStyles,
    formatExpenseDate,
} from "@/src/components/dashboard/expenses/expenseStyles";
import {
    paymentMethodLabel,
    paymentMethodStyles,
} from "@/src/components/dashboard/payments/paymentStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
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
import { useDeleteExpense, useExpense } from "@/src/hooks/useExpenses";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    Banknote,
    Building,
    Calendar,
    CreditCard,
    DoorOpen,
    Loader2,
    Pencil,
    Printer,
    Store,
    StickyNote,
    Trash2,
} from "lucide-react";
import { Link, useRouter } from "@/src/i18n/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ExpenseDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const expenseId = params.id;

    const { data: e, isLoading, isError, error } = useExpense(expenseId);
    const deleteMutation = useDeleteExpense();

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8">
                    <Skeleton className="h-5 w-32 bg-paper" />
                    <Skeleton className="h-44 w-full rounded-[18px] bg-paper" />
                    <Skeleton className="h-56 w-full rounded-[14px] bg-paper" />
                </div>
            </div>
        );
    }

    if (isError || !e) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] p-4 sm:p-6 lg:p-8">
                    <Link
                        href="/owner/dashboard/expenses"
                        className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        Back to expenses
                    </Link>
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load expense
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Expense not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream print:bg-white">
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print\\:document { box-shadow: none !important; border-color: transparent !important; }
                }
            `}</style>

            <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8 print:max-w-full print:p-0 print:space-y-4">
                {/* Toolbar */}
                <div className="flex items-center justify-between print:hidden">
                    <Link
                        href="/owner/dashboard/expenses"
                        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        All expenses
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-rule-soft bg-paper px-3 text-[12.5px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
                        >
                            <Printer size={12} />
                            Print
                        </button>
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
                            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-coral-100 bg-coral-50/70 px-3 text-[12.5px] font-medium text-coral-600 transition-colors hover:bg-coral-50"
                        >
                            <Trash2 size={12} />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Hero */}
                <div
                    className="relative overflow-hidden rounded-[18px] bg-jade-950 px-5 py-5 text-paper sm:px-6 sm:py-6"
                    style={{
                        boxShadow:
                            "0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 40px -22px rgba(10,46,34,0.5)",
                    }}
                >
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-45"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(255,123,87,0.45), transparent 65%)",
                        }}
                    />

                    <p className="relative font-serif text-[13px] italic text-paper/60">
                        Expense
                    </p>
                    <p className="font-bangla relative mt-0.5 text-[11.5px] text-paper/45">
                        খরচের বিবরণ
                    </p>
                    <h1 className="relative mt-2 text-[22px] font-bold tracking-[-0.02em] text-paper sm:text-[26px]">
                        {e.title}
                    </h1>
                    <p className="relative mt-4 text-[40px] font-bold leading-none tracking-[-0.025em] tabular-nums text-coral-400 sm:text-[46px]">
                        {formatMoney(e.amount)}
                    </p>

                    <div className="relative mt-4 flex flex-wrap items-center gap-1.5">
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                expenseCategoryStyles[e.category],
                            )}
                        >
                            {expenseCategoryLabel(e.category)}
                        </span>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                paymentMethodStyles[e.paymentMethod],
                            )}
                        >
                            {paymentMethodLabel(e.paymentMethod)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md border border-paper/15 bg-paper/5 px-1.5 py-0.5 text-[10.5px] font-medium text-paper/85 tabular-nums">
                            <Calendar size={11} />
                            {formatExpenseDate(e.expenseDate)}
                        </span>
                    </div>
                </div>

                {/* Details document */}
                <div className="print:document overflow-hidden rounded-[14px] border border-rule-soft bg-paper print:rounded-none">
                    <div className="border-b border-rule-soft px-6 py-4 sm:px-8">
                        <p className="font-serif text-[12.5px] italic text-coral-600/85">
                            Details
                        </p>
                        <p className="font-bangla text-[11.5px] text-ink-soft/75">
                            বিস্তারিত
                        </p>
                    </div>

                    <dl className="divide-y divide-rule-soft">
                        <DetailRow
                            icon={<Banknote size={13} />}
                            label="Amount"
                            bn="পরিমাণ"
                        >
                            <span className="text-[14px] font-bold tabular-nums text-coral-600">
                                {formatMoney(e.amount)}
                            </span>
                        </DetailRow>
                        <DetailRow
                            icon={<CreditCard size={13} />}
                            label="Paid via"
                            bn="পরিশোধ মাধ্যম"
                        >
                            <span
                                className={cn(
                                    "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                    paymentMethodStyles[e.paymentMethod],
                                )}
                            >
                                {paymentMethodLabel(e.paymentMethod)}
                            </span>
                        </DetailRow>
                        <DetailRow
                            icon={<Calendar size={13} />}
                            label="Expense date"
                            bn="খরচের তারিখ"
                        >
                            <span className="tabular-nums text-ink">
                                {formatExpenseDate(e.expenseDate)}
                            </span>
                        </DetailRow>
                        {e.paidTo && (
                            <DetailRow
                                icon={<Store size={13} />}
                                label="Paid to"
                                bn="প্রাপক"
                            >
                                <span className="text-ink">{e.paidTo}</span>
                            </DetailRow>
                        )}
                        {e.building && (
                            <DetailRow
                                icon={<Building size={13} />}
                                label="Building"
                                bn="বিল্ডিং"
                            >
                                <Link
                                    href={`/owner/dashboard/buildings/${e.building.id}`}
                                    className="text-ink hover:text-jade-900"
                                >
                                    {e.building.name}
                                </Link>
                            </DetailRow>
                        )}
                        {e.unit && (
                            <DetailRow
                                icon={<DoorOpen size={13} />}
                                label="Unit"
                                bn="ইউনিট"
                            >
                                <Link
                                    href={`/owner/dashboard/units/${e.unit.id}`}
                                    className="text-ink hover:text-jade-900"
                                >
                                    Unit {e.unit.name}
                                </Link>
                            </DetailRow>
                        )}
                        {e.notes && (
                            <DetailRow
                                icon={<StickyNote size={13} />}
                                label="Notes"
                                bn="নোট"
                            >
                                <span className="text-ink">{e.notes}</span>
                            </DetailRow>
                        )}
                    </dl>

                    <div className="border-t border-rule-soft bg-cream/40 px-6 py-3 sm:px-8">
                        <p className="text-[11px] text-ink-soft tabular-nums">
                            Recorded{" "}
                            <span className="text-ink">
                                {new Date(e.createdAt).toLocaleString()}
                            </span>
                            {e.updatedAt !== e.createdAt && (
                                <>
                                    {" · "}Updated{" "}
                                    <span className="text-ink">
                                        {new Date(e.updatedAt).toLocaleString()}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Edit dialog */}
                <RecordExpenseDialog
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    expense={e}
                />

                {/* Delete confirmation */}
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-jade-950">
                                Delete this expense?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-ink-soft">
                                This will permanently delete{" "}
                                <strong className="text-ink">{e.title}</strong>{" "}
                                ({formatMoney(e.amount)}). This action cannot be
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
                                    deleteMutation.mutate(e.id, {
                                        onSuccess: () => {
                                            setDeleteOpen(false);
                                            router.push(
                                                "/owner/dashboard/expenses",
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
                                    "Delete expense"
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
    bn,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    bn: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <dt className="flex items-center gap-2 text-[12px] text-ink-soft">
                <span className="text-ink-soft/60">{icon}</span>
                <span className="font-semibold text-ink">{label}</span>
                <span className="font-bangla text-[11px] text-ink-soft/65">
                    · {bn}
                </span>
            </dt>
            <dd className="text-[13px]">{children}</dd>
        </div>
    );
}
