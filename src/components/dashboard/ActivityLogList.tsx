"use client";

// src/components/dashboard/ActivityLogList.tsx
//
// Reusable audit-trail panel. Owners see their org's activity;
// SUPER_ADMIN sees everything.

import { Skeleton } from "@/src/components/ui/skeleton";
import { useActivityLogs } from "@/src/hooks/useActivityLogs";
import type { ActivityLog } from "@/src/types/activityLog.types";
import { Activity, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

function formatTimestamp(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

interface Props {
    title?: string;
    bnTitle?: string;
}

export function ActivityLogList({
    title = "Activity log",
    bnTitle = "অডিট ট্রেইল",
}: Props) {
    const [entityType, setEntityType] = useState("");
    const [action, setAction] = useState("");

    const filters = useMemo(
        () => ({
            ...(entityType && { entityType }),
            ...(action && { action }),
            limit: 100,
        }),
        [entityType, action],
    );

    const { data, isLoading, isError, error } = useActivityLogs(filters);

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1240px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <header>
                    <p className="font-serif text-[13px] italic text-coral-600/85">
                        Audit trail
                    </p>
                    <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                        {title}
                    </h1>
                    <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                        {bnTitle}
                    </p>
                </header>

                {/* Filters */}
                <div className="grid grid-cols-1 gap-3 rounded-[14px] border border-rule-soft bg-paper p-3 sm:grid-cols-2">
                    <FilterSelect
                        label="Entity"
                        value={entityType}
                        onChange={setEntityType}
                        options={[
                            { value: "", label: "All entities" },
                            { value: "User", label: "User" },
                            { value: "Building", label: "Building" },
                            { value: "Floor", label: "Floor" },
                            { value: "Unit", label: "Unit" },
                            { value: "Tenant", label: "Tenant" },
                            { value: "Lease", label: "Lease" },
                            { value: "Invoice", label: "Invoice" },
                            { value: "Payment", label: "Payment" },
                            { value: "Expense", label: "Expense" },
                            { value: "Complaint", label: "Complaint" },
                            { value: "RentAgreement", label: "Agreement" },
                            { value: "RentIncrease", label: "Rent increase" },
                            { value: "Subscription", label: "Subscription" },
                        ]}
                    />
                    <FilterSelect
                        label="Action"
                        value={action}
                        onChange={setAction}
                        options={[
                            { value: "", label: "All actions" },
                            { value: "CREATED", label: "Created (any)" },
                            { value: "UPDATED", label: "Updated (any)" },
                            { value: "DELETED", label: "Deleted (any)" },
                            {
                                value: "PAYMENT_CREATED",
                                label: "Payment created",
                            },
                            {
                                value: "INVOICE_GENERATED",
                                label: "Invoice generated",
                            },
                        ]}
                    />
                </div>

                {/* Stream */}
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-14 rounded-[10px] bg-paper"
                            />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load activity logs
                        </h2>
                        <p className="mt-1 text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Something went wrong."}
                        </p>
                    </div>
                ) : !data || data.length === 0 ? (
                    <div className="rounded-[14px] border border-dashed border-rule-soft bg-paper px-6 py-12 text-center">
                        <Activity
                            size={28}
                            className="mx-auto text-ink-soft/50"
                        />
                        <p className="mt-2 text-[14px] font-semibold text-jade-950">
                            No activity yet
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {data.map((log) => (
                            <LogRow key={log.id} log={log} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function LogRow({ log }: { log: ActivityLog }) {
    const [open, setOpen] = useState(false);
    return (
        <li className="rounded-[10px] border border-rule-soft bg-paper">
            <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left"
            >
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-jade-50 text-jade-700">
                    <Activity size={13} />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">
                        {log.action.replace(/_/g, " ")}
                        <span className="ml-1.5 text-ink-soft">
                            · {log.entityType}
                        </span>
                    </p>
                    <p className="text-[11px] text-ink-soft">
                        {log.user?.name ?? "system"} ·{" "}
                        {formatTimestamp(log.createdAt)}
                    </p>
                </div>
                <ChevronDown
                    size={14}
                    className={
                        "text-ink-soft transition-transform " +
                        (open ? "rotate-180" : "")
                    }
                />
            </button>
            {open && (
                <div className="border-t border-rule-soft px-3 py-2 text-[11.5px]">
                    {log.description && (
                        <p className="text-ink">{log.description}</p>
                    )}
                    {log.metadata && (
                        <pre className="mt-1.5 overflow-x-auto rounded-md bg-cream/60 p-2 text-[10.5px] text-ink-soft">
                            {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                    )}
                    <p className="mt-1 text-ink-soft/70">
                        IP: {log.ipAddress ?? "—"} · UA:{" "}
                        {log.userAgent ? log.userAgent.slice(0, 64) : "—"}
                    </p>
                </div>
            )}
        </li>
    );
}

function FilterSelect({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                {label}
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 h-8 w-full rounded-md border border-rule-soft bg-cream/40 px-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-jade-700/30"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
