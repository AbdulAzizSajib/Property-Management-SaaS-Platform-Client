"use client";
import { loginAction } from "@/src/services/auth.services";
import { isLoginIdentifier } from "@/src/lib/validation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import NeatBackground from "@/src/components/NeatBackground";

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
      // Login runs server-side so the httpOnly auth cookies are set on *our*
      // domain — otherwise (cross-site) the middleware never sees them and
      // bounces the user back here. The action also computes the destination.
      const result = await loginAction(
        { identifier: identifier.trim(), password },
        redirectParam,
      );

      if (result.ok) {
        router.push(result.destination);
        return;
      }

      // Special case: backend says the email isn't verified and has just
      // auto-sent a fresh OTP. Route the user to the verify page with their
      // email pre-filled and a banner explaining what happened — they can
      // type the new code without going back here.
      if (result.code === "EMAIL_NOT_VERIFIED") {
        // The identifier may be a phone, not an email. Only forward when it
        // actually looks like an email so the verify page can pre-fill it.
        const trimmed = identifier.trim();
        const emailParam = trimmed.includes("@")
          ? `?email=${encodeURIComponent(trimmed)}&fromLogin=1`
          : "?fromLogin=1";
        router.push(`/verify-email${emailParam}`);
        return;
      }

      setServerError(result.message);
    } catch {
      setServerError("Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
      {/* Animated gradient background */}
      <NeatBackground className="absolute inset-0 z-0 h-full w-full" />

      {/* Floating form card — solid rectangular panel */}
      <div className="relative z-10 w-full max-w-md my-6 max-h-[calc(100dvh-3rem)] overflow-y-auto border border-white/40 bg-[#F8F5EB] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.5)] px-6 py-8 rounded-3xl sm:px-9">
        <div className="w-full">
          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
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
    </div>
  );
}

// ─── Components ──────────────────────────────────

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
