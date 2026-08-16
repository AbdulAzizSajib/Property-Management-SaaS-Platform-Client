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
        <footer className="max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-12 pb-12 border-b border-rule dark:border-white/15">
                <div className="col-span-2 md:col-span-3 lg:col-span-1">
                    <Link
          href="/"
          className="flex shrink-0  items-center text-2xl font-bold tracking-tight relative gap-2"
        > 
          <svg
            viewBox="0 10 216 177"
            fill="none"
            aria-hidden="true"
            className="h-6 w-auto text-black "
          >
            <path d="M0 0H215L126 88V176H0V0Z" fill="currentColor" />
            <rect x="170" y="100" width="39" height="50" fill="currentColor" />
          </svg>
          <h2
            className="z-10 text-black  space-grotesk text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px]"
          >
            Bariyan
          </h2>
        </Link>
                    <p className="text-sm text-ink-soft dark:text-mist-soft leading-[1.6] max-w-[320px] mb-5">
                        A modern property management platform built for
                        landlords, real estate firms and housing societies in Bangladesh to
                        collect rent, manage tenants, and grow their portfolio with confidence.
                    </p>
                    <div className="flex gap-2.5">
                        {socials.map((s) => (
                            <a
                                key={s.name}
                                href={s.href}
                                aria-label={s.name}
                                className="w-9 h-9 rounded-lg bg-cream-2 dark:bg-night-2 hover:bg-sky-900 hover:text-paper text-sky-900 dark:text-sky-50 font-bold text-sm flex items-center justify-center transition"
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
                    <h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-900 dark:text-sky-50 mb-4.5">
                        Get in touch
                    </h5>
                    <ul className="space-y-2.5 text-sm text-ink-soft dark:text-mist-soft">
                        <li>
                            <a href="tel:+8801700000000" className="hover:text-sky-900 dark:hover:text-sky-50">
                                +৮৮০ ১৭০০-০০০০০০
                            </a>
                        </li>
                        <li>
                            <a href="mailto:hello@Bariyan.com.bd" className="hover:text-sky-900 dark:hover:text-sky-50">
                                hello@Bariyan.com.bd
                            </a>
                        </li>
                        <li>Gulshan-1, Dhaka 1212</li>
                        <li>Sat–Thu · ৯ AM – ১০ PM</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 text-[12.5px] text-ink-soft dark:text-mist-soft">
                <span>© {new Date().getFullYear()} Bariyan.com - All rights reserved.</span>
                {/* <div className="flex gap-1.5 bg-paper p-1 rounded-lg border border-rule-soft">
                    <button
                        type="button"
                        onClick={() => setLang("en")}
                        className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            lang === "en" ? "bg-sky-900 text-paper" : "text-ink-soft"
                        }`}
                    >
                        English
                    </button>
                    <button
                        type="button"
                        onClick={() => setLang("bn")}
                        className={`px-2.5 py-1 rounded text-xs font-semibold font-bangla ${
                            lang === "bn" ? "bg-sky-900 text-paper" : "text-ink-soft"
                        }`}
                    >
                        বাংলা
                    </button>
                </div> */}
                {/* <span>Trade Lic. 12345 · BIN 67890</span> */}
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
            <h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-900 dark:text-sky-50 mb-4.5">
                {title}
            </h5>
            <ul className="space-y-2.5">
                {links.map((l) => (
                    <li key={l.name}>
                        <a href={l.href} className="text-sm text-ink-soft dark:text-mist-soft hover:text-sky-900 dark:hover:text-sky-50 transition">
                            {l.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
