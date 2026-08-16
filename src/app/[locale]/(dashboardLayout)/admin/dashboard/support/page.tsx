"use client";

// src/app/admin/dashboard/support/page.tsx

import {
    formatRelativeTime,
    supportTicketCategoryLabel,
    supportTicketCategoryStyles,
    supportTicketPriorityDot,
    supportTicketPriorityLabel,
    supportTicketStatusAccent,
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
import { useAllSupportTickets } from "@/src/hooks/useSupportTickets";
import { cn } from "@/src/lib/utils";
import {
    SUPPORT_TICKET_CATEGORY_OPTIONS,
    SUPPORT_TICKET_STATUS_OPTIONS,
    type SupportTicket,
    type SupportTicketCategory,
    type SupportTicketStatus,
} from "@/src/types/supportTicket.types";
import {
    ArrowUpRight,
    Building2,
    LifeBuoy,
    Mail,
    MessageCircleQuestion,
    Phone,
    Search,
    Ticket,
    X,
} from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useState } from "react";

const ALL = "All";
const SUPPORT_EMAIL = "platform@saasly.app";
const SUPPORT_PHONE = "+8801711000111";

const faqs = [
    {
        q: "How do I approve or reject a subscription request?",
        a: "Go to Subscription requests, filter by Pending, and use the Approve / Reject actions on each row.",
    },
    {
        q: "How do I change a plan's pricing or limits?",
        a: "Open Plans from the sidebar to edit pricing, unit limits, and features for each tier.",
    },
    {
        q: "An organisation reports a billing discrepancy — what do I do?",
        a: "Cross-check their subscription history under Subscription requests and their organisation record. Escalate to engineering if the ledger itself looks wrong.",
    },
    {
        q: "How fast are platform support requests handled?",
        a: "Internal/platform issues are typically triaged within one business day.",
    },
];

export default function AdminSupportPage() {
    const [statusFilter, setStatusFilter] = useState<string>(ALL);
    const [categoryFilter, setCategoryFilter] = useState<string>(ALL);
    const [orgQuery, setOrgQuery] = useState("");

    const filters = {
        ...(statusFilter !== ALL && {
            status: statusFilter as SupportTicketStatus,
        }),
        ...(categoryFilter !== ALL && {
            category: categoryFilter as SupportTicketCategory,
        }),
    };

    const { data: tickets, isLoading, isError, error } =
        useAllSupportTickets(filters);

    const filtered = (tickets ?? []).filter((t) => {
        const q = orgQuery.trim().toLowerCase();
        if (!q) return true;
        return (
            t.organization?.name.toLowerCase().includes(q) ||
            t.organization?.id.toLowerCase().includes(q)
        );
    });

    const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
        "Platform support request",
    )}`;

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-270 space-y-5 p-4 sm:p-6 lg:p-8">
                {/* Heading */}
                <header>
                    <p className="font-serif text-[13px] italic text-coral-600/85">
                        Platform operations
                    </p>
                    <h1 className="mt-0.5 flex items-center gap-2 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                        <LifeBuoy size={24} className="text-jade-700" />
                        Support
                    </h1>
                </header>

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
                                value={orgQuery}
                                onChange={(e) => setOrgQuery(e.target.value)}
                                placeholder="Filter by organization name or id…"
                                className="h-9 w-full rounded-md border border-rule-soft bg-paper pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-soft/60 focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
                            />
                        </div>

                        <div className="w-full sm:w-44">
                            <Select
                                value={statusFilter}
                                onValueChange={(v) => setStatusFilter(v ?? ALL)}
                            >
                                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>
                                        All statuses
                                    </SelectItem>
                                    {SUPPORT_TICKET_STATUS_OPTIONS.map(
                                        (opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-48">
                            <Select
                                value={categoryFilter}
                                onValueChange={(v) =>
                                    setCategoryFilter(v ?? ALL)
                                }
                            >
                                <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>
                                        All categories
                                    </SelectItem>
                                    {SUPPORT_TICKET_CATEGORY_OPTIONS.map(
                                        (opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {(filtered.length > 0 || orgQuery.trim()) && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-rule-soft pt-3 text-[12px] text-ink-soft">
                            <span className="tabular-nums">
                                <span className="font-semibold text-ink">
                                    {filtered.length}
                                </span>{" "}
                                {filtered.length === 1 ? "result" : "results"}
                            </span>
                            {orgQuery.trim() && (
                                <button
                                    type="button"
                                    onClick={() => setOrgQuery("")}
                                    className="inline-flex items-center gap-1 font-medium text-ink-soft transition-colors hover:text-coral-600"
                                >
                                    <X size={11} /> Clear
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Ticket list */}
                {isLoading ? (
                    <ListShell />
                ) : isError ? (
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load tickets
                        </h2>
                        <p className="mt-1 text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Please try again."}
                        </p>
                    </div>
                ) : !tickets || tickets.length === 0 ? (
                    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
                            <LifeBuoy size={26} className="text-jade-800" />
                        </div>
                        <h2 className="mt-4 text-[17px] font-bold text-jade-950">
                            No support tickets
                        </h2>
                        <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
                            Tickets filed by organizations will show up here.
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-12 text-center">
                        <p className="text-[13.5px] text-ink-soft">
                            No tickets match your filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                        <ul className="divide-y divide-rule-soft">
                            {filtered.map((t) => (
                                <TicketRow key={t.id} ticket={t} />
                            ))}
                        </ul>
                    </div>
                )}

                {/* Contact card */}
                <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                    <div className="border-b border-rule-soft px-5 py-4 sm:px-6">
                        <p className="font-serif text-[12.5px] italic text-coral-600/85">
                            Contact the platform team
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
                        <a
                            href={mailtoHref}
                            className="flex items-center gap-3 rounded-[10px] border border-rule-soft bg-cream/60 px-4 py-3.5 transition-colors hover:border-jade-700/30 hover:bg-jade-50/60"
                        >
                            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-jade-50 text-jade-800">
                                <Mail size={16} />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[12px] font-semibold text-jade-950">
                                    Email us
                                </span>
                                <span className="block truncate text-[12.5px] text-ink-soft">
                                    {SUPPORT_EMAIL}
                                </span>
                            </span>
                        </a>

                        <a
                            href={`tel:${SUPPORT_PHONE}`}
                            className="flex items-center gap-3 rounded-[10px] border border-rule-soft bg-cream/60 px-4 py-3.5 transition-colors hover:border-jade-700/30 hover:bg-jade-50/60"
                        >
                            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-jade-50 text-jade-800">
                                <Phone size={16} />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[12px] font-semibold text-jade-950">
                                    Call us
                                </span>
                                <span className="block truncate text-[12.5px] text-ink-soft tabular-nums">
                                    {SUPPORT_PHONE}
                                </span>
                            </span>
                        </a>
                    </div>
                    <p className="border-t border-rule-soft px-5 py-3 text-[11.5px] text-ink-soft sm:px-6">
                        For organisation-specific issues, include the
                        organisation name or ID so we can look it up quickly.
                    </p>
                </div>

                {/* FAQ */}
                <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                    <div className="flex items-center gap-2 border-b border-rule-soft px-5 py-4 sm:px-6">
                        <MessageCircleQuestion
                            size={15}
                            className="text-jade-700"
                        />
                        <p className="font-serif text-[12.5px] italic text-coral-600/85">
                            Frequently asked questions
                        </p>
                    </div>
                    <div className="divide-y divide-rule-soft">
                        {faqs.map((item) => (
                            <div key={item.q} className="px-5 py-4 sm:px-6">
                                <p className="text-[13.5px] font-semibold text-jade-950">
                                    {item.q}
                                </p>
                                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TicketRow({ ticket }: { ticket: SupportTicket }) {
    const lastMessage = ticket.messages[ticket.messages.length - 1];

    return (
        <li>
            <Link
                href={`/admin/dashboard/support/${ticket.id}`}
                className="group relative flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cream/60 sm:flex-row sm:items-start"
            >
                <span
                    aria-hidden
                    className={cn(
                        "absolute inset-y-0 left-0 w-[3px]",
                        supportTicketStatusAccent[ticket.status],
                    )}
                />

                <span
                    aria-hidden
                    title={supportTicketPriorityLabel(ticket.priority)}
                    className={cn(
                        "mt-1 ml-2 h-2 w-2 shrink-0 rounded-full",
                        supportTicketPriorityDot[ticket.priority],
                    )}
                />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-[13.5px] font-semibold text-jade-950 group-hover:text-jade-900">
                            {ticket.subject}
                        </p>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                supportTicketStatusStyles[ticket.status],
                            )}
                        >
                            {supportTicketStatusLabel(ticket.status)}
                        </span>
                        <span
                            className={cn(
                                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                supportTicketCategoryStyles[ticket.category],
                            )}
                        >
                            {supportTicketCategoryLabel(ticket.category)}
                        </span>
                    </div>

                    {lastMessage && (
                        <p className="mt-1 line-clamp-2 text-[12.5px] text-ink-soft">
                            {lastMessage.body}
                        </p>
                    )}

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-soft">
                        {ticket.organization && (
                            <span className="inline-flex items-center gap-1">
                                <Building2
                                    size={11}
                                    className="text-ink-soft/60"
                                />
                                <span className="text-ink">
                                    {ticket.organization.name}
                                </span>
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                            <Ticket size={11} className="text-ink-soft/60" />
                            {ticket.messages.length}{" "}
                            {ticket.messages.length === 1
                                ? "message"
                                : "messages"}
                        </span>
                        <span className="tabular-nums">
                            · {formatRelativeTime(ticket.updatedAt)}
                        </span>
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

function ListShell() {
    return (
        <div className="space-y-2">
            {[1, 2, 3].map((i) => (
                <Skeleton
                    key={i}
                    className="h-[72px] w-full rounded-[10px] bg-paper"
                />
            ))}
        </div>
    );
}
