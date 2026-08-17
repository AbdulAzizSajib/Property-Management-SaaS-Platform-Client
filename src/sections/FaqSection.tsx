"use client";

import { RevealGroup, RevealItem } from "@/src/components/Reveal";
import SectionHead from "@/src/components/SectionHead";
import { useState } from "react";

const faqs = [
    {
        q: "Will my tenants need to download an app to pay rent?",
        a: "No. Tenants pay through their existing bKash, Nagad, or Rocket app — the same one they already use for groceries. You send them a payment link over SMS or WhatsApp; they tap, confirm with their PIN, done. The whole flow takes about 12 seconds and works on any feature phone with mobile banking.",
    },
    {
        q: "How is Bariyan different from just using bKash and Excel?",
        a: "Excel doesn’t send reminders. bKash doesn’t track which flat owes what. We connect both — plus tenants, leases, maintenance, utility splits, and tax reports — into one workspace built specifically for Bangladeshi rental properties.",
    },
    {
        q: "Is my financial data safe? Where is it stored?",
        a: "Yes. All data is encrypted in transit and at rest, stored on AWS Singapore servers, with daily backups. We’re ISO 27001 certified and undergo annual penetration testing. We never share data with third parties — including Bangladesh Bank, unless legally compelled by court order.",
    },
    {
        q: "Does it support Bangla language and BDT currency natively?",
        a: "Both. Tenants can receive SMS, invoices, and payment links in Bangla. Landlords can toggle the entire dashboard between Bangla and English with one click. All amounts are in BDT (taka) — no conversion math needed.",
    },
    {
        q: "What happens if a tenant disputes a payment?",
        a: "Every transaction is logged with a tamper-proof timestamp, the gateway transaction ID (from bKash/Nagad), and an auto-generated receipt with your stamp. Disputes are resolved in <48 hours via our support team, who liaise directly with the wallet provider on your behalf.",
    },
    {
        q: "Do you provide customer support in Bangla?",
        a: "Yes — over WhatsApp, phone, and email, every day from ৯টা to ১০টা (9 AM – 10 PM). Our entire support team is based in Gulshan and Chattogram. Professional & Enterprise plans get priority response within 30 minutes.",
    },
    {
        q: "Can I cancel anytime?",
        a: "Yes. No annual contracts on the Starter or Professional plans. Cancel from your dashboard with two clicks. We’ll export all your data to Excel before deactivation.",
    },
];

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-5 md:px-8">
                <SectionHead
               
                    title={
                        <>
                            Things landlords actually ask us
                        </>
                    }
                    description={
                        <>
                            If your question isn&apos;t here, WhatsApp us at +880 1782521705. <br /> Real
                            humans, Bangla &amp; English, 9 AM – 10 PM.
                        </>
                    }
                />

                <RevealGroup className="max-w-[820px] mx-auto">
                    {faqs.map((faq, i) => {
                        const open = openIndex === i;
                        return (
                            <RevealItem key={faq.q}>
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(open ? null : i)}
                                    className="w-full text-left border-b border-rule dark:border-white/15 py-6 cursor-pointer"
                                >
                                    <div className="flex justify-between items-center gap-6">
                                        <h3 className="text-[17px] font-semibold text-sky-950 dark:text-sky-50 tracking-[-0.01em]">
                                            {faq.q}
                                        </h3>
                                        <span
                                            className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-bold text-base transition ${
                                                open
                                                    ? "bg-sky-500 text-paper rotate-45"
                                                    : "bg-cream-2 dark:bg-night-2 text-sky-900 dark:text-sky-50"
                                            }`}
                                        >
                                            +
                                        </span>
                                    </div>
                                    {open && (
                                        <div className="mt-4 max-w-[680px] text-[15px] leading-[1.65] text-ink-soft dark:text-mist-soft">
                                            {faq.a}
                                        </div>
                                    )}
                                </button>
                            </RevealItem>
                        );
                    })}
                </RevealGroup>
            </div>
        </section>
    );
}
