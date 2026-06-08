"use client";
import { ApiError } from "@/src/lib/api";
import { registerOwner } from "@/src/lib/auth";
import { isBdPhone, isEmail, slugify } from "@/src/lib/validation";
import type { RegisterPayload } from "@/src/types/auth";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = 1 | 2;

type FormState = {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  orgName: string;
  orgAddress: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  email: "",
  password: "",
  contactNumber: "",
  orgName: "",
  orgAddress: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  function validateStep2(): boolean {
    const e: FieldErrors = {};
    if (!form.orgName.trim()) e.orgName = "Organization name is required";
    if (!form.orgAddress.trim()) e.orgAddress = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep1()) setStep(2);
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validateStep2()) return;

    setSubmitting(true);
    setServerError(null);

    const payload: RegisterPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      contactNumber: form.contactNumber.trim(),
      organization: {
        name: form.orgName.trim(),
        // Slug is auto-derived from the org name (the user no longer picks it).
        slug: slugify(form.orgName),
        address: form.orgAddress.trim(),
      },
    };

    try {
      await registerOwner(payload);
      // Don't persistAuth — the user isn't fully authenticated until they verify
      // their email. Send them to the OTP screen with the email pre-filled.
      router.push(
        `/verify-email?email=${encodeURIComponent(form.email.trim())}`,
      );
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
    <div className="min-h-screen grid lg:grid-cols-[5fr_6fr]">
      {/* LEFT — Form column */}
      <div className="flex flex-col bg-paper px-6 py-8 sm:px-10 md:px-14 lg:px-12 xl:px-20">
        {/* Top: Logo */}
        <Link
          href="/"
          className="inline-flex items-center text-jade-900 text-3xl font-rubita w-fit"
        >
          Bari<span className="text-coral-600">yan</span>
        </Link>

        {/* Form area — centered vertically */}
        <div className="flex-1 flex flex-col justify-center py-10 lg:py-12">
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Heading */}
            <div className="mb-5">
              <p className="font-serif italic text-coral-600/85 text-[13px]">
                Get started
              </p>
              <h1 className="mt-0.5 text-[26px] sm:text-[28px] font-bold tracking-[-0.02em] text-jade-950">
                Create your account
              </h1>
              <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                Bariyan এ আপনার নতুন একাউন্ট তৈরি করুন।
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    step >= 1 ? "bg-jade-900" : "bg-rule-soft"
                  }`}
                />
                <div
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    step >= 2 ? "bg-jade-900" : "bg-rule-soft"
                  }`}
                />
              </div>
              <p className="mt-2 text-[11.5px] text-ink-soft tabular-nums">
                Step <span className="font-semibold text-ink">{step}</span> of{" "}
                <span className="tabular-nums">2</span> —{" "}
                {step === 1 ? "Owner details" : "Organization details"}
              </p>
            </div>

            {serverError && (
              <div className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-[10px] bg-coral-50/70 border border-coral-100 text-coral-700 text-[13px]">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {step === 1 ? (
                <>
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
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
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
                        update(
                          "contactNumber",
                          e.target.value.replace(/\s+/g, ""),
                        )
                      }
                      placeholder="01711000111"
                      maxLength={11}
                      className={inputClass(
                        !!errors.contactNumber,
                        "tabular-nums",
                      )}
                    />
                  </Field>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-jade-900 hover:bg-jade-950 transition-colors px-4 py-3 rounded-[10px] text-paper text-[14px] font-semibold shadow-[0_10px_30px_-12px_rgba(13,79,63,0.45)]"
                  >
                    Continue
                    <ArrowRight size={15} />
                  </button>
                </>
              ) : (
                <>
                  <Field label="Organization name" required error={errors.orgName}>
                    <input
                      type="text"
                      autoComplete="organization"
                      value={form.orgName}
                      onChange={(e) => update("orgName", e.target.value)}
                      placeholder="Sajib Properties Ltd."
                      className={inputClass(!!errors.orgName)}
                    />
                  </Field>

                  <Field label="Address" required error={errors.orgAddress}>
                    <input
                      type="text"
                      autoComplete="street-address"
                      value={form.orgAddress}
                      onChange={(e) => update("orgAddress", e.target.value)}
                      placeholder="Lalmatia, Dhaka"
                      className={inputClass(!!errors.orgAddress)}
                    />
                  </Field>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[10px] border border-rule-soft bg-paper text-ink-soft hover:border-jade-700/30 hover:text-jade-900 transition-colors text-[14px] font-medium disabled:opacity-50"
                    >
                      <ArrowLeft size={15} />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-jade-900 hover:bg-jade-950 transition-colors px-4 py-3 rounded-[10px] text-paper text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_10px_30px_-12px_rgba(13,79,63,0.45)]"
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
                  </div>
                </>
              )}
            </form>

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

        {/* Bottom footer microcopy */}
        <p className="text-[11.5px] text-ink-soft/65">
          © {new Date().getFullYear()} Bariyan ·{" "}
          <span className="font-bangla">সব ভাড়াটিয়া, সব হিসাব</span>
        </p>
      </div>

      {/* RIGHT — Visual column */}
      <RegisterShowcase />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Showcase visual — same family as the login showcase, slightly
// different copy to fit the "get started" moment.
// ─────────────────────────────────────────────────────────────────

function RegisterShowcase() {
  return (
    <div className="hidden lg:block relative overflow-hidden bg-jade-950 text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full opacity-55"
        style={{
          background:
            "radial-gradient(circle, rgba(46,196,140,0.5), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(255,123,87,0.4), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,253,248,0.10) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="absolute inset-x-0 top-24 flex justify-center">
        <Image
          src="/assets/hero-section-card-image.svg"
          alt=""
          width={483}
          height={307}
          priority
          className="w-[460px] max-w-[78%] opacity-95"
        />
      </div>

      <div className="absolute top-8 right-8 z-10">
        <span className="bg-paper/10 backdrop-blur-md border border-paper/15 text-paper/90 px-3 py-1.5 rounded-full text-[10.5px] font-bold uppercase tracking-[0.14em]">
          Free during beta
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-10 xl:p-14 z-10">
        <p className="font-serif italic text-[28px] xl:text-[32px] text-paper leading-[1.2] tracking-[-0.01em]">
          Start tracking
        </p>
        <p className="font-serif italic text-[28px] xl:text-[32px] text-coral-400 leading-[1.2] tracking-[-0.01em]">
          every taka of rent.
        </p>
        <p className="font-bangla text-[15px] text-paper/80 mt-5 leading-relaxed">
          Excel আর ডায়েরির ঝামেলা ছেড়ে — সব হিসাব এক জায়গায়।
        </p>

        <div className="mt-7 pt-5 border-t border-paper/10 flex items-baseline gap-3">
          <span className="text-[26px] font-rubita text-paper leading-none">
            Bari<span className="text-coral-400">yan</span>
          </span>
          <span className="text-paper/25">·</span>
          <span className="text-[12.5px] text-paper/65">
            Closed beta · Q1 2026 launch
          </span>
        </div>
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
        <span className="text-[11.5px] text-coral-700 mt-1 block">{error}</span>
      ) : hint ? (
        <span className="text-[11.5px] text-ink-soft/85 mt-1 block">
          {hint}
        </span>
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
