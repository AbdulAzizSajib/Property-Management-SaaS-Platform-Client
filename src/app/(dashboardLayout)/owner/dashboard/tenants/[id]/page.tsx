"use client";

// src/app/owner/dashboard/tenants/[id]/page.tsx

import { getLeaseStatusTone } from "@/src/components/dashboard/leases/leaseStyles";
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
import { fmtNum } from "@/src/lib/numerals";
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
      <div className="min-h-screen bg-cream">
        <div className="mx-auto container space-y-5 p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-5 w-32 bg-paper" />
          <Skeleton className="h-44 w-full bg-paper rounded-[18px]" />
          <Skeleton className="h-72 w-full bg-paper rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (isError || !tenant) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="mx-auto container p-4 sm:p-6 lg:p-8">
          <Link
            href="/owner/dashboard/tenants"
            className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft hover:text-jade-900"
          >
            <ArrowLeft size={12} />
            Back to tenants
          </Link>
          <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
            <h2 className="text-[15px] font-bold text-coral-600">
              Couldn&apos;t load tenant
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
              {error instanceof Error ? error.message : "Tenant not found."}
            </p>
          </div>
        </div>
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
  const monthlyTotal = activeLeases.reduce(
    (sum, l) => sum + Number(l.monthlyRent ?? 0),
    0,
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto container space-y-5 p-4 sm:p-6 lg:p-8">
        {/* Back link */}
        <Link
          href="/owner/dashboard/tenants"
          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-jade-900"
        >
          <ArrowLeft size={12} />
          All tenants
        </Link>

        {/* Hero — identity + money summary inline */}
        <div
          className="overflow-hidden rounded-[18px] border border-rule-soft bg-paper"
          style={{
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.6) inset, 0 14px 36px -22px rgba(10,46,34,0.22)",
          }}
        >
          <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-6">
            <div className="flex items-start gap-4 min-w-0">
              {/* Avatar */}
              <span className="relative inline-flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-jade-50 ring-2 ring-jade-100">
                {tenant.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={tenant.photoUrl}
                    alt={tenant.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-[18px] font-bold text-jade-800">
                    {initials}
                  </span>
                )}
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-[26px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[28px]">
                    {tenant.name}
                  </h1>
                  <span
                    className={cn(
                      "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      tenant.isActive
                        ? "bg-jade-50 text-jade-800 border-jade-100"
                        : "bg-cream text-ink-soft border-rule-soft",
                    )}
                  >
                    {tenant.isActive ? "Active" : "Inactive"}
                  </span>
                  {tenant.user && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-jade-100 bg-jade-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-jade-800">
                      <ShieldCheck size={10} />
                      Portal
                    </span>
                  )}
                </div>

                {tenant.occupation && (
                  <p className="mt-1.5 text-[13px] text-ink-soft">
                    <Briefcase
                      size={12}
                      className="mr-1 inline -translate-y-px text-ink-soft/60"
                    />
                    {tenant.occupation}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-ink-soft">
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Phone size={11} className="text-ink-soft/60" />
                    {tenant.phone}
                  </span>
                  {tenant.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail size={11} className="text-ink-soft/60" />
                      {tenant.email}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} className="text-ink-soft/60" />
                    Joined {new Date(tenant.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end lg:flex-row lg:items-start">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-rule-soft bg-paper px-3 text-[12.5px] font-medium text-ink transition-colors hover:border-jade-700/30 hover:text-jade-900"
              >
                <Pencil size={12} />
                Edit
              </button>
              {tenant.isActive && (
                <button
                  type="button"
                  onClick={() => setDeactivateOpen(true)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-coral-100 bg-coral-50 px-3 text-[12.5px] font-semibold text-coral-600 transition-colors hover:bg-coral-100"
                >
                  <Power size={12} />
                  Deactivate
                </button>
              )}
            </div>
          </div>

          {/* Money summary bar — replaces 4 redundant SmallStats */}
          <div className="grid grid-cols-3 divide-x divide-rule-soft border-t border-rule-soft bg-cream/40">
            <MoneyCell
              label="Active leases"
              bn="সক্রিয় লিজ"
              value={fmtNum(activeLeases.length)}
              sub={`of ${fmtNum(tenant.leases.length)} total`}
              highlight={activeLeases.length > 0}
            />
            <MoneyCell
              label="Monthly rent"
              bn="মাসিক ভাড়া"
              value={monthlyTotal > 0 ? formatMoney(monthlyTotal) : "—"}
              sub={monthlyTotal > 0 ? "from active leases" : "no active rent"}
              highlight={monthlyTotal > 0}
              primary
            />
            <MoneyCell
              label="Lease history"
              bn="ইতিহাস"
              value={fmtNum(tenant.leases.length)}
              sub={
                tenant.leases.length === 1
                  ? "lease on record"
                  : "leases on record"
              }
            />
          </div>
        </div>

        {/* Info row: Personal+Emergency together, Portal separate */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Personal + Emergency — both are "about the person" */}
          <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
            <div>
              <p className="font-serif text-[13px] italic text-coral-600/85">
                About the tenant
              </p>
              <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                Personal info
              </h3>
            </div>

            <ul className="mt-4 space-y-3.5">
              <InfoRow
                icon={IdCard}
                label="NID number"
                bn="এনআইডি"
                value={tenant.nidNumber}
                mono
              />
              <InfoRow
                icon={Briefcase}
                label="Occupation"
                bn="পেশা"
                value={tenant.occupation}
              />
              <InfoRow
                icon={MapPin}
                label="Permanent address"
                bn="স্থায়ী ঠিকানা"
                value={tenant.permanentAddress}
                multiline
              />
            </ul>

            {/* Emergency contact subsection */}
            <div className="mt-5 border-t border-rule-soft pt-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                Emergency contact
              </p>
              <p className="font-bangla text-[10.5px] text-ink-soft/70">
                জরুরী যোগাযোগ
              </p>

              {tenant.emergencyContact || tenant.emergencyName ? (
                <div className="mt-2.5 rounded-[10px] border border-rule-soft bg-cream/60 p-3">
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-ink-soft/60" />
                    <p className="text-[13.5px] font-semibold text-ink">
                      {tenant.emergencyName || "—"}
                    </p>
                  </div>
                  {tenant.emergencyContact && (
                    <div className="mt-1 flex items-center gap-2">
                      <Phone size={13} className="text-ink-soft/60" />
                      <p className="text-[13px] text-ink-soft tabular-nums">
                        {tenant.emergencyContact}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-coral-100 bg-coral-50/60 px-2 py-1 text-[11.5px] text-coral-600">
                  <AlertTriangle size={11} />
                  No emergency contact on file
                </div>
              )}
            </div>
          </div>

          {/* Portal access */}
          <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
            <p className="font-serif text-[13px] italic text-coral-600/85">
              Self-service login
            </p>
            <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
              Portal access
            </h3>
            <p className="mt-1 text-[12px] text-ink-soft">
              Whether this tenant can sign in to pay rent and view invoices.
            </p>

            {tenant.user ? (
              <div className="mt-4 rounded-[10px] border border-rule-soft bg-cream/60 p-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-jade-50 text-[11.5px] font-bold text-jade-800">
                    {tenant.user.name
                      .split(" ")
                      .filter(Boolean)
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-ink">
                      {tenant.user.name}
                    </p>
                    <p className="truncate text-[11.5px] text-ink-soft">
                      {tenant.user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span
                    className={cn(
                      "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      tenant.user.emailVerified
                        ? "bg-jade-50 text-jade-800 border-jade-100"
                        : "bg-coral-50 text-coral-600 border-coral-100",
                    )}
                  >
                    {tenant.user.emailVerified
                      ? "Email verified"
                      : "Email unverified"}
                  </span>
                  <span
                    className={cn(
                      "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      tenant.user.isActive
                        ? "bg-jade-50 text-jade-800 border-jade-100"
                        : "bg-cream text-ink-soft border-rule-soft",
                    )}
                  >
                    {tenant.user.isActive
                      ? "Account active"
                      : "Account inactive"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[10px] border border-dashed border-rule-soft px-4 py-6 text-center">
                <UserX className="mx-auto text-ink-soft/40" size={22} />
                <p className="mt-2 text-[13px] text-ink-soft">
                  No portal login created
                </p>
                <p className="font-bangla mt-0.5 text-[11px] text-ink-soft/65">
                  পোর্টাল লগইন নেই
                </p>
                <p className="mx-auto mt-2 max-w-[220px] text-[11.5px] text-ink-soft/75">
                  Tenant cannot sign in to view invoices or pay rent online.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Leases */}
        <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-serif text-[13px] italic text-coral-600/85">
                Rental agreements
              </p>
              <h3 className="mt-0.5 text-[16px] font-bold tracking-[-0.015em] text-jade-950">
                Lease history
              </h3>
              <p className="mt-1 text-[12px] text-ink-soft">
                {tenant.leases.length === 0
                  ? "No leases on record"
                  : `${fmtNum(tenant.leases.length)} lease${tenant.leases.length === 1 ? "" : "s"} on record`}
              </p>
            </div>
            {tenant.leases.length > 0 && (
              <Link
                href={`/owner/dashboard/leases?tenantId=${tenant.id}`}
                className="text-[12.5px] font-medium text-jade-900 hover:text-coral-600 transition-colors"
              >
                View all →
              </Link>
            )}
          </div>

          <div className="mt-4">
            {tenant.leases.length === 0 ? (
              <div className="rounded-[10px] border border-dashed border-rule-soft px-4 py-8 text-center">
                <FileText className="mx-auto text-ink-soft/40" size={24} />
                <p className="mt-2 text-[13px] text-ink-soft">
                  This tenant has no lease history.
                </p>
                <p className="font-bangla mt-0.5 text-[11.5px] text-ink-soft/70">
                  কোনো লিজ নেই
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-rule-soft">
                {tenant.leases.map((lease) => (
                  <li
                    key={lease.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-ink">
                        Lease #{lease.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-[11.5px] text-ink-soft tabular-nums">
                        {new Date(lease.startDate).toLocaleDateString()} –{" "}
                        {new Date(lease.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <p className="text-[14px] font-semibold text-jade-950 tabular-nums">
                        {formatMoney(lease.monthlyRent)}
                      </p>
                      <span
                        className={cn(
                          "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          getLeaseStatusTone(lease.status),
                        )}
                      >
                        {lease.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Edit dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-jade-950">Edit tenant</DialogTitle>
              <DialogDescription className="text-ink-soft">
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
                    (payload[key] as unknown) = trimmed === "" ? null : trimmed;
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
              <AlertDialogTitle className="text-jade-950">
                Deactivate this tenant?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-ink-soft">
                <strong className="text-ink">{tenant.name}</strong> will be
                marked as inactive. Their lease history and invoices remain
                intact, but they won&apos;t appear in new lease pickers.
              </AlertDialogDescription>
              {activeLeases.length > 0 && (
                <div className="mt-3 flex items-start gap-2 rounded-[10px] border border-coral-100 bg-coral-50/70 px-3 py-2 text-[12.5px] text-coral-600">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                  <span>
                    This tenant has{" "}
                    <strong>
                      {fmtNum(activeLeases.length)} active lease
                      {activeLeases.length === 1 ? "" : "s"}
                    </strong>
                    . You may want to terminate those first.
                  </span>
                </div>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deactivateMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={deactivateMutation.isPending}
                onClick={() => {
                  deactivateMutation.mutate(tenant.id, {
                    onSuccess: () => setDeactivateOpen(false),
                  });
                }}
                className="bg-coral-600 text-paper hover:bg-coral-700"
              >
                {deactivateMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deactivating…
                  </>
                ) : (
                  "Deactivate tenant"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function MoneyCell({
  label,
  bn,
  value,
  sub,
  highlight,
  primary,
}: {
  label: string;
  bn: string;
  value: string;
  sub: string;
  highlight?: boolean;
  primary?: boolean;
}) {
  return (
    <div className="px-4 py-3.5 sm:px-5">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </p>
      <p className="font-bangla text-[10.5px] text-ink-soft/70">{bn}</p>
      <p
        className={cn(
          "mt-1 font-bold tracking-[-0.025em] tabular-nums leading-none",
          primary ? "text-[24px]" : "text-[22px]",
          highlight ? "text-jade-950" : "text-ink-soft/70",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] text-ink-soft">{sub}</p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  bn,
  value,
  multiline,
  mono,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  bn: string;
  value: string | null;
  multiline?: boolean;
  mono?: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-cream text-ink-soft">
        <Icon size={13} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          {label}{" "}
          <span className="font-bangla font-normal normal-case text-ink-soft/65 tracking-normal">
            · {bn}
          </span>
        </p>
        <p
          className={cn(
            "mt-0.5 text-[13.5px]",
            value ? "text-ink" : "text-ink-soft/50 italic",
            multiline ? "whitespace-pre-line" : "truncate",
            mono && "font-mono tabular-nums",
          )}
        >
          {value || "Not provided"}
        </p>
      </div>
    </li>
  );
}
