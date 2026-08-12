"use client";
import { ApiError } from "@/src/lib/api";
import { registerOwner } from "@/src/lib/auth";
import { verifyEmailAction } from "@/src/services/auth.services";
import { isBdPhone, isEmail } from "@/src/lib/validation";
import type { RegisterPayload } from "@/src/types/auth";
import { useResendVerificationOtp } from "@/src/hooks/useAuthActions";
import { usePlans } from "@/src/hooks/useSubscription";
import type { SubscriptionPlan } from "@/src/types/subscription.types";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  MailCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import NeatBackground from "@/src/components/NeatBackground";

type Step = 1 | 2;

const RESEND_COOLDOWN_SECONDS = 60;

type FormState = {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  email: "",
  password: "",
  contactNumber: "",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  );
}

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: plans } = usePlans();

  // Plan carried from the pricing page (?plan=BASIC). Validated against the
  // real catalog — an unrecognized/tampered value is treated as no plan.
  const carriedPlanParam = searchParams.get("plan");
  const carriedPlan = useMemo(() => {
    if (!carriedPlanParam || !plans) return null;
    const match = plans.find((p) => p.plan === carriedPlanParam);
    return match ?? null;
  }, [carriedPlanParam, plans]);

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const resendMut = useResendVerificationOtp();

  async function handleVerify() {
    setOtpError(null);
    setVerifying(true);
    try {
      const result = await verifyEmailAction({
        email: form.email.trim(),
        otp: otpDigits.join(""),
        plan: carriedPlan?.plan as SubscriptionPlan | undefined,
      });
      if (result.ok) {
        router.push(result.destination);
        return;
      }
      setOtpError(result.message);
      setOtpDigits(["", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } catch {
      setOtpError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setServerError(null);
  }

  function validateStep1(): boolean {
    const e: FieldErrors = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!isEmail(form.email)) e.email = "Enter a valid email address";
    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (!isBdPhone(form.contactNumber))
      e.contactNumber = "Enter a valid Bangladeshi phone (e.g. 01711000111)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validateStep1()) return;

    setSubmitting(true);
    setServerError(null);

    const payload: RegisterPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      contactNumber: form.contactNumber.trim(),
    };

    try {
      await registerOwner(payload);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setStep(2);
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
        if (err.status === 409) setStep(1);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
      <NeatBackground className="absolute inset-0 z-0 h-full w-full" />

      <div className="relative z-10 w-full max-w-md my-6 max-h-[calc(100dvh-3rem)] border border-white/40 bg-[#F8F5EB] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.5)] px-6 py-8 rounded-3xl sm:px-9">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-jade-900 dark:text-jade-50 text-3xl font-bold tracking-tight relative"
        >
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }} viewBox="366.667 680 1230.667 682.667" className="h-7 w-auto absolute -top-3.5 left-28.75" preserveAspectRatio="none">
            <path transform="translate(0,0)" fill="#247460" d="M 1156.17 704.057 C 1165.62 709.999 1189.79 730.077 1199.78 737.954 C 1232.79 763.92 1265.63 790.088 1298.32 816.455 L 1573.77 1033.95 C 1559.4 1034.24 1499.39 1036.14 1489.09 1032.69 C 1475.17 1028.02 1460.98 1016.83 1448.48 1009.03 L 1378 965.121 C 1306.39 920.635 1231.94 876.987 1161.12 831.747 C 1148.71 838.78 1123.69 857.081 1111.02 865.707 L 1014.95 930.551 C 907.585 1003.92 799.428 1076.13 690.502 1147.16 L 495.835 1273.03 C 463.437 1293.65 423.702 1320.34 390.529 1338.03 C 406.372 1321.62 437.975 1295.44 455.536 1280.56 C 488.408 1252.41 521.487 1224.51 554.77 1196.85 L 695.66 1078.95 C 722.179 1056.67 751.695 1030.44 778.776 1009.4 C 777.735 986.8 778.572 957.352 778.594 934.29 L 778.619 789.032 C 815.8 789.05 853.371 788.795 890.52 789.278 C 890.683 815.378 890.691 841.478 890.544 867.578 C 890.556 883.121 891.24 904.906 890.214 919.622 C 979.24 853.148 1069.25 774.057 1156.17 704.057 z"></path>
            <path transform="translate(0,0)" fill="#247460" d="M 1088.78 1065.28 C 1107.1 1066.51 1133.97 1065.68 1152.84 1065.65 C 1153.36 1086.21 1152.99 1108.84 1153.02 1129.55 C 1131.64 1129.28 1110.25 1129.25 1088.87 1129.46 C 1088.45 1108.45 1088.77 1086.37 1088.78 1065.28 z"></path>
            <path transform="translate(0,0)" fill="#247460" d="M 1183.02 1065.44 C 1201.98 1065.05 1222.24 1065.3 1241.28 1065.23 C 1241.26 1073.17 1242.03 1125.66 1240.39 1129.39 L 1236.25 1129.6 L 1177.8 1129.53 C 1177.87 1121.15 1176.43 1069.6 1178.98 1065.78 L 1183.02 1065.44 z"></path>
            <path transform="translate(0,0)" fill="#247460" d="M 1088.78 977.918 C 1107.09 976.886 1133.96 977.588 1152.88 977.566 L 1153 1040.87 C 1132.12 1040.51 1109.73 1040.95 1088.74 1041.01 L 1088.78 977.918 z"></path>
            <path transform="translate(0,0)" fill="#247460" d="M 1177.96 977.928 L 1241.14 977.684 C 1241.64 997.869 1241.19 1020.46 1241.2 1040.81 L 1177.98 1040.94 C 1177.81 1019.94 1177.8 998.932 1177.96 977.928 z"></path>
          </svg>
          <h2 className="bg-coral-500 bg-clip-text text-transparent z-10">
            Bariyan
          </h2>
        </Link>

        <div className="mt-4">
          <div className="w-full">
            <div className="mb-5">
              <h1 className="mt-0.5 text-[26px] sm:text-[28px] font-bold tracking-[-0.02em] text-jade-950 text-center">
                Create your account
              </h1>
            </div>

            {/* Carried plan summary — read-only, informs but doesn't re-decide */}
            {step === 1 && carriedPlan && (
              <div className="mb-5 flex items-center gap-3 rounded-[12px] bg-jade-50/60 border border-jade-100 px-4 py-3">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-jade-100 text-jade-700">
                  <Sparkles size={15} />
                </span>
                <p className="text-[12.5px] text-ink">
                  You&apos;re signing up for the{" "}
                  <span className="font-semibold text-jade-900">
                    {carriedPlan.displayName}
                  </span>{" "}
                  plan —{" "}
                  <span className="font-semibold text-jade-900 tabular-nums">
                    {Number(carriedPlan.priceMonthly) === 0
                      ? "Free"
                      : `৳${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(Number(carriedPlan.priceMonthly))}/mo`}
                  </span>
                </p>
              </div>
            )}

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-jade-900" : "bg-rule-soft"}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-jade-900" : "bg-rule-soft"}`} />
              </div>
              <p className="mt-2 text-[11.5px] text-ink-soft tabular-nums">
                Step <span className="font-semibold text-ink">{step}</span> of{" "}
                <span className="tabular-nums">2</span> —{" "}
                {step === 1 ? "Owner details" : "Verify your email"}
              </p>
            </div>
            

            {serverError && (
              <div className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-[10px] bg-coral-50/70 border border-coral-100 text-coral-600 text-[13px]">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Step 2: Email verification */}
            {step === 2 && (
              <div className="space-y-5">
                {/* Email sent notice */}
                <div className="rounded-[12px] bg-jade-50/60 border border-jade-100 px-4 py-3.5 flex gap-3 items-start">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-jade-100 text-jade-700 mt-0.5">
                    <MailCheck size={15} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-jade-900">Check your inbox</p>
                    <p className="text-[12px] text-ink-soft mt-0.5">
                      4-digit code sent to{" "}
                      <span className="font-semibold text-ink">{form.email.trim()}</span>
                    </p>
                  </div>
                </div>

                {otpError && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-[10px] bg-coral-50/70 border border-coral-100 text-coral-600 text-[13px]">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                {/* 4-box OTP input */}
                <div>
                  <span className="text-[12.5px] font-semibold text-ink block mb-3">
                    Enter 4-digit code
                  </span>
                  <div className="flex gap-3 justify-center">
                    {otpDigits.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        maxLength={1}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(-1);
                          const next = [...otpDigits];
                          next[i] = val;
                          setOtpDigits(next);
                          setOtpError(null);
                          if (val && i < 3) {
                            document.getElementById(`otp-${i + 1}`)?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !digit && i > 0) {
                            document.getElementById(`otp-${i - 1}`)?.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
                          const next = ["", "", "", ""];
                          pasted.split("").forEach((ch, idx) => { next[idx] = ch; });
                          setOtpDigits(next);
                          setOtpError(null);
                          const focusIdx = Math.min(pasted.length, 3);
                          document.getElementById(`otp-${focusIdx}`)?.focus();
                        }}
                        className={[
                          "w-14 h-14 rounded-[12px] border-2 bg-paper text-center text-[22px] font-bold text-ink font-mono",
                          "focus:outline-none focus:ring-2 focus:ring-jade-700/20 transition-colors",
                          otpError
                            ? "border-coral-300 focus:border-coral-500"
                            : digit
                              ? "border-jade-700 bg-jade-50/40"
                              : "border-rule-soft focus:border-jade-700",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={verifying || otpDigits.some((d) => d === "")}
                  onClick={handleVerify}
                  className="w-full inline-flex items-center justify-center gap-2 bg-jade-900 hover:bg-jade-950 transition-colors px-4 py-3 rounded-[10px] text-paper text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_10px_30px_-12px_rgba(13,79,63,0.45)]"
                >
                  {verifying ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      Verify email
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[12px] text-ink-soft">
                  <span>Code পাননি?</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (cooldown > 0) return;
                      resendMut.mutate(
                        { email: form.email.trim() },
                        {
                          onSuccess: () => {
                            setCooldown(RESEND_COOLDOWN_SECONDS);
                            setOtpDigits(["", "", "", ""]);
                            document.getElementById("otp-0")?.focus();
                          },
                        },
                      );
                    }}
                    disabled={resendMut.isPending || cooldown > 0}
                    className="font-semibold text-jade-700 hover:text-coral-600 disabled:cursor-not-allowed disabled:text-ink-soft/60"
                  >
                    {resendMut.isPending ? (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 size={11} className="animate-spin" />
                        Sending…
                      </span>
                    ) : cooldown > 0 ? (
                      <span className="tabular-nums">Resend in {cooldown}s</span>
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Registration form */}
            {step === 1 && (
              <form onSubmit={handleSubmit} className="space-y-2" noValidate>
                <Field label="Full name" required error={errors.name}>
                  <input
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. Aziz Sajib"
                    className={inputClass(!!errors.name)}
                  />
                </Field>

                <Field label="Email address" required error={errors.email}>
                  <input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="owner@example.com"
                    className={inputClass(!!errors.email)}
                  />
                </Field>

                <Field
                  label="Password"
                  required
                  error={errors.password}
                  hint="Minimum 8 characters"
                >
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="••••••••"
                      className={inputClass(!!errors.password, "pr-10")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-ink-soft hover:text-jade-900"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </Field>

                <Field
                  label="Contact number"
                  required
                  error={errors.contactNumber}
                  hint="11-digit Bangladeshi mobile"
                >
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.contactNumber}
                    onChange={(e) =>
                      update("contactNumber", e.target.value.replace(/\s+/g, ""))
                    }
                    placeholder="01711000111"
                    maxLength={11}
                    className={inputClass(!!errors.contactNumber, "tabular-nums")}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-jade-900 hover:bg-jade-950 transition-colors px-4 py-3 rounded-[10px] text-paper text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_10px_30px_-12px_rgba(13,79,63,0.45)]"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-[13.5px] text-ink-soft mt-7">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-jade-900 font-semibold underline underline-offset-4 hover:text-coral-600 transition-colors"
              >
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-[11.5px] text-ink-soft/65">
          © {new Date().getFullYear()} Bariyan ·{" "}
          <span className="font-bangla">সব ভাড়াটিয়া, সব হিসাব</span>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-semibold text-ink">
        {label}
        {required && (
          <span className="ml-1 text-coral-600" aria-label="required">
            *
          </span>
        )}
      </span>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <span className="text-[11.5px] text-coral-600 mt-1 block">{error}</span>
      ) : hint ? (
        <span className="text-[11.5px] text-ink-soft/85 mt-1 block">{hint}</span>
      ) : null}
    </label>
  );
}

function inputClass(hasError: boolean, extra = ""): string {
  return [
    "w-full px-3 py-2.5 rounded-[10px] border bg-paper text-[14px] text-ink placeholder:text-ink-soft/55",
    "focus:outline-none focus:ring-2 focus:ring-jade-700/20",
    hasError
      ? "border-coral-300 focus:border-coral-600"
      : "border-rule-soft focus:border-jade-700",
    extra,
  ].join(" ");
}
