"use client";

import { GenerateInvoiceDialog } from "@/src/components/dashboard/invoices/GenerateInvoiceDialog";
import { GenerateMonthlyBatchDialog } from "@/src/components/dashboard/invoices/GenerateMonthlyBatchDialog";
import {
    formatBillingMonth,
    invoiceStatusLabel,
    invoiceStatusStyles,
    invoiceTypeLabel,
    invoiceTypeStyles,
} from "@/src/components/dashboard/invoices/invoiceStyles";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useInvoices } from "@/src/hooks/useInvoices";
import { cn } from "@/src/lib/utils";
import {
    INVOICE_STATUS_OPTIONS,
    type InvoiceListItem,
    type InvoiceStatus,
} from "@/src/types/invoice.types";
import {
    Building,
    Calendar,
    ChevronDown,
    DoorOpen,
    Plus,
    Receipt,
    Search,
    User,
    X,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";

const ALL = "__ALL__";

export default function InvoicesListPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading…</div>}>
            <InvoicesListInner />
        </Suspense>
    );
}

function InvoicesListInner() {
    const [statusFilter, setStatusFilter] = useState<string>(ALL);
    const [query, setQuery] = useState("");
    const [generateOpen, setGenerateOpen] = useState(false);
    const [batchOpen, setBatchOpen] = useState(false);

    const filters = {
        ...(statusFilter !== ALL && { status: statusFilter as InvoiceStatus }),
    };

    const { data: invoices, isLoading, isError, error } = useInvoices(filters);

    const filtered = useMemo(
        () =>
            (invoices ?? []).filter((i) => {
                const q = query.trim().toLowerCase();
                if (!q) return true;
                return (
                    i.invoiceNumber.toLowerCase().includes(q) ||
                    i.tenant.name.toLowerCase().includes(q) ||
                    i.tenant.phone.toLowerCase().includes(q) ||
                    i.unit.name.toLowerCase().includes(q) ||
                    i.unit.building.name.toLowerCase().includes(q)
                );
            }),
        [invoices, query],
    );

    const totalDue = (invoices ?? []).reduce(
        (sum, i) => sum + Number(i.dueAmount),
        0,
    );
    const totalPaid = (invoices ?? []).reduce(
        (sum, i) => sum + Number(i.paidAmount),
        0,
    );
    const overdueCount = (invoices ?? []).filter(
        (i) => i.status === "OVERDUE",
    ).length;

    const hasActiveFilters = statusFilter !== ALL || query.trim() !== "";

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Invoices
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Rent invoices, billing history and outstanding amounts.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setBatchOpen(true)}>
                        <Zap size={14} />
                        Monthly batch
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button>
                                    <Plus size={14} />
                                    Generate
                                    <ChevronDown size={14} />
                                </Button>
                            }
                        />
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => setGenerateOpen(true)}>
                                <Receipt size={13} className="mr-2" />
                                Single invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setBatchOpen(true)}>
                                <Zap size={13} className="mr-2" />
                                Monthly batch
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <StatTile
                    label="Total invoices"
                    value={String(invoices?.length ?? 0)}
                    sublabel="all statuses"
                    accent="indigo"
                />
                <StatTile
                    label="Outstanding"
                    value={formatMoney(totalDue)}
                    sublabel="due across all invoices"
                    accent={totalDue > 0 ? "rose" : "emerald"}
                />
                <StatTile
                    label="Collected"
                    value={formatMoney(totalPaid)}
                    sublabel="paid to date"
                    accent="emerald"
                />
                <StatTile
                    label="Overdue"
                    value={String(overdueCount)}
                    sublabel="needs attention"
                    accent={overdueCount > 0 ? "rose" : "emerald"}
                />
            </div>

            {/* Filters */}
            <Card className="px-4 py-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search
                            size={15}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by invoice #, tenant, unit, building..."
                            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div className="w-full sm:w-48">
                        <Select
                            value={statusFilter}
                            onValueChange={(v) => setStatusFilter(v ?? ALL)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL}>All statuses</SelectItem>
                                {INVOICE_STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="tabular-nums">
                        {filtered.length} {filtered.length === 1 ? "result" : "results"}
                    </span>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setStatusFilter(ALL);
                            }}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                        >
                            <X size={11} /> Clear filters
                        </button>
                    )}
                </div>
            </Card>

            {/* Content */}
            {isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                </div>
            ) : isError ? (
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load invoices
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Please try again."}
                    </p>
                </Card>
            ) : !invoices || invoices.length === 0 ? (
                <EmptyState
                    onGenerate={() => setGenerateOpen(true)}
                    onBatch={() => setBatchOpen(true)}
                />
            ) : filtered.length === 0 ? (
                <Card className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-500">
                        No invoices match your filters.
                    </p>
                </Card>
            ) : (
                <Card className="overflow-hidden p-0">
                    <ul className="divide-y divide-slate-100">
                        {filtered.map((inv) => (
                            <InvoiceRow key={inv.id} invoice={inv} />
                        ))}
                    </ul>
                </Card>
            )}

            {/* Dialogs */}
            <GenerateInvoiceDialog
                open={generateOpen}
                onOpenChange={setGenerateOpen}
            />
            <GenerateMonthlyBatchDialog
                open={batchOpen}
                onOpenChange={setBatchOpen}
            />
        </div>
    );
}

function InvoiceRow({ invoice }: { invoice: InvoiceListItem }) {
    return (
        <li>
            <Link
                href={`/owner/dashboard/invoices/${invoice.id}`}
                className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center"
            >
                {/* Left: invoice meta */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="truncate font-mono text-xs font-medium text-slate-900 group-hover:text-indigo-700">
                            {invoice.invoiceNumber}
                        </p>
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-[10px]",
                                invoiceTypeStyles[invoice.type],
                            )}
                        >
                            {invoiceTypeLabel(invoice.type)}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-[10px]",
                                invoiceStatusStyles[invoice.status],
                            )}
                        >
                            {invoiceStatusLabel(invoice.status)}
                        </Badge>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                            <User size={11} /> {invoice.tenant.name}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <Building size={11} /> {invoice.unit.building.name}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <DoorOpen size={11} /> {invoice.unit.name}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <Calendar size={11} />
                            {formatBillingMonth(invoice.billingMonth)}
                        </span>
                    </div>
                </div>

                {/* Right: amounts */}
                <div className="flex items-baseline gap-6 sm:gap-8">
                    <div className="text-right">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Due
                        </p>
                        <p
                            className={cn(
                                "text-sm font-semibold tabular-nums",
                                Number(invoice.dueAmount) > 0
                                    ? "text-rose-700"
                                    : "text-slate-400",
                            )}
                        >
                            {formatMoney(invoice.dueAmount)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Total
                        </p>
                        <p className="text-base font-semibold text-slate-900 tabular-nums">
                            {formatMoney(invoice.totalAmount)}
                        </p>
                    </div>
                </div>
            </Link>
        </li>
    );
}

function StatTile({
    label,
    value,
    sublabel,
    accent,
}: {
    label: string;
    value: string;
    sublabel: string;
    accent: "indigo" | "emerald" | "rose";
}) {
    const accents: Record<typeof accent, string> = {
        indigo: "bg-indigo-50 text-indigo-700",
        emerald: "bg-emerald-50 text-emerald-700",
        rose: "bg-rose-50 text-rose-700",
    };
    return (
        <Card className="px-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                {label}
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">
                {value}
            </p>
            <span
                className={cn(
                    "mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                    accents[accent],
                )}
            >
                {sublabel}
            </span>
        </Card>
    );
}

function EmptyState({
    onGenerate,
    onBatch,
}: {
    onGenerate: () => void;
    onBatch: () => void;
}) {
    return (
        <Card className="px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-indigo-50">
                <Receipt size={28} className="text-indigo-600" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No invoices yet
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Generate your first invoice for an active lease, or run a monthly batch
                to invoice everyone at once.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
                <Button variant="outline" onClick={onBatch}>
                    <Zap size={14} /> Monthly batch
                </Button>
                <Button onClick={onGenerate}>
                    <Plus size={14} /> Generate invoice
                </Button>
            </div>
        </Card>
    );
}
