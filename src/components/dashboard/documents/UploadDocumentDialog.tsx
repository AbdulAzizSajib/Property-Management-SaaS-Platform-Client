"use client";

// src/components/dashboard/documents/UploadDocumentDialog.tsx
//
// Multipart upload of a document with optional links to a tenant, building, or lease.

import {
    Field,
    FormActions,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import {
    formatFileSize,
    getFileGlyph,
} from "@/src/components/dashboard/documents/documentStyles";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { useBuildings } from "@/src/hooks/useBuildings";
import { useDocuments, useUploadDocument } from "@/src/hooks/useDocuments";
import { useLeases } from "@/src/hooks/useLeases";
import { useTenants } from "@/src/hooks/useTenants";
import {
    DOCUMENT_TYPE_OPTIONS,
    type DocumentType,
} from "@/src/types/document.types";
import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NO_VAL = "__NONE__";

interface UploadDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultTenantId?: string;
    defaultBuildingId?: string;
    defaultLeaseId?: string;
}

export function UploadDocumentDialog({
    open,
    onOpenChange,
    defaultTenantId,
    defaultBuildingId,
    defaultLeaseId,
}: UploadDocumentDialogProps) {
    const { data: tenants } = useTenants();
    const { data: buildings } = useBuildings();
    const { data: leases } = useLeases();
    const mutation = useUploadDocument();
    // Force the list to refetch after upload — covers cases where the
    // useDocuments hook on the parent page used filters we don't match.
    useDocuments();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [type, setType] = useState<DocumentType>("NID");
    const [tenantId, setTenantId] = useState<string>(NO_VAL);
    const [buildingId, setBuildingId] = useState<string>(NO_VAL);
    const [leaseId, setLeaseId] = useState<string>(NO_VAL);
    const [autoFilledName, setAutoFilledName] = useState(false);

    useEffect(() => {
        if (!open) return;
        setFile(null);
        setName("");
        setType("NID");
        setTenantId(defaultTenantId ?? NO_VAL);
        setBuildingId(defaultBuildingId ?? NO_VAL);
        setLeaseId(defaultLeaseId ?? NO_VAL);
        setAutoFilledName(false);
        // Clear the file input value too
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [open, defaultTenantId, defaultBuildingId, defaultLeaseId]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const next = e.target.files?.[0] ?? null;
        setFile(next);
        // Auto-fill name from filename (sans extension) if user hasn't typed
        if (next && (name.trim() === "" || autoFilledName)) {
            const base = next.name.replace(/\.[^.]+$/, "");
            setName(base);
            setAutoFilledName(true);
        }
    }

    function handleNameChange(value: string) {
        setName(value);
        setAutoFilledName(false);
    }

    function clearFile() {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name.trim());
        formData.append("type", type);
        if (tenantId !== NO_VAL) formData.append("tenantId", tenantId);
        if (buildingId !== NO_VAL) formData.append("buildingId", buildingId);
        if (leaseId !== NO_VAL) formData.append("leaseId", leaseId);

        mutation.mutate(formData, {
            onSuccess: () => onOpenChange(false),
        });
    }

    const glyph = file ? getFileGlyph(file.type) : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-jade-950">
                        Upload document
                    </DialogTitle>
                    <DialogDescription className="text-ink-soft">
                        Archive a document — ID, contract, deed, receipt —
                        and tag it to a tenant, building, or lease.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* File picker */}
                    <Field label="File" htmlFor="d-file" required>
                        {!file ? (
                            <label
                                htmlFor="d-file"
                                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-rule-soft bg-cream/40 px-4 py-6 text-center transition-colors hover:border-jade-700/40 hover:bg-cream/70"
                            >
                                <span className="inline-flex size-9 items-center justify-center rounded-full bg-jade-50">
                                    <Upload
                                        size={16}
                                        className="text-jade-700"
                                    />
                                </span>
                                <p className="text-[13px] font-semibold text-ink">
                                    Click to select a file
                                </p>
                                <p className="text-[11.5px] text-ink-soft">
                                    PDF, image, or document · up to 25 MB
                                </p>
                                <input
                                    id="d-file"
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,image/*,.doc,.docx,.xls,.xlsx,.csv,.txt"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                    required
                                />
                            </label>
                        ) : (
                            <div className="flex items-center gap-3 rounded-[10px] border border-rule-soft bg-paper px-3 py-2.5">
                                {glyph && (
                                    <span
                                        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-[8px] ${glyph.bg}`}
                                    >
                                        <glyph.Icon
                                            size={16}
                                            className={glyph.fg}
                                        />
                                    </span>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-semibold text-ink">
                                        {file.name}
                                    </p>
                                    <p className="text-[11.5px] text-ink-soft tabular-nums">
                                        {formatFileSize(file.size)}
                                        {file.type && (
                                            <>
                                                {" · "}
                                                <span className="font-mono">
                                                    {file.type}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={clearFile}
                                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-cream hover:text-coral-600"
                                    aria-label="Remove file"
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        )}
                    </Field>

                    <Field
                        label="Name"
                        htmlFor="d-name"
                        required
                        hint={
                            autoFilledName
                                ? "Filled from filename — edit if needed"
                                : "Friendly title for this document"
                        }
                    >
                        <Input
                            id="d-name"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Rahim NID Copy"
                            required
                            className={fieldClass}
                        />
                    </Field>

                    <Field label="Type" htmlFor="d-type" required>
                        <Select
                            value={type}
                            onValueChange={(v) =>
                                setType((v ?? "NID") as DocumentType)
                            }
                        >
                            <SelectTrigger
                                id="d-type"
                                className={`w-full ${fieldClass}`}
                            >
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
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
                    </Field>

                    <div className="rounded-[10px] border border-rule-soft bg-cream/40 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                            Link to (optional)
                        </p>
                        <p className="font-bangla text-[11px] text-ink-soft/65">
                            সংযুক্ত করুন (ঐচ্ছিক)
                        </p>

                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <Field label="Tenant" htmlFor="d-tenant">
                                <Select
                                    value={tenantId}
                                    onValueChange={(v) =>
                                        setTenantId(v ?? NO_VAL)
                                    }
                                >
                                    <SelectTrigger
                                        id="d-tenant"
                                        className={`w-full ${fieldClass}`}
                                    >
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={NO_VAL}>
                                            <span className="text-ink-soft">
                                                None
                                            </span>
                                        </SelectItem>
                                        {(tenants ?? []).map((t) => (
                                            <SelectItem
                                                key={t.id}
                                                value={t.id}
                                            >
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label="Building" htmlFor="d-building">
                                <Select
                                    value={buildingId}
                                    onValueChange={(v) =>
                                        setBuildingId(v ?? NO_VAL)
                                    }
                                >
                                    <SelectTrigger
                                        id="d-building"
                                        className={`w-full ${fieldClass}`}
                                    >
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={NO_VAL}>
                                            <span className="text-ink-soft">
                                                None
                                            </span>
                                        </SelectItem>
                                        {(buildings ?? []).map((b) => (
                                            <SelectItem
                                                key={b.id}
                                                value={b.id}
                                            >
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label="Lease" htmlFor="d-lease">
                                <Select
                                    value={leaseId}
                                    onValueChange={(v) =>
                                        setLeaseId(v ?? NO_VAL)
                                    }
                                >
                                    <SelectTrigger
                                        id="d-lease"
                                        className={`w-full ${fieldClass}`}
                                    >
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={NO_VAL}>
                                            <span className="text-ink-soft">
                                                None
                                            </span>
                                        </SelectItem>
                                        {(leases ?? []).map((l) => (
                                            <SelectItem
                                                key={l.id}
                                                value={l.id}
                                            >
                                                <span className="inline-flex items-center gap-1.5">
                                                    <span className="text-ink">
                                                        {l.tenant.name}
                                                    </span>
                                                    <span className="text-[11px] text-ink-soft">
                                                        · Unit {l.unit.name}
                                                    </span>
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </div>

                    <FormActions
                        submitting={mutation.isPending}
                        submitLabel="Upload"
                        onCancel={() => onOpenChange(false)}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
