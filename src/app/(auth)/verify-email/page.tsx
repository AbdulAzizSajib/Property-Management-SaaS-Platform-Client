"use client";

// src/app/(auth)/verify-email/page.tsx
//
// Email verification — user submits the OTP sent on signup.

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useVerifyEmail } from "@/src/hooks/useAuthActions";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={null}>
            <VerifyEmailForm />
        </Suspense>
    );
}

function VerifyEmailForm() {
    const router = useRouter();
    const params = useSearchParams();
    const [email, setEmail] = useState(params.get("email") ?? "");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const mut = useVerifyEmail();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email || !otp) {
            setError("Both email and OTP are required");
            return;
        }
        mut.mutate(
            { email, otp },
            {
                onSuccess: () => {
                    router.push("/login?verified=1");
                },
            },
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
            <div className="w-full max-w-md rounded-[16px] border border-rule-soft bg-paper p-6 shadow-sm">
                <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-jade-50 text-jade-700">
                    <MailCheck size={18} />
                </span>
                <h1 className="mt-3 text-[22px] font-bold tracking-[-0.01em] text-jade-950">
                    Verify your email
                </h1>
                <p className="font-bangla mt-1 text-[12px] text-ink-soft">
                    ইমেইলে পাঠানো OTP লিখুন
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
                        />
                    </label>
                    <label className="block space-y-1">
                        <span className="text-[12px] font-semibold text-ink">
                            OTP code
                        </span>
                        <Input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            inputMode="numeric"
                            placeholder="123456"
                            className="tracking-[0.4em] text-center font-mono"
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
                                Verifying…
                            </>
                        ) : (
                            <>
                                Verify email
                                <ArrowRight size={14} />
                            </>
                        )}
                    </Button>
                </form>

                <p className="mt-4 text-center text-[12px] text-ink-soft">
                    Back to{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-jade-700 hover:text-coral-600"
                    >
                        login
                    </Link>
                </p>
            </div>
        </div>
    );
}
