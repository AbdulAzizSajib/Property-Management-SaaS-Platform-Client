"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useOrganization, useUpdateOrganization } from "@/src/hooks/useOrganization";
import { Building2, Loader2, Mail, MapPin, Phone, Save } from "lucide-react";
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

    // Hydrate form when org loads.
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

        // Only send fields that actually changed (PATCH semantics).
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
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (isError || !org) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <Card className="px-5">
                    <CardHeader className="px-0">
                        <CardTitle>Couldn&apos;t load organization</CardTitle>
                        <CardDescription>
                            {error instanceof Error
                                ? error.message
                                : "Something went wrong. Please try again."}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const initials = org.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Heading */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Organization
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your company profile, contact details and subscription summary.
                </p>
            </div>

            {/* Profile header card */}
            <Card className="px-6 py-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <Avatar className="size-16 ring-2 ring-slate-200">
                        {org.logoUrl ? (
                            <AvatarImage src={org.logoUrl} alt={org.name} />
                        ) : null}
                        <AvatarFallback className="bg-linear-to-br from-indigo-500 to-violet-600 text-lg font-semibold text-white">
                            {initials || <Building2 size={20} />}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-xl font-semibold text-slate-900">
                                {org.name}
                            </h2>
                            <Badge
                                variant="outline"
                                className={
                                    org.isActive
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-slate-200 bg-slate-50 text-slate-600"
                                }
                            >
                                {org.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">
                            <span className="font-mono">{org.slug}</span> ·{" "}
                            <span>Joined {new Date(org.createdAt).toLocaleDateString()}</span>
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                            {org.email && (
                                <span className="inline-flex items-center gap-1.5">
                                    <Mail size={12} /> {org.email}
                                </span>
                            )}
                            {org.phone && (
                                <span className="inline-flex items-center gap-1.5">
                                    <Phone size={12} /> {org.phone}
                                </span>
                            )}
                            {org.address && (
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin size={12} /> {org.address}
                                </span>
                            )}
                        </div>
                    </div>

                    {org.subscription && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:text-right">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                                Current plan
                            </p>
                            <p className="mt-0.5 text-base font-semibold text-slate-900">
                                {org.subscription.plan.replace("_", " ")}
                            </p>
                            <Link
                                href="/owner/dashboard/subscription"
                                className="mt-1 inline-block text-xs font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                Manage subscription →
                            </Link>
                        </div>
                    )}
                </div>
            </Card>

            {/* Edit form */}
            <Card className="px-6 py-6">
                <CardHeader className="px-0">
                    <CardTitle>Company details</CardTitle>
                    <CardDescription>
                        These details appear on invoices and tenant communications.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="md:col-span-2 space-y-1.5">
                                <Label htmlFor="name">Organization name</Label>
                                <Input
                                    id="name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, name: e.target.value }))
                                    }
                                    placeholder="Sajib Properties Ltd."
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <Label htmlFor="logoUrl">Logo URL</Label>
                                <Input
                                    id="logoUrl"
                                    type="url"
                                    value={form.logoUrl}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, logoUrl: e.target.value }))
                                    }
                                    placeholder="https://example.com/logo.png"
                                />
                                <p className="text-xs text-slate-500">
                                    Public URL of your company logo. Leave blank to use the
                                    auto-generated initials.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email">Contact email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, email: e.target.value }))
                                    }
                                    placeholder="info@example.com"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="phone">Contact phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, phone: e.target.value }))
                                    }
                                    placeholder="01711000111"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={form.address}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, address: e.target.value }))
                                    }
                                    placeholder="House 12, Road 5, Lalmatia, Dhaka"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                disabled={!isDirty || update.isPending}
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isDirty || update.isPending}
                            >
                                {update.isPending ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={14} />
                                        Save changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
