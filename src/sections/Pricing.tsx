"use client";

import { ArrowRight, Check, Star } from "lucide-react";
import { RevealGroup, RevealItem } from "@/src/components/Reveal";
import SectionHead from "@/src/components/SectionHead";
import { usePlans } from "@/src/hooks/useSubscription";
import { getPriceForCycle } from "@/src/lib/subscriptionPricing";
import type { Plan } from "@/src/types/subscription.types";
import type { BillingCycle } from "@/src/types/subscriptionRequest.types";
import { useRouter } from "@/src/i18n/navigation";
import { useState } from "react";

const fmt = (n: number) =>
    new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(n);

export default function Pricing() {
    const { data: plans, isLoading, isError } = usePlans();
    const [cycle, setCycle] = useState<BillingCycle>("MONTHLY");

    return (
        <section id="pricing" className="bg-paper dark:bg-night-2 py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-5 md:px-8">
                <SectionHead
                    title={<>Simple pricing. No surprises.</>}
                    description="Pay monthly in taka. Start free, upgrade anytime. Every plan includes Bangla-speaking support."
                />

                <div className="flex justify-center mb-10">
                    <div className="inline-flex items-center rounded-full border border-rule-soft dark:border-white/10 bg-cream/60 dark:bg-white/5 p-1 text-[13px] font-semibold">
                        <button
                            type="button"
                            onClick={() => setCycle("MONTHLY")}
                            className={`rounded-full px-4 py-2 transition-colors ${
                                cycle === "MONTHLY"
                                    ? "bg-sky-950 text-paper"
                                    : "text-ink-soft dark:text-mist-soft hover:text-ink dark:hover:text-mist"
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => setCycle("YEARLY")}
                            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors ${
                                cycle === "YEARLY"
                                    ? "bg-sky-950 text-paper"
                                    : "text-ink-soft dark:text-mist-soft hover:text-ink dark:hover:text-mist"
                            }`}
                        >
                            Yearly
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${
                                    cycle === "YEARLY"
                                        ? "bg-amber-500 text-sky-950"
                                        : "bg-jade-100 text-jade-800"
                                }`}
                            >
                                2 months free
                            </span>
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1320px] mx-auto items-stretch">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={`h-[480px] rounded-[18px] border border-rule-soft dark:border-white/10 bg-cream/60 dark:bg-white/5 animate-pulse ${
                                    i === 2 ? "lg:-translate-y-2" : ""
                                }`}
                            />
                        ))}
                    </div>
                ) : isError ? (
                    <p className="text-center text-[13px] text-ink-soft dark:text-mist-soft">
                        Couldn&apos;t load pricing right now — please refresh, or{" "}
                        <a href="#faq" className="font-semibold text-sky-800 underline decoration-sky-800/30 underline-offset-2 dark:text-sky-300">
                            check the FAQ
                        </a>{" "}
                        for plan details.
                    </p>
                ) : !plans || plans.length === 0 ? (
                    <p className="text-center text-[13px] text-ink-soft dark:text-mist-soft">
                        Plans aren&apos;t available right now. Please check back shortly.
                    </p>
                ) : (
                    <>
                        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1320px] mx-auto items-stretch">
                            {plans.map((plan) => (
                                <PlanCard key={plan.plan} plan={plan} cycle={cycle} />
                            ))}
                        </RevealGroup>

                        <p className="text-center mt-10 text-[13px] text-ink-soft dark:text-mist-soft">
                            All prices in BDT, inclusive of VAT.{" "}
                            <b className="text-sky-900 dark:text-sky-50">
                                Transaction fees
                            </b>{" "}
                            apply only to wallet payments — passed through at cost.
                        </p>
                    </>
                )}
            </div>
        </section>
    );
}

function PlanCard({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
    const router = useRouter();
    const { amount: price } = getPriceForCycle(plan, cycle);
    // Enterprise-style custom pricing (BUSINESS tier) doesn't carry a fixed
    // plan into registration — "Contact sales" stays a non-navigating CTA.
    const isContactSales = plan.plan === "BUSINESS";
    const ctaLabel = isContactSales
        ? "Contact sales"
        : plan.plan === "FREE"
          ? "Start free trial"
          : "Get started";

    const handleSelect = () => {
        if (isContactSales) return;
        router.push(`/register?plan=${plan.plan}`);
    };

    if (plan.isPopular) {
        return (
            <RevealItem className="relative rounded-[18px] p-7 flex flex-col bg-sky-950 text-paper lg:-translate-y-2 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_3px_0_0_#000] border border-black/40">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 lg:left-7 lg:translate-x-0 inline-flex items-center gap-1 bg-amber-500 text-sky-950 text-[10.5px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    <Star size={11} strokeWidth={2.5} fill="currentColor" aria-hidden />
                    Most popular
                </span>
                <div className="text-sm font-bold uppercase tracking-[0.12em] text-amber-500 mb-3">
                    {plan.displayName}
                </div>
                <div className="text-[13px] text-white/60 mb-6 leading-[1.5]">
                    {plan.description}
                </div>
                <Price amount={price} cycle={cycle} featured />
                <div className="text-xs text-white/50 mb-6">
                    {cycle === "YEARLY" ? "Billed yearly" : "Billed monthly"}
                </div>
                <ul className="border-t border-white/10 pt-6 mb-8 flex-1 space-y-2">
                    {plan.features.map((f) => (
                        <FeatureLi key={f} text={f} featured />
                    ))}
                </ul>
                <button
                    type="button"
                    onClick={handleSelect}
                    className="group w-full inline-flex items-center justify-center gap-1.5 py-3.5 rounded-[10px] font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-sky-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.15)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-950"
                >
                    {ctaLabel}
                    {!isContactSales && (
                        <ArrowRight
                            size={16}
                            strokeWidth={2.25}
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                            aria-hidden
                        />
                    )}
                </button>
            </RevealItem>
        );
    }
    return (
        <RevealItem className="rounded-[18px] p-7 bg-paper dark:bg-night-2 flex flex-col shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_3px_0_0_#000] border border-black/40">
            <div className="text-sm font-bold uppercase tracking-[0.12em] text-sky-800 dark:text-sky-300 mb-3">
                {plan.displayName}
            </div>
            <div className="text-[13px] text-ink-soft dark:text-mist-soft mb-6 leading-normal">
                {plan.description}
            </div>
            <Price amount={price} cycle={cycle} />
            <div className="text-xs text-ink-soft dark:text-mist-soft mb-6">
                {price === 0
                    ? "No card required"
                    : cycle === "YEARLY"
                      ? "Billed yearly"
                      : "Billed monthly"}
            </div>
            <ul className="border-t border-rule-soft dark:border-white/10 pt-6 mb-8 flex-1 space-y-2">
                {plan.features.map((f) => (
                    <FeatureLi key={f} text={f} />
                ))}
            </ul>
            <button
                type="button"
                onClick={handleSelect}
                className="group w-full inline-flex items-center justify-center gap-1.5 py-3.5 rounded-[10px] font-semibold text-sm border border-sky-900 dark:border-sky-300 text-sky-900 dark:text-sky-50 hover:bg-sky-900 hover:text-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-900 focus-visible:ring-offset-2 dark:focus-visible:ring-sky-300"
            >
                {ctaLabel}
                {!isContactSales && (
                    <ArrowRight
                        size={16}
                        strokeWidth={2.25}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden
                    />
                )}
            </button>
        </RevealItem>
    );
}

function Price({
    amount,
    cycle,
    featured,
}: {
    amount: number;
    cycle: BillingCycle;
    featured?: boolean;
}) {
    return (
        <div className="flex items-baseline gap-1 mb-1">
            <span className={`text-2xl font-medium ${featured ? "text-paper" : "text-sky-900 dark:text-sky-50"}`}>
                ৳
            </span>
            <span
                className={`text-4xl font-extrabold tracking-[-0.03em] leading-none tabular-nums ${
                    featured ? "text-paper" : "text-sky-950 dark:text-sky-50"
                }`}
            >
                {amount === 0 ? "0" : fmt(amount)}
            </span>
            <span className={`text-sm ${featured ? "text-white/50" : "text-ink-soft dark:text-mist-soft"}`}>
                {amount === 0 ? "" : cycle === "YEARLY" ? "/yr" : "/mo"}
            </span>
        </div>
    );
}

function FeatureLi({ text, featured }: { text: string; featured?: boolean }) {
    return (
        <li
            className={`grid grid-cols-[16px_1fr] gap-2.5 text-[13.5px] leading-[1.45] ${
                featured ? "text-white/85" : "text-ink dark:text-mist"
            }`}
        >
            <span
                className={`w-3.5 h-3.5 mt-0.5 rounded flex items-center justify-center ${
                    featured ? "bg-amber-500 text-sky-950" : "bg-sky-700 text-paper"
                }`}
            >
                <Check size={10} strokeWidth={3} aria-hidden />
            </span>
            <span>{text}</span>
        </li>
    );
}
