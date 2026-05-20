"use client";
import { ApiError } from "@/src/lib/api";
import { persistAuth, registerOwner } from "@/src/lib/auth";
import { isBdPhone, isEmail, isSlug, slugify } from "@/src/lib/validation";
import type { RegisterPayload } from "@/src/types/auth";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Building2,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Step = 1 | 2;

type FormState = {
    name: string;
    email: string;
    password: string;
    contactNumber: string;
    orgName: string;
    orgSlug: string;
    orgPhone: string;
    orgEmail: string;
    orgAddress: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    orgName: "",
    orgSlug: "",
    orgPhone: "",
    orgEmail: "",
    orgAddress: "",
};

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [slugTouched, setSlugTouched] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!slugTouched) {
            setForm((f) => ({ ...f, orgSlug: slugify(f.orgName) }));
        }
    }, [form.orgName, slugTouched]);

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
        if (!isSlug(form.orgSlug))
            e.orgSlug = "Use lowercase letters, numbers and hyphens only";
        if (!isBdPhone(form.orgPhone))
            e.orgPhone = "Enter a valid Bangladeshi phone";
        if (!isEmail(form.orgEmail)) e.orgEmail = "Enter a valid email address";
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
                slug: form.orgSlug.trim(),
                phone: form.orgPhone.trim(),
                email: form.orgEmail.trim(),
                address: form.orgAddress.trim(),
            },
        };

        try {
            const data = await registerOwner(payload);
            persistAuth(data);
            router.push("/login?registered=1");
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
        <div className="w-full max-w-xl">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-1">
                    <span className="flex items-center justify-center size-10 rounded-lg bg-indigo-50 text-indigo-600">
                        <Building2 size={20} />
                    </span>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-800">
                            Create your BariBari account
                        </h1>
                        <p className="text-xs text-slate-500">
                            Step {step} of 2 — {step === 1 ? "Owner details" : "Organization details"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-5 mb-6">
                    <div className={`h-1.5 flex-1 rounded ${step >= 1 ? "bg-indigo-600" : "bg-slate-200"}`} />
                    <div className={`h-1.5 flex-1 rounded ${step >= 2 ? "bg-indigo-600" : "bg-slate-200"}`} />
                </div>

                {serverError && (
                    <div className="flex items-start gap-2 mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{serverError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {step === 1 ? (
                        <>
                            <Field label="Full name" error={errors.name}>
                                <input
                                    type="text"
                                    autoComplete="name"
                                    value={form.name}
                                    onChange={(e) => update("name", e.target.value)}
                                    placeholder="e.g. Aziz Sajib"
                                    className={inputClass(!!errors.name)}
                                />
                            </Field>

                            <Field label="Email address" error={errors.email}>
                                <input
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    placeholder="owner@example.com"
                                    className={inputClass(!!errors.email)}
                                />
                            </Field>

                            <Field label="Password" error={errors.password} hint="Minimum 8 characters">
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
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </Field>

                            <Field label="Contact number" error={errors.contactNumber} hint="11-digit Bangladeshi mobile">
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    value={form.contactNumber}
                                    onChange={(e) => update("contactNumber", e.target.value.replace(/\s+/g, ""))}
                                    placeholder="01711000111"
                                    maxLength={11}
                                    className={inputClass(!!errors.contactNumber)}
                                />
                            </Field>

                            <button
                                type="button"
                                onClick={handleNext}
                                className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition px-4 py-3 rounded-md text-white font-medium"
                            >
                                Continue
                                <ArrowRight size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Field label="Organization name" error={errors.orgName}>
                                <input
                                    type="text"
                                    autoComplete="organization"
                                    value={form.orgName}
                                    onChange={(e) => update("orgName", e.target.value)}
                                    placeholder="Sajib Properties Ltd."
                                    className={inputClass(!!errors.orgName)}
                                />
                            </Field>

                            <Field
                                label="Organization slug"
                                error={errors.orgSlug}
                                hint="Used in your subdomain & URLs"
                            >
                                <input
                                    type="text"
                                    value={form.orgSlug}
                                    onChange={(e) => {
                                        setSlugTouched(true);
                                        update("orgSlug", e.target.value.toLowerCase());
                                    }}
                                    placeholder="sajib-properties"
                                    className={inputClass(!!errors.orgSlug)}
                                />
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Organization phone" error={errors.orgPhone}>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        value={form.orgPhone}
                                        onChange={(e) => update("orgPhone", e.target.value.replace(/\s+/g, ""))}
                                        placeholder="01711000111"
                                        maxLength={11}
                                        className={inputClass(!!errors.orgPhone)}
                                    />
                                </Field>

                                <Field label="Organization email" error={errors.orgEmail}>
                                    <input
                                        type="email"
                                        value={form.orgEmail}
                                        onChange={(e) => update("orgEmail", e.target.value)}
                                        placeholder="info@sajibprops.com"
                                        className={inputClass(!!errors.orgEmail)}
                                    />
                                </Field>
                            </div>

                            <Field label="Address" error={errors.orgAddress}>
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
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-slate-300 hover:bg-slate-50 transition text-slate-700 disabled:opacity-50"
                                >
                                    <ArrowLeft size={16} />
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition px-4 py-3 rounded-md text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            Create account
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>

            <p className="text-center text-sm text-slate-500 mt-5">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Sign in
                </Link>
            </p>
        </div>
    );
}

function Field({
    label,
    error,
    hint,
    children,
}: {
    label: string;
    error?: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <div className="mt-1.5">{children}</div>
            {error ? (
                <span className="text-xs text-red-600 mt-1 block">{error}</span>
            ) : hint ? (
                <span className="text-xs text-slate-400 mt-1 block">{hint}</span>
            ) : null}
        </label>
    );
}

function inputClass(hasError: boolean, extra = ""): string {
    return [
        "w-full px-3 py-2.5 rounded-md border bg-white text-slate-800 placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
        hasError
            ? "border-red-400 focus:border-red-500"
            : "border-slate-300 focus:border-indigo-500",
        extra,
    ].join(" ");
}
