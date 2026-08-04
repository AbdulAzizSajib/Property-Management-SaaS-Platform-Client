"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        function onAnchorClick(e: MouseEvent) {
            const anchor = (e.target as HTMLElement).closest("a[href^='#']");
            if (!anchor) return;
            const id = anchor.getAttribute("href")?.slice(1);
            if (!id) return;
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            lenis.scrollTo(target, { offset: -96 });
        }
        document.addEventListener("click", onAnchorClick);

        return () => {
            document.removeEventListener("click", onAnchorClick);
            lenis.destroy();
        };
    }, []);

    return null;
}
