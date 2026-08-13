"use client";

// src/app/admin/dashboard/subscriptions/page.tsx
//
// SUPER_ADMIN — list every organization's subscription and apply manual
// plan/status overrides via PATCH /subscriptions/:organizationId.

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  useAdminUpdateSubscription,
  useAllSubscriptions,
} from "@/src/hooks/useSubscription";
import { cn } from "@/src/lib/utils";
import {
  PLAN_ORDER,
  type SubscriptionPlan,
  type SubscriptionStatus,
  type SubscriptionWithOrganization,
} from "@/src/types/subscription.types";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";

const STATUSES: SubscriptionStatus[] = [
  "TRIALING",
  "ACTIVE",
  "PAST_DUE",
  "CANCELLED",
  "EXPIRED",
];

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n);

export default function AdminSubscriptionsPage() {
  const { data, isLoading, isError, error } = useAllSubscriptions();
  const [editing, setEditing] = useState<SubscriptionWithOrganization | null>(
    null,
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto container space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header>
          <p className="font-serif text-[13px] italic text-coral-600/85">
            Platform billing
          </p>
          <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
            All subscriptions
          </h1>
        </header>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-[10px] bg-paper" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
            <h2 className="text-[15px] font-bold text-coral-600">
              Couldn&apos;t load subscriptions
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
              {error instanceof Error ? error.message : "Something went wrong."}
            </p>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-rule-soft bg-paper px-6 py-12 text-center">
            <p className="text-[14px] font-semibold text-jade-950">
              No subscriptions yet
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
            <table className="w-full text-[13px]">
              <thead className="bg-cream/60 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                <tr>
                  <th className="px-3 py-2 text-left">Organization</th>
                  <th className="px-3 py-2 text-left">Plan</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-right">Price</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule-soft">
                {data.map((sub) => (
                  <tr key={sub.id} className="bg-paper hover:bg-cream/40">
                    <td className="px-3 py-2 align-middle">
                      <p className="font-semibold text-ink">
                        {sub.organization.name}
                      </p>
                      <p className="text-[11px] text-ink-soft">
                        {sub.organization.email ?? "—"}
                      </p>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <span className="rounded-md bg-jade-50 px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-jade-800">
                        {sub.plan.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-3 py-2 text-right align-middle tabular-nums">
                      {fmtMoney(parseFloat(sub.priceMonthly) || 0)}
                      <span className="text-ink-soft">/mo</span>
                    </td>
                    <td className="px-3 py-2 text-right align-middle">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(sub)}
                      >
                        <Pencil size={12} />
                        Override
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <OverrideDialog
          subscription={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const map: Record<SubscriptionStatus, string> = {
    TRIALING: "border-jade-100 bg-jade-50/60 text-jade-700",
    ACTIVE: "border-jade-100 bg-jade-50 text-jade-800",
    PAST_DUE: "border-coral-100 bg-coral-50 text-coral-600",
    CANCELLED: "border-rule-soft bg-cream text-ink-soft",
    EXPIRED: "border-coral-100 bg-coral-50 text-coral-600",
  };
  return (
    <span
      className={cn(
        "rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider",
        map[status],
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function OverrideDialog({
  subscription,
  onClose,
}: {
  subscription: SubscriptionWithOrganization;
  onClose: () => void;
}) {
  const [plan, setPlan] = useState<SubscriptionPlan>(subscription.plan);
  const [status, setStatus] = useState<SubscriptionStatus>(subscription.status);
  const mut = useAdminUpdateSubscription(subscription.organizationId);

  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open && !mut.isPending) onClose();
      }}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Override {subscription.organization.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Manually set plan and status. This bypasses normal billing.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <label className="block">
            <span className="text-[12px] font-semibold text-ink">Plan</span>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as SubscriptionPlan)}
              className="mt-1 h-8 w-full rounded-md border border-rule-soft bg-paper px-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-jade-700/30"
            >
              {PLAN_ORDER.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[12px] font-semibold text-ink">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
              className="mt-1 h-8 w-full rounded-md border border-rule-soft bg-paper px-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-jade-700/30"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" disabled={mut.isPending} onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={mut.isPending}
            onClick={() =>
              mut.mutate({ plan, status }, { onSuccess: () => onClose() })
            }
            className="bg-sky-950 text-paper hover:bg-sky-950"
          >
            {mut.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : (
              "Apply override"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
