import SectionHead from "@/src/components/SectionHead";

const steps = [
    {
        title: "Sign up with your number",
        text: "Verify with an OTP to your bKash-linked mobile. Add your building's NOC and trade license — we do the rest.",
    },
    {
        title: "Add flats & tenants",
        text: "Import from your existing rent register, or punch in flats in under a minute each. NID-verify tenants from your phone camera.",
    },
    {
        title: "Connect bKash/Nagad",
        text: "Link your merchant account or personal wallet. Auto-generate tenant payment links — share over WhatsApp, IMO, or SMS.",
    },
    {
        title: "Sit back. Collect rent.",
        text: "Tenants pay with a tap. You get notified. SMS reminders auto-send the 1st and 5th. Your bank deposits 24h later.",
    },
];

export default function HowItWorks() {
    return (
        <section className="bg-paper py-24 lg:py-32 border-t border-b border-rule-soft">
            <div className="container mx-auto px-5 md:px-8">
                <SectionHead
                    eyebrow="Get started"
                    title={
                        <>
                            From signup to first rent collected
                            <br />
                            in{" "}
                            <em className="font-serif italic font-normal text-coral-600">
                                under 24 hours
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
