import type { PricingPlan } from "@/src/types";
import { CheckIcon } from "lucide-react";

export const pricingData: PricingPlan[] = [
    {
        title: "Starter",
        price: 999,
        features: [
            { name: "Up to 10 units", icon: CheckIcon },
            { name: "Tenant & lease management", icon: CheckIcon },
            { name: "bKash / Nagad rent collection", icon: CheckIcon },
            { name: "Auto SMS rent reminders", icon: CheckIcon },
            { name: "Email support (Bangla & English)", icon: CheckIcon },
        ],
        buttonText: "Start Free Trial",
    },
    {
        title: "Professional",
        price: 2999,
        mostPopular: true,
        features: [
            { name: "Up to 100 units", icon: CheckIcon },
            { name: "Everything in Starter", icon: CheckIcon },
            { name: "Maintenance & complaint tracking", icon: CheckIcon },
            { name: "Multi-property dashboard", icon: CheckIcon },
            { name: "Service charge & utility bills", icon: CheckIcon },
            { name: "Priority WhatsApp support", icon: CheckIcon },
        ],
        buttonText: "Get Started",
    },
    {
        title: "Enterprise",
        price: 7999,
        features: [
            { name: "Unlimited units & properties", icon: CheckIcon },
            { name: "Dedicated account manager", icon: CheckIcon },
            { name: "Custom lease & legal templates", icon: CheckIcon },
            { name: "API access & accounting export", icon: CheckIcon },
            { name: "On-site onboarding in Dhaka/Ctg", icon: CheckIcon },
        ],
        buttonText: "Contact Sales",
    },
];
