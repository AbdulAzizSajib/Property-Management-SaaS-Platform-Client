"use client";

// src/components/dashboard/users/StaffForm.tsx
//
// Create-staff form — invokes POST /users/create-staff. Used by OWNER
// (creates MANAGER or CARETAKER) and SUPER_ADMIN.

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useBuildings } from "@/src/hooks/useBuildings";
import { cn } from "@/src/lib/utils";
import type { CreateStaffPayload } from "@/src/types/user.types";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface StaffFormProps {
    submitting: boolean;
    onSubmit: (payload: CreateStaffPayload) => void;
    onCancel: () => void;
}

export function StaffForm({ submitting, onSubmit, onCancel }: StaffFormProps) {
    const { data: buildings } = useBuildings();
    const [role, setRole] = useState<"MANAGER" | "CARETAKER">("MANAGER");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [password, setPassword] = useState("");
    const [buildingIds, setBuildingIds] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const toggleBuilding = (id: string) =>
        setBuildingIds((curr) =>
            curr.includes(id) ? curr.filter((b) => b !== id) : [...curr, id],
        );

    const submit = () => {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = "Required";
        if (!email.trim()) e.email = "Required";
        if (password.length < 6) e.password = "Min 6 characters";
        setErrors(e);
        if (Object.keys(e).length) return;

        onSubmit({
            password,
            role,
            user: {
                name: name.trim(),
                email: email.trim(),
                ...(contactNumber.trim() && {
                    contactNumber: contactNumber.trim(),
                }),
            },
            buildingIds,
        });
    };

    return (
        <div className="flex max-h-[calc(100vh-8rem)] flex-col">
            <div className="border-b border-rule-soft px-5 py-4">
                <h2 className="text-[18px] font-bold tracking-[-0.01em] text-jade-950">
                    Add staff member
                </h2>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                {/* Role */}
                <div>
                    <p className="text-[12px] font-semibold text-ink">
                        Role
                        <span className="ml-0.5 text-coral-600">*</span>
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {(["MANAGER", "CARETAKER"] as const).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={cn(
                                    "rounded-md border px-3 py-2 text-left transition-colors",
                                    role === r
                                        ? "border-jade-700 bg-jade-50 text-jade-900"
                                        : "border-rule-soft bg-paper text-ink-soft hover:border-jade-700/30",
                                )}
                            >
                                <p className="text-[13px] font-semibold">
                                    {r === "MANAGER" ? "Manager" : "Caretaker"}
                                </p>
                                <p className="text-[11px] opacity-80">
                                    {r === "MANAGER"
                                        ? "Operates buildings on owner's behalf"
                                        : "Limited: rent collection & complaints"}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <Field label="Full name" required error={errors.name}>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Hasan Ali"
                    />
                </Field>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Email" required error={errors.email}>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="hasan@example.com"
                        />
                    </Field>
                    <Field label="Phone">
                        <Input
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="01711000222"
                        />
                    </Field>
                </div>

                <Field
                    label="Temporary password"
                    required
                    hint="Staff can change it after first login."
                    error={errors.password}
                >
                    <Input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                    />
                </Field>

                <div>
                    <p className="text-[12px] font-semibold text-ink">
                        Assigned buildings
                    </p>
                    <p className="text-[11px] text-ink-soft">
                        Leave empty to assign later.
                    </p>
                    <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md border border-rule-soft bg-cream/40 p-2">
                        {(buildings ?? []).length === 0 ? (
                            <p className="px-1 py-1 text-[12px] text-ink-soft">
                                No buildings yet.
                            </p>
                        ) : (
                            buildings!.map((b) => {
                                const selected = buildingIds.includes(b.id);
                                return (
                                    <label
                                        key={b.id}
                                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-[12.5px] hover:bg-paper"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={() => toggleBuilding(b.id)}
                                            className="size-3.5"
                                        />
                                        <span className="truncate text-ink">
                                            {b.name}
                                        </span>
                                    </label>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-rule-soft bg-cream/40 px-5 py-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="bg-jade-900 text-paper hover:bg-jade-950"
                >
                    {submitting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Creating…
                        </>
                    ) : (
                        "Create staff"
                    )}
                </Button>
            </div>
        </div>
    );
}

function Field({
    label,
    required,
    hint,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block space-y-1">
            <span className="text-[12px] font-semibold text-ink">
                {label}
                {required && <span className="ml-0.5 text-coral-600">*</span>}
            </span>
            {children}
            {error ? (
                <p className="text-[11px] font-medium text-coral-600">{error}</p>
            ) : hint ? (
                <p className="text-[11px] text-ink-soft">{hint}</p>
            ) : null}
        </label>
    );
}
