import type { ReactNode } from "react";

type Props = {
    eyebrow: string;
    title: ReactNode;
    description?: ReactNode;
    light?: boolean;
};

export default function SectionHead({ eyebrow, title, description, light }: Props) {
    return (
        <div className="text-center mb-16">
            <div
                className={`inline-block font-mono text-[11px] uppercase tracking-[0.2em] mb-4 ${
                    light ? "text-amber-500" : "text-coral-600"
                }`}
            >
                — {eyebrow}
            </div>
            <h2
                className={`font-bold tracking-[-0.03em] leading-[1.05] mb-4 text-balance text-[36px] md:text-[44px] lg:text-[56px] ${
                    light ? "text-paper" : "text-jade-950"
                }`}
            >
                {title}
            </h2>
            {description && (
                <p
                    className={`text-[17px] leading-[1.55] max-w-[580px] mx-auto text-pretty ${
                        light ? "text-white/60" : "text-ink-soft"
                    }`}
                >
                    {description}
                </p>
            )}
        </div>
    );
}
