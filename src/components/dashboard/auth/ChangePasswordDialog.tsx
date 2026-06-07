"use client";

// src/components/dashboard/auth/ChangePasswordDialog.tsx

import { Button } from "@/src/components/ui/button";
import { Dialog, DialogPortal } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { useChangePassword } from "@/src/hooks/useAuthActions";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: Props) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const mut = useChangePassword();

    const submit = () => {
        setError(null);
        if (!currentPassword || !newPassword) {
            setError("Both fields are required");
            return;
        }
        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirm) {
            setError("Confirmation doesn't match");
            return;
        }
        mut.mutate(
            { currentPassword, newPassword },
            {
                onSuccess: () => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirm("");
                    onOpenChange(false);
                },
            },
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                if (!mut.isPending) onOpenChange(o);
            }}
        >
            <DialogPortal>
                <DialogPrimitive.Backdrop className="fixed inset-0 isolate z-50 bg-black/20 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
                <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-rule-soft bg-paper shadow-2xl outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
                    <DialogPrimitive.Title className="sr-only">
                        Change password
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Update the password for your account.
                    </DialogPrimitive.Description>

                    <div className="border-b border-rule-soft px-5 py-4">
                        <h2 className="text-[18px] font-bold tracking-[-0.01em] text-jade-950">
                            Change password
                        </h2>
                        <p className="font-bangla mt-0.5 text-[12px] text-ink-soft">
                            পাসওয়ার্ড পরিবর্তন করুন
                        </p>
                    </div>

                    <div className="space-y-3 px-5 py-5">
                        <Field label="Current password">
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                autoComplete="current-password"
                            />
                        </Field>
                        <Field label="New password">
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </Field>
                        <Field label="Confirm new password">
                            <Input
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                autoComplete="new-password"
                            />
                        </Field>
                        {error && (
                            <p className="text-[12px] font-medium text-coral-700">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-rule-soft bg-cream/40 px-5 py-3">
                        <Button
                            variant="outline"
                            disabled={mut.isPending}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={mut.isPending}
                            onClick={submit}
                            className="bg-jade-900 text-paper hover:bg-jade-950"
                        >
                            {mut.isPending ? (
                                <>
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                    Updating…
                                </>
                            ) : (
                                "Change password"
                            )}
                        </Button>
                    </div>
                </DialogPrimitive.Popup>
            </DialogPortal>
        </Dialog>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block space-y-1">
            <span className="text-[12px] font-semibold text-ink">{label}</span>
            {children}
        </label>
    );
}
