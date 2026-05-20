import SectionTitle from "@/src/components/SectionTitle";
import { pricingData } from "@/src/data/pricingData";
import { SparklesIcon } from "lucide-react";

export default function Pricing() {
    return (
        <div id="pricing">
            <SectionTitle
                text1="Pricing"
                text2="Simple plans, priced for Bangladesh"
                text3="Pay monthly in BDT. Cancel anytime. All plans include a 30-day free trial and Bangla-speaking support."
            />

            <div className="flex flex-wrap items-center justify-center gap-6 mt-16">
                {pricingData.map((plan, index) => (
                    <div
                        key={index}
                        className={`p-6 rounded-2xl max-w-75 w-full shadow-[0px_4px_26px] shadow-black/6 ${plan.mostPopular ? "relative pt-12 bg-linear-to-b from-indigo-600 to-violet-600" : "bg-white"}`}
                    >
                        {plan.mostPopular && (
                            <div className="flex items-center text-xs gap-1 py-1.5 px-2 text-indigo-600 absolute top-4 right-4 rounded bg-white font-medium">
                                <SparklesIcon size={14} />
                                <p>Most Popular</p>
                            </div>
                        )}
                        <p className={plan.mostPopular ? "text-white" : ""}>{plan.title}</p>
                        <h4
                            className={`text-3xl font-semibold mt-1 ${plan.mostPopular ? "text-white" : ""}`}
                        >
                            <span className="font-normal text-xl align-top mr-0.5">৳</span>
                            {plan.price.toLocaleString("en-IN")}
                            <span
                                className={`font-normal text-sm ${plan.mostPopular ? "text-white/90" : "text-slate-500"}`}
                            >
                                /month
                            </span>
                        </h4>
                        <hr className="border-slate-200 my-8" />
                        <div
                            className={`space-y-2 ${plan.mostPopular ? "text-white" : "text-slate-500"}`}
                        >
                            {plan.features.map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={idx} className="flex items-center gap-1.5">
                                        <Icon
                                            size={18}
                                            className={`${plan.mostPopular ? "text-white" : "text-indigo-600"}`}
                                        />
                                        <span>{feature.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            className={`transition w-full py-3 rounded-lg font-medium mt-8 ${plan.mostPopular ? "bg-white hover:bg-slate-100 text-slate-800" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                        >
                            <span>{plan.buttonText}</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
