"use client";

// src/components/dashboard/users/UsersTable.tsx
//
// Reusable table for the /users endpoint. Owner uses it on Staff page,
// admin uses it on Users page (with full role filter). Soft-delete and
// edit are wired through.

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useDeleteUser, useUpdateUser, useUsers } from "@/src/hooks/useUsers";
import { cn } from "@/src/lib/utils";
import type { UserRole } from "@/src/lib/authUtils";
import { Loader2, Power, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";

interface UsersTableProps {
    /** Restrict the list to a subset of roles. Empty = all. */
    roles?: UserRole[];
    /** Heading override. */
    title?: string;
    bnTitle?: string;
    /** Slot for the page-level "Add" button. */
    headerAction?: React.ReactNode;
}

export function UsersTable({
    roles,
    title = "Users",
    bnTitle,
    headerAction,
}: UsersTableProps) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const filters = {
        page,
        limit: 20,
        ...(roles && roles.length === 1 && { role: roles[0] }),
        ...(search && { search }),
    };

    const { data, isLoading, isError, error } = useUsers(filters);
    const deleteMut = useDeleteUser();
    const [toDeactivate, setToDeactivate] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const items = data?.items ?? [];
    const filteredItems =
        roles && roles.length > 1
            ? items.filter((u) => roles.includes(u.role))
            : items;

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1240px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            People & access
                        </p>
                        <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            {title}
                        </h1>
                        {bnTitle && (
                            <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                                {bnTitle}
                            </p>
                        )}
                    </div>
                    {headerAction}
                </header>

                {/* Search */}
                <div className="rounded-[14px] border border-rule-soft bg-paper p-3">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by name or email…"
                        className="w-full rounded-md border border-rule-soft bg-cream/40 px-3 py-1.5 text-[13px] outline-none focus:border-jade-700 focus:bg-paper"
                    />
                </div>

                {/* Table */}
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-16 rounded-[10px] bg-paper"
                            />
                        ))}
                    </div>
                ) : isError ? (
                    <ErrorBlock
                        message={
                            error instanceof Error
                                ? error.message
                                : "Could not load users."
                        }
                    />
                ) : filteredItems.length === 0 ? (
                    <div className="rounded-[14px] border border-dashed border-rule-soft bg-paper px-6 py-12 text-center">
                        <p className="text-[14px] font-semibold text-jade-950">
                            No users yet
                        </p>
                        <p className="mt-1 text-[12px] text-ink-soft">
                            Add your first {title.toLowerCase()} above.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                        <table className="w-full text-[13px]">
                            <thead className="bg-cream/60 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                                <tr>
                                    <Th>Name</Th>
                                    <Th>Email</Th>
                                    <Th>Role</Th>
                                    <Th>Status</Th>
                                    <Th className="text-right">Actions</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-rule-soft">
                                {filteredItems.map((u) => (
                                    <UserRow
                                        key={u.id}
                                        user={u}
                                        onAskDeactivate={() =>
                                            setToDeactivate({
                                                id: u.id,
                                                name: u.name,
                                            })
                                        }
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                    <div className="flex items-center justify-between text-[12px] text-ink-soft">
                        <span>
                            Page {data.page} of {data.totalPages} ·{" "}
                            {data.total} total
                        </span>
                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page >= data.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Soft delete confirmation */}
            <AlertDialog
                open={toDeactivate !== null}
                onOpenChange={(open) => {
                    if (!open && !deleteMut.isPending) setToDeactivate(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate this user?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {toDeactivate?.name} will lose access immediately.
                            This is a soft delete — the record stays in the
                            database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            variant="outline"
                            disabled={deleteMut.isPending}
                            onClick={() => setToDeactivate(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleteMut.isPending}
                            onClick={() => {
                                if (!toDeactivate) return;
                                deleteMut.mutate(toDeactivate.id, {
                                    onSuccess: () => setToDeactivate(null),
                                });
                            }}
                        >
                            {deleteMut.isPending ? (
                                <>
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                    Deactivating…
                                </>
                            ) : (
                                <>
                                    <Trash2 size={14} />
                                    Deactivate
                                </>
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function Th({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th className={cn("px-3 py-2 text-left font-semibold", className)}>
            {children}
        </th>
    );
}

function Td({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <td className={cn("px-3 py-2 align-middle", className)}>{children}</td>;
}

function UserRow({
    user,
    onAskDeactivate,
}: {
    user: import("@/src/types/user.types").User;
    onAskDeactivate: () => void;
}) {
    const updateMut = useUpdateUser(user.id);

    const initials = user.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <tr className="bg-paper hover:bg-cream/40">
            <Td>
                <div className="flex items-center gap-2">
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-jade-50 text-[10.5px] font-bold text-jade-800 ring-1 ring-jade-100">
                        {initials}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">
                            {user.name}
                        </p>
                        {user.contactNumber && (
                            <p className="truncate text-[11px] text-ink-soft">
                                {user.contactNumber}
                            </p>
                        )}
                    </div>
                </div>
            </Td>
            <Td>
                <span className="text-ink-soft">{user.email}</span>
            </Td>
            <Td>
                <span className="rounded-md bg-jade-50 px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-jade-800">
                    {user.role.replace("_", " ")}
                </span>
            </Td>
            <Td>
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider",
                        user.isActive
                            ? "border-jade-100 bg-jade-50/60 text-jade-700"
                            : "border-rule-soft bg-cream text-ink-soft",
                    )}
                >
                    <span
                        className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            user.isActive ? "bg-jade-600" : "bg-ink-soft/50",
                        )}
                    />
                    {user.isActive ? "Active" : "Inactive"}
                </span>
            </Td>
            <Td className="text-right">
                <div className="inline-flex items-center gap-1.5">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={updateMut.isPending}
                        onClick={() =>
                            updateMut.mutate({ isActive: !user.isActive })
                        }
                    >
                        {updateMut.isPending ? (
                            <Loader2 size={12} className="animate-spin" />
                        ) : (
                            <Power size={12} />
                        )}
                        {user.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onAskDeactivate}
                        className="text-coral-600 hover:bg-coral-50 hover:text-coral-600"
                        aria-label="Delete user"
                    >
                        <Trash2 size={12} />
                    </Button>
                </div>
            </Td>
        </tr>
    );
}

function ErrorBlock({ message }: { message: string }) {
    return (
        <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
            <h2 className="text-[15px] font-bold text-coral-600">
                Couldn&apos;t load users
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
                {message}
            </p>
        </div>
    );
}

// Re-export the add icon for pages that want their own header action.
export { UserPlus };
