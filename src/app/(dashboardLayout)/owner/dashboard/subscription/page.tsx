"use client";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useChangePlan, useSubscription } from "@/src/hooks/useSubscription";
import { cn } from "@/src/lib/utils";
import {
    PLAN_ORDER,
    PLAN_PRESETS,
    type SubscriptionPlan,
    type SubscriptionStatus,
} from "@/src/types/subscription.types";
import {
    Building,
    Check,
    Clock,
    CreditCard,
    DoorOpen,
    Loader2,
    MessageSquare,
    Palette,
    Sparkles,
    Users,
    UsersRound,
    X,
} from "lucide-react";

const statusStyles: Record<SubscriptionStatus, { label: string; className: string }> = {
    TRIALING: { label: "Trialing", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    ACTIVE: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    PAST_DUE: { label: "Past Due", className: "bg-amber-50 text-amber-700 border-amber-200" },
    CANCELED: { label: "Canceled", className: "bg-slate-100 text-slate-600 border-slate-200" },
    EXPIRED: { label: "Expired", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

const fmt = (n: number) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(n);

function daysUntil(iso: string | null): number | null {
    if (!iso) return null;
    const diff = new Date(iso).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function SubscriptionPage() {
    const { data: sub, isLoading, isError, error } = useSubscription();
    const changePlan = useChangePlan();

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-44 w-full" />
                <div className="grid gap-4 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-80" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError || !sub) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <Card className="px-5">
                    <CardHeader className="px-0">
                        <CardTitle>Couldn&apos;t load subscription</CardTitle>
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

    const status = statusStyles[sub.status];
    const trialDaysLeft = daysUntil(sub.trialEndsAt);
    const price = parseFloat(sub.priceMonthly) || 0;

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Heading */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Subscription
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Your current plan, usage limits and available upgrades.
                </p>
            </div>

            {/* Trial warning */}
            {sub.status === "TRIALING" && trialDaysLeft !== null && trialDaysLeft <= 7 && (
                <Alert>
                    <Clock />
                    <AlertTitle>
                        {trialDaysLeft <= 0
                            ? "Your free trial has ended"
                            : `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left on your free trial`}
                    </AlertTitle>
                    <AlertDescription>
                        Upgrade now to keep access to all your buildings, units and tenants without
                        interruption.
                    </AlertDescription>
                </Alert>
            )}

            {/* Current plan summary */}
            <Card className="px-6 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        <span className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-600/30">
                            <CreditCard size={22} />
                        </span>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {PLAN_PRESETS[sub.plan].label} Plan
                                </h2>
                                <Badge variant="outline" className={status.className}>
                                    {status.label}
                                </Badge>
                            </div>
                            <p className="mt-0.5 text-sm text-slate-500">
                                {PLAN_PRESETS[sub.plan].tagline}
                            </p>

                            <div className="mt-3 flex items-baseline gap-1">
                                <span className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                                    {price === 0 ? "Free" : fmt(price)}
                                </span>
                                {price > 0 && (
                                    <span className="text-sm text-slate-500">/month</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4">
                        <UsageStat icon={Building} label="Buildings" limit={sub.buildingLimit} />
                        <UsageStat icon={DoorOpen} label="Units" limit={sub.unitLimit} />
                        <UsageStat icon={Users} label="Tenants" limit={sub.tenantLimit} />
                        <UsageStat
                            icon={Sparkles}
                            label="Renews"
                            limit={sub.autoRenew ? "Auto" : "Manual"}
                        />
                    </div>
                </div>

                {/* Feature badges */}
                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                    <FeatureBadge icon={MessageSquare} label="SMS Notifications" enabled={sub.smsEnabled} />
                    <FeatureBadge icon={Palette} label="Custom Branding" enabled={sub.customBranding} />
                    <FeatureBadge icon={UsersRound} label="Multiple Admins" enabled={sub.multiAdmin} />
                </div>

                {/* Dates */}
                <div className="mt-4 grid grid-cols-1 gap-3 text-xs text-slate-500 sm:grid-cols-3">
                    <KeyValue label="Started" value={new Date(sub.startDate).toLocaleDateString()} />
                    {sub.trialEndsAt && (
                        <KeyValue
                            label="Trial ends"
                            value={new Date(sub.trialEndsAt).toLocaleDateString()}
                        />
                    )}
                    {sub.endDate && (
                        <KeyValue
                            label="Renews on"
                            value={new Date(sub.endDate).toLocaleDateString()}
                        />
                    )}
                </div>
            </Card>

            {/* Plan picker */}
            <section>
                <div className="mb-3 flex items-end justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Change your plan
                        </h2>
                        <p className="text-xs text-slate-500">
                            Switching takes effect immediately. Limits and pricing update at once.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {PLAN_ORDER.map((plan) => (
                        <PlanCard
                            key={plan}
                            plan={plan}
                            current={sub.plan}
                            onSelect={() => changePlan.mutate(plan)}
                            pending={changePlan.isPending && changePlan.variables === plan}
                            disabled={changePlan.isPending}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

function UsageStat({
    icon: Icon,
    label,
    limit,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    limit: number | string;
}) {
    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                <Icon size={11} />
                {label}
            </div>
            <p className="mt-0.5 text-base font-semibold text-slate-900 tabular-nums">
                {typeof limit === "number" ? limit.toLocaleString() : limit}
            </p>
        </div>
    );
}

function FeatureBadge({
    icon: Icon,
    label,
    enabled,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    enabled: boolean;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                enabled
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-500",
            )}
        >
            <Icon size={12} />
            {label}
            {enabled ? (
                <Check size={12} className="text-emerald-600" />
            ) : (
                <X size={12} className="text-slate-400" />
            )}
        </span>
    );
}

function KeyValue({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-md border border-slate-100 bg-white px-3 py-2 sm:flex-col sm:items-start sm:justify-start">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {label}
            </span>
            <span className="text-sm font-medium text-slate-700">{value}</span>
        </div>
    );
}

function PlanCard({
    plan,
    current,
    onSelect,
    pending,
    disabled,
}: {
    plan: SubscriptionPlan;
    current: SubscriptionPlan;
    onSelect: () => void;
    pending: boolean;
    disabled: boolean;
}) {
    const preset = PLAN_PRESETS[plan];
    const isCurrent = plan === current;
    const highlight = preset.highlight;

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-xl border bg-white p-5 transition-all",
                highlight && !isCurrent
                    ? "border-indigo-300 shadow-lg shadow-indigo-100"
                    : "border-slate-200",
                isCurrent && "ring-2 ring-indigo-500",
            )}
        >
            {highlight && !isCurrent && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
                    Most popular
                </span>
            )}

            <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900">{preset.label}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{preset.tagline}</p>
            </div>

            <div className="mb-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
                        {preset.priceMonthly === 0 ? "Free" : fmt(preset.priceMonthly)}
                    </span>
                    {preset.priceMonthly > 0 && (
                        <span className="text-xs text-slate-500">/mo</span>
                    )}
                </div>
            </div>

            <ul className="mb-5 flex-1 space-y-2 text-sm">
                <FeatureRow enabled>{preset.buildingLimit.toLocaleString()} buildings</FeatureRow>
                <FeatureRow enabled>{preset.unitLimit.toLocaleString()} units</FeatureRow>
                <FeatureRow enabled>{preset.tenantLimit.toLocaleString()} tenants</FeatureRow>
                <FeatureRow enabled={preset.smsEnabled}>SMS notifications</FeatureRow>
                <FeatureRow enabled={preset.customBranding}>Custom branding</FeatureRow>
                <FeatureRow enabled={preset.multiAdmin}>Multiple admins</FeatureRow>
            </ul>

            <Button
                variant={isCurrent ? "outline" : highlight ? "default" : "secondary"}
                disabled={isCurrent || disabled}
                onClick={onSelect}
            >
                {pending ? (
                    <>
                        <Loader2 size={14} className="animate-spin" />
                        Switching...
                    </>
                ) : isCurrent ? (
                    "Current plan"
                ) : (
                    "Switch to this plan"
                )}
            </Button>
        </div>
    );
}

function FeatureRow({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
    return (
        <li className="flex items-center gap-2">
            {enabled ? (
                <Check size={14} className="text-emerald-600" />
            ) : (
                <X size={14} className="text-slate-300" />
            )}
            <span className={enabled ? "text-slate-700" : "text-slate-400 line-through"}>
                {children}
            </span>
        </li>
    );
}
