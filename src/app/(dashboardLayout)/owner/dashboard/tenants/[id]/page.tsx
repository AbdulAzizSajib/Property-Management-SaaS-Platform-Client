"use client";

import { TenantForm } from "@/src/components/dashboard/tenants/TenantForm";
import { formatMoney } from "@/src/components/dashboard/units/unitStyles";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
    useDeactivateTenant,
    useTenant,
    useUpdateTenant,
} from "@/src/hooks/useTenants";
import { cn } from "@/src/lib/utils";
import type { UpdateTenantPayload } from "@/src/types/tenant.types";
import {
    AlertTriangle,
    ArrowLeft,
    Briefcase,
    Calendar,
    FileText,
    IdCard,
    Loader2,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Power,
    ShieldCheck,
    User,
    UserX,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function TenantDetailPage() {
    const params = useParams<{ id: string }>();
    const tenantId = params.id;

    const { data: tenant, isLoading, isError, error } = useTenant(tenantId);
    const updateMutation = useUpdateTenant(tenantId);
    const deactivateMutation = useDeactivateTenant();

    const [editOpen, setEditOpen] = useState(false);
    const [deactivateOpen, setDeactivateOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-72 w-full" />
            </div>
        );
    }

    if (isError || !tenant) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <Link
                    href="/owner/dashboard/tenants"
                    className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                    <ArrowLeft size={12} />
                    Back to tenants
                </Link>
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load tenant
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Tenant not found."}
                    </p>
                </Card>
            </div>
        );
    }

    const initials = tenant.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const activeLeases = tenant.leases.filter((l) => l.status === "ACTIVE");

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Breadcrumb */}
            <Link
                href="/owner/dashboard/tenants"
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
            >
                <ArrowLeft size={12} />
                All tenants
            </Link>

            {/* Hero */}
            <Card className="px-6 py-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        <Avatar className="size-16 ring-2 ring-slate-200">
                            {tenant.photoUrl && (
                                <AvatarImage src={tenant.photoUrl} alt={tenant.name} />
                            )}
                            <AvatarFallback className="bg-indigo-100 text-lg font-semibold text-indigo-700">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900">
                                    {tenant.name}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={
                                        tenant.isActive
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border-slate-200 bg-slate-50 text-slate-600"
                                    }
                                >
                                    {tenant.isActive ? "Active" : "Inactive"}
                                </Badge>
                                {tenant.user && (
                                    <Badge
                                        variant="outline"
                                        className="border-indigo-200 bg-indigo-50 text-indigo-700"
                                    >
                                        <ShieldCheck size={10} className="mr-1" />
                                        Portal access
                                    </Badge>
                                )}
                            </div>
                            {tenant.occupation && (
                                <p className="mt-1 text-sm text-slate-500">
                                    <Briefcase size={12} className="mr-1 inline" />
                                    {tenant.occupation}
                                </p>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1">
                                    <Phone size={11} /> {tenant.phone}
                                </span>
                                {tenant.email && (
                                    <span className="inline-flex items-center gap-1">
                                        <Mail size={11} /> {tenant.email}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1">
                                    <Calendar size={11} />
                                    Joined {new Date(tenant.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                            <Pencil size={13} /> Edit
                        </Button>
                        {tenant.isActive && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeactivateOpen(true)}
                            >
                                <Power size={13} /> Deactivate
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <SmallStat
                    label="Total leases"
                    value={tenant.leases.length}
                    accent="indigo"
                />
                <SmallStat
                    label="Active leases"
                    value={activeLeases.length}
                    accent="emerald"
                />
                <SmallStat
                    label="Portal account"
                    value={tenant.user ? "Yes" : "No"}
                    accent="violet"
                />
                <SmallStat
                    label="Status"
                    value={tenant.isActive ? "Active" : "Inactive"}
                    accent={tenant.isActive ? "emerald" : "rose"}
                />
            </div>

            {/* Personal info + Emergency + Leases */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Personal info */}
                <Card className="px-6 lg:col-span-1">
                    <CardHeader className="px-0">
                        <CardTitle>Personal info</CardTitle>
                        <CardDescription>Identification &amp; address</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <ul className="space-y-3">
                            <InfoRow
                                icon={IdCard}
                                label="NID number"
                                value={tenant.nidNumber}
                            />
                            <InfoRow
                                icon={Briefcase}
                                label="Occupation"
                                value={tenant.occupation}
                            />
                            <InfoRow
                                icon={MapPin}
                                label="Permanent address"
                                value={tenant.permanentAddress}
                                multiline
                            />
                        </ul>
                    </CardContent>
                </Card>

                {/* Emergency */}
                <Card className="px-6 lg:col-span-1">
                    <CardHeader className="px-0">
                        <CardTitle>Emergency contact</CardTitle>
                        <CardDescription>Who to reach in case of emergency</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        {tenant.emergencyContact || tenant.emergencyName ? (
                            <ul className="space-y-3">
                                <InfoRow
                                    icon={User}
                                    label="Name"
                                    value={tenant.emergencyName}
                                />
                                <InfoRow
                                    icon={Phone}
                                    label="Phone"
                                    value={tenant.emergencyContact}
                                />
                            </ul>
                        ) : (
                            <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center">
                                <AlertTriangle
                                    className="mx-auto text-slate-300"
                                    size={22}
                                />
                                <p className="mt-2 text-sm text-slate-500">
                                    No emergency contact recorded
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Portal */}
                <Card className="px-6 lg:col-span-1">
                    <CardHeader className="px-0">
                        <CardTitle>Portal access</CardTitle>
                        <CardDescription>Linked tenant login account</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        {tenant.user ? (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-800">
                                    {tenant.user.name}
                                </p>
                                <p className="text-xs text-slate-500">{tenant.user.email}</p>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    <Badge
                                        variant="outline"
                                        className={
                                            tenant.user.emailVerified
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : "border-amber-200 bg-amber-50 text-amber-700"
                                        }
                                    >
                                        {tenant.user.emailVerified
                                            ? "Email verified"
                                            : "Email unverified"}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={
                                            tenant.user.isActive
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : "border-slate-200 bg-slate-50 text-slate-600"
                                        }
                                    >
                                        {tenant.user.isActive
                                            ? "Account active"
                                            : "Account inactive"}
                                    </Badge>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center">
                                <UserX className="mx-auto text-slate-300" size={22} />
                                <p className="mt-2 text-sm text-slate-500">
                                    No portal login created
                                </p>
                                <p className="mx-auto mt-1 max-w-[200px] text-[11px] text-slate-400">
                                    Tenant cannot sign in to view invoices or pay rent online.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Leases */}
            <Card className="px-6">
                <CardHeader className="px-0">
                    <CardTitle>Lease history</CardTitle>
                    <CardDescription>
                        {tenant.leases.length === 0
                            ? "No leases on record"
                            : `${tenant.leases.length} lease${tenant.leases.length === 1 ? "" : "s"} on record`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    {tenant.leases.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
                            <FileText className="mx-auto text-slate-300" size={24} />
                            <p className="mt-2 text-sm text-slate-500">
                                This tenant has no lease history.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {tenant.leases.map((lease) => (
                                <li
                                    key={lease.id}
                                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-800">
                                            Lease #{lease.id.slice(-6).toUpperCase()}
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            {new Date(lease.startDate).toLocaleDateString()}{" "}
                                            – {new Date(lease.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-900 tabular-nums">
                                            {formatMoney(lease.monthlyRent)}
                                        </p>
                                        <Badge variant="outline" className="text-[10px]">
                                            {lease.status}
                                        </Badge>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            {/* Edit dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit tenant</DialogTitle>
                        <DialogDescription>
                            Update details for {tenant.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <TenantForm
                        mode="edit"
                        submitting={updateMutation.isPending}
                        submitLabel="Save changes"
                        defaultValues={{
                            name: tenant.name,
                            phone: tenant.phone,
                            email: tenant.email ?? "",
                            nidNumber: tenant.nidNumber ?? "",
                            occupation: tenant.occupation ?? "",
                            emergencyContact: tenant.emergencyContact ?? "",
                            emergencyName: tenant.emergencyName ?? "",
                            permanentAddress: tenant.permanentAddress ?? "",
                            photoUrl: tenant.photoUrl ?? "",
                            createLoginAccount: false,
                            password: "",
                        }}
                        onCancel={() => setEditOpen(false)}
                        onSubmit={(values) => {
                            const payload: UpdateTenantPayload = {};

                            const setIfChanged = <K extends keyof UpdateTenantPayload>(
                                key: K,
                                newVal: string,
                                currentVal: string | null,
                            ) => {
                                const trimmed = newVal.trim();
                                if (trimmed !== (currentVal ?? "")) {
                                    (payload[key] as unknown) =
                                        trimmed === "" ? null : trimmed;
                                }
                            };

                            if (values.name.trim() !== tenant.name) {
                                payload.name = values.name.trim();
                            }
                            if (values.phone.trim() !== tenant.phone) {
                                payload.phone = values.phone.trim();
                            }
                            setIfChanged("email", values.email, tenant.email);
                            setIfChanged("nidNumber", values.nidNumber, tenant.nidNumber);
                            setIfChanged(
                                "occupation",
                                values.occupation,
                                tenant.occupation,
                            );
                            setIfChanged(
                                "emergencyContact",
                                values.emergencyContact,
                                tenant.emergencyContact,
                            );
                            setIfChanged(
                                "emergencyName",
                                values.emergencyName,
                                tenant.emergencyName,
                            );
                            setIfChanged(
                                "permanentAddress",
                                values.permanentAddress,
                                tenant.permanentAddress,
                            );
                            setIfChanged("photoUrl", values.photoUrl, tenant.photoUrl);

                            if (Object.keys(payload).length === 0) {
                                setEditOpen(false);
                                return;
                            }

                            updateMutation.mutate(payload, {
                                onSuccess: () => setEditOpen(false),
                            });
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Deactivate confirmation */}
            <AlertDialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate this tenant?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <strong>{tenant.name}</strong> will be marked as inactive. Their
                            lease history and invoices remain intact, but they won&apos;t appear
                            in new lease pickers.
                            {activeLeases.length > 0 && (
                                <span className="mt-2 block rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
                                    <AlertTriangle
                                        size={12}
                                        className="mr-1 inline"
                                    />
                                    This tenant has{" "}
                                    <strong>
                                        {activeLeases.length} active lease
                                        {activeLeases.length === 1 ? "" : "s"}
                                    </strong>
                                    . You may want to terminate those first.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deactivateMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={deactivateMutation.isPending}
                            onClick={() => {
                                deactivateMutation.mutate(tenant.id, {
                                    onSuccess: () => setDeactivateOpen(false),
                                });
                            }}
                        >
                            {deactivateMutation.isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Deactivating...
                                </>
                            ) : (
                                "Deactivate tenant"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function SmallStat({
    label,
    value,
    accent,
}: {
    label: string;
    value: number | string;
    accent: "indigo" | "emerald" | "violet" | "rose";
}) {
    const accents: Record<typeof accent, string> = {
        indigo: "text-indigo-700",
        emerald: "text-emerald-700",
        violet: "text-violet-700",
        rose: "text-rose-700",
    };
    return (
        <Card className="px-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                {label}
            </p>
            <p
                className={cn(
                    "mt-1 text-2xl font-semibold tabular-nums",
                    accents[accent],
                )}
            >
                {value}
            </p>
        </Card>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
    multiline,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string | null;
    multiline?: boolean;
}) {
    return (
        <li className="flex items-start gap-2.5">
            <Icon size={14} className="mt-0.5 shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    {label}
                </p>
                <p
                    className={cn(
                        "text-sm text-slate-700",
                        multiline ? "whitespace-pre-line" : "truncate",
                        !value && "text-slate-400",
                    )}
                >
                    {value || "—"}
                </p>
            </div>
        </li>
    );
}
