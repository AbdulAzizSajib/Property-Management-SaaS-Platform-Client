const logos = [
    { name: "Bashundhara Properties", path: "M4 3h16v18H4z M9 8h6 M9 12h6 M9 16h3" },
    { name: "Sheltech Living", path: "M3 21h18 M5 21V9l7-5 7 5v12 M9 21v-6h6v6" },
    { name: "Rangs Estates", path: "M3 21h18 M6 21V8 M18 21V8 M6 8l6-5 6 5 M10 13h4 M10 17h4" },
    {
        name: "Concord Group",
        path: "M3 6h8v15H3z M13 3h8v18h-8z M5 10h4 M5 14h4 M5 18h4 M15 7h4 M15 11h4 M15 15h4",
    },
    { name: "EDISON Real Estate", path: "M3 7l9-4 9 4 M5 7v14h14V7 M9 11h6 M9 15h6" },
];

export default function TrustedCompanies() {
    return (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 text-center border-b border-rule-soft">
            <div className="font-mono text-[11px] text-ink-soft tracking-[0.18em] uppercase mb-7">
                Trusted by 1,200+ landlords across Bangladesh
            </div>
            <div className="flex flex-wrap justify-between items-center gap-8">
                {logos.map((l) => (
                    <div
                        key={l.name}
                        className="flex items-center gap-2.5 font-bold text-[18px] text-ink-soft tracking-tight opacity-70"
                    >
                        <svg
                            className="w-[22px] h-[22px] shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                        >
                            <path d={l.path} />
                        </svg>
                        {l.name}
                    </div>
                ))}
            </div>
        </section>
    );
}
