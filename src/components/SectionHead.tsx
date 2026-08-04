"use client";

import Reveal from "@/src/components/Reveal";
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
            <Reveal>
                <div
                    className={`inline-block font-mono text-[11px] uppercase tracking-[0.2em] mb-4 ${
                        light ? "text-amber-500" : "text-coral-600"
                    }`}
                >
                    — {eyebrow}
                </div>
            </Reveal>
            <Reveal delay={0.08}>
                <h2
                    className={`font-bold tracking-[-0.03em] leading-[1.05] mb-4 text-balance text-[36px] md:text-[44px] lg:text-[56px] ${
                        light ? "text-paper" : "text-jade-950 dark:text-jade-50"
                    }`}
                >
                    {title}
                </h2>
            </Reveal>
            {description && (
                <Reveal delay={0.16}>
                    <p
                        className={`text-[17px] leading-[1.55] max-w-[580px] mx-auto text-pretty ${
                            light ? "text-white/60" : "text-ink-soft dark:text-mist-soft"
                        }`}
                    >
                        {description}
                    </p>
                </Reveal>
            )}
        </div>
    );
}
