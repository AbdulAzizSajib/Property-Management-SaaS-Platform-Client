"use client";

import { RevealGroup, RevealItem } from "@/src/components/Reveal";
import SectionHead from "@/src/components/SectionHead";
import { usePlans } from "@/src/hooks/useSubscription";
import type { Plan } from "@/src/types/subscription.types";
import { useRouter } from "@/src/i18n/navigation";

const fmt = (n: number) =>
    new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(n);

export default function Pricing() {
    const { data: plans, isLoading, isError } = usePlans();

    return (
        <section id="pricing" className="bg-paper dark:bg-night-2 py-24 lg:py-32">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8">
                <SectionHead

                    title={
                        <>
                            Priced for Bangladesh.
                            <br />
                            Not{" "}
                            <em className="font-serif italic font-normal text-sky-500">
                                Silicon Valley
                            </em>
                            .
                        </>
                    }
                    description="Pay monthly in taka. Cancel anytime. All plans include a 30-day free trial and Bangla-speaking support."
                />

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1320px] mx-auto">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-[480px] rounded-[18px] border border-rule-soft dark:border-white/10 bg-cream/60 dark:bg-white/5 animate-pulse"
                            />
                        ))}
                    </div>
                ) : isError || !plans || plans.length === 0 ? (
                    <p className="text-center text-[13px] text-ink-soft dark:text-mist-soft">
                        Couldn&apos;t load pricing right now. Please try again shortly.
                    </p>
                ) : (
                    <>
                        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1320px] mx-auto items-stretch">
                            {plans.map((plan) => (
                                <PlanCard key={plan.plan} plan={plan} />
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

function PlanCard({ plan }: { plan: Plan }) {
    const router = useRouter();
    const price = parseFloat(plan.priceMonthly) || 0;
    // Enterprise-style custom pricing (BUSINESS tier) doesn't carry a fixed
    // plan into registration — "Contact sales" stays a non-navigating CTA.
    const isContactSales = plan.plan === "BUSINESS";
    const ctaLabel = isContactSales
        ? "Contact sales"
        : plan.plan === "FREE"
          ? "Start free trial"
          : "Get started →";

    const handleSelect = () => {
        if (isContactSales) return;
        router.push(`/register?plan=${plan.plan}`);
    };

    if (plan.isPopular) {
        return (
            <RevealItem className="relative rounded-[18px] p-7 flex flex-col bg-sky-950 text-paper border border-sky-800 lg:-translate-y-2 shadow-[0_24px_48px_-16px_rgba(10,46,34,0.4)]">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 lg:left-7 lg:translate-x-0 bg-sky-500 text-paper text-[10.5px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    ★ Most popular
                </span>
                <div className="text-sm font-bold uppercase tracking-[0.12em] text-amber-500 mb-3">
                    {plan.displayName}
                </div>
                <div className="text-[13px] text-white/60 mb-6 leading-[1.5]">
                    {plan.description}
                </div>
                <Price amount={price} featured />
                <div className="text-xs text-white/50 mb-6">Billed monthly</div>
                <ul className="border-t border-white/10 pt-6 mb-8 flex-1 space-y-2">
                    {plan.features.map((f) => (
                        <FeatureLi key={f} text={f} featured />
                    ))}
                </ul>
                <button
                    type="button"
                    onClick={handleSelect}
                    className="w-full py-3.5 rounded-[10px] font-semibold text-sm bg-sky-500 hover:bg-sky-400 text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.2)]"
                >
                    {ctaLabel}
                </button>
            </RevealItem>
        );
    }
    return (
        <RevealItem className="rounded-[18px] p-7 bg-paper dark:bg-night-2 border border-rule-soft dark:border-white/10 flex flex-col">
            <div className="text-sm font-bold uppercase tracking-[0.12em] text-sky-800 dark:text-sky-300 mb-3">
                {plan.displayName}
            </div>
            <div className="text-[13px] text-ink-soft dark:text-mist-soft mb-6 leading-[1.5]">
                {plan.description}
            </div>
            <Price amount={price} />
            <div className="text-xs text-ink-soft dark:text-mist-soft mb-6">
                {price === 0 ? "No card required" : "Billed monthly"}
            </div>
            <ul className="border-t border-rule-soft dark:border-white/10 pt-6 mb-8 flex-1 space-y-2">
                {plan.features.map((f) => (
                    <FeatureLi key={f} text={f} />
                ))}
            </ul>
            <button
                type="button"
                onClick={handleSelect}
                className="w-full py-3.5 rounded-[10px] font-semibold text-sm border border-sky-900 dark:border-sky-300 text-sky-900 dark:text-sky-50 hover:bg-sky-900 hover:text-paper transition"
            >
                {ctaLabel}
            </button>
        </RevealItem>
    );
}

function Price({ amount, featured }: { amount: number; featured?: boolean }) {
    return (
        <div className="flex items-baseline gap-1 mb-1">
            <span className={`text-2xl font-medium ${featured ? "text-paper" : "text-sky-900 dark:text-sky-50"}`}>
                ৳
            </span>
            <span
                className={`text-4xl font-extrabold tracking-[-0.03em] leading-none ${
                    featured ? "text-paper" : "text-sky-950 dark:text-sky-50"
                }`}
            >
                {amount === 0 ? "0" : fmt(amount)}
            </span>
            <span className={`text-sm ${featured ? "text-white/50" : "text-ink-soft dark:text-mist-soft"}`}>/mo</span>
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
                className={`w-3.5 h-3.5 mt-0.5 rounded bg-sky-700 relative inline-flex items-center justify-center text-[10px] font-bold`}
            >
                <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-paper" fill="none">
                    <path
                        d="M2 6.5l2.5 2.5L10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <span>{text}</span>
        </li>
    );
}
