"use client";

// src/app/(auth)/verify-email/page.tsx
//
// Email verification — user submits the OTP sent on signup.

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    useResendVerificationOtp,
    useVerifyEmail,
} from "@/src/hooks/useAuthActions";
import { clearAuth } from "@/src/lib/auth";
import { clearAuthCookies } from "@/src/lib/cookieUtils";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const RESEND_COOLDOWN_SECONDS = 60;

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
    const [cooldown, setCooldown] = useState(0);
    const mut = useVerifyEmail();
    const resend = useResendVerificationOtp();

    // When the user arrives here because their login attempt failed with
    // EMAIL_NOT_VERIFIED, the backend has already sent a fresh OTP. Start
    // the cooldown immediately so they don't request another one.
    const fromLogin = params.get("fromLogin") === "1";
    useEffect(() => {
        if (fromLogin) setCooldown(RESEND_COOLDOWN_SECONDS);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Tick the cooldown down to 0.
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

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
                onSuccess: async () => {
                    // The register endpoint may have left auth cookies set
                    // (the request runs with credentials: "include"). If we
                    // don't wipe them, the proxy treats the user as logged in
                    // and bounces /login back to the dashboard — skipping
                    // the sign-in step entirely. Clear server cookies +
                    // client localStorage so /login renders normally.
                    await clearAuthCookies();
                    clearAuth();
                    router.push("/login?verified=1");
                },
            },
        );
    };

    const handleResend = () => {
        if (!email) {
            setError("Enter your email to resend the OTP");
            return;
        }
        if (cooldown > 0) return;
        setError(null);
        resend.mutate(
            { email },
            {
                onSuccess: () => setCooldown(RESEND_COOLDOWN_SECONDS),
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

                {fromLogin && (
                    <div className="mt-4 rounded-[10px] border border-coral-100 bg-coral-50/70 px-3 py-2.5 text-[12.5px] text-coral-700">
                        Your email isn&apos;t verified yet. We just sent a fresh
                        6-digit code to{" "}
                        <span className="font-semibold">
                            {email || "your email"}
                        </span>
                        . Enter it below to continue.
                    </div>
                )}

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

                {/* Resend OTP — rate-limited client-side with a 60s cooldown */}
                <div className="mt-4 flex items-center justify-between text-[12px] text-ink-soft">
                    <span>Didn&apos;t get the code?</span>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resend.isPending || cooldown > 0 || !email}
                        className="font-semibold text-jade-700 hover:text-coral-600 disabled:cursor-not-allowed disabled:text-ink-soft/60 disabled:hover:text-ink-soft/60"
                    >
                        {resend.isPending ? (
                            <span className="inline-flex items-center gap-1">
                                <Loader2 size={11} className="animate-spin" />
                                Sending…
                            </span>
                        ) : cooldown > 0 ? (
                            <span className="tabular-nums">
                                Resend in {cooldown}s
                            </span>
                        ) : (
                            "Resend OTP"
                        )}
                    </button>
                </div>

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
