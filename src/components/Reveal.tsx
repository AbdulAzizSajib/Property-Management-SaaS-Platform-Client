"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    once?: boolean;
};

const base: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function Reveal({ children, className, delay = 0, y = 24, once = true }: Props) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount: 0.2 }}
            variants={{
                hidden: { opacity: 0, y },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function RevealGroup({
    children,
    className,
    stagger = 0.08,
    once = true,
}: {
    children: ReactNode;
    className?: string;
    stagger?: number;
    once?: boolean;
}) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount: 0.2 }}
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: stagger },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function RevealItem({
    children,
    className,
    y = 20,
}: {
    children: ReactNode;
    className?: string;
    y?: number;
}) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export { base as revealVariants };
