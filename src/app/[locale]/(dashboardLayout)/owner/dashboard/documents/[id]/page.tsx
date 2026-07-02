"use client";

// src/app/owner/dashboard/documents/[id]/page.tsx

import {
    documentTypeLabel,
    documentTypeStyles,
    formatDocumentDate,
    formatFileSize,
    getFileGlyph,
    shortMime,
} from "@/src/components/dashboard/documents/documentStyles";
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
import { useDeleteDocument, useDocument } from "@/src/hooks/useDocuments";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    Building,
    Calendar,
    Download,
    ExternalLink,
    FileType,
    HardDrive,
    Loader2,
    Tag,
    Trash2,
    UploadCloud,
    UserCircle,
} from "lucide-react";
import { Link, useRouter } from "@/src/i18n/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function DocumentDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const documentId = params.id;

    const { data: d, isLoading, isError, error } = useDocument(documentId);
    const deleteMutation = useDeleteDocument();

    const [deleteOpen, setDeleteOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8">
                    <Skeleton className="h-5 w-32 bg-paper" />
                    <Skeleton className="h-48 w-full rounded-[18px] bg-paper" />
                    <Skeleton className="h-72 w-full rounded-[14px] bg-paper" />
                </div>
            </div>
        );
    }

    if (isError || !d) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] p-4 sm:p-6 lg:p-8">
                    <Link
                        href="/owner/dashboard/documents"
                        className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        Back to documents
                    </Link>
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load document
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Document not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const glyph = getFileGlyph(d.mimeType);
    const isImage = (d.mimeType ?? "").toLowerCase().startsWith("image/");
    const isPdf = (d.mimeType ?? "").toLowerCase() === "application/pdf";

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8">
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/owner/dashboard/documents"
                        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        All documents
                    </Link>
                    <div className="flex flex-wrap items-center gap-2">
                        <a
                            href={d.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-rule-soft bg-paper px-3 text-[12.5px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
                        >
                            <ExternalLink size={12} />
                            Open
                        </a>
                        <a
                            href={d.fileUrl}
                            download={d.name}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-rule-soft bg-paper px-3 text-[12.5px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
                        >
                            <Download size={12} />
                            Download
                        </a>
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
                <div className="overflow-hidden rounded-[18px] border border-rule-soft bg-paper px-5 py-5 sm:px-6 sm:py-6">
                    <p className="font-serif text-[13px] italic text-coral-600/85">
                        Document
                    </p>
                    <p className="font-bangla mt-0.5 text-[11.5px] text-ink-soft/65">
                        কাগজপত্র
                    </p>

                    <div className="mt-3 flex items-start gap-4">
                        <span
                            className={cn(
                                "inline-flex size-14 shrink-0 items-center justify-center rounded-[12px]",
                                glyph.bg,
                            )}
                        >
                            <glyph.Icon size={24} className={glyph.fg} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <h1 className="break-words text-[22px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[26px]">
                                {d.name}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                <span
                                    className={cn(
                                        "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                        documentTypeStyles[d.type],
                                    )}
                                >
                                    {documentTypeLabel(d.type)}
                                </span>
                                <span className="rounded-md border border-rule-soft bg-cream/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                                    {shortMime(d.mimeType)}
                                </span>
                                <span className="rounded-md border border-rule-soft bg-cream/60 px-1.5 py-0.5 text-[10.5px] font-medium text-ink-soft tabular-nums">
                                    {formatFileSize(d.fileSize)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview (image-only inline; PDF gets a quick-open card) */}
                {isImage && (
                    <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={d.fileUrl}
                            alt={d.name}
                            className="max-h-[640px] w-full object-contain bg-cream/40"
                        />
                    </div>
                )}

                {isPdf && (
                    <a
                        href={d.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-[14px] border border-rule-soft bg-paper px-5 py-4 transition-colors hover:bg-cream/60"
                    >
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-coral-50">
                            <glyph.Icon size={18} className="text-coral-600" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-[13.5px] font-semibold text-jade-950 group-hover:text-jade-900">
                                Open PDF in new tab
                            </p>
                            <p className="text-[11.5px] text-ink-soft tabular-nums">
                                {formatFileSize(d.fileSize)} ·{" "}
                                {shortMime(d.mimeType)}
                            </p>
                        </div>
                        <ExternalLink
                            size={14}
                            className="shrink-0 text-ink-soft/40 group-hover:text-jade-900"
                        />
                    </a>
                )}

                {/* Detail rows */}
                <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
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
                            icon={<Tag size={13} />}
                            label="Type"
                            bn="ধরন"
                        >
                            <span
                                className={cn(
                                    "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                    documentTypeStyles[d.type],
                                )}
                            >
                                {documentTypeLabel(d.type)}
                            </span>
                        </DetailRow>
                        <DetailRow
                            icon={<FileType size={13} />}
                            label="File"
                            bn="ফাইল"
                        >
                            <span className="font-mono text-[12.5px] text-ink-soft">
                                {d.mimeType}
                            </span>
                        </DetailRow>
                        <DetailRow
                            icon={<HardDrive size={13} />}
                            label="Size"
                            bn="আকার"
                        >
                            <span className="tabular-nums text-ink">
                                {formatFileSize(d.fileSize)}
                            </span>
                        </DetailRow>
                        {d.tenant && (
                            <DetailRow
                                icon={<UserCircle size={13} />}
                                label="Tenant"
                                bn="ভাড়াটিয়া"
                            >
                                <Link
                                    href={`/owner/dashboard/tenants/${d.tenant.id}`}
                                    className="text-ink hover:text-jade-900"
                                >
                                    {d.tenant.name}
                                </Link>
                            </DetailRow>
                        )}
                        {d.building && (
                            <DetailRow
                                icon={<Building size={13} />}
                                label="Building"
                                bn="বিল্ডিং"
                            >
                                <Link
                                    href={`/owner/dashboard/buildings/${d.building.id}`}
                                    className="text-ink hover:text-jade-900"
                                >
                                    {d.building.name}
                                </Link>
                            </DetailRow>
                        )}
                        {d.leaseId && (
                            <DetailRow
                                icon={<Tag size={13} />}
                                label="Lease"
                                bn="ভাড়ার চুক্তি"
                            >
                                <Link
                                    href={`/owner/dashboard/leases/${d.leaseId}`}
                                    className="font-mono text-[12.5px] text-ink hover:text-jade-900"
                                >
                                    {d.leaseId}
                                </Link>
                            </DetailRow>
                        )}
                        <DetailRow
                            icon={<UploadCloud size={13} />}
                            label="Uploaded by"
                            bn="আপলোডকারী"
                        >
                            <span className="inline-flex items-center gap-1.5">
                                <span className="text-ink">
                                    {d.uploadedBy.name}
                                </span>
                                {d.uploadedBy.role && (
                                    <span className="text-[11px] text-ink-soft">
                                        · {d.uploadedBy.role}
                                    </span>
                                )}
                            </span>
                        </DetailRow>
                        <DetailRow
                            icon={<Calendar size={13} />}
                            label="Uploaded"
                            bn="আপলোডের তারিখ"
                        >
                            <span className="tabular-nums text-ink">
                                {formatDocumentDate(d.createdAt)}
                            </span>
                        </DetailRow>
                    </dl>

                    <div className="border-t border-rule-soft bg-cream/40 px-6 py-3 sm:px-8">
                        <p className="break-all text-[11px] text-ink-soft">
                            <span className="font-semibold text-ink">
                                File URL:
                            </span>{" "}
                            <a
                                href={d.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-jade-800 hover:text-jade-950"
                            >
                                {d.fileUrl}
                            </a>
                        </p>
                    </div>
                </div>

                {/* Delete confirmation */}
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-jade-950">
                                Delete this document?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-ink-soft">
                                This will permanently delete{" "}
                                <strong className="text-ink">{d.name}</strong>{" "}
                                and remove its file from storage. This action
                                cannot be undone.
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
                                    deleteMutation.mutate(d.id, {
                                        onSuccess: () => {
                                            setDeleteOpen(false);
                                            router.push(
                                                "/owner/dashboard/documents",
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
                                    "Delete document"
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
