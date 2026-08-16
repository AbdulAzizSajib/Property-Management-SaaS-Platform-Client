"use client";

// src/app/admin/dashboard/support/[id]/page.tsx

import { TicketThread } from "@/src/components/dashboard/support/TicketThread";
import {
    formatRelativeTime,
    formatSupportTicketDate,
    supportTicketCategoryLabel,
    supportTicketCategoryStyles,
    supportTicketPriorityLabel,
    supportTicketPriorityStyles,
    supportTicketStatusLabel,
    supportTicketStatusStyles,
} from "@/src/components/dashboard/support/supportTicketStyles";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
    useAddSupportTicketMessage,
    useSupportTicket,
    useUpdateSupportTicketStatus,
} from "@/src/hooks/useSupportTickets";
import { cn } from "@/src/lib/utils";
import { SUPPORT_TICKET_STATUS_OPTIONS } from "@/src/types/supportTicket.types";
import { ArrowLeft, Building2, Calendar, Tag, UserCircle } from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useParams } from "next/navigation";

export default function AdminSupportTicketDetailPage() {
    const params = useParams<{ id: string }>();
    const ticketId = params.id;

    const { data: t, isLoading, isError, error } = useSupportTicket(
        ticketId,
    );
    const addMessage = useAddSupportTicketMessage(ticketId);
    const updateStatus = useUpdateSupportTicketStatus(ticketId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-270 space-y-5 p-4 sm:p-6 lg:p-8">
                    <Skeleton className="h-5 w-32 bg-paper" />
                    <Skeleton className="h-36 w-full rounded-[18px] bg-paper" />
                    <Skeleton className="h-72 w-full rounded-[14px] bg-paper" />
                </div>
            </div>
        );
    }

    if (isError || !t) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-270 p-4 sm:p-6 lg:p-8">
                    <Link
                        href="/admin/dashboard/support"
                        className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        Back to support
                    </Link>
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load ticket
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Ticket not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const isClosed = t.status === "CLOSED";

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-270 space-y-5 p-4 sm:p-6 lg:p-8">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href="/admin/dashboard/support"
                        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-jade-900"
                    >
                        <ArrowLeft size={12} />
                        All tickets
                    </Link>

                    <div className="w-full sm:w-52">
                        <Select
                            value={t.status}
                            onValueChange={(v) => {
                                if (v && v !== t.status) {
                                    updateStatus.mutate({
                                        status: v as typeof t.status,
                                    });
                                }
                            }}
                        >
                            <SelectTrigger
                                disabled={updateStatus.isPending}
                                className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20"
                            >
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {SUPPORT_TICKET_STATUS_OPTIONS.map((opt) => (
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

                {/* Hero */}
                <div
                    className={cn(
                        "relative overflow-hidden rounded-[18px] px-5 py-5 sm:px-6 sm:py-6",
                        isClosed
                            ? "border border-rule-soft bg-paper"
                            : "bg-sky-950 text-paper",
                    )}
                    style={
                        isClosed
                            ? undefined
                            : {
                                  boxShadow:
                                      "0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 40px -22px rgba(10,46,34,0.5)",
                              }
                    }
                >
                    {!isClosed && (
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
                            isClosed ? "text-coral-600/85" : "text-paper/60",
                        )}
                    >
                        Support ticket
                    </p>
                    <h1
                        className={cn(
                            "relative mt-2 text-[22px] font-bold tracking-[-0.02em] sm:text-[26px]",
                            isClosed ? "text-jade-950" : "text-paper",
                        )}
                    >
                        {t.subject}
                    </h1>

                    <div className="relative mt-3 flex flex-wrap items-center gap-1.5">
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                supportTicketStatusStyles[t.status],
                            )}
                        >
                            {supportTicketStatusLabel(t.status)}
                        </span>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                supportTicketPriorityStyles[t.priority],
                            )}
                        >
                            {supportTicketPriorityLabel(t.priority)}
                        </span>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                supportTicketCategoryStyles[t.category],
                            )}
                        >
                            {supportTicketCategoryLabel(t.category)}
                        </span>
                        <span
                            className={cn(
                                "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium tabular-nums",
                                isClosed
                                    ? "border-rule-soft bg-cream/60 text-ink-soft"
                                    : "border-paper/15 bg-paper/5 text-paper/85",
                            )}
                        >
                            <Calendar size={11} />
                            {formatRelativeTime(t.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Details */}
                <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                    <dl className="divide-y divide-rule-soft">
                        {t.organization && (
                            <DetailRow
                                icon={<Building2 size={13} />}
                                label="Organization"
                            >
                                <span className="text-ink">
                                    {t.organization.name}
                                </span>
                            </DetailRow>
                        )}
                        {t.createdBy && (
                            <DetailRow
                                icon={<UserCircle size={13} />}
                                label="Filed by"
                            >
                                <span className="text-ink">
                                    {t.createdBy.name}
                                </span>
                            </DetailRow>
                        )}
                        <DetailRow icon={<Tag size={13} />} label="Category">
                            <span
                                className={cn(
                                    "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                    supportTicketCategoryStyles[t.category],
                                )}
                            >
                                {supportTicketCategoryLabel(t.category)}
                            </span>
                        </DetailRow>
                        <DetailRow icon={<Calendar size={13} />} label="Filed">
                            <span className="tabular-nums text-ink">
                                {formatSupportTicketDate(t.createdAt)}
                                <span className="ml-1.5 text-ink-soft/70">
                                    · {formatRelativeTime(t.createdAt)}
                                </span>
                            </span>
                        </DetailRow>
                    </dl>
                </div>

                {/* Thread */}
                <TicketThread
                    messages={t.messages}
                    closed={isClosed}
                    isReplying={addMessage.isPending}
                    onReply={(body) => addMessage.mutate({ body })}
                />
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
