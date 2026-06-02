"use client";

import { Skeleton } from "@/src/components/ui/skeleton";
import {
    useChangePlan,
    usePlans,
    useSubscription,
} from "@/src/hooks/useSubscription";
import { cn } from "@/src/lib/utils";
import {
    type Plan,
    type SubscriptionPlan,
    type SubscriptionStatus,
} from "@/src/types/subscription.types";
import {
    Building,
    Check,
    Clock,
    CreditCard,
    DoorOpen,
    Layers,
    Loader2,
    MessageSquare,
    Palette,
    Sparkles,
    Users,
    UsersRound,
    X,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// Status styling — semantic, brand-aligned:
//   TRIALING → jade-soft (positive but tentative)
//   ACTIVE   → jade (healthy, money flowing)
//   PAST_DUE → coral (needs attention)
//   CANCELED → ink-soft (archival)
//   EXPIRED  → coral (urgent)
// ─────────────────────────────────────────────────────────────────

const statusStyles: Record<
    SubscriptionStatus,
    { label: string; className: string }
> = {
    TRIALING: {
        label: "Trialing",
        className: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    },
    ACTIVE: {
        label: "Active",
        className: "bg-jade-50 text-jade-800 border-jade-100",
    },
    PAST_DUE: {
        label: "Past due",
        className: "bg-coral-50 text-coral-700 border-coral-100",
    },
    CANCELED: {
        label: "Canceled",
        className: "bg-cream text-ink-soft border-rule-soft",
    },
    EXPIRED: {
        label: "Expired",
        className: "bg-coral-50 text-coral-700 border-coral-100",
    },
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

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function SubscriptionPage() {
    const { data: sub, isLoading, isError, error } = useSubscription();
    const { data: plans, isLoading: plansLoading } = usePlans();
    const changePlan = useChangePlan();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1240px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <Skeleton className="h-9 w-64 bg-paper" />
                    <Skeleton className="h-44 w-full rounded-[14px] bg-paper" />
                    <div className="grid gap-4 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-80 rounded-[14px] bg-paper"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !sub) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="mx-auto max-w-[1240px] p-4 sm:p-6 lg:p-8">
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-700">
                            Couldn&apos;t load subscription
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-[13px] text-coral-700/80">
                            {error instanceof Error
                                ? error.message
                                : "Something went wrong. Please try again."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const status = statusStyles[sub.status];
    const trialDaysLeft = daysUntil(sub.trialEndsAt);
    const price = parseFloat(sub.priceMonthly) || 0;

    // Find catalog entry for the user's current plan (for displayName + description)
    const currentPlanMeta = plans?.find((p) => p.plan === sub.plan);

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1240px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Heading */}
                <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Plan &amp; billing
                        </p>
                        <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            Subscription
                        </h1>
                        <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                            আপনার বর্তমান প্ল্যান, ব্যবহারের সীমা ও উপলব্ধ আপগ্রেড।
                        </p>
                    </div>
                </header>

                {/* Trial warning */}
                {sub.status === "TRIALING" &&
                    trialDaysLeft !== null &&
                    trialDaysLeft <= 7 && (
                        <div className="flex items-start gap-3 rounded-[14px] border border-coral-100 bg-coral-50/70 px-4 py-3.5">
                            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-coral-100 text-coral-700">
                                <Clock size={16} />
                            </span>
                            <div className="flex-1">
                                <p className="text-[14px] font-bold text-coral-700">
                                    {trialDaysLeft <= 0
                                        ? "Your free trial has ended"
                                        : `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left on your free trial`}
                                </p>
                                <p className="text-[12.5px] text-coral-700/80 mt-0.5">
                                    Upgrade now to keep access to all your
                                    buildings, units and tenants without
                                    interruption.
                                </p>
                            </div>
                        </div>
                    )}

                {/* Current plan summary */}
                <div className="rounded-[14px] border border-rule-soft bg-paper p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-jade-900 text-paper">
                                <CreditCard size={22} />
                            </span>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-[20px] font-bold tracking-[-0.01em] text-jade-950">
                                        {currentPlanMeta?.displayName ?? sub.plan} plan
                                    </h2>
                                    <span
                                        className={cn(
                                            "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                            status.className,
                                        )}
                                    >
                                        {status.label}
                                    </span>
                                </div>
                                {currentPlanMeta?.description && (
                                    <p className="mt-1 text-[13px] text-ink-soft">
                                        {currentPlanMeta.description}
                                    </p>
                                )}

                                <div className="mt-3 flex items-baseline gap-1">
                                    <span className="text-[32px] font-bold leading-none tracking-[-0.025em] text-jade-950 tabular-nums">
                                        {price === 0 ? "Free" : fmt(price)}
                                    </span>
                                    {price > 0 && (
                                        <span className="text-[13px] text-ink-soft">
                                            /month
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-3">
                            <UsageStat
                                icon={Building}
                                label="Buildings"
                                bn="বিল্ডিং"
                                limit={sub.buildingLimit}
                            />
                            <UsageStat
                                icon={Layers}
                                label="Floors"
                                bn="ফ্লোর"
                                limit={sub.floorLimit}
                            />
                            <UsageStat
                                icon={DoorOpen}
                                label="Units"
                                bn="ইউনিট"
                                limit={sub.unitLimit}
                            />
                            <UsageStat
                                icon={Users}
                                label="Tenants"
                                bn="ভাড়াটিয়া"
                                limit={sub.tenantLimit}
                            />
                        </div>
                    </div>

                    {/* Feature pills */}
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-rule-soft pt-5">
                        <FeatureBadge
                            icon={MessageSquare}
                            label="SMS notifications"
                            enabled={sub.smsEnabled}
                        />
                        <FeatureBadge
                            icon={Palette}
                            label="Custom branding"
                            enabled={sub.customBranding}
                        />
                        <FeatureBadge
                            icon={UsersRound}
                            label="Multiple admins"
                            enabled={sub.multiAdmin}
                        />
                        <FeatureBadge
                            icon={Sparkles}
                            label={sub.autoRenew ? "Auto-renews" : "Manual renewal"}
                            enabled={sub.autoRenew}
                        />
                    </div>

                    {/* Dates */}
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <KeyValue label="Started" value={formatDate(sub.startDate)} />
                        {sub.trialEndsAt && (
                            <KeyValue
                                label="Trial ends"
                                value={formatDate(sub.trialEndsAt)}
                            />
                        )}
                        {sub.endDate && (
                            <KeyValue
                                label="Renews on"
                                value={formatDate(sub.endDate)}
                            />
                        )}
                    </div>
                </div>

                {/* Plan picker */}
                <section>
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <p className="font-serif text-[12.5px] italic text-coral-600/85">
                                Change your plan
                            </p>
                            <p className="font-bangla text-[11.5px] text-ink-soft/75 mt-0.5">
                                আপনার প্ল্যান পরিবর্তন করুন
                            </p>
                            <p className="mt-1 text-[12.5px] text-ink-soft">
                                Switching takes effect immediately. Limits and
                                pricing update at once.
                            </p>
                        </div>
                    </div>

                    {plansLoading || !plans ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton
                                    key={i}
                                    className="h-96 rounded-[14px] bg-paper"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {plans.map((plan) => (
                                <PlanCard
                                    key={plan.plan}
                                    plan={plan}
                                    current={sub.plan}
                                    onSelect={() => changePlan.mutate(plan.plan)}
                                    pending={
                                        changePlan.isPending &&
                                        changePlan.variables === plan.plan
                                    }
                                    disabled={changePlan.isPending}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────

function UsageStat({
    icon: Icon,
    label,
    bn,
    limit,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    bn: string;
    limit: number | string;
}) {
    return (
        <div className="rounded-[10px] border border-rule-soft bg-cream/60 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                    <Icon size={11} className="text-ink-soft/70" />
                    {label}
                </div>
                <p className="font-bangla text-[10px] text-ink-soft/65">{bn}</p>
            </div>
            <p className="mt-1 text-[16px] font-bold text-jade-950 tabular-nums">
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
                "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium",
                enabled
                    ? "border-jade-100 bg-jade-50 text-jade-800"
                    : "border-rule-soft bg-cream/60 text-ink-soft",
            )}
        >
            <Icon size={11} className={enabled ? "text-jade-700" : "text-ink-soft/60"} />
            {label}
            {enabled ? (
                <Check size={11} className="text-jade-700" />
            ) : (
                <X size={11} className="text-ink-soft/50" />
            )}
        </span>
    );
}

function KeyValue({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[10px] border border-rule-soft bg-cream/40 px-3 py-2">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                {label}
            </p>
            <p className="mt-0.5 text-[13px] font-medium text-ink tabular-nums">
                {value}
            </p>
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
    plan: Plan;
    current: SubscriptionPlan;
    onSelect: () => void;
    pending: boolean;
    disabled: boolean;
}) {
    const isCurrent = plan.plan === current;
    const highlight = plan.isPopular;
    const price = parseFloat(plan.priceMonthly) || 0;

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-[14px] border bg-paper p-5 transition-all",
                isCurrent
                    ? "border-jade-700 ring-2 ring-jade-700/20"
                    : highlight
                        ? "border-coral-100 shadow-[0_20px_50px_-30px_rgba(232,93,68,0.35)]"
                        : "border-rule-soft",
            )}
        >
            {highlight && !isCurrent && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-coral-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-paper shadow-[0_4px_12px_-4px_rgba(232,93,68,0.6)]">
                    <Sparkles size={9} />
                    Most popular
                </span>
            )}

            {isCurrent && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-jade-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-paper">
                    Current plan
                </span>
            )}

            <div className="mb-4">
                <h3 className="text-[16px] font-bold text-jade-950">
                    {plan.displayName}
                </h3>
                <p className="mt-0.5 text-[12px] text-ink-soft">
                    {plan.description}
                </p>
            </div>

            <div className="mb-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-[26px] font-bold leading-none tracking-[-0.025em] text-jade-950 tabular-nums">
                        {price === 0 ? "Free" : fmt(price)}
                    </span>
                    {price > 0 && (
                        <span className="text-[12px] text-ink-soft">/mo</span>
                    )}
                </div>
            </div>

            {/* Limits row — compact summary */}
            <div className="mb-3 grid grid-cols-2 gap-1.5 text-[11px] text-ink-soft">
                <Limit label="Buildings" value={plan.buildingLimit} />
                <Limit label="Floors" value={plan.floorLimit} />
                <Limit label="Units" value={plan.unitLimit} />
                <Limit label="Tenants" value={plan.tenantLimit} />
            </div>

            {/* Feature list from the API */}
            <ul className="mb-5 flex-1 space-y-2 text-[13px]">
                {plan.features.map((feature, idx) => (
                    <FeatureRow key={idx} enabled>
                        {feature}
                    </FeatureRow>
                ))}
            </ul>

            <button
                type="button"
                disabled={isCurrent || disabled}
                onClick={onSelect}
                className={cn(
                    "inline-flex h-10 items-center justify-center gap-1.5 rounded-[10px] px-4 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                    isCurrent
                        ? "border border-rule-soft bg-cream text-ink-soft"
                        : highlight
                            ? "bg-coral-600 text-paper hover:bg-coral-700 shadow-[0_10px_24px_-12px_rgba(232,93,68,0.55)]"
                            : "bg-jade-900 text-paper hover:bg-jade-950",
                )}
            >
                {pending ? (
                    <>
                        <Loader2 size={14} className="animate-spin" />
                        Switching…
                    </>
                ) : isCurrent ? (
                    "Current plan"
                ) : (
                    <>
                        Switch
                        <span aria-hidden>→</span>
                    </>
                )}
            </button>
        </div>
    );
}

function Limit({ label, value }: { label: string; value: number }) {
    // Treat very large numbers as "Unlimited" for the compact summary.
    const display = value >= 9999 ? "Unlimited" : value.toLocaleString();
    return (
        <div className="flex items-baseline justify-between rounded-md bg-cream/50 px-2 py-1">
            <span className="text-[10px] uppercase tracking-wider text-ink-soft/70">
                {label}
            </span>
            <span className="font-semibold text-jade-950 tabular-nums">
                {display}
            </span>
        </div>
    );
}

function FeatureRow({
    enabled,
    children,
}: {
    enabled: boolean;
    children: React.ReactNode;
}) {
    return (
        <li className="flex items-start gap-2">
            {enabled ? (
                <Check size={14} className="mt-0.5 shrink-0 text-jade-700" />
            ) : (
                <X size={14} className="mt-0.5 shrink-0 text-ink-soft/40" />
            )}
            <span
                className={
                    enabled
                        ? "text-ink"
                        : "text-ink-soft/55 line-through"
                }
            >
                {children}
            </span>
        </li>
    );
}
