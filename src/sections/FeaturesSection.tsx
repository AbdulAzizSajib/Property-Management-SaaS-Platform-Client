"use client";

import { RevealGroup, RevealItem } from "@/src/components/Reveal";
import SectionHead from "@/src/components/SectionHead";
import {
    Banknote,
    LayoutGrid,
    Languages,
    Users,
    Wrench,
    type LucideIcon,
} from "lucide-react";

const utilities = [
    { name: "Gas", amount: "৳800" },
    { name: "Water", amount: "৳350" },
    { name: "Lift", amount: "৳200" },
    { name: "Sec.", amount: "৳500" },
];

const reportStats = [
    { n: "Financial", l: "Income vs. expense" },
    { n: "Collection", l: "Rent status" },
    { n: "Occupancy", l: "Vacant vs. rented" },
    { n: "Expenses", l: "By category" },
];

const collectionRows = [
    { code: "R", color: "bg-indigo-300", name: "Rashid Ahmed — Flat A4", meta: "Mirpur 11 · Apr rent", amount: "৳18,500", due: false },
    { code: "S", color: "bg-blue-300", name: "Salma Begum — Flat B2", meta: "Dhanmondi · May rent", amount: "৳24,000", due: false },
    { code: "I", color: "bg-sky-300", name: "Imran Khan — Flat C1", meta: "Uttara · May rent", amount: "৳15,200 due", due: true },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="py-16 lg:py-20">
            <div className="max-w-7xl space-grotesk mx-auto px-5  md:px-8">
                <SectionHead
                    title={
                        <>
                            Everything your property
                            <br />
                            needs, in one dashboard
                        </>
                    }
                    description="From a single flat to a 30-storey tower — no spreadsheets, no paperwork."
                />

                <RevealGroup className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[minmax(200px,auto)] gap-3">
                    {/* B-1 hero card */}
                    <RevealItem className="md:col-span-4 lg:col-span-4 md:row-span-2 bg-sky-900 rounded-[18px] p-6 text-white overflow-hidden flex flex-col shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_3px_0_0_#000] border border-black/40">
                        <FeatureIcon dark icon={Banknote} />
                        <h3 className="font-bold text-[26px] tracking-[-0.015em]  mb-2">
                            Track every rent payment in one place
                        </h3>
                        <p className="text-[14px]  leading-normal mb-4">
                            Cash, bKash, Nagad, or bank — every payment gets a receipt, instantly.
                        </p>
                        <div className="flex-1 border border-white/10 rounded-xl p-3 grid gap-1">
                            {collectionRows.map((row) => (
                                <div
                                    key={row.name}
                                    className="grid grid-cols-[28px_1fr_auto] gap-3 items-center text-xs rounded-lg px-2.5 py-1.5"
                                >
                                    <span
                                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-extrabold tracking-tighter text-black ${row.color}`}
                                    >
                                        {row.code}
                                    </span>
                                    <div className="font-semibold">
                                        {row.name}
                                        <small className="block text-white/50 text-[10px] font-normal">
                                            {row.meta}
                                        </small>
                                    </div>
                                    <div
                                        className={`font-mono text-[11px] font-bold px-2 py-1 rounded ${row.due ? "bg-sky-600" : "bg-sky-700"}`}
                                    >
                                        {row.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RevealItem>

                    {/* B-2 */}
                    <BentoCard className="md:col-span-2 lg:col-span-2 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_3px_0_0_#000] border border-black/40">
                        <FeatureIcon icon={Users} />
                        <h3 className="text-[19px] font-bold tracking-[-0.015em] text-sky-950 dark:text-sky-50 mb-2">
                            Tenant &amp; lease
                            <br />
                            management
                        </h3>
                        <p className="text-sm text-ink-soft dark:text-mist-soft leading-[1.55]">
                            Store tenant details, sign digital leases, and track deposits in-app.
                        </p>
                    </BentoCard>

                    {/* B-3 */}
                    <BentoCard className="md:col-span-2 lg:col-span-2 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_3px_0_0_#000] border border-black/40">
                        <FeatureIcon icon={Wrench} />
                        <h3 className="text-[19px] font-bold tracking-[-0.015em] text-sky-950 dark:text-sky-50 mb-2">
                            Maintenance &amp; complaints
                        </h3>
                        <p className="text-sm text-ink-soft dark:text-mist-soft leading-[1.55]">
                            Tenants report issues from their phone — assign, track, resolve.
                        </p>
                    </BentoCard>

                    {/* B-4 Bilingual dashboard */}
                    <BentoCard className="md:col-span-2 lg:col-span-3 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_3px_0_0_#000] border border-black/40">
                        <FeatureIcon icon={Languages} />
                        <h3 className="text-[19px] font-bold tracking-[-0.015em] text-sky-950 dark:text-sky-50 mb-2">
                            One dashboard, two languages
                        </h3>
                        <p className="text-sm text-ink-soft dark:text-mist-soft leading-[1.55]">
                            Switch the whole dashboard between Bangla and English in one click.
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-rule-soft dark:border-white/10 bg-cream-2 dark:bg-night-2 p-1 text-xs font-semibold">
                            <span className="rounded-full bg-sky-800 px-3 py-1.5 font-bangla text-paper">
                                বাংলা
                            </span>
                            <span className="px-3 py-1.5 text-ink-soft dark:text-mist-soft">
                                English
                            </span>
                        </div>
                    </BentoCard>

                    {/* B-5 utilities */}
                    <BentoCard className="md:col-span-2 lg:col-span-3 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_3px_0_0_#000] border border-black/40">
                        <FeatureIcon icon={LayoutGrid} />
                        <h3 className="text-[19px] font-bold tracking-[-0.015em] text-sky-950 dark:text-sky-50 mb-2">
                            Log service charges &amp; utility bills
                        </h3>
                        <p className="text-sm text-ink-soft dark:text-mist-soft leading-[1.55]">
                            Log gas, water, lift, and generator bills — categorized, never lost.
                        </p>
                        <div className="grid grid-cols-5 gap-1 mt-3">
                            {utilities.map((u) => (
                                <div
                                    key={u.name}
                                    className="bg-cream-2 dark:bg-night-2 rounded-md p-2 text-center text-[10px] text-ink-soft dark:text-mist-soft font-semibold"
                                >
                                    {u.name}
                                    <br />
                                    <b className="text-sky-900 dark:text-sky-50 text-xs">{u.amount}</b>
                                </div>
                            ))}
                            <div className="bg-sky-50 dark:bg-sky-500/15 rounded-md p-2 text-center text-[10px] text-sky-700 dark:text-sky-300 font-semibold">
                                Total
                                <br />
                                <b className="text-sky-900 dark:text-sky-50 text-xs">৳1,850</b>
                            </div>
                        </div>
                    </BentoCard>

                    {/* B-6 reports stats */}
                    <RevealItem className="md:col-span-4 lg:col-span-6 bg-cream-2 dark:bg-night-2 rounded-[18px] p-6 md:px-7 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_3px_0_0_#000] border border-black/40">
                        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-4 items-center">
                            <div>
                                <h3 className="text-[22px] font-bold text-sky-950 dark:text-sky-50 tracking-[-0.015em] mb-1.5">
                                    Reports that show you where you stand
                                </h3>
                                <p className="text-[13px] text-ink-soft dark:text-mist-soft leading-[1.55]">
                                    Financials, collections, occupancy, expenses — four reports, always ready.
                                </p>
                            </div>
                            {reportStats.map((s) => (
                                <div key={s.l} className="text-center max-md:text-left">
                                    <div className="text-[28px] font-bold text-sky-800 dark:text-sky-300 tracking-[-0.02em] mb-0.5">
                                        {s.n}
                                    </div>
                                    <div className="text-[11px] text-ink-soft dark:text-mist-soft uppercase tracking-wider font-semibold">
                                        {s.l}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RevealItem>
                </RevealGroup>
            </div>
        </section>
    );
}

function BentoCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <RevealItem
            className={`bg-paper dark:bg-night-2 border border-rule-soft dark:border-white/10 rounded-[18px] p-5 relative overflow-hidden ${className ?? ""}`}
        >
            {children}
        </RevealItem>
    );
}

function FeatureIcon({ icon: Icon, dark }: { icon: LucideIcon; dark?: boolean }) {
    return (
        <div
            className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-3 ${
                dark ? "bg-white/10 text-amber-500" : "bg-sky-50 dark:bg-sky-500/15 text-sky-800 dark:text-sky-300"
            }`}
        >
            <Icon size={20} strokeWidth={1.8} />
        </div>
    );
}
