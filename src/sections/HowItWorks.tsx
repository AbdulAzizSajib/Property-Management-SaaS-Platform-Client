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
        <section className="bg-paper py-24 lg:py-32 border-t border-b border-rule-soft">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8">
                <SectionHead
                    eyebrow="Get started"
                    title={
                        <>
                            From signup to every taka tracked
                            <br />
                            in{" "}
                            <em className="font-serif italic font-normal text-coral-600">
                                under 10 minutes
                            </em>
                        </>
                    }
                    description={"No installer visits. No spreadsheet migrations. No “let me speak to your IT guy.”"}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((s, i) => (
                        <div key={s.title} className="pt-7 relative">
                            <div className="font-mono text-[12px] font-bold text-coral-600 pb-3.5 mb-4.5 border-b border-rule">
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <h4 className="text-[18px] font-bold text-jade-950 tracking-[-0.015em] mb-2.5">
                                {s.title}
                            </h4>
                            <p className="text-sm leading-[1.6] text-ink-soft">{s.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
