"use client";
import { ApiError } from "@/src/lib/api";
import { loginUser, persistAuth } from "@/src/lib/auth";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
} from "@/src/lib/authUtils";
import { isLoginIdentifier } from "@/src/lib/validation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
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
  const justVerified = search.get("verified") === "1";
  const redirectParam = search.get("redirect");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    let ok = true;
    if (!isLoginIdentifier(identifier)) {
      setIdentifierError("Enter a valid email or Bangladeshi phone number");
      ok = false;
    } else setIdentifierError(null);
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
      const data = await loginUser({
        identifier: identifier.trim(),
        password,
      });
      persistAuth(data);
      const role = data.user.role;
      const fallback = getDefaultDashboardRoute(role);
      const destination =
        redirectParam && isValidRedirectForRole(redirectParam, role)
          ? redirectParam
          : fallback;
      router.push(destination);
    } catch (err) {
      // Special case: backend says the email isn't verified and has just
      // auto-sent a fresh OTP. Route the user to the verify page with their
      // email pre-filled and a banner explaining what happened — they can
      // type the new code without going back here.
      if (
        err instanceof ApiError &&
        err.body?.error?.body?.code === "EMAIL_NOT_VERIFIED"
      ) {
        // The identifier may be a phone, not an email. Only forward when it
        // actually looks like an email so the verify page can pre-fill it.
        const trimmed = identifier.trim();
        const emailParam = trimmed.includes("@")
          ? `?email=${encodeURIComponent(trimmed)}&fromLogin=1`
          : "?fromLogin=1";
        router.push(`/verify-email${emailParam}`);
        return;
      }
      setServerError(
        err instanceof ApiError
          ? err.message
          : "Sign in failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* LEFT — clean form column */}
      <div className="flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-sm">
          {/* Logo top-left (optional) */}
          <Link href="/" className="inline-block mb-16">
            <p className="text-[24px] leading-none font-rubita text-jade-950">
              Bari<span className="text-coral-600">yan</span>
            </p>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold tracking-[-0.02em] text-jade-950 mb-1.5">
              Welcome back
            </h1>
            <p className="text-[14px] text-ink-soft">
              Welcome back, please enter your details.
            </p>
            <p className="font-bangla text-[13px] text-ink-soft mt-1">
              আপনার Bariyan workspace এ ফিরে আসুন।
            </p>
          </div>

          {/* Status banners */}
          {justVerified ? (
            <div className="flex items-start gap-2 mb-5 px-3 py-2.5 rounded-[10px] bg-jade-50/70 border border-jade-100 text-jade-800 text-[13px]">
              <CheckCircle2
                size={15}
                className="mt-0.5 shrink-0 text-jade-700"
              />
              <span>Email verified. Sign in to access your dashboard.</span>
            </div>
          ) : justRegistered ? (
            <div className="flex items-start gap-2 mb-5 px-3 py-2.5 rounded-[10px] bg-jade-50/70 border border-jade-100 text-jade-800 text-[13px]">
              <CheckCircle2
                size={15}
                className="mt-0.5 shrink-0 text-jade-700"
              />
              <span>Account created. Please sign in to continue.</span>
            </div>
          ) : null}

          {serverError && (
            <div className="flex items-start gap-2 mb-5 px-3 py-2.5 rounded-[10px] bg-coral-50/70 border border-coral-100 text-coral-700 text-[13px]">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Google login button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-[10px] border border-rule-soft bg-paper hover:bg-jade-50/30 transition-colors text-[14px] font-medium text-ink"
          >
            <GoogleIcon />
            Log in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-rule-soft" />
            <span className="text-[12px] text-ink-soft">or</span>
            <div className="h-px flex-1 bg-rule-soft" />
          </div>

          {/* Form — underline inputs (editorial style) */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <UnderlineInput
              label="Email or phone"
              type="text"
              inputMode="email"
              autoComplete="username"
              value={identifier}
              onChange={(v) => {
                setIdentifier(v);
                setIdentifierError(null);
                setServerError(null);
              }}
              error={identifierError}
            />

            <UnderlineInput
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(v) => {
                setPassword(v);
                setPasswordError(null);
                setServerError(null);
              }}
              error={passwordError}
              rightAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="p-1 text-ink-soft hover:text-jade-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            <div className="flex justify-end -mt-1">
              <Link
                href="/forgot-password"
                className="text-[12px] font-medium text-coral-600 hover:text-coral-700"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 bg-jade-950 hover:bg-jade-900 transition-colors px-4 py-3 rounded-[10px] text-paper text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-ink-soft mt-7">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-jade-950 hover:text-coral-600 font-semibold underline underline-offset-2 transition-colors"
            >
              Sign up for free.
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT — full-bleed editorial image with overlay */}
      <aside className="hidden lg:block relative overflow-hidden bg-jade-950">
        {/* Background image */}
        <Image
          src="/assets/login-cover.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />

        {/* Dark gradient overlay — top to bottom for legibility */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,49,38,0.15) 0%, rgba(13,49,38,0.45) 55%, rgba(7,32,25,0.85) 100%)",
          }}
        />

        {/* Top-right small badge — closed beta signal */}
        <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper/10 backdrop-blur-md border border-paper/20">
          <span className="size-1.5 rounded-full bg-coral-400 animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.14em] text-paper/90 font-semibold">
            Closed beta · Q1 2026
          </span>
        </div>

        {/* Bottom content — testimonial */}
        <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
          <div className="max-w-lg">
            {/* Quote mark decoration */}
            <svg
              width="40"
              height="32"
              viewBox="0 0 40 32"
              fill="none"
              className="text-coral-400/70 mb-5"
            >
              <path
                d="M0 32V20.8C0 14.4 1.6 9.067 4.8 4.8C8 1.6 12.267 0 17.6 0V6.4C14.933 6.4 12.8 7.467 11.2 9.6C9.6 11.733 8.8 14.4 8.8 17.6H17.6V32H0ZM22.4 32V20.8C22.4 14.4 24 9.067 27.2 4.8C30.4 1.6 34.667 0 40 0V6.4C37.333 6.4 35.2 7.467 33.6 9.6C32 11.733 31.2 14.4 31.2 17.6H40V32H22.4Z"
                fill="currentColor"
              />
            </svg>

            <p className="text-paper text-[22px] xl:text-[26px] font-semibold leading-[1.35] tracking-[-0.015em]">
              Excel আর ডায়েরির ঝামেলা শেষ। এখন প্রতিটা ভাড়াটিয়া, প্রতিটা
              টাকার হিসাব এক জায়গায়।
            </p>

            <p className="font-serif italic text-paper/70 text-[14px] mt-3 leading-[1.5]">
              No more spreadsheets. No more chasing tenants. Just clarity.
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mt-7">
              <div className="size-11 rounded-full bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center text-paper font-bold text-[15px] ring-2 ring-paper/20">
                R
              </div>
              <div>
                <p className="text-paper font-semibold text-[15px] leading-tight">
                  Rashed Ahmed
                </p>
                <p className="text-paper/65 text-[12.5px] mt-0.5">
                  Landlord · 14 properties · Dhanmondi, Dhaka
                </p>
              </div>
            </div>

            {/* Trust stats bar at very bottom */}
            <div className="flex items-center gap-6 mt-9 pt-6 border-t border-paper/15">
              <Stat value="340+" label="landlords" />
              <span className="h-4 w-px bg-paper/15" />
              <Stat value="৳12cr" label="collected" />
              <span className="h-4 w-px bg-paper/15" />
              <Stat value="4" label="divisions" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─── Components ──────────────────────────────────

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-paper font-bold text-[18px] tracking-[-0.02em] tabular-nums leading-none">
        {value}
      </p>
      <p className="text-paper/60 text-[11px] mt-1">{label}</p>
    </div>
  );
}

function UnderlineInput({
  label,
  type,
  value,
  onChange,
  error,
  autoComplete,
  inputMode,
  rightAdornment,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  rightAdornment?: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={`relative border-b ${error ? "border-coral-400" : "border-rule-soft focus-within:border-jade-900"} transition-colors`}
      >
        <input
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className="w-full bg-transparent pb-2 pt-1 text-[14px] text-ink placeholder:text-ink-soft/70 focus:outline-none pr-8"
        />
        {rightAdornment && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {rightAdornment}
          </div>
        )}
      </div>
      {error && (
        <span className="text-[11.5px] text-coral-700 mt-1.5 block">
          {error}
        </span>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.257h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
