"use client";

import LogoMark from "@/src/components/LogoMark";
import Link from "next/link";
import { useState } from "react";

const productLinks = [
    { name: "Features", href: "#features" },
    { name: "Dashboard", href: "#product" },
    { name: "Integrations", href: "#integrations" },
    { name: "Pricing", href: "#pricing" },
    { name: "Changelog", href: "#" },
];
const companyLinks = [
    { name: "About us", href: "#" },
    { name: "Press kit", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Partners", href: "#" },
    { name: "Contact", href: "#" },
];
const resourceLinks = [
    { name: "Help center", href: "#" },
    { name: "Landlord guides", href: "#" },
    { name: "Tax templates", href: "#" },
    { name: "Webinars (Bangla)", href: "#" },
    { name: "API docs", href: "#" },
];
const socials = [
    { label: "f", href: "#", name: "Facebook" },
    { label: "ig", href: "#", name: "Instagram" },
    { label: "in", href: "#", name: "LinkedIn" },
    { label: "𝕏", href: "#", name: "X" },
];

export default function Footer() {
    const [lang, setLang] = useState<"en" | "bn">("en");

    return (
        <footer className="max-w-[1280px] mx-auto px-5 md:px-8 pt-20 pb-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-12 pb-12 border-b border-rule">
                <div className="col-span-2 md:col-span-3 lg:col-span-1">
                    <Link href="/" className="flex items-center gap-2.5 text-jade-900 font-bold text-[19px] tracking-tight mb-4">
                        <LogoMark />
                        <span>
                            Bari<b className="text-coral-600">Bari</b>
                        </span>
                    </Link>
                    <p className="text-sm text-ink-soft leading-[1.6] max-w-[320px] mb-5">
                        Bangladesh&apos;s modern property management platform — built for
                        landlords, real estate firms and housing societies to collect rent,
                        manage tenants, and grow their portfolio with confidence.
                    </p>
                    <div className="flex gap-2.5">
                        {socials.map((s) => (
                            <a
                                key={s.name}
                                href={s.href}
                                aria-label={s.name}
                                className="w-9 h-9 rounded-lg bg-cream-2 hover:bg-jade-900 hover:text-paper text-jade-900 font-bold text-sm flex items-center justify-center transition"
                            >
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>

                <FootCol title="Product" links={productLinks} />
                <FootCol title="Company" links={companyLinks} />
                <FootCol title="Resources" links={resourceLinks} />

                <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-jade-900 mb-4.5">
                        Get in touch
                    </h5>
                    <ul className="space-y-2.5 text-sm text-ink-soft">
                        <li>
                            <a href="tel:+8801700000000" className="hover:text-jade-900">
                                +৮৮০ ১৭০০-০০০০০০
                            </a>
                        </li>
                        <li>
                            <a href="mailto:hello@baribari.com.bd" className="hover:text-jade-900">
                                hello@baribari.com.bd
                            </a>
                        </li>
                        <li>Gulshan-1, Dhaka 1212</li>
                        <li>Sat–Thu · ৯ AM – ১০ PM</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 text-[12.5px] text-ink-soft">
                <span>© {new Date().getFullYear()} BariBari Technologies Ltd. · All rights reserved.</span>
                <div className="flex gap-1.5 bg-paper p-1 rounded-lg border border-rule-soft">
                    <button
                        type="button"
                        onClick={() => setLang("en")}
                        className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            lang === "en" ? "bg-jade-900 text-paper" : "text-ink-soft"
                        }`}
                    >
                        English
                    </button>
                    <button
                        type="button"
                        onClick={() => setLang("bn")}
                        className={`px-2.5 py-1 rounded text-xs font-semibold font-bangla ${
                            lang === "bn" ? "bg-jade-900 text-paper" : "text-ink-soft"
                        }`}
                    >
                        বাংলা
                    </button>
                </div>
                <span>Trade Lic. 12345 · BIN 67890</span>
            </div>
        </footer>
    );
}

function FootCol({
    title,
    links,
}: {
    title: string;
    links: { name: string; href: string }[];
}) {
    return (
        <div>
            <h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-jade-900 mb-4.5">
                {title}
            </h5>
            <ul className="space-y-2.5">
                {links.map((l) => (
                    <li key={l.name}>
                        <a href={l.href} className="text-sm text-ink-soft hover:text-jade-900 transition">
                            {l.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
