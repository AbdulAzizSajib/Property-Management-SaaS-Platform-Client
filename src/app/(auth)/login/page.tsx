"use client";
import { ApiError } from "@/src/lib/api";
import { loginUser, persistAuth } from "@/src/lib/auth";
import { getDefaultDashboardRoute, isValidRedirectForRole } from "@/src/lib/authUtils";
import { isEmail } from "@/src/lib/validation";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    LogIn,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const router = useRouter();
    const search = useSearchParams();
    const justRegistered = search.get("registered") === "1";
    const redirectParam = search.get("redirect");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function validate(): boolean {
        let ok = true;
        if (!isEmail(email)) {
            setEmailError("Enter a valid email address");
            ok = false;
        } else setEmailError(null);
        if (password.length < 1) {
            setPasswordError("Password is required");
            ok = false;
        } else setPasswordError(null);
        return ok;
    }

    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        setServerError(null);
        try {
            const data = await loginUser({ email: email.trim(), password });
            persistAuth(data);

            // Redirect priority:
            //   1. ?redirect= query param, if it's valid for this user's role
            //   2. The role's default dashboard (OWNER -> /owner/dashboard, etc.)
            const role = data.user.role;
            const fallback = getDefaultDashboardRoute(role);
            const destination =
                redirectParam && isValidRedirectForRole(redirectParam, role)
                    ? redirectParam
                    : fallback;
            router.push(destination);
        } catch (err) {
            setServerError(
                err instanceof ApiError ? err.message : "Sign in failed. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center justify-center size-10 rounded-lg bg-indigo-50 text-indigo-600">
                        <LogIn size={20} />
                    </span>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-800">Welcome back</h1>
                        <p className="text-xs text-slate-500">Sign in to your BariBari workspace</p>
                    </div>
                </div>

                {justRegistered && (
                    <div className="flex items-start gap-2 mb-4 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                        <span>Account created. Please sign in to continue.</span>
                    </div>
                )}

                {serverError && (
                    <div className="flex items-start gap-2 mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{serverError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Email address</span>
                        <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError(null);
                                setServerError(null);
                            }}
                            placeholder="owner@example.com"
                            className={inputClass(!!emailError)}
                        />
                        {emailError && (
                            <span className="text-xs text-red-600 mt-1 block">{emailError}</span>
                        )}
                    </label>

                    <label className="block">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">Password</span>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-indigo-600 hover:text-indigo-700"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative mt-1.5">
                            <input
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError(null);
                                    setServerError(null);
                                }}
                                placeholder="••••••••"
                                className={inputClass(!!passwordError, "pr-10")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {passwordError && (
                            <span className="text-xs text-red-600 mt-1 block">{passwordError}</span>
                        )}
                    </label>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition px-4 py-3 rounded-md text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign in
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <p className="text-center text-sm text-slate-500 mt-5">
                New to BariBari?{" "}
                <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Create an account
                </Link>
            </p>
        </div>
    );
}

function inputClass(hasError: boolean, extra = ""): string {
    return [
        "w-full px-3 py-2.5 mt-1.5 rounded-md border bg-white text-slate-800 placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
        hasError
            ? "border-red-400 focus:border-red-500"
            : "border-slate-300 focus:border-indigo-500",
        extra,
    ].join(" ");
}
