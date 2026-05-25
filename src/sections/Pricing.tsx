import SectionHead from "@/src/components/SectionHead";

type Feature = { text: string; check: boolean };

type Plan = {
    name: string;
    fit: string;
    amount: string;
    billed: string;
    features: Feature[];
    cta: string;
    featured?: boolean;
};

const plans: Plan[] = [
    {
        name: "Starter",
        fit: "For solo landlords with a single building or up to 10 flats.",
        amount: "999",
        billed: "Billed monthly · No annual lock-in",
        features: [
            { text: "Up to 10 units", check: true },
            { text: "Tenant & lease management", check: true },
            { text: "bKash / Nagad rent collection", check: true },
            { text: "Auto SMS reminders (500/mo)", check: true },
            { text: "Email support — Bangla & English", check: true },
            { text: "Multi-property dashboard", check: false },
            { text: "Service charge auto-split", check: false },
        ],
        cta: "Start free trial",
    },
    {
        name: "Professional",
        fit: "For owners of 2–4 buildings or 100 flats. The sweet spot for most landlords.",
        amount: "2,999",
        billed: "Billed monthly · Save 15% annually",
        features: [
            { text: "Up to 100 units", check: true },
            { text: "Everything in Starter", check: true },
            { text: "Multi-property dashboard", check: true },
            { text: "Service charge & utility bills", check: true },
            { text: "Maintenance ticket workflows", check: true },
            { text: "Unlimited SMS reminders", check: true },
            { text: "Priority WhatsApp support", check: true },
            { text: "TDS & income tax reports", check: true },
        ],
        cta: "Get started →",
        featured: true,
    },
    {
        name: "Enterprise",
        fit: "For real estate firms, housing societies, and developers with 100+ flats.",
        amount: "7,999",
        billed: "Custom volume pricing available",
        features: [
            { text: "Unlimited units & properties", check: true },
            { text: "Dedicated account manager", check: true },
            { text: "Custom lease templates", check: true },
            { text: "API access & accounting export", check: true },
            { text: "On-site onboarding in Dhaka/Ctg", check: true },
            { text: "SLA-backed uptime", check: true },
            { text: "Audit-ready financial trails", check: true },
        ],
        cta: "Contact sales",
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="bg-paper py-24 lg:py-32">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8">
                <SectionHead
                    eyebrow="Simple, BDT pricing"
                    title={
                        <>
                            Priced for Bangladesh.
                            <br />
                            Not{" "}
                            <em className="font-serif italic font-normal text-coral-600">
                                Silicon Valley
                            </em>
                            .
                        </>
                    }
                    description="Pay monthly in taka. Cancel anytime. All plans include a 30-day free trial and Bangla-speaking support."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
                    {plans.map((plan) => (
                        <PlanCard key={plan.name} plan={plan} />
                    ))}
                </div>

                <p className="text-center mt-10 text-[13px] text-ink-soft">
                    All prices in BDT, inclusive of VAT. <b className="text-jade-900">Transaction fees</b>{" "}
                    apply only to wallet payments — passed through at cost.
                </p>
            </div>
        </section>
    );
}

function PlanCard({ plan }: { plan: Plan }) {
    if (plan.featured) {
        return (
            <div className="relative rounded-[18px] p-9 flex flex-col bg-jade-950 text-paper border border-jade-800 lg:scale-[1.03] shadow-[0_24px_48px_-16px_rgba(10,46,34,0.4)]">
                <span className="absolute -top-3.5 left-8 bg-coral-600 text-paper text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    ★ Most popular
                </span>
                <div className="text-sm font-bold uppercase tracking-[0.12em] text-amber-500 mb-3">
                    {plan.name}
                </div>
                <div className="text-[13px] text-white/60 mb-6 leading-[1.5]">{plan.fit}</div>
                <Price amount={plan.amount} featured />
                <div className="text-xs text-white/50 mb-6">{plan.billed}</div>
                <ul className="border-t border-white/10 pt-6 mb-8 flex-1 space-y-2">
                    {plan.features.map((f) => (
                        <FeatureLi key={f.text} feature={f} featured />
                    ))}
                </ul>
                <button
                    type="button"
                    className="w-full py-3.5 rounded-[10px] font-semibold text-sm bg-coral-600 hover:bg-coral-500 text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.2)]"
                >
                    {plan.cta}
                </button>
            </div>
        );
    }
    return (
        <div className="rounded-[18px] p-9 bg-paper border border-rule-soft flex flex-col">
            <div className="text-sm font-bold uppercase tracking-[0.12em] text-jade-800 mb-3">
                {plan.name}
            </div>
            <div className="text-[13px] text-ink-soft mb-6 leading-[1.5]">{plan.fit}</div>
            <Price amount={plan.amount} />
            <div className="text-xs text-ink-soft mb-6">{plan.billed}</div>
            <ul className="border-t border-rule-soft pt-6 mb-8 flex-1 space-y-2">
                {plan.features.map((f) => (
                    <FeatureLi key={f.text} feature={f} />
                ))}
            </ul>
            <button
                type="button"
                className="w-full py-3.5 rounded-[10px] font-semibold text-sm border border-jade-900 text-jade-900 hover:bg-jade-900 hover:text-paper transition"
            >
                {plan.cta}
            </button>
        </div>
    );
}

function Price({ amount, featured }: { amount: string; featured?: boolean }) {
    return (
        <div className="flex items-baseline gap-1 mb-1">
            <span className={`text-2xl font-medium ${featured ? "text-paper" : "text-jade-900"}`}>
                ৳
            </span>
            <span
                className={`text-5xl font-extrabold tracking-[-0.03em] leading-none ${
                    featured ? "text-paper" : "text-jade-950"
                }`}
            >
                {amount}
            </span>
            <span className={`text-sm ${featured ? "text-white/50" : "text-ink-soft"}`}>/mo</span>
        </div>
    );
}

function FeatureLi({ feature, featured }: { feature: Feature; featured?: boolean }) {
    return (
        <li
            className={`grid grid-cols-[16px_1fr] gap-2.5 text-[13.5px] leading-[1.45] ${
                featured ? "text-white/85" : "text-ink"
            }`}
        >
            <span
                className={`w-3.5 h-3.5 mt-0.5 rounded ${
                    feature.check
                        ? featured
                            ? "bg-jade-700"
                            : "bg-jade-700"
                        : featured
                          ? "bg-white/10"
                          : "bg-jade-50"
                } relative inline-flex items-center justify-center text-[10px] font-bold`}
            >
                {feature.check ? (
                    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-paper" fill="none">
                        <path
                            d="M2 6.5l2.5 2.5L10 3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    <span className={featured ? "text-amber-500" : "text-jade-700"}>×</span>
                )}
            </span>
            <span>{feature.text}</span>
        </li>
    );
}
