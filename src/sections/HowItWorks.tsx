"use client";

import { RevealGroup, RevealItem } from "@/src/components/Reveal";
import SectionHead from "@/src/components/SectionHead";

const steps = [
    {
        title: "Sign up with your Email or Google account",
        text: "Verify with an OTP to your mobile. Add your organization and building details, and you're ready to go.",
    },
    {
        title: "Add flats & tenants",
        text: "Import from your existing rent register, or punch in flats in under a minute each. Keep every tenant's details in one place.",
    },
    {
        title: "Record rent & expenses",
        text: "Log each month's rent, dues and expenses with a tap. Bariyan keeps a clear running balance for every flat — no Excel needed.",
    },
    {
        title: "Stay on top, effortlessly",
        text: "Auto SMS reminders for unpaid rent. See who's paid, who's behind, and pull income, expense & collection reports in one click.",
    },
];

export default function HowItWorks() {
    return (
        <section className="bg-paper dark:bg-night-2 py-24 lg:py-32 border-t border-b border-rule-soft dark:border-white/10">
            <div className="max-w-7xl mx-auto px-5 md:px-8 space-grotesk">
                <SectionHead
                   
                    title={
                        <>
                            From signup to every taka tracked in under 10 minutes
                        </>
                    }
                    description={"No installer visits. No spreadsheet migrations. No “let me speak to your IT guy.”"}
                />

                <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((s, i) => (
                        <RevealItem key={s.title} className="p-5 rounded-2xl relative shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_3px_0_0_#000] border border-black/40">
                            <div className="font-mono text-[12px] font-bold text-sky-500 pb-4 mb-4 border-b border-rule dark:border-white/15">
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <h4 className="text-[18px] font-bold text-sky-950 dark:text-sky-50 tracking-[-0.015em] mb-3">
                                {s.title}
                            </h4>
                            <p className="text-sm leading-[1.6] text-ink-soft dark:text-mist-soft">{s.text}</p>
                        </RevealItem>
                    ))}
                </RevealGroup>
            </div>
        </section>
    );
}
