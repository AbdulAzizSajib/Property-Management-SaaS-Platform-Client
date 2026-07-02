"use client";

// src/app/(dashboardLayout)/admin/dashboard/plans/page.tsx
//
// Plan-config editor for SUPER_ADMIN. Plans are enum-bound and seeded once, so
// there is no create/delete — only edit price / limits / features / isActive.

import { PlanConfigForm } from "@/src/components/dashboard/plans/PlanConfigForm";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogPortal } from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  usePlanConfigs,
  useUpdatePlanConfig,
} from "@/src/hooks/usePlanConfigs";
import { cn } from "@/src/lib/utils";
import type {
  CreatePlanConfigPayload,
  PlanConfig,
  UpdatePlanConfigPayload,
} from "@/src/types/planConfig.types";
import { PLAN_ORDER } from "@/src/types/subscription.types";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Check, Palette, Pencil, Sparkles, UsersRound, X } from "lucide-react";
import { useMemo, useState } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n);

export default function AdminPlansPage() {
  const { data: plans, isLoading, isError, error } = usePlanConfigs();

  // The plan currently being edited (null = dialog closed).
  const [editing, setEditing] = useState<PlanConfig | null>(null);
  const updateMut = useUpdatePlanConfig(editing?.id ?? "");

  const sortedPlans = useMemo(() => {
    if (!plans) return [];
    const rank = (p: string) => {
      const i = PLAN_ORDER.indexOf(p as (typeof PLAN_ORDER)[number]);
      return i === -1 ? PLAN_ORDER.length : i;
    };
    return [...plans].sort((a, b) => rank(a.plan) - rank(b.plan));
  }, [plans]);

  const closeForm = () => setEditing(null);

  const handleFormSubmit = (
    payload: CreatePlanConfigPayload | UpdatePlanConfigPayload,
  ) => {
    if (!editing) return;
    updateMut.mutate(payload as UpdatePlanConfigPayload, {
      onSuccess: () => closeForm(),
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto container space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-[13px] italic text-coral-600/85">
              Pricing catalog
            </p>
            <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
              Plans
            </h1>
            <p className="font-bangla mt-1 text-[13px] text-ink-soft">
              দাম, সীমা ও ফিচার সম্পাদনা করুন।
            </p>
          </div>
        </header>

        {/* States */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-[14px] bg-paper" />
            ))}
          </div>
        ) : isError ? (
          <ErrorBlock message={errorMessage(error)} />
        ) : sortedPlans.length === 0 ? (
          <EmptyBlock />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sortedPlans.map((p) => (
              <PlanCard key={p.id} plan={p} onEdit={() => setEditing(p)} />
            ))}
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
      >
        <DialogPortal>
          <DialogPrimitive.Backdrop className="fixed inset-0 isolate z-50 bg-black/20 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Popup
            className={cn(
              "fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2",
              "overflow-hidden rounded-xl border border-rule-soft bg-paper shadow-2xl outline-none",
              "sm:max-w-2xl data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            )}
          >
            <DialogPrimitive.Title className="sr-only">
              Edit plan
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Edit a subscription plan&apos;s price, limits and features.
            </DialogPrimitive.Description>
            <PlanConfigForm
              initial={editing ?? undefined}
              submitting={updateMut.isPending}
              onCancel={closeForm}
              onSubmit={handleFormSubmit}
            />
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </div>
  );
}

// ─── pieces ──────────────────────────────────────────────────────

function PlanCard({ plan, onEdit }: { plan: PlanConfig; onEdit: () => void }) {
  const price = parseFloat(plan.priceMonthly) || 0;
  const featureCount = plan.features.length;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-[14px] border bg-paper p-5 transition-all",
        plan.isPopular
          ? "border-coral-100 shadow-[0_20px_50px_-30px_rgba(232,93,68,0.35)]"
          : "border-rule-soft",
        !plan.isActive && "opacity-75",
      )}
    >
      {plan.isPopular && (
        <span className="absolute -top-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-coral-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-paper shadow-[0_4px_12px_-4px_rgba(232,93,68,0.6)]">
          <Sparkles size={9} />
          Popular
        </span>
      )}

      {/* Status row */}
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-md bg-jade-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-jade-800">
          {plan.plan.replace("_", " ")}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            plan.isActive
              ? "border-jade-100 bg-jade-50/60 text-jade-700"
              : "border-rule-soft bg-cream text-ink-soft",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              plan.isActive ? "bg-jade-600" : "bg-ink-soft/50",
            )}
          />
          {plan.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Name + description */}
      <div className="mb-3">
        <h3 className="text-[18px] font-bold tracking-[-0.01em] text-jade-950">
          {plan.displayName}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-[12.5px] text-ink-soft">
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-[26px] font-bold leading-none tracking-[-0.025em] text-jade-950 tabular-nums">
            {price === 0 ? "Free" : fmt(price)}
          </span>
          {price > 0 && <span className="text-[12px] text-ink-soft">/mo</span>}
        </div>
        {plan.trialDays !== null && plan.trialDays > 0 && (
          <p className="mt-0.5 text-[11.5px] font-medium text-coral-600">
            {plan.trialDays}-day trial
          </p>
        )}
      </div>

      {/* Limits */}
      <ul className="mb-3 space-y-1.5 text-[12.5px] text-ink">
        <LimitRow label="Buildings" value={plan.buildingLimit} />
        <LimitRow label="Floors" value={plan.floorLimit} />
        <LimitRow label="Units" value={plan.unitLimit} />
        <LimitRow label="Tenants" value={plan.tenantLimit} />
      </ul>

      {/* Capabilities pills */}
      <div className="mb-3 flex flex-wrap gap-1">
        <CapPill label="SMS" icon={Check} on={plan.smsEnabled} />
        <CapPill label="Branding" icon={Palette} on={plan.customBranding} />
        <CapPill label="Multi-admin" icon={UsersRound} on={plan.multiAdmin} />
      </div>

      <p className="text-[11px] text-ink-soft">
        {featureCount === 0
          ? "No feature bullets"
          : `${featureCount} feature${featureCount === 1 ? "" : "s"}`}
      </p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-rule-soft pt-3">
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
          <Pencil size={12} />
          Edit
        </Button>
      </div>
    </div>
  );
}

function LimitRow({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-ink-soft">{label}</span>
      <span className="font-semibold tabular-nums text-jade-950">
        {value.toLocaleString()}
      </span>
    </li>
  );
}

function CapPill({
  label,
  icon: Icon,
  on,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  on: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium",
        on
          ? "border-jade-100 bg-jade-50 text-jade-800"
          : "border-rule-soft bg-cream/50 text-ink-soft",
      )}
    >
      <Icon size={10} className={on ? "text-jade-700" : "text-ink-soft/60"} />
      {label}
      {on ? null : <X size={9} className="text-ink-soft/50" />}
    </span>
  );
}

function EmptyBlock() {
  return (
    <div className="rounded-[14px] border border-dashed border-rule-soft bg-paper px-6 py-12 text-center">
      <h2 className="text-[15px] font-bold text-jade-950">No plans found</h2>
      <p className="mt-1 text-[13px] text-ink-soft">
        Plans are seeded automatically. Restart the server to re-initialize the
        catalog.
      </p>
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
      <h2 className="text-[15px] font-bold text-coral-600">
        Couldn&apos;t load plans
      </h2>
      <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-600/80">
        {message}
      </p>
    </div>
  );
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
