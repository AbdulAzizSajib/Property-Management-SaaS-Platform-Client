"use client";

// src/app/owner/dashboard/documents/page.tsx

import { UploadDocumentDialog } from "@/src/components/dashboard/documents/UploadDocumentDialog";
import {
    documentTypeLabel,
    documentTypeStyles,
    formatDocumentDate,
    formatFileSize,
    getFileGlyph,
    shortMime,
} from "@/src/components/dashboard/documents/documentStyles";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useBuildings } from "@/src/hooks/useBuildings";
import { useDocuments } from "@/src/hooks/useDocuments";
import { useTenants } from "@/src/hooks/useTenants";
import { fmtNum } from "@/src/lib/numerals";
import { cn } from "@/src/lib/utils";
import {
    DOCUMENT_TYPE_OPTIONS,
    type DocumentListItem,
    type DocumentType,
} from "@/src/types/document.types";
import {
    ArrowUpRight,
    Building,
    FolderArchive,
    Plus,
    Search,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";

const ALL = "__ALL__";

export default function DocumentsListPage() {
    return (
        <Suspense fallback={<ListShell />}>
            <DocumentsListInner />
        </Suspense>
    );
}

function DocumentsListInner() {
    const [typeFilter, setTypeFilter] = useState<string>(ALL);
    const [tenantFilter, setTenantFilter] = useState<string>(ALL);
    const [buildingFilter, setBuildingFilter] = useState<string>(ALL);
    const [query, setQuery] = useState("");
    const [uploadOpen, setUploadOpen] = useState(false);

    const filters = {
        ...(typeFilter !== ALL && { type: typeFilter as DocumentType }),
        ...(tenantFilter !== ALL && { tenantId: tenantFilter }),
        ...(buildingFilter !== ALL && { buildingId: buildingFilter }),
    };

    const {
        data: documents,
        isLoading,
        isError,
        error,
    } = useDocuments(filters);
    const { data: tenants } = useTenants();
    const { data: buildings } = useBuildings();

    const filtered = useMemo(
        () =>
            (documents ?? []).filter((d) => {
                const q = query.trim().toLowerCase();
                if (!q) return true;
                return (
                    d.name.toLowerCase().includes(q) ||
                    (d.tenant?.name.toLowerCase().includes(q) ?? false) ||
                    (d.building?.name.toLowerCase().includes(q) ?? false) ||
                    (d.uploadedBy?.name.toLowerCase().includes(q) ?? false)
                );
            }),
        [documents, query],
    );

    const totalSize = (documents ?? []).reduce(
        (sum, d) => sum + (d.fileSize ?? 0),
        0,
    );

    const hasActiveFilters =
        typeFilter !== ALL ||
        tenantFilter !== ALL ||
        buildingFilter !== ALL ||
        query.trim() !== "";

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1240px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Heading */}
                <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Archive &amp; records
                        </p>
                        <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            Documents
                        </h1>
                        <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                            চুক্তি, এনআইডি ও জরুরি কাগজপত্র।
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setUploadOpen(true)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                    >
                        <Plus size={14} />
                        Upload document
                    </button>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <MiniStat
                        label="Total documents"
                        bn="মোট কাগজপত্র"
                        value={fmtNum(documents?.length ?? 0)}
                        sub="archived"
                        tone="good"
                    />
                    <MiniStat
                        label="Storage used"
                        bn="স্টোরেজ ব্যবহৃত"
                        value={formatFileSize(totalSize)}
                        sub="across all files"
                        tone="neutral"
                    />
                    <MiniStat
                        label="Filtered"
                        bn="ফিল্টার"
                        value={fmtNum(filtered.length)}
                        sub={
                            hasActiveFilters
                                ? "matching current filters"
                                : "showing all"
                        }
                        tone="neutral"
                    />
                </div>

                {/* Filters */}
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
                                placeholder="Search by name, tenant, building, uploader…"
                                className="h-9 w-full rounded-md border border-rule-soft bg-paper pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-soft/60 focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
                            />
                        </div>

                        <div className="w-full sm:w-48">
                            <Select
                                value={typeFilter}
                                onValueChange={(v) =>
                                    setTypeFilter(v ?? ALL)
                                }
                            >
                                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>
                                        All types
                                    </SelectItem>
                                    {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="w-full sm:w-48">
                            <Select
                                value={tenantFilter}
                                onValueChange={(v) =>
                                    setTenantFilter(v ?? ALL)
                                }
                            >
                                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                                    <SelectValue placeholder="Tenant" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>
                                        All tenants
                                    </SelectItem>
                                    {(tenants ?? []).map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-48">
                            <Select
                                value={buildingFilter}
                                onValueChange={(v) =>
                                    setBuildingFilter(v ?? ALL)
                                }
                            >
                                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                                    <SelectValue placeholder="Building" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>
                                        All buildings
                                    </SelectItem>
                                    {(buildings ?? []).map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                    onClick={() => {
                                        setQuery("");
                                        setTypeFilter(ALL);
                                        setTenantFilter(ALL);
                                        setBuildingFilter(ALL);
                                    }}
                                    className="inline-flex items-center gap-1 font-medium text-ink-soft transition-colors hover:text-coral-600"
                                >
                                    <X size={11} /> Clear filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <ListShell />
                ) : isError ? (
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-700">
                            Couldn&apos;t load documents
                        </h2>
                        <p className="mt-1 text-[13px] text-coral-700/80">
                            {error instanceof Error
                                ? error.message
                                : "Please try again."}
                        </p>
                    </div>
                ) : !documents || documents.length === 0 ? (
                    <EmptyState onUpload={() => setUploadOpen(true)} />
                ) : filtered.length === 0 ? (
                    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-12 text-center">
                        <p className="text-[13.5px] text-ink-soft">
                            No documents match your filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                        <ul className="divide-y divide-rule-soft">
                            {filtered.map((d) => (
                                <DocumentRow key={d.id} document={d} />
                            ))}
                        </ul>
                    </div>
                )}

                <UploadDocumentDialog
                    open={uploadOpen}
                    onOpenChange={setUploadOpen}
                />
            </div>
        </div>
    );
}

function DocumentRow({ document }: { document: DocumentListItem }) {
    const glyph = getFileGlyph(document.mimeType);

    return (
        <li>
            <Link
                href={`/owner/dashboard/documents/${document.id}`}
                className="group relative flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cream/60 sm:flex-row sm:items-center"
            >
                {/* File icon */}
                <span
                    className={cn(
                        "inline-flex size-10 shrink-0 items-center justify-center rounded-[10px]",
                        glyph.bg,
                    )}
                >
                    <glyph.Icon size={18} className={glyph.fg} />
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-[13.5px] font-semibold text-jade-950 group-hover:text-jade-900">
                            {document.name}
                        </p>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                documentTypeStyles[document.type],
                            )}
                        >
                            {documentTypeLabel(document.type)}
                        </span>
                        <span className="rounded-md border border-rule-soft bg-cream/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                            {shortMime(document.mimeType)}
                        </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-soft">
                        {document.tenant && (
                            <span className="inline-flex items-center gap-1">
                                <User size={11} className="text-ink-soft/60" />
                                <span className="text-ink">
                                    {document.tenant.name}
                                </span>
                            </span>
                        )}
                        {document.building && (
                            <span className="inline-flex items-center gap-1">
                                <Building
                                    size={11}
                                    className="text-ink-soft/60"
                                />
                                {document.building.name}
                            </span>
                        )}
                        <span className="tabular-nums">
                            {formatFileSize(document.fileSize)}
                        </span>
                        <span className="tabular-nums">
                            · {formatDocumentDate(document.createdAt)}
                        </span>
                        {document.uploadedBy && (
                            <span className="ml-auto inline-flex items-center gap-1 text-ink-soft/70">
                                by{" "}
                                <span className="text-ink-soft">
                                    {document.uploadedBy.name}
                                </span>
                            </span>
                        )}
                    </div>
                </div>

                <ArrowUpRight
                    size={14}
                    className="shrink-0 self-center text-ink-soft/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-jade-900"
                />
            </Link>
        </li>
    );
}

function MiniStat({
    label,
    bn,
    value,
    sub,
    tone,
}: {
    label: string;
    bn: string;
    value: string;
    sub: string;
    tone: "good" | "warn" | "neutral";
}) {
    const valueTone =
        tone === "warn"
            ? "text-coral-700"
            : tone === "good"
                ? "text-jade-950"
                : "text-ink-soft/85";

    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper px-4 py-3.5">
            <div className="flex items-baseline justify-between gap-2">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                    {label}
                </p>
                <p className="font-bangla text-[10.5px] text-ink-soft/65">
                    {bn}
                </p>
            </div>
            <p
                className={cn(
                    "mt-1.5 text-[20px] font-bold leading-none tracking-[-0.025em] tabular-nums",
                    valueTone,
                )}
            >
                {value}
            </p>
            <p className="mt-1.5 text-[11.5px] text-ink-soft">{sub}</p>
        </div>
    );
}

function ListShell() {
    return (
        <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                    key={i}
                    className="h-[72px] w-full rounded-[10px] bg-paper"
                />
            ))}
        </div>
    );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
                <FolderArchive size={26} className="text-jade-800" />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-jade-950">
                No documents yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
                Archive contracts, NIDs, deeds, and receipts — tied to a
                tenant, building, or lease so you can find them later.
            </p>
            <p className="font-bangla mt-0.5 text-[12px] text-ink-soft/75">
                প্রথম কাগজ আপলোড করুন
            </p>
            <div className="mt-5 flex items-center justify-center">
                <button
                    type="button"
                    onClick={onUpload}
                    className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                >
                    <Plus size={14} />
                    Upload document
                </button>
            </div>
        </div>
    );
}
