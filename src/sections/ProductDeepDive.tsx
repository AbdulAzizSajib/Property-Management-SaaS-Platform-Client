"use client";

import LogoMark from "@/src/components/LogoMark";
import Reveal from "@/src/components/Reveal";
import SectionHead from "@/src/components/SectionHead";
import { useState } from "react";

const topTabs = ["Collections", "Tenants", "Maintenance", "Reports"];
const innerTabs = ["All flats (18)", "Paid (14)", "Due (3)", "Vacant (1)"];

const mainNav = [
    { label: "Dashboard" },
    { label: "Collections", active: true },
    { label: "Properties" },
    { label: "Tenants" },
    { label: "Maintenance", badge: 3 },
];
const moneyNav = [{ label: "Bank accounts" }, { label: "Reports" }, { label: "Service charges" }];

const stats = [
    { label: "Total expected", value: "৳3,12,000", change: "May target" },
    { label: "Collected", value: "৳2,67,500", change: "↑ 86% collection rate" },
    {
        label: "Outstanding",
        value: "৳44,500",
        change: "3 tenants overdue",
        down: true,
        valueAccent: "coral" as const,
    },
    { label: "Service charge", value: "৳26,400", change: "Auto-split done" },
];

type Status = "paid" | "due" | "upcoming";

const rows: {
    flat: string;
    name: string;
    phone: string;
    tenure: string;
    via: { code: string; label: string; color: string };
    rent: string;
    status: { kind: Status; text: string };
}[] = [
    {
        flat: "A1",
        name: "Rashid Ahmed",
        phone: "+880 1712-3****99",
        tenure: "2 yrs",
        via: { code: "bK", label: "bKash", color: "bg-bkash" },
        rent: "৳18,500",
        status: { kind: "paid", text: "Paid · May 03" },
    },
    {
        flat: "A2",
        name: "Salma Begum",
        phone: "+880 1819-2****12",
        tenure: "5 yrs",
        via: { code: "Ng", label: "Nagad", color: "bg-nagad" },
        rent: "৳22,000",
        status: { kind: "paid", text: "Paid · May 05" },
    },
    {
        flat: "B2",
        name: "Imran Khan",
        phone: "+880 1614-7****05",
        tenure: "8 mo",
        via: { code: "Rk", label: "Rocket", color: "bg-rocket" },
        rent: "৳15,200",
        status: { kind: "due", text: "7 days overdue" },
    },
    {
        flat: "B3",
        name: "Fariha Sultana",
        phone: "+880 1923-1****87",
        tenure: "1 yr",
        via: { code: "CB", label: "City Bank", color: "bg-citybank" },
        rent: "৳28,000",
        status: { kind: "paid", text: "Paid · May 01" },
    },
    {
        flat: "C1",
        name: "Tareq Hossain",
        phone: "+880 1517-3****44",
        tenure: "3 mo",
        via: { code: "bK", label: "bKash", color: "bg-bkash" },
        rent: "৳16,800",
        status: { kind: "upcoming", text: "Due May 18" },
    },
];

const statusStyles: Record<Status, string> = {
    paid: "bg-[#d6efe1] text-[#0a6133]",
    due: "bg-[#ffe1d8] text-[#b73d22]",
    upcoming: "bg-[#fce6b8] text-[#8a5a08]",
};

export default function ProductDeepDive() {
    const [activeTab, setActiveTab] = useState(topTabs[0]);
    const [activeInner, setActiveInner] = useState(innerTabs[0]);

    return (
        <section id="product" className="bg-jade-950 text-paper py-24 lg:py-32 rounded-3xl mx-4 md:mx-8">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8">
                <SectionHead
                    light
                    eyebrow="The dashboard"
                    title={
                        <>
                            See what your portfolio looks like
                            <br />
                            at{" "}
                            <em className="font-serif italic font-normal text-amber-500">
                                4:32 PM today
                            </em>
                        </>
                    }
                    description="A live look at the Bariyan workspace — built for fast scanning, designed for landlords who don't have time for tutorials."
                />

                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {topTabs.map((tab) => {
                        const active = tab === activeTab;
                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`px-4.5 py-2.5 rounded-full text-[13.5px] font-semibold border transition ${
                                    active
                                        ? "bg-paper text-jade-950 border-paper"
                                        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-paper"
                                }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <Reveal y={40} className="max-w-[1100px] mx-auto bg-paper rounded-2xl p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.4)]">
                    <div className="flex items-center gap-1.5 px-3 py-2">
                        <span className="w-[9px] h-[9px] rounded-full bg-[#f9beb2]" />
                        <span className="w-[9px] h-[9px] rounded-full bg-[#fadea2]" />
                        <span className="w-[9px] h-[9px] rounded-full bg-[#b4ddc5]" />
                    </div>
                    <div className="bg-cream dark:bg-night rounded-[10px] min-h-[480px] grid md:grid-cols-[220px_1fr] overflow-hidden">
                        <aside className="hidden md:block bg-paper dark:bg-night-2 p-5 border-r border-rule-soft dark:border-white/10">
                            <div className="font-bold text-[17px] text-jade-900 dark:text-jade-50 mb-6 flex items-center gap-2.5">
                                <LogoMark size="sm" />
                                Bariyan
                            </div>
                            <SideLabel>Main</SideLabel>
                            {mainNav.map((n) => (
                                <SideItem key={n.label} {...n} />
                            ))}
                            <SideLabel>Money</SideLabel>
                            {moneyNav.map((n) => (
                                <SideItem key={n.label} {...n} />
                            ))}
                        </aside>

                        <main className="p-7">
                            <div className="flex flex-wrap gap-4 justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-[22px] font-bold text-jade-950 dark:text-jade-50 tracking-[-0.02em] mb-1">
                                        Collections — May 2026
                                    </h3>
                                    <p className="text-[13px] text-ink-soft dark:text-mist-soft">
                                        Rahman Tower · Mirpur 11 · 18 flats
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="bg-coral-600 hover:bg-coral-500 transition text-paper font-semibold text-sm px-4 py-2.5 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.2),0_4px_12px_rgba(232,93,68,0.22)]"
                                >
                                    + Record payment
                                </button>
                            </div>

                            <div className="flex gap-1 mb-5 border-b border-rule-soft dark:border-white/10">
                                {innerTabs.map((t) => {
                                    const active = t === activeInner;
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setActiveInner(t)}
                                            className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition ${
                                                active
                                                    ? "text-jade-900 dark:text-jade-50 border-coral-600"
                                                    : "text-ink-soft dark:text-mist-soft border-transparent hover:text-jade-900 dark:hover:text-jade-50"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                                {stats.map((s) => (
                                    <div
                                        key={s.label}
                                        className="bg-paper dark:bg-night-2 border border-rule-soft dark:border-white/10 rounded-[10px] p-3.5"
                                    >
                                        <div className="text-[11px] text-ink-soft dark:text-mist-soft mb-2 font-medium">
                                            {s.label}
                                        </div>
                                        <div
                                            className={`text-[22px] font-bold tracking-[-0.02em] ${
                                                s.valueAccent === "coral"
                                                    ? "text-coral-600"
                                                    : "text-jade-900 dark:text-jade-50"
                                            }`}
                                        >
                                            {s.value}
                                        </div>
                                        <div
                                            className={`text-[10.5px] font-semibold mt-1 ${
                                                s.down ? "text-coral-600" : "text-jade-700 dark:text-jade-300"
                                            }`}
                                        >
                                            {s.change}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-paper dark:bg-night-2 border border-rule-soft dark:border-white/10 rounded-[10px] overflow-hidden">
                                <div className="px-4.5 py-3.5 border-b border-rule-soft dark:border-white/10 flex justify-between items-center">
                                    <h4 className="text-sm font-bold text-jade-950 dark:text-jade-50">
                                        Tenant payments
                                    </h4>
                                    <span className="text-[11px] text-ink-soft dark:text-mist-soft font-medium bg-cream dark:bg-night px-2.5 py-1 rounded">
                                        May 2026 ▾
                                    </span>
                                </div>
                                {rows.map((r) => (
                                    <div
                                        key={r.flat}
                                        className="grid grid-cols-[30px_1.5fr_1fr_1fr_0.8fr_auto] gap-3 items-center px-4.5 py-3 border-b border-rule-soft dark:border-white/10 last:border-b-0 text-[13px]"
                                    >
                                        <span className="font-mono text-[11px] font-bold text-jade-900 dark:text-jade-50 bg-jade-50 dark:bg-jade-500/15 px-1.5 py-0.5 rounded text-center">
                                            {r.flat}
                                        </span>
                                        <div>
                                            <b className="font-semibold">{r.name}</b>
                                            <small className="block text-ink-soft dark:text-mist-soft text-[11px]">
                                                {r.phone} · {r.tenure}
                                            </small>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-ink-soft dark:text-mist-soft">
                                            <span
                                                className={`w-4 h-4 rounded text-white text-[7px] font-extrabold flex items-center justify-center ${r.via.color}`}
                                            >
                                                {r.via.code}
                                            </span>
                                            {r.via.label}
                                        </div>
                                        <div className="font-mono font-semibold text-jade-900 dark:text-jade-50">
                                            {r.rent}
                                        </div>
                                        <div
                                            className={`text-[10.5px] font-bold px-2 py-1 rounded-full uppercase tracking-wider text-center ${statusStyles[r.status.kind]}`}
                                        >
                                            {r.status.text}
                                        </div>
                                        <button type="button" className="text-ink-soft dark:text-mist-soft">
                                            ⋯
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </main>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

function SideLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-[10px] font-bold text-ink-soft dark:text-mist-soft uppercase tracking-[0.1em] mt-4.5 mb-2.5">
            {children}
        </div>
    );
}

function SideItem({
    label,
    active,
    badge,
}: {
    label: string;
    active?: boolean;
    badge?: number;
}) {
    return (
        <div
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-0.5 ${
                active ? "bg-jade-50 dark:bg-jade-500/15 text-jade-900 dark:text-jade-50 font-semibold" : "text-ink-soft dark:text-mist-soft font-medium"
            }`}
        >
            <span
                className={`w-3.5 h-3.5 rounded border-[1.4px] border-current opacity-70 ${
                    active ? "bg-jade-800 border-jade-800" : ""
                }`}
            />
            {label}
            {badge != null && (
                <span className="ml-auto text-[10px] font-bold bg-coral-100 text-coral-600 px-1.5 py-px rounded-lg">
                    {badge}
                </span>
            )}
        </div>
    );
}
