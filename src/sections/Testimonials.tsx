"use client";

import { RevealGroup, RevealItem } from "@/src/components/Reveal";
import SectionHead from "@/src/components/SectionHead";

const others = [
    {
        initials: "NJ",
        quote: "Managing 3 buildings in Uttara feels effortless now. Tenants love the Bangla reminders — they say it feels personal, not like a bank notice.",
        name: "Nusrat Jahan",
        meta: "Uttara Sector 7",
    },
    {
        initials: "RH",
        quote: "Best investment for our agency in Chattogram. We onboarded 80 flats in two weeks. The TDS report alone is worth the price.",
        name: "Rakibul Hasan",
        meta: "CTG Properties Ltd.",
    },
    {
        initials: "SK",
        quote: "আমার বাবার বানানো বাড়ি, কিন্তু হিসাব রাখা কঠিন ছিল। Bariyan সব সহজ করে দিয়েছে।",
        name: "Shahriar Kabir",
        meta: "Dhanmondi 27 · 4 flats",
        bangla: true,
    },
    {
        initials: "FA",
        quote: "Switched from 3 Excel sheets and a notebook. Never going back. Reports for income tax are a 1-click export.",
        name: "Farzana Akter",
        meta: "Gulshan 2 · 12 flats",
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 lg:py-32">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8">
                <SectionHead
                    eyebrow="Loved by landlords"
                    title={
                        <>
                            From Dhaka to Chattogram,
                            <br />
                            1,200+ landlords sleep{" "}
                            <em className="font-serif italic font-normal text-sky-500">
                                better
                            </em>{" "}
                            at night
                        </>
                    }
                />

                <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-4">
                    {/* Featured card spans 2 rows */}
                    <RevealItem className="md:col-span-2 lg:col-span-1 lg:row-span-2 bg-sky-900 border border-sky-900 text-paper rounded-2xl p-9 flex flex-col justify-between">
                        <div>
                            <p className="font-serif italic text-[26px] leading-[1.3] mb-8 text-pretty">
                                &quot;Rent collection used to take me a full week every month. With
                                Bariyan and bKash, everything settles in 24 hours. The Bangla SMS
                                feature alone saved me 4 hours of phone calls.&quot;
                            </p>
                            <div className="flex gap-8 pt-7 border-t border-white/10">
                                <Stat n="3" l="Buildings" />
                                <Stat n="42" l="Flats managed" />
                                <Stat n="96%" l="On-time rent" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-8">
                            <span className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-amber-500 to-sky-400 text-white font-bold text-base flex items-center justify-center">
                                TA
                            </span>
                            <div>
                                <div className="font-bold text-sm text-paper">Tanvir Ahmed</div>
                                <div className="text-xs text-white/50 mt-0.5">
                                    Owner · Bashundhara R/A · Customer since 2024
                                </div>
                            </div>
                        </div>
                    </RevealItem>

                    {others.map((t) => (
                        <RevealItem
                            key={t.name}
                            className="bg-paper dark:bg-night-2 border border-rule-soft dark:border-white/10 rounded-2xl p-7 flex flex-col"
                        >
                            <p
                                className={`text-[18px] leading-[1.45] text-sky-950 dark:text-sky-50 mb-6 text-pretty ${
                                    t.bangla ? "font-bangla" : "font-serif italic"
                                }`}
                            >
                                &quot;{t.quote}&quot;
                            </p>
                            <div className="flex items-center gap-3 mt-auto">
                                <span className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-cream-2 to-rule text-sky-900 font-bold text-base flex items-center justify-center">
                                    {t.initials}
                                </span>
                                <div>
                                    <div className="font-bold text-sm text-sky-950 dark:text-sky-50">{t.name}</div>
                                    <div className="text-xs text-ink-soft dark:text-mist-soft mt-0.5">{t.meta}</div>
                                </div>
                            </div>
                        </RevealItem>
                    ))}
                </RevealGroup>
            </div>
        </section>
    );
}

function Stat({ n, l }: { n: string; l: string }) {
    return (
        <div>
            <div className="text-[32px] font-bold text-amber-500 tracking-[-0.02em] leading-none">
                {n}
            </div>
            <div className="text-[11px] text-white/60 uppercase tracking-wider mt-1 font-semibold">
                {l}
            </div>
        </div>
    );
}
