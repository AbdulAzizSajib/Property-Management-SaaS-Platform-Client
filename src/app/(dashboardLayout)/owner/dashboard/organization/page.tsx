"use client";

import {
    Field,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
    useOrganization,
    useUpdateOrganization,
} from "@/src/hooks/useOrganization";
import { cn } from "@/src/lib/utils";
import {
    Building2,
    Calendar,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FormState {
    name: string;
    logoUrl: string;
    phone: string;
    email: string;
    address: string;
}

const emptyForm: FormState = {
    name: "",
    logoUrl: "",
    phone: "",
    email: "",
    address: "",
};

export default function OrganizationPage() {
    const { data: org, isLoading, isError, error } = useOrganization();
    const update = useUpdateOrganization();
    const [form, setForm] = useState<FormState>(emptyForm);

    useEffect(() => {
        if (org) {
            setForm({
                name: org.name ?? "",
                logoUrl: org.logoUrl ?? "",
                phone: org.phone ?? "",
                email: org.email ?? "",
                address: org.address ?? "",
            });
        }
    }, [org]);

    const isDirty = org
        ? form.name !== (org.name ?? "") ||
          form.logoUrl !== (org.logoUrl ?? "") ||
          form.phone !== (org.phone ?? "") ||
          form.email !== (org.email ?? "") ||
          form.address !== (org.address ?? "")
        : false;

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        if (!isDirty || !org) return;

        update.mutate({
            ...(form.name !== org.name && { name: form.name }),
            ...(form.logoUrl !== (org.logoUrl ?? "") && {
                logoUrl: form.logoUrl || null,
            }),
            ...(form.phone !== (org.phone ?? "") && { phone: form.phone || null }),
            ...(form.email !== (org.email ?? "") && { email: form.email || null }),
            ...(form.address !== (org.address ?? "") && {
                address: form.address || null,
            }),
        });
    }

    function handleReset() {
        if (!org) return;
        setForm({
            name: org.name ?? "",
            logoUrl: org.logoUrl ?? "",
            phone: org.phone ?? "",
            email: org.email ?? "",
            address: org.address ?? "",
        });
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8">
                    <Skeleton className="h-5 w-32 bg-paper" />
                    <Skeleton className="h-44 w-full rounded-[14px] bg-paper" />
                    <Skeleton className="h-80 w-full rounded-[14px] bg-paper" />
                </div>
            </div>
        );
    }

    if (isError || !org) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1080px] p-4 sm:p-6 lg:p-8">
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load organization
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Something went wrong. Please try again."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const initials =
        org.name
            .split(" ")
            .filter(Boolean)
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "";

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1080px] space-y-5 p-4 sm:p-6 lg:p-8">
                {/* Heading */}
                <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Your workspace
                        </p>
                        <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            Organization
                        </h1>
                        <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                            প্রতিষ্ঠানের তথ্য — বিল ও যোগাযোগে এই তথ্যই ব্যবহার হবে।
                        </p>
                    </div>
                </header>

                {/* Profile header card */}
                <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
                    <div className="flex flex-col gap-5 p-5 sm:p-6 sm:flex-row sm:items-center">
                        {/* Avatar */}
                        <span className="relative inline-flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-jade-50 ring-1 ring-jade-100 text-[18px] font-bold text-jade-800">
                            {org.logoUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={org.logoUrl}
                                    alt={org.name}
                                    className="size-full object-cover"
                                />
                            ) : initials ? (
                                initials
                            ) : (
                                <Building2 size={22} className="text-jade-700" />
                            )}
                        </span>

                        {/* Identity */}
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="truncate text-[20px] font-bold tracking-[-0.01em] text-jade-950">
                                    {org.name}
                                </h2>
                                <span
                                    className={cn(
                                        "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                        org.isActive
                                            ? "bg-jade-50 text-jade-800 border-jade-100"
                                            : "bg-cream text-ink-soft border-rule-soft",
                                    )}
                                >
                                    {org.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <p className="mt-1 text-[12.5px] text-ink-soft">
                                <span className="font-mono text-ink">{org.slug}</span>{" "}
                                <span className="mx-1 text-rule">·</span>
                                <span className="inline-flex items-center gap-1 tabular-nums">
                                    <Calendar size={11} className="text-ink-soft/60" />
                                    Joined{" "}
                                    {new Date(org.createdAt).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-soft">
                                {org.email && (
                                    <span className="inline-flex items-center gap-1">
                                        <Mail size={11} className="text-ink-soft/60" />
                                        <span className="text-ink">{org.email}</span>
                                    </span>
                                )}
                                {org.phone && (
                                    <span className="inline-flex items-center gap-1">
                                        <Phone size={11} className="text-ink-soft/60" />
                                        <span className="text-ink tabular-nums">
                                            {org.phone}
                                        </span>
                                    </span>
                                )}
                                {org.address && (
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin size={11} className="text-ink-soft/60" />
                                        <span className="text-ink">{org.address}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Plan callout */}
                        {org.subscription && (
                            <div className="rounded-[10px] border border-rule-soft bg-cream/60 px-4 py-3 sm:text-right">
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                                    Current plan
                                </p>
                                <p className="font-bangla text-[10.5px] text-ink-soft/65">
                                    বর্তমান প্ল্যান
                                </p>
                                <p className="mt-1 text-[15px] font-bold text-jade-950">
                                    {org.subscription.plan.replace("_", " ")}
                                </p>
                                <Link
                                    href="/owner/dashboard/subscription"
                                    className="mt-1 inline-block text-[12px] font-semibold text-jade-900 hover:text-coral-600 transition-colors"
                                >
                                    Manage subscription →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit form */}
                <div className="rounded-[14px] border border-rule-soft bg-paper">
                    <div className="border-b border-rule-soft px-5 py-4 sm:px-6">
                        <p className="font-serif text-[12.5px] italic text-coral-600/85">
                            Company details
                        </p>
                        <p className="font-bangla text-[11.5px] text-ink-soft/75">
                            ইনভয়েস ও ভাড়াটিয়ার যোগাযোগে এই তথ্য দেখানো হবে।
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <Field
                                    label="Organization name"
                                    htmlFor="org-name"
                                    required
                                >
                                    <Input
                                        id="org-name"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, name: e.target.value }))
                                        }
                                        placeholder="Sajib Properties Ltd."
                                        required
                                        className={fieldClass}
                                    />
                                </Field>
                            </div>

                            <div className="md:col-span-2">
                                <Field
                                    label="Logo URL"
                                    htmlFor="org-logo"
                                    hint="Public URL of your company logo. Leave blank to use the auto-generated initials."
                                >
                                    <Input
                                        id="org-logo"
                                        type="url"
                                        value={form.logoUrl}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                logoUrl: e.target.value,
                                            }))
                                        }
                                        placeholder="https://example.com/logo.png"
                                        className={fieldClass}
                                    />
                                </Field>
                            </div>

                            <Field label="Contact email" htmlFor="org-email">
                                <Input
                                    id="org-email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, email: e.target.value }))
                                    }
                                    placeholder="info@example.com"
                                    className={fieldClass}
                                />
                            </Field>

                            <Field label="Contact phone" htmlFor="org-phone">
                                <Input
                                    id="org-phone"
                                    type="tel"
                                    inputMode="numeric"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, phone: e.target.value }))
                                    }
                                    placeholder="01711000111"
                                    maxLength={15}
                                    className={`${fieldClass} tabular-nums`}
                                />
                            </Field>

                            <div className="md:col-span-2">
                                <Field label="Address" htmlFor="org-address">
                                    <Input
                                        id="org-address"
                                        autoComplete="street-address"
                                        value={form.address}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                address: e.target.value,
                                            }))
                                        }
                                        placeholder="House 12, Road 5, Lalmatia, Dhaka"
                                        className={fieldClass}
                                    />
                                </Field>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-rule-soft pt-4">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={!isDirty || update.isPending}
                                className="inline-flex h-9 items-center rounded-[8px] border border-rule-soft bg-paper px-4 text-[13px] font-medium text-ink-soft transition-colors hover:border-jade-700/30 hover:text-jade-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={!isDirty || update.isPending}
                                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {update.isPending ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <Save size={14} />
                                        Save changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
