"use client";
import { loginAction } from "@/src/services/auth.services";
import { isEmail, isLoginIdentifier } from "@/src/lib/validation";
import {
  useForgetPassword,
  useResetPassword,
} from "@/src/hooks/useAuthActions";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
} from "lucide-react";
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

  // Password recovery is handled inline (no separate pages) — the card swaps
  // between three views: enter email → email an OTP → submit OTP + new password,
  // then drop the user back on the login view with a success banner.
  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState<string | null>(null);
  const forgetMut = useForgetPassword();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [justReset, setJustReset] = useState(false);
  const resetMut = useResetPassword();

  function handleForgot(ev: React.FormEvent) {
    ev.preventDefault();
    setForgotError(null);
    if (!isEmail(forgotEmail)) {
      setForgotError("Enter a valid email address");
      return;
    }
    forgetMut.mutate(
      { email: forgotEmail },
      {
        onSuccess: () => {
          setOtp("");
          setNewPassword("");
          setResetError(null);
          setMode("reset");
        },
      },
    );
  }

  function handleReset(ev: React.FormEvent) {
    ev.preventDefault();
    setResetError(null);
    if (!forgotEmail || !otp || !newPassword) {
      setResetError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters");
      return;
    }
    resetMut.mutate(
      { email: forgotEmail, otp, newPassword },
      {
        onSuccess: () => {
          setPassword("");
          setOtp("");
          setNewPassword("");
          setJustReset(true);
          setMode("login");
        },
      },
    );
  }

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
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-jade-900 dark:text-jade-50 text-3xl font-bold tracking-tight relative"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block" }}
              viewBox="366.667 680 1230.667 682.667"
              className="h-7 w-auto absolute -top-3.5 left-28.75"
              preserveAspectRatio="none"
            >
              <path
                transform="translate(0,0)"
                fill="#247460"
                d="M 1156.17 704.057 C 1165.62 709.999 1189.79 730.077 1199.78 737.954 C 1232.79 763.92 1265.63 790.088 1298.32 816.455 L 1573.77 1033.95 C 1559.4 1034.24 1499.39 1036.14 1489.09 1032.69 C 1475.17 1028.02 1460.98 1016.83 1448.48 1009.03 L 1378 965.121 C 1306.39 920.635 1231.94 876.987 1161.12 831.747 C 1148.71 838.78 1123.69 857.081 1111.02 865.707 L 1014.95 930.551 C 907.585 1003.92 799.428 1076.13 690.502 1147.16 L 495.835 1273.03 C 463.437 1293.65 423.702 1320.34 390.529 1338.03 C 406.372 1321.62 437.975 1295.44 455.536 1280.56 C 488.408 1252.41 521.487 1224.51 554.77 1196.85 L 695.66 1078.95 C 722.179 1056.67 751.695 1030.44 778.776 1009.4 C 777.735 986.8 778.572 957.352 778.594 934.29 L 778.619 789.032 C 815.8 789.05 853.371 788.795 890.52 789.278 C 890.683 815.378 890.691 841.478 890.544 867.578 C 890.556 883.121 891.24 904.906 890.214 919.622 C 979.24 853.148 1069.25 774.057 1156.17 704.057 z"
              ></path>
              <path
                transform="translate(0,0)"
                fill="#247460"
                d="M 1088.78 1065.28 C 1107.1 1066.51 1133.97 1065.68 1152.84 1065.65 C 1153.36 1086.21 1152.99 1108.84 1153.02 1129.55 C 1131.64 1129.28 1110.25 1129.25 1088.87 1129.46 C 1088.45 1108.45 1088.77 1086.37 1088.78 1065.28 z"
              ></path>
              <path
                transform="translate(0,0)"
                fill="#247460"
                d="M 1183.02 1065.44 C 1201.98 1065.05 1222.24 1065.3 1241.28 1065.23 C 1241.26 1073.17 1242.03 1125.66 1240.39 1129.39 L 1236.25 1129.6 L 1177.8 1129.53 C 1177.87 1121.15 1176.43 1069.6 1178.98 1065.78 L 1183.02 1065.44 z"
              ></path>
              <path
                transform="translate(0,0)"
                fill="#247460"
                d="M 1088.78 977.918 C 1107.09 976.886 1133.96 977.588 1152.88 977.566 L 1153 1040.87 C 1132.12 1040.51 1109.73 1040.95 1088.74 1041.01 L 1088.78 977.918 z"
              ></path>
              <path
                transform="translate(0,0)"
                fill="#247460"
                d="M 1177.96 977.928 L 1241.14 977.684 C 1241.64 997.869 1241.19 1020.46 1241.2 1040.81 L 1177.98 1040.94 C 1177.81 1019.94 1177.8 998.932 1177.96 977.928 z"
              ></path>
            </svg>
            <h2 className="bg-coral-500 bg-clip-text text-transparent z-10">
              Bariyan
            </h2>
          </Link>

          {mode === "login" ? (
            <>
              {/* Heading */}
              <div className="mb-8">
                <h1 className="text-[28px] font-bold tracking-[-0.02em] text-jade-950 mb-1.5 text-center">
                  Welcome back
                </h1>
                <p className="text-[14px] text-ink-soft text-center">
                  Sign in with Google or email
                </p>
              </div>

              {/* Status banners */}
              {justReset ? (
                <div className="flex items-start gap-2 mb-5 px-3 py-2.5 rounded-[10px] bg-jade-50/70 border border-jade-100 text-jade-800 text-[13px]">
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 shrink-0 text-jade-700"
                  />
                  <span>Password updated. Sign in with your new password.</span>
                </div>
              ) : justVerified ? (
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
                <div className="flex items-start gap-2 mb-5 px-3 py-2.5 rounded-[10px] bg-coral-50/70 border border-coral-100 text-coral-600 text-[13px]">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Google login button */}
              <button
                onClick={() => {
                  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
                  window.location.href = `${baseUrl}/auth/login/google`;
                }}
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
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />

                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(
                        identifier.includes("@") ? identifier.trim() : "",
                      );
                      setForgotError(null);
                      setMode("forgot");
                    }}
                    className="text-[12px] font-medium text-coral-600 hover:text-coral-600"
                  >
                    Forgot password?
                  </button>
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
            </>
          ) : mode === "forgot" ? (
            <>
              {/* Forgot-password — inline email step */}
              <div className="mb-6 flex flex-col items-center text-center">
                <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-jade-50 text-jade-700">
                  <KeyRound size={18} />
                </span>
                <h1 className="mt-3 text-[24px] font-bold tracking-[-0.01em] text-jade-950">
                  Forgot your password?
                </h1>
                <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                  আপনার ইমেইল দিন, আমরা একটি OTP পাঠাবো
                </p>
              </div>

              <form onSubmit={handleForgot} className="space-y-5" noValidate>
                <UnderlineInput
                  label="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={forgotEmail}
                  onChange={(v) => {
                    setForgotEmail(v);
                    setForgotError(null);
                  }}
                  error={forgotError}
                />

                <button
                  type="submit"
                  disabled={forgetMut.isPending}
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 bg-jade-950 hover:bg-jade-900 transition-colors px-4 py-3 rounded-[10px] text-paper text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {forgetMut.isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending OTP…
                    </>
                  ) : (
                    <>
                      Send reset code
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setForgotError(null);
                }}
                className="mt-7 flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-ink-soft hover:text-jade-900 transition-colors"
              >
                <ArrowLeft size={14} />
                Back to login
              </button>
            </>
          ) : (
            <>
              {/* Reset-password — inline OTP + new password step */}
              <div className="mb-6 flex flex-col items-center text-center">
                <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-jade-50 text-jade-700">
                  <ShieldCheck size={18} />
                </span>
                <h1 className="mt-3 text-[24px] font-bold tracking-[-0.01em] text-jade-950">
                  Reset your password
                </h1>
                <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                  ইমেইলে পাঠানো OTP দিয়ে নতুন পাসওয়ার্ড সেট করুন
                </p>
                {forgotEmail && (
                  <p className="mt-1 text-[12px] text-ink-soft">
                    {forgotEmail}
                  </p>
                )}
              </div>

              <form onSubmit={handleReset} className="space-y-5" noValidate>
                <UnderlineInput
                  label="OTP code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(v) => {
                    setOtp(v);
                    setResetError(null);
                  }}
                />

                <UnderlineInput
                  label="New password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(v) => {
                    setNewPassword(v);
                    setResetError(null);
                  }}
                  rightAdornment={
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((s) => !s)}
                      className="p-1 text-ink-soft hover:text-jade-900"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  }
                />

                {resetError && (
                  <span className="text-[11.5px] text-coral-600 block">
                    {resetError}
                  </span>
                )}

                <button
                  type="submit"
                  disabled={resetMut.isPending}
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 bg-jade-950 hover:bg-jade-900 transition-colors px-4 py-3 rounded-[10px] text-paper text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resetMut.isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Resetting…
                    </>
                  ) : (
                    <>
                      Reset password
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 flex items-center justify-between text-[13px]">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setResetError(null);
                  }}
                  className="flex items-center gap-1.5 font-medium text-ink-soft hover:text-jade-900 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResetError(null);
                    setMode("forgot");
                  }}
                  className="font-medium text-coral-600 hover:text-coral-600"
                >
                  Send again
                </button>
              </div>
            </>
          )}
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
        <span className="text-[11.5px] text-coral-600 mt-1.5 block">
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
