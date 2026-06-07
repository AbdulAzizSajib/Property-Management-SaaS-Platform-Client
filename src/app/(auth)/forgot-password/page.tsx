"use client";

// src/app/(auth)/forgot-password/page.tsx
//
// Step 1 of password recovery — emails an OTP to the user.

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useForgetPassword } from "@/src/hooks/useAuthActions";
import { isEmail } from "@/src/lib/validation";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const mut = useForgetPassword();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!isEmail(email)) {
            setError("Enter a valid email address");
            return;
        }
        mut.mutate(
            { email },
            {
                onSuccess: () => {
                    router.push(
                        `/reset-password?email=${encodeURIComponent(email)}`,
                    );
                },
            },
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
            <div className="w-full max-w-md rounded-[16px] border border-rule-soft bg-paper p-6 shadow-sm">
                <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-jade-50 text-jade-700">
                    <KeyRound size={18} />
                </span>
                <h1 className="mt-3 text-[22px] font-bold tracking-[-0.01em] text-jade-950">
                    Forgot your password?
                </h1>
                <p className="font-bangla mt-1 text-[12px] text-ink-soft">
                    আপনার ইমেইল দিন, আমরা একটি OTP পাঠাবো
                </p>

                <form onSubmit={submit} className="mt-5 space-y-3">
                    <label className="block space-y-1">
                        <span className="text-[12px] font-semibold text-ink">
                            Email
                        </span>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            autoFocus
                        />
                    </label>
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
                                Sending OTP…
                            </>
                        ) : (
                            <>
                                Send reset code
                                <ArrowRight size={14} />
                            </>
                        )}
                    </Button>
                </form>

                <p className="mt-4 text-center text-[12px] text-ink-soft">
                    Remembered it?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-jade-700 hover:text-coral-600"
                    >
                        Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
}
