"use client";

// src/app/admin/dashboard/users/page.tsx
//
// SUPER_ADMIN users management — view & soft-delete any user across all
// organizations.

import { UsersTable } from "@/src/components/dashboard/users/UsersTable";

export default function AdminUsersPage() {
    return (
        <UsersTable title="All users" />
    );
}
