import SectionHead from "@/src/components/SectionHead";

type Provider = {
    key: string;
    label: string;
    name: string;
    desc: string;
    badgeFrom: string;
    badgeTo: string;
    hoverBorder: string;
};

const providers: Provider[] = [
    {
        key: "bkash",
        label: "bKash",
        name: "bKash",
        desc: "Direct merchant integration · 1.5% MDR",
        badgeFrom: "from-bkash",
        badgeTo: "to-[#c01060]",
        hoverBorder: "hover:border-bkash",
    },
    {
        key: "nagad",
        label: "Nagad",
        name: "Nagad",
        desc: "Personal & merchant accounts · 1.4% MDR",
        badgeFrom: "from-[#f37021]",
        badgeTo: "to-nagad",
        hoverBorder: "hover:border-nagad",
    },
    {
        key: "rocket",
        label: "Rocket",
        name: "Rocket",
        desc: "DBBL Mobile Banking · 1.8% MDR",
        badgeFrom: "from-rocket",
        badgeTo: "to-[#5e1f6b]",
        hoverBorder: "hover:border-rocket",
    },
    {
        key: "upay",
        label: "upay",
        name: "Upay",
        desc: "UCB Mobile Wallet · 1.6% MDR",
        badgeFrom: "from-[#f99800]",
        badgeTo: "to-upay",
        hoverBorder: "hover:border-upay",
    },
    {
        key: "bank",
        label: "Bank",
        name: "City Bank",
        desc: "Direct bank settlement · T+1",
        badgeFrom: "from-[#1e7bcb]",
        badgeTo: "to-citybank",
        hoverBorder: "hover:border-citybank",
    },
    {
        key: "sms",
        label: "SMS",
        name: "SMS Gateway BD",
        desc: "Bangla & English SMS · ৳0.40 each",
        badgeFrom: "from-jade-700",
        badgeTo: "to-jade-900",
        hoverBorder: "hover:border-jade-700",
    },
];

export default function IntegrationsSection() {
    return (
        <section id="integrations" className="py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-5 md:px-8">
                <SectionHead
                    eyebrow="Native integrations"
                    title={
                        <>
                            Built for the way
                            <br />
                            Bangladesh{" "}
                            <em className="font-serif italic font-normal text-coral-600">
                                pays
                            </em>
                        </>
                    }
                    description="Every mobile wallet, every major bank, every SMS gateway your tenants already use — connected on day one. No middlemen, no extra fees."
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                    {providers.map((p) => (
                        <div
                            key={p.key}
                            className={`bg-paper border border-rule-soft rounded-[14px] px-4.5 py-6 text-center transition hover:-translate-y-1 ${p.hoverBorder}`}
                        >
                            <div
                                className={`w-14 h-14 mx-auto mb-3.5 rounded-[14px] flex items-center justify-center text-white font-extrabold text-[11px] tracking-tighter shadow-[0_6px_20px_-6px_rgba(0,0,0,0.2)] bg-gradient-to-br ${p.badgeFrom} ${p.badgeTo}`}
                            >
                                {p.label}
                            </div>
                            <div className="font-bold text-[15px] text-jade-950 tracking-tight mb-1">
                                {p.name}
                            </div>
                            <div className="text-[11.5px] text-ink-soft leading-[1.4]">{p.desc}</div>
                            <div className="inline-flex items-center gap-1.5 mt-2.5 bg-jade-50 text-jade-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-jade-500" />
                                Live
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
