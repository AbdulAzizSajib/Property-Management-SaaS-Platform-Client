"use client";

// src/components/dashboard/NotificationsBell.tsx
//
// Drop-in replacement for the static bell button in Owner/Admin topbars.
// Renders a popover with a paginated, mark-as-read notification list.

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
    useNotifications,
} from "@/src/hooks/useNotifications";
import { cn } from "@/src/lib/utils";
import type { AppNotification } from "@/src/types/notification.types";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import Link from "next/link";

function formatTimeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "just now";
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    if (day < 30) return `${day}d ago`;
    return new Date(iso).toLocaleDateString();
}

export function NotificationsBell() {
    const { data, isLoading } = useNotifications({ limit: 20 });
    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();

    const items: AppNotification[] = data ?? [];
    const unreadCount = items.filter((n) => n.status === "PENDING").length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label={
                    unreadCount > 0
                        ? `Notifications (${unreadCount} unread)`
                        : "Notifications"
                }
                className="relative inline-flex size-9 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-cream hover:text-jade-900 data-[state=open]:bg-cream"
            >
                <Bell size={17} />
                {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-coral-500 opacity-70" />
                        <span className="relative h-2 w-2 rounded-full bg-coral-600 ring-2 ring-paper" />
                    </span>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[360px] max-w-[calc(100vw-2rem)] border-rule-soft bg-paper p-0"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-rule-soft px-3 py-2.5">
                    <div>
                        <p className="text-[13px] font-semibold text-jade-950">
                            Notifications
                        </p>
                        <p className="font-bangla text-[10.5px] text-ink-soft/75">
                            নোটিফিকেশন
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            disabled={markAllRead.isPending}
                            onClick={() => markAllRead.mutate()}
                            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-jade-700 transition-colors hover:bg-jade-50 disabled:opacity-50"
                        >
                            {markAllRead.isPending ? (
                                <Loader2 size={10} className="animate-spin" />
                            ) : (
                                <CheckCheck size={10} />
                            )}
                            Mark all read
                        </button>
                    )}
                </div>

                {/* List */}
                <div className="max-h-[420px] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2 py-8 text-[12px] text-ink-soft">
                            <Loader2 size={13} className="animate-spin" />
                            Loading…
                        </div>
                    ) : items.length === 0 ? (
                        <div className="px-3 py-10 text-center">
                            <p className="text-[12.5px] font-semibold text-ink">
                                You&apos;re all caught up
                            </p>
                            <p className="font-bangla text-[10.5px] text-ink-soft/75">
                                কোনো নতুন নোটিফিকেশন নেই
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-rule-soft">
                            {items.map((n) => (
                                <NotificationRow
                                    key={n.id}
                                    notification={n}
                                    onRead={() => markRead.mutate(n.id)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function NotificationRow({
    notification,
    onRead,
}: {
    notification: AppNotification;
    onRead: () => void;
}) {
    const isUnread = notification.status === "PENDING";

    const inner = (
        <div
            className={cn(
                "flex gap-2.5 px-3 py-2.5 transition-colors",
                isUnread ? "bg-jade-50/40" : "bg-transparent",
                "hover:bg-cream/60",
            )}
        >
            {/* unread dot */}
            <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center">
                {isUnread && (
                    <span className="h-2 w-2 rounded-full bg-coral-600" />
                )}
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold text-ink">
                    {notification.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11.5px] text-ink-soft">
                    {notification.message}
                </p>
                <p className="mt-1 text-[10.5px] text-ink-soft/65">
                    {formatTimeAgo(notification.createdAt)}
                </p>
            </div>
        </div>
    );

    if (notification.actionUrl) {
        return (
            <li>
                <Link
                    href={notification.actionUrl}
                    onClick={() => isUnread && onRead()}
                    className="block"
                >
                    {inner}
                </Link>
            </li>
        );
    }

    return (
        <li>
            <button
                type="button"
                onClick={() => isUnread && onRead()}
                className="block w-full text-left"
            >
                {inner}
            </button>
        </li>
    );
}
