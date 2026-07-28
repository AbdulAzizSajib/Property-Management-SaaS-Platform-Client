"use client";

// src/app/owner/dashboard/staff/page.tsx
//
// Lists managers + caretakers belonging to the caller's organization.
// "Add staff" opens a dialog that calls POST /users/create-staff.

import { StaffForm } from "@/src/components/dashboard/users/StaffForm";
import {
    UserPlus,
    UsersTable,
} from "@/src/components/dashboard/users/UsersTable";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogPortal } from "@/src/components/ui/dialog";
import { useCreateStaff } from "@/src/hooks/useUsers";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useState } from "react";

export default function OwnerStaffPage() {
    const [open, setOpen] = useState(false);
    const createMut = useCreateStaff();

    return (
        <>
            <UsersTable
                roles={["MANAGER", "CARETAKER"]}
                title="Staff"
                headerAction={
                    <Button
                        onClick={() => setOpen(true)}
                        className="bg-jade-900 text-paper hover:bg-jade-950"
                    >
                        <UserPlus size={14} />
                        Add staff
                    </Button>
                }
            />

            <Dialog
                open={open}
                onOpenChange={(o) => {
                    if (!o && !createMut.isPending) setOpen(false);
                }}
            >
                <DialogPortal>
                    <DialogPrimitive.Backdrop className="fixed inset-0 isolate z-50 bg-black/20 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
                    <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-rule-soft bg-paper shadow-2xl outline-none sm:max-w-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
                        <DialogPrimitive.Title className="sr-only">
                            Add staff member
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Description className="sr-only">
                            Create a new manager or caretaker account.
                        </DialogPrimitive.Description>
                        <StaffForm
                            submitting={createMut.isPending}
                            onCancel={() => setOpen(false)}
                            onSubmit={(payload) =>
                                createMut.mutate(payload, {
                                    onSuccess: () => setOpen(false),
                                })
                            }
                        />
                    </DialogPrimitive.Popup>
                </DialogPortal>
            </Dialog>
        </>
    );
}
