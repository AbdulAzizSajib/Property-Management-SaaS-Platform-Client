"use client";

import { motion } from "framer-motion";

const months = [
    { lbl: "Jun", h: 42 },
    { lbl: "Jul", h: 58 },
    { lbl: "Aug", h: 64 },
    { lbl: "Sep", h: 51 },
    { lbl: "Oct", h: 72 },
    { lbl: "Nov", h: 68 },
    { lbl: "Dec", h: 80 },
    { lbl: "Jan", h: 76 },
    { lbl: "Feb", h: 84 },
    { lbl: "Mar", h: 78 },
    { lbl: "Apr", h: 88 },
    { lbl: "May", h: 96, now: true },
];

const sidebarItems: { label: string; active?: boolean; count?: number }[] = [
    { label: "Dashboard", active: true },
    { label: "Properties" },
    { label: "Tenants", count: 12 },
    { label: "Collections" },
    { label: "Maintenance", count: 3 },
];

const reportItems = [{ label: "Income" }, { label: "Occupancy" }];

const flats: { id: string; state: "paid" | "due" | "vacant" }[] = [
    { id: "A1", state: "paid" },
    { id: "A2", state: "paid" },
    { id: "A3", state: "paid" },
    { id: "B1", state: "paid" },
    { id: "B2", state: "due" },
    { id: "B3", state: "paid" },
    { id: "C1", state: "paid" },
    { id: "C2", state: "vacant" },
    { id: "C3", state: "paid" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function DashboardMockup() {
    return (
        <div className="relative aspect-[1.05/1] [perspective:1800px]">
            {/* Soft glow behind */}
            <div
                aria-hidden
                className="absolute inset-6 -z-10 rounded-[28px] opacity-70 blur-2xl"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 40%, rgba(13,79,63,0.18), transparent 70%)",
                }}
            />

            {/* Main dashboard panel */}
            <div
                className="relative z-[2] bg-paper rounded-[18px] overflow-hidden origin-center"
                style={{
                    boxShadow:
                        "0 1px 0 rgba(255,255,255,0.6) inset, 0 0 0 1px rgba(13,79,63,0.08), 0 40px 70px -25px rgba(10,46,34,0.28), 0 14px 32px -12px rgba(10,46,34,0.16)",
                    transform: "rotate3d(1,-0.2,0,1.5deg) rotateZ(-0.4deg)",
                }}
            >
                {/* Chrome */}
                <div className="flex items-center gap-2 px-3.5 py-3 border-b border-rule-soft bg-cream">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f9beb2]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fadea2]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b4ddc5]" />
                    <span className="ml-3 flex-1 max-w-[280px] font-mono text-[11px] text-ink-soft bg-paper px-3 py-1 rounded-md border border-rule-soft inline-flex items-center gap-1.5">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path
                                d="M3 4.5V3a2 2 0 114 0v1.5M2.5 4.5h5v4h-5v-4z"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        app.baribari.com.bd / dashboard
                    </span>
                </div>

                {/* Body */}
                <div className="grid grid-cols-[180px_1fr] min-h-[460px]">
                    <aside className="bg-jade-950 text-jade-50 px-3.5 py-4">
                        <div className="flex items-center gap-2 font-bold text-[14px] text-paper pb-3.5 border-b border-white/10 mb-3.5">
                            <span className="relative w-[22px] h-[22px] rounded-[5px] bg-coral-600 overflow-hidden flex items-center justify-center">
                                <span className="text-paper text-[12px] font-bold leading-none">
                                    B
                                </span>
                            </span>
                            BariBari
                        </div>
                        <SideLabel>Workspace</SideLabel>
                        {sidebarItems.map((item) => (
                            <SideItem key={item.label} {...item} />
                        ))}
                        <SideLabel>Reports</SideLabel>
                        {reportItems.map((item) => (
                            <SideItem key={item.label} {...item} />
                        ))}
                    </aside>

                    <main className="p-5 bg-paper">
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="text-[15px] font-bold text-jade-900 tracking-tight mb-1">
                                    Welcome back, Karim Bhai
                                </h3>
                                <p className="text-[12px] text-ink-soft leading-tight">
                                    3 buildings · 18 flats · this week
                                </p>
                            </div>
                            <span className="text-[11px] font-semibold bg-cream text-ink-soft border border-rule-soft px-2.5 py-1 rounded-md tabular-nums">
                                May 2026
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <Kpi
                                label="Collected"
                                value="৳4,18,500"
                                delta="↑ 12% vs Apr"
                            />
                            <Kpi
                                label="Due this week"
                                value="৳62,000"
                                delta="3 tenants"
                                accent="coral"
                            />
                            <Kpi
                                label="Occupancy"
                                value="94"
                                unit="%"
                                delta="17 of 18 flats"
                            />
                        </div>

                        <div className="border border-rule-soft rounded-[10px] p-3.5 bg-paper">
                            <div className="flex justify-between items-center text-[12px] font-semibold text-ink mb-3.5">
                                <span>Monthly collection</span>
                                <div className="flex gap-3 text-[10.5px] text-ink-soft font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <i className="inline-block w-2 h-2 rounded-sm bg-jade-700" />
                                        Collected
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <i className="inline-block w-2 h-2 rounded-sm bg-coral-600" />
                                        This month
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-12 gap-[5px] h-[90px] items-end relative">
                                {/* Subtle baseline */}
                                <div className="absolute left-0 right-0 bottom-0 h-px bg-rule-soft" />
                                {months.map((m, i) => (
                                    <motion.div
                                        key={m.lbl}
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{
                                            duration: 0.7,
                                            ease,
                                            delay: 0.6 + i * 0.04,
                                        }}
                                        style={{ transformOrigin: "bottom" }}
                                        className="relative bg-jade-50 rounded-t-sm flex flex-col justify-end"
                                    >
                                        <i
                                            className={`block rounded-t-sm ${m.now ? "bg-coral-600" : "bg-jade-700"}`}
                                            style={{ height: `${m.h}%` }}
                                        />
                                        <span className="absolute -bottom-[18px] left-0 right-0 text-center font-mono text-[10px] text-ink-soft">
                                            {m.lbl}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Floating building card — calmer rotation, pulled in tighter */}
            <motion.div
                initial={{ opacity: 0, y: -10, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: 2.5 }}
                transition={{ duration: 0.8, ease, delay: 0.6 }}
                whileHover={{ rotate: 1, y: -3 }}
                className="hidden sm:block absolute -top-4 -right-4 lg:-right-6 z-[3] bg-jade-900 text-paper rounded-[14px] px-4 py-3.5 w-[218px]"
                style={{
                    boxShadow:
                        "0 24px 44px -12px rgba(10,46,34,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset",
                }}
            >
                <div className="flex items-start justify-between mb-2.5">
                    <h5 className="text-[11px] text-white/55 uppercase tracking-[0.12em] font-semibold">
                        Rahman Tower
                    </h5>
                    <span className="text-[9.5px] text-jade-300 font-mono">LIVE</span>
                </div>
                <div className="text-[15px] font-bold mb-0.5">Mirpur 11</div>
                <div className="text-[11.5px] text-white/60 mb-3.5">
                    6-storey · 18 flats
                </div>
                <div className="grid grid-cols-3 gap-1 mb-2.5">
                    {flats.map((f, i) => (
                        <FlatCell key={f.id} {...f} delay={1.1 + i * 0.04} />
                    ))}
                </div>
                <div className="flex gap-2.5 text-[10px] text-white/65">
                    <LegendDot color="bg-jade-500">Paid</LegendDot>
                    <LegendDot color="bg-coral-600">Due</LegendDot>
                    <LegendDot color="bg-white/20">Vacant</LegendDot>
                </div>
            </motion.div>

            {/* Floating SMS notif — pulled in, calmer angle */}
            <motion.div
                initial={{ opacity: 0, y: 10, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                transition={{ duration: 0.8, ease, delay: 0.75 }}
                whileHover={{ rotate: -0.5, y: -3 }}
                className="hidden sm:block absolute bottom-6 -left-4 lg:-left-6 z-[3] bg-paper rounded-[14px] px-4 py-3.5 w-[238px]"
                style={{
                    boxShadow:
                        "0 24px 44px -12px rgba(10,46,34,0.28), 0 0 0 1px rgba(13,79,63,0.06)",
                }}
            >
                <h5 className="text-[10.5px] text-ink-soft uppercase tracking-[0.12em] font-semibold mb-2 flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-sm bg-jade-800 text-paper">
                        <svg
                            width="9"
                            height="9"
                            viewBox="0 0 9 9"
                            fill="none"
                        >
                            <path
                                d="M1 2h7v4.5H5L3 8V6.5H1V2z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>
                    SMS sent · <span className="font-bangla">বাংলা</span>
                </h5>
                <div className="font-bangla text-[13.5px] text-ink leading-[1.45] font-medium">
                    প্রিয় ভাড়াটিয়া, মে মাসের ভাড়া ৳১৮,৫০০ এখনও বাকি। bKash এ পেমেন্ট
                    করুন।
                </div>
                <div className="flex justify-between font-mono text-[10px] text-ink-soft mt-2.5 pt-2.5 border-t border-rule-soft">
                    <span>To: 12 tenants</span>
                    <span>৳0.45/SMS</span>
                </div>
            </motion.div>
        </div>
    );
}

function SideLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-[10.5px] tracking-[0.14em] uppercase text-white/45 mt-3.5 mb-2 font-semibold">
            {children}
        </div>
    );
}

function SideItem({
    label,
    active,
    count,
}: {
    label: string;
    active?: boolean;
    count?: number;
}) {
    return (
        <div
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[12.5px] font-medium mb-0.5 transition-colors ${
                active
                    ? "bg-white/[0.08] text-paper"
                    : "text-white/65 hover:text-white/85"
            }`}
        >
            <span
                className={`w-3.5 h-3.5 rounded-[3px] border-[1.3px] ${
                    active
                        ? "bg-coral-500 border-coral-500"
                        : "border-current opacity-70"
                }`}
            />
            {label}
            {count != null && (
                <span className="ml-auto bg-coral-600 text-paper text-[9.5px] font-bold px-1.5 py-px rounded-full min-w-[16px] text-center tabular-nums">
                    {count}
                </span>
            )}
        </div>
    );
}

function Kpi({
    label,
    value,
    unit,
    delta,
    accent,
}: {
    label: string;
    value: string;
    unit?: string;
    delta: string;
    accent?: "coral";
}) {
    return (
        <div
            className={`p-3 border rounded-[10px] ${
                accent === "coral"
                    ? "bg-gradient-to-br from-[#fdf1ed] to-[#fde8e2] border-[#fbd5cb]"
                    : "bg-cream border-rule-soft"
            }`}
        >
            <div className="text-[10.5px] text-ink-soft uppercase tracking-[0.1em] mb-1.5 font-semibold">
                {label}
            </div>
            <div
                className={`text-[17px] font-bold tracking-[-0.02em] flex items-baseline gap-0.5 tabular-nums ${
                    accent === "coral" ? "text-coral-600" : "text-jade-900"
                }`}
            >
                {value}
                {unit && (
                    <small className="text-[11.5px] text-ink-soft font-medium">
                        {unit}
                    </small>
                )}
            </div>
            <div
                className={`text-[10.5px] mt-1 font-semibold ${
                    accent === "coral" ? "text-coral-600" : "text-jade-700"
                }`}
            >
                {delta}
            </div>
        </div>
    );
}

function FlatCell({
    id,
    state,
    delay = 0,
}: {
    id: string;
    state: "paid" | "due" | "vacant";
    delay?: number;
}) {
    const styles = {
        paid: "bg-jade-500 text-white",
        due: "bg-coral-600 text-white",
        vacant: "bg-white/5 text-white/30 border border-white/10",
    } as const;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease, delay }}
            className={`aspect-[1.4/1] rounded-[3px] flex items-center justify-center text-[10px] font-mono font-semibold ${styles[state]}`}
        >
            {id}
        </motion.div>
    );
}

function LegendDot({
    color,
    children,
}: {
    color: string;
    children: React.ReactNode;
}) {
    return (
        <span className="flex items-center gap-1.5">
            <i className={`inline-block w-[7px] h-[7px] rounded-sm ${color}`} />
            {children}
        </span>
    );
}