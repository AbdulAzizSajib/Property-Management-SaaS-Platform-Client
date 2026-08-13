"use client";

// src/components/dashboard/auth/EditProfileDialog.tsx

import { Button } from "@/src/components/ui/button";
import { Dialog, DialogPortal } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { useCurrentUser, useUpdateMyProfile } from "@/src/hooks/useAuthActions";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Loader2, Upload, User as UserIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export function EditProfileDialog({ open, onOpenChange }: Props) {
    const { data: me } = useCurrentUser();
    const [name, setName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mut = useUpdateMyProfile();

    // Prefill from the current user whenever the dialog opens.
    useEffect(() => {
        if (!open || !me) return;
        setName(me.name ?? "");
        setContactNumber(me.contactNumber ?? "");
        setImage(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [open, me]);

    // Build/revoke an object URL preview for a newly picked file.
    useEffect(() => {
        if (!image) {
            setImagePreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(image);
        setImagePreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const next = e.target.files?.[0] ?? null;
        if (next && next.size > MAX_IMAGE_BYTES) {
            setError("Image must be 5 MB or smaller");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }
        setError(null);
        setImage(next);
    }

    function clearImage() {
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const submit = () => {
        setError(null);

        const trimmedName = name.trim();
        if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 50) {
            setError("Name must be 3–50 characters");
            return;
        }

        const trimmedPhone = contactNumber.trim();
        if (
            trimmedPhone &&
            (trimmedPhone.length < 11 || trimmedPhone.length > 15)
        ) {
            setError("Contact number must be 11–15 characters");
            return;
        }

        mut.mutate(
            {
                name: trimmedName,
                contactNumber: trimmedPhone || undefined,
                image: image ?? undefined,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            },
        );
    };

    // Preview shows: newly picked file > existing saved avatar > placeholder.
    const previewSrc = imagePreviewUrl ?? me?.image ?? null;

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
                        Edit profile
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Update your name, contact number, and profile photo.
                    </DialogPrimitive.Description>

                    <div className="border-b border-rule-soft px-5 py-4">
                        <h2 className="text-[18px] font-bold tracking-[-0.01em] text-jade-950">
                            My profile
                        </h2>
                    </div>

                    <div className="space-y-3 px-5 py-5">
                        <Field label="Photo">
                            <div className="flex items-center gap-3">
                                <span className="relative inline-flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-jade-50 ring-1 ring-jade-100">
                                    {previewSrc ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={previewSrc}
                                            alt="Profile"
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon
                                            size={22}
                                            className="text-jade-700"
                                        />
                                    )}
                                </span>
                                <div className="flex flex-1 items-center gap-2">
                                    <label
                                        htmlFor="edit-profile-image"
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-rule-soft bg-cream/40 px-2.5 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:border-jade-700/40 hover:bg-cream/70"
                                    >
                                        <Upload size={12} />
                                        {image ? "Change photo" : "Upload photo"}
                                        <input
                                            id="edit-profile-image"
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="sr-only"
                                        />
                                    </label>
                                    {image && (
                                        <button
                                            type="button"
                                            onClick={clearImage}
                                            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-cream hover:text-coral-600"
                                            aria-label="Remove selected photo"
                                        >
                                            <X size={13} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Field>
                        <Field label="Name">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />
                        </Field>
                        <Field label="Contact number">
                            <Input
                                value={contactNumber}
                                onChange={(e) =>
                                    setContactNumber(e.target.value)
                                }
                                autoComplete="tel"
                            />
                        </Field>
                        {error && (
                            <p className="text-[12px] font-medium text-coral-600">
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
                            className="bg-sky-950 text-paper hover:bg-sky-950"
                        >
                            {mut.isPending ? (
                                <>
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                    Saving…
                                </>
                            ) : (
                                "Save changes"
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
