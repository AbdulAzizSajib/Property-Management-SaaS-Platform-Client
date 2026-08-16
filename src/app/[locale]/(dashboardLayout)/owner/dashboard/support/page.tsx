"use client";

// src/app/owner/dashboard/support/page.tsx

import { CreateSupportTicketDialog } from "@/src/components/dashboard/support/CreateSupportTicketDialog";
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
import { useOrganization } from "@/src/hooks/useOrganization";
import { useMySupportTickets } from "@/src/hooks/useSupportTickets";
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
    LifeBuoy,
    Mail,
    MessageCircleQuestion,
    Phone,
    Plus,
    Ticket,
} from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useState } from "react";

const ALL = "All";
const SUPPORT_EMAIL = "support@saasly.app";
const SUPPORT_PHONE = "+8801711000111";

const faqs = [
    {
        q: "How do I add a new unit or building?",
        a: "Go to Buildings from the sidebar, open a building, then use \"Add unit\" inside it. Units become available for leasing right away.",
    },
    {
        q: "How do I upgrade or change my subscription plan?",
        a: "Visit Organization → Manage subscription, or go directly to the Subscription page to compare plans and upgrade.",
    },
    {
        q: "A tenant's invoice or payment looks wrong — what do I do?",
        a: "Open the invoice from Invoices, check the collection entries under Collection, and correct or reissue it from there. If the numbers still don't match, file a ticket with the invoice ID.",
    },
    {
        q: "How long does a support request take to resolve?",
        a: "We usually reply within one business day. Urgent billing or access issues are prioritised.",
    },
];

export default function OwnerSupportPage() {
    const { data: org } = useOrganization();
    const [statusFilter, setStatusFilter] = useState<string>(ALL);
    const [categoryFilter, setCategoryFilter] = useState<string>(ALL);
    const [createOpen, setCreateOpen] = useState(false);

    const filters = {
        ...(statusFilter !== ALL && {
            status: statusFilter as SupportTicketStatus,
        }),
        ...(categoryFilter !== ALL && {
            category: categoryFilter as SupportTicketCategory,
        }),
    };

    const {
        data: tickets,
        isLoading,
        isError,
        error,
    } = useMySupportTickets(filters);

    const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
        `Support request${org?.name ? ` — ${org.name}` : ""}`,
    )}`;

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-270 space-y-5 p-4 sm:p-6 lg:p-8">
                {/* Heading */}
                <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            We&apos;re here to help
                        </p>
                        <h1 className="mt-0.5 flex items-center gap-2 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            <LifeBuoy size={24} className="text-jade-700" />
                            Support
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-sky-950 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-sky-950"
                    >
                        <Plus size={14} />
                        New ticket
                    </button>
                </header>

                {/* Filters */}
                <div className="rounded-[14px] border border-rule-soft bg-paper p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                    <EmptyState onCreate={() => setCreateOpen(true)} />
                ) : (
                    <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                        <ul className="divide-y divide-rule-soft">
                            {tickets.map((t) => (
                                <TicketRow key={t.id} ticket={t} />
                            ))}
                        </ul>
                    </div>
                )}

                {/* Contact + FAQ — secondary to the ticket workspace */}
                <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                    <div className="border-b border-rule-soft px-5 py-4 sm:px-6">
                        <p className="font-serif text-[12.5px] italic text-coral-600/85">
                            Prefer to reach out directly?
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

                <p className="text-center text-[12px] text-ink-soft">
                    Looking for subscription details instead?{" "}
                    <Link
                        href="/owner/dashboard/subscription"
                        className="font-semibold text-jade-900 hover:text-coral-600 transition-colors"
                    >
                        Go to Subscription →
                    </Link>
                </p>

                {/* Dialog */}
                <CreateSupportTicketDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                />
            </div>
        </div>
    );
}

function TicketRow({ ticket }: { ticket: SupportTicket }) {
    const lastMessage = ticket.messages[ticket.messages.length - 1];

    return (
        <li>
            <Link
                href={`/owner/dashboard/support/${ticket.id}`}
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

function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
                <LifeBuoy size={26} className="text-jade-800" />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-jade-950">
                No support tickets yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
                Run into a problem or have a question for the platform team?
                File a ticket and we&apos;ll get back to you here.
            </p>
            <div className="mt-5 flex items-center justify-center">
                <button
                    type="button"
                    onClick={onCreate}
                    className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-sky-950 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-sky-950"
                >
                    <Plus size={14} />
                    New ticket
                </button>
            </div>
        </div>
    );
}
