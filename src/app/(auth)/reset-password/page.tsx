"use client";

// src/app/(auth)/reset-password/page.tsx
//
// Step 2 of password recovery — submit OTP + new password.

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useResetPassword } from "@/src/hooks/useAuthActions";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordForm />
        </Suspense>
    );
}

function ResetPasswordForm() {
    const router = useRouter();
    const params = useSearchParams();
    const [email, setEmail] = useState(params.get("email") ?? "");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const mut = useResetPassword();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email || !otp || !newPassword) {
            setError("All fields are required");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        mut.mutate(
            { email, otp, newPassword },
            {
                onSuccess: () => {
                    router.push("/login");
                },
            },
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
            <div className="w-full max-w-md rounded-[16px] border border-rule-soft bg-paper p-6 shadow-sm">
                <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-jade-50 text-jade-700">
                    <ShieldCheck size={18} />
                </span>
                <h1 className="mt-3 text-[22px] font-bold tracking-[-0.01em] text-jade-950">
                    Reset your password
                </h1>
                <p className="font-bangla mt-1 text-[12px] text-ink-soft">
                    ইমেইলে পাঠানো OTP দিয়ে নতুন পাসওয়ার্ড সেট করুন
                </p>

                <form onSubmit={submit} className="mt-5 space-y-3">
                    <Field label="Email">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </Field>
                    <Field label="OTP code" hint="6-digit code from email">
                        <Input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            inputMode="numeric"
                            placeholder="123456"
                            className="tracking-[0.4em] text-center font-mono"
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

                    {error && (
                        <p className="text-[12px] font-medium text-coral-700">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={mut.isPending}
                        className="w-full bg-jade-900 text-paper hover:bg-jade-950"
                    >
                        {mut.isPending ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Resetting…
                            </>
                        ) : (
                            <>
                                Reset password
                                <ArrowRight size={14} />
                            </>
                        )}
                    </Button>
                </form>

                <p className="mt-4 text-center text-[12px] text-ink-soft">
                    Didn&apos;t get the code?{" "}
                    <Link
                        href="/forgot-password"
                        className="font-semibold text-jade-700 hover:text-coral-600"
                    >
                        Send again
                    </Link>
                </p>
            </div>
        </div>
    );
}

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block space-y-1">
            <span className="text-[12px] font-semibold text-ink">{label}</span>
            {children}
            {hint && <p className="text-[11px] text-ink-soft">{hint}</p>}
        </label>
    );
}
