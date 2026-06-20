import SectionHead from "@/src/components/SectionHead";
import {
    Banknote,
    LayoutGrid,
    MessageSquare,
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
    { n: "14+", l: "Report types" },
    { n: ".xlsx", l: "Excel export" },
    { n: "PDF", l: "Owner-ready" },
    { n: "৳0", l: "Per export" },
];

const collectionRows = [
    { code: "bK", color: "bg-bkash", name: "Rashid Ahmed — Flat A4", meta: "Mirpur 11 · Apr rent", amount: "৳18,500", due: false },
    { code: "Ng", color: "bg-nagad", name: "Salma Begum — Flat B2", meta: "Dhanmondi · May rent", amount: "৳24,000", due: false },
    { code: "Rk", color: "bg-rocket", name: "Imran Khan — Flat C1", meta: "Uttara · May rent", amount: "৳15,200 due", due: true },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 lg:py-32">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8">
                <SectionHead
                    eyebrow="What you get"
                    title={
                        <>
                            Built for the way Bangladesh
                            <br />
                            <em className="font-serif italic font-normal text-coral-600">
                                actually
                            </em>{" "}
                            manages property
                        </>
                    }
                    description="From a single flat in Mirpur to a 30-storey tower in Bashundhara, Bariyan adapts to how you already work."
                />

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[minmax(220px,auto)] gap-4">
                    {/* B-1 hero card */}
                    <div className="md:col-span-4 lg:col-span-4 md:row-span-2 bg-jade-900 border border-jade-900 rounded-[18px] p-8 text-paper overflow-hidden">
                        <FeatureIcon dark icon={Banknote} />
                        <h3 className="font-bold text-[28px] tracking-[-0.015em] text-paper mb-3">
                            Track every rent payment in one place
                        </h3>
                        <p className="text-[15px] text-white/70 leading-[1.55] max-w-[360px] mb-6">
                            Record how each tenant paid — cash, bKash, Nagad, Rocket or bank
                            transfer — and Bariyan auto-generates a PDF rent receipt for every
                            payment.
                        </p>
                        <div className="bg-white/[0.06] border border-white/10 rounded-xl p-3.5 grid gap-2">
                            {collectionRows.map((row) => (
                                <div
                                    key={row.name}
                                    className="grid grid-cols-[24px_1fr_auto] gap-2.5 items-center text-xs bg-white/5 rounded-lg px-2.5 py-2"
                                >
                                    <div
                                        className={`w-6 h-6 rounded-md font-mono text-[8px] font-extrabold text-white flex items-center justify-center tracking-tighter ${row.color}`}
                                    >
                                        {row.code}
                                    </div>
                                    <div className="text-paper font-semibold">
                                        {row.name}
                                        <small className="block text-white/50 text-[10px] font-normal">
                                            {row.meta}
                                        </small>
                                    </div>
                                    <div
                                        className={`font-mono text-[11px] font-bold text-paper px-2 py-1 rounded ${row.due ? "bg-coral-600" : "bg-jade-700"}`}
                                    >
                                        {row.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* B-2 */}
                    <BentoCard className="md:col-span-2 lg:col-span-2">
                        <FeatureIcon icon={Users} />
                        <h3 className="text-[19px] font-bold tracking-[-0.015em] text-jade-950 dark:text-jade-50 mb-2">
                            Tenant &amp; lease
                            <br />
                            management
                        </h3>
                        <p className="text-sm text-ink-soft dark:text-mist-soft leading-[1.55]">
                            NID verification, digital lease agreements, deposit tracking,
                            renewal reminders — all paperless.
                        </p>
                    </BentoCard>

                    {/* B-3 */}
                    <BentoCard className="md:col-span-2 lg:col-span-2">
                        <FeatureIcon icon={Wrench} />
                        <h3 className="text-[19px] font-bold tracking-[-0.015em] text-jade-950 dark:text-jade-50 mb-2">
                            Maintenance &amp; complaints
                        </h3>
                        <p className="text-sm text-ink-soft dark:text-mist-soft leading-[1.55]">
                            Tenants raise issues from their phone. Assign caretakers, track
                            repairs, close tickets faster.
                        </p>
                    </BentoCard>

                    {/* B-4 SMS */}
                    <BentoCard className="md:col-span-2 lg:col-span-3">
                        <FeatureIcon icon={MessageSquare} />
                        <h3 className="text-[19px] font-bold tracking-[-0.015em] text-jade-950 dark:text-jade-50 mb-2">
                            Auto SMS reminders — in Bangla &amp; English
                        </h3>
                        <p className="text-sm text-ink-soft dark:text-mist-soft leading-[1.55]">
                            Send rent reminders, society notices, gas/water bills, eid greetings
                            — all scheduled, all in your tenants&apos; language.
                        </p>
                        <div className="relative mt-4 bg-jade-50 dark:bg-jade-500/15 rounded-[10px] px-3.5 py-3 font-bangla text-[13px] leading-[1.5] text-jade-950 dark:text-jade-50">
                            <span className="absolute -top-2 left-3.5 bg-jade-800 text-paper font-mono text-[9px] px-1.5 py-0.5 rounded tracking-wider font-semibold">
                                SMS
                            </span>
                            প্রিয় ভাড়াটিয়া, মে মাসের ভাড়া ৳১৮,৫০০ পরিশোধের শেষ তারিখ ১০ই মে। ধন্যবাদ। — রহমান টাওয়ার
                        </div>
                    </BentoCard>

                    {/* B-5 utilities */}
                    <BentoCard className="md:col-span-2 lg:col-span-3">
                        <FeatureIcon icon={LayoutGrid} />
                        <h3 className="text-[19px] font-bold tracking-[-0.015em] text-jade-950 dark:text-jade-50 mb-2">
                            Service charge &amp; utilities, split automatically
                        </h3>
                        <p className="text-sm text-ink-soft dark:text-mist-soft leading-[1.55]">
                            Gas, water, lift, security, generator — split across flats by area,
                            by family, or a flat fee. One click reconciles every bill.
                        </p>
                        <div className="grid grid-cols-5 gap-1 mt-4">
                            {utilities.map((u) => (
                                <div
                                    key={u.name}
                                    className="bg-cream-2 dark:bg-night-2 rounded-md p-2 text-center text-[10px] text-ink-soft dark:text-mist-soft font-semibold"
                                >
                                    {u.name}
                                    <br />
                                    <b className="text-jade-900 dark:text-jade-50 text-xs">{u.amount}</b>
                                </div>
                            ))}
                            <div className="bg-jade-50 dark:bg-jade-500/15 rounded-md p-2 text-center text-[10px] text-jade-700 dark:text-jade-300 font-semibold">
                                Total
                                <br />
                                <b className="text-jade-900 dark:text-jade-50 text-xs">৳1,850</b>
                            </div>
                        </div>
                    </BentoCard>

                    {/* B-6 reports stats */}
                    <div className="md:col-span-4 lg:col-span-6 bg-cream-2 dark:bg-night-2 rounded-[18px] p-8 md:px-9">
                        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-6 items-center">
                            <div>
                                <h3 className="text-[22px] font-bold text-jade-950 dark:text-jade-50 tracking-[-0.015em] mb-1.5">
                                    Reports your accountant will love.
                                </h3>
                                <p className="text-[13px] text-ink-soft dark:text-mist-soft leading-[1.55]">
                                    Monthly income, occupancy, GST/TDS-ready statements. Export to
                                    Excel, PDF, or send straight to your CA.
                                </p>
                            </div>
                            {reportStats.map((s) => (
                                <div key={s.l} className="text-center max-md:text-left">
                                    <div className="text-[28px] font-bold text-jade-800 dark:text-jade-300 tracking-[-0.02em] mb-0.5">
                                        {s.n}
                                    </div>
                                    <div className="text-[11px] text-ink-soft dark:text-mist-soft uppercase tracking-wider font-semibold">
                                        {s.l}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function BentoCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={`bg-paper dark:bg-night-2 border border-rule-soft dark:border-white/10 rounded-[18px] p-7 relative overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(10,46,34,0.15)] ${className ?? ""}`}
        >
            {children}
        </div>
    );
}

function FeatureIcon({ icon: Icon, dark }: { icon: LucideIcon; dark?: boolean }) {
    return (
        <div
            className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-4.5 ${
                dark ? "bg-white/10 text-amber-500" : "bg-jade-50 dark:bg-jade-500/15 text-jade-800 dark:text-jade-300"
            }`}
        >
            <Icon size={22} strokeWidth={1.8} />
        </div>
    );
}
