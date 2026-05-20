import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type NavLink = {
    name: string;
    href: string;
};

export type Faq = {
    question: string;
    answer: string;
};

export type PricingFeature = {
    name: string;
    icon: LucideIcon;
};

export type PricingPlan = {
    title: string;
    price: number;
    mostPopular?: boolean;
    features: PricingFeature[];
    buttonText: string;
};

export type Testimonial = {
    image: string;
    name: string;
    handle: string;
    date: string;
    quote: string;
};

export type CompanyLogo = {
    name: string;
    logo: ReactNode;
};
