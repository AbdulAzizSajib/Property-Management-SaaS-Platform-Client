"use client";

import { AlertCircle, ArrowRight, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useResendVerificationOtp } from "@/src/hooks/useAuthActions";
import { verifyEmailAction } from "@/src/services/auth.services";

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
    const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const [verifying, setVerifying] = useState(false);
    const resend = useResendVerificationOtp();

    const fromLogin = params.get("fromLogin") === "1";
    useEffect(() => {
        if (fromLogin) setCooldown(RESEND_COOLDOWN_SECONDS);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    const otp = otpDigits.join("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email || otp.length < 4) {
            setError("Please enter your email and the 4-digit code");
            return;
        }
        setVerifying(true);
        try {
            const result = await verifyEmailAction({ email, otp });
            if (result.ok) {
                router.push(result.destination);
                return;
            }
            setError(result.message);
            setOtpDigits(["", "", "", ""]);
            document.getElementById("otp-ve-0")?.focus();
        } catch {
            setError("Invalid or expired OTP. Please try again.");
            setOtpDigits(["", "", "", ""]);
            document.getElementById("otp-ve-0")?.focus();
        } finally {
            setVerifying(false);
        }
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
                onSuccess: () => {
                    setCooldown(RESEND_COOLDOWN_SECONDS);
                    setOtpDigits(["", "", "", ""]);
                    document.getElementById("otp-ve-0")?.focus();
                },
            },
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
            <div className="w-full max-w-md rounded-[16px] border border-rule-soft bg-paper p-6 shadow-sm">
                {/* Header */}
                <div className="rounded-[12px] bg-jade-50/60 border border-jade-100 px-4 py-3.5 flex gap-3 items-start">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-jade-100 text-jade-700 mt-0.5">
                        <MailCheck size={15} />
                    </span>
                    <div>
                        <p className="text-[13px] font-semibold text-jade-900">Check your inbox</p>
                        <p className="text-[12px] text-ink-soft mt-0.5">
                            4-digit code sent to{" "}
                            <span className="font-semibold text-ink">
                                {email || "your email"}
                            </span>
                        </p>
                    </div>
                </div>

                <h1 className="mt-4 text-[22px] font-bold tracking-[-0.01em] text-jade-950">
                    Verify your email
                </h1>

                {fromLogin && (
                    <div className="mt-3 rounded-[10px] border border-coral-100 bg-coral-50/70 px-3 py-2.5 text-[12.5px] text-coral-600">
                        Your email isn&apos;t verified yet. We just sent a fresh
                        4-digit code to{" "}
                        <span className="font-semibold">
                            {email || "your email"}
                        </span>
                        . Enter it below to continue.
                    </div>
                )}

                <form onSubmit={submit} className="mt-5 space-y-5">
                    {/* Email field */}
                    <label className="block">
                        <span className="text-[12px] font-semibold text-ink block mb-1.5">
                            Email
                        </span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-[10px] border border-rule-soft bg-paper text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-jade-700/20 focus:border-jade-700"
                        />
                    </label>

                    {/* 4-box OTP input */}
                    <div>
                        <span className="text-[12px] font-semibold text-ink block mb-3">
                            Enter 4-digit code
                        </span>
                        <div className="flex gap-3 justify-center">
                            {otpDigits.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-ve-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    value={digit}
                                    maxLength={1}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "").slice(-1);
                                        const next = [...otpDigits];
                                        next[i] = val;
                                        setOtpDigits(next);
                                        setError(null);
                                        if (val && i < 3) {
                                            document.getElementById(`otp-ve-${i + 1}`)?.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !digit && i > 0) {
                                            document.getElementById(`otp-ve-${i - 1}`)?.focus();
                                        }
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
                                        const next = ["", "", "", ""];
                                        pasted.split("").forEach((ch, idx) => { next[idx] = ch; });
                                        setOtpDigits(next);
                                        setError(null);
                                        const focusIdx = Math.min(pasted.length, 3);
                                        document.getElementById(`otp-ve-${focusIdx}`)?.focus();
                                    }}
                                    className={[
                                        "w-14 h-14 rounded-[12px] border-2 bg-paper text-center text-[22px] font-bold text-ink font-mono",
                                        "focus:outline-none focus:ring-2 focus:ring-jade-700/20 transition-colors",
                                        error
                                            ? "border-coral-300 focus:border-coral-500"
                                            : digit
                                                ? "border-jade-700 bg-jade-50/40"
                                                : "border-rule-soft focus:border-jade-700",
                                    ].join(" ")}
                                />
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 px-3 py-2.5 rounded-[10px] bg-coral-50/70 border border-coral-100 text-coral-600 text-[13px]">
                            <AlertCircle size={15} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={verifying || otpDigits.some((d) => d === "")}
                        className="w-full inline-flex items-center justify-center gap-2 bg-sky-950 hover:bg-sky-950 transition-colors px-4 py-3 rounded-[10px] text-paper text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_10px_30px_-12px_rgba(13,79,63,0.45)]"
                    >
                        {verifying ? (
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
                    </button>
                </form>

                {/* Resend OTP */}
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
