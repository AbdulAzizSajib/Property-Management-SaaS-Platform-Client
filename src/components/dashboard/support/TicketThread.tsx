"use client";

// src/components/dashboard/support/TicketThread.tsx
//
// Message thread for a support ticket, reused by both the owner and
// admin detail pages. Renders messages oldest-first and a reply
// composer that disables itself (with an explanation) once the ticket
// is CLOSED.

import { fieldClass } from "@/src/components/dashboard/forms/form-primitives";
import { formatRelativeTime } from "@/src/components/dashboard/support/supportTicketStyles";
import { Textarea } from "@/src/components/ui/textarea";
import type { SupportTicketMessage } from "@/src/types/supportTicket.types";
import { Loader2, Lock, Paperclip, Send, UserCircle } from "lucide-react";
import { useState } from "react";

interface TicketThreadProps {
    messages: SupportTicketMessage[];
    closed: boolean;
    onReply: (body: string) => void;
    isReplying: boolean;
}

export function TicketThread({
    messages,
    closed,
    onReply,
    isReplying,
}: TicketThreadProps) {
    const [body, setBody] = useState("");

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        const trimmed = body.trim();
        if (!trimmed) return;
        onReply(trimmed);
        setBody("");
    }

    return (
        <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
            <div className="border-b border-rule-soft px-6 py-4 sm:px-8">
                <p className="font-serif text-[12.5px] italic text-coral-600/85">
                    Conversation
                </p>
            </div>

            {messages.length === 0 ? (
                <p className="px-6 py-8 text-center text-[13px] text-ink-soft sm:px-8">
                    No messages yet.
                </p>
            ) : (
                <ul className="divide-y divide-rule-soft">
                    {messages.map((m) => (
                        <li key={m.id} className="px-6 py-4 sm:px-8">
                            <div className="flex items-center gap-2">
                                <UserCircle
                                    size={14}
                                    className="text-ink-soft/60"
                                />
                                <span className="text-[12.5px] font-semibold text-ink">
                                    {m.author?.name ?? "Unknown"}
                                </span>
                                {m.author?.role && (
                                    <span className="text-[11px] text-ink-soft">
                                        · {m.author.role}
                                    </span>
                                )}
                                <span className="ml-auto text-[11px] text-ink-soft/75 tabular-nums">
                                    {formatRelativeTime(m.createdAt)}
                                </span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-ink">
                                {m.body}
                            </p>
                            {m.attachmentUrls.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {m.attachmentUrls.map((url) => (
                                        <a
                                            key={url}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-[11.5px] font-medium text-jade-900 hover:text-coral-600"
                                        >
                                            <Paperclip size={11} />
                                            Attachment
                                        </a>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <div className="border-t border-rule-soft px-6 py-4 sm:px-8">
                {closed ? (
                    <p className="flex items-center gap-1.5 text-[12.5px] text-ink-soft">
                        <Lock size={12} />
                        This ticket is closed. Replies can no longer be
                        added — open a new ticket if you need further help.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-2.5">
                        <Textarea
                            rows={3}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write a reply…"
                            className={`${fieldClass} resize-none`}
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isReplying || !body.trim()}
                                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-sky-950 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-sky-950 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isReplying ? (
                                    <>
                                        <Loader2
                                            size={14}
                                            className="animate-spin"
                                        />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <Send size={13} />
                                        Reply
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
