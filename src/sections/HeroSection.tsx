"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, CirclePlay } from "lucide-react";
import { RevealGroup, RevealItem } from "@/src/components/Reveal";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgYRaw = useTransform(heroScrollProgress, [0, 1], ["0%", "-18%"]);
  const bgY = prefersReducedMotion ? "0%" : bgYRaw;

  const { scrollYProgress: previewScrollProgress } = useScroll({
    target: previewRef,
    offset: ["start end", "end center"],
  });
  const previewScaleRaw = useTransform(previewScrollProgress, [0, 1], [0.6, 1.04]);
  const previewScale = prefersReducedMotion ? 1 : previewScaleRaw;

  return (
    <section
      ref={sectionRef}
      className="relative isolate -mt-20 overflow-hidden pb-16 pt-16 lg:-mt-24 lg:pb-20 lg:pt-20"
    >
      {/* Background — sky/flower-field artwork, parallax-reveals within the hero only */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div className="absolute inset-x-0 top-[-12%] h-[130%]" style={{ y: bgY }}>
          <Image
            src="/assets/hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-bottom "
          />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-cream" />
      </div>

      <RevealGroup
        className="relative z-10 mx-auto flex container flex-col items-center px-5 text-center md:px-8"
        stagger={0.1}
      >
        {/* Headline */}
        <RevealItem>
          <h1 className="mt-24 max-w-4xl space-grotesk text-balance text-[42px] font-bold leading-[1.08] tracking-[-0.02em] text-paper sm:text-[58px] sm:leading-[1.05] lg:text-[72px] lg:leading-[1.03]">
            Manage your property{" "}
            <span>
              <span className="mr-4 text-paper">finances</span>
              easily
            </span>
          </h1>
        </RevealItem>

        {/* Sub-headline */}
        <RevealItem>
          <p className="mt-6 max-w-sm text-[17px] leading-[1.65] text-paper/80">
            Smartly manage your properties, tenants, and finances in one place. Get real-time insights and stay in control.
          </p>
        </RevealItem>

        {/* CTAs */}
        <RevealItem className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="group relative overflow-hidden rounded-full bg-zinc-900 py-2 pr-2 pl-4 text-[15px] font-semibold text-paper shadow-[0_1px_0_0_rgba(255,255,255,0.16)_inset,0_14px_34px_-10px_rgba(6,31,23,0.55)] transition-all duration-200 hover:-translate-y-0.5  hover:shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_20px_40px_-12px_rgba(6,31,23,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-sky-950"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Get started now
              <ArrowRight
                className="rounded-full bg-paper p-1 text-sky-950 transition-transform duration-200 group-hover:translate-x-0.5"
                size={22}
                strokeWidth={2}
              />
            </span>
          </button>

          <button
            type="button"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white px-4 py-2 text-[15px] font-semibold text-ink shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] backdrop-blur-md transition-colors hover:border-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-950 focus-visible:ring-offset-2"
          >
            <CirclePlay
              className="text-sky-950/70 transition-transform group-hover:scale-110"
              size={20}
              strokeWidth={1.6}
            />
            Watch the 90-second demo
          </button>
        </RevealItem>

        {/* Product preview screenshot */}
        <RevealItem className="mt-10 w-full max-w-7xl">
          <div ref={previewRef}>
            <motion.div style={{ scale: previewScale, transformOrigin: "top center" }}>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-2 shadow-[0_40px_80px_-28px_rgba(10,46,34,0.45),0_16px_40px_-16px_rgba(10,46,34,0.3)] backdrop-blur-sm">
                <div className="overflow-hidden rounded-2xl bg-paper">
                  <div className="flex items-center gap-2 border-b border-rule-soft bg-cream px-3.5 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f9beb2]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#fadea2]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#b4ddc5]" />
                    <span className="ml-3 inline-flex max-w-65 flex-1 items-center gap-1.5 rounded-md border border-rule-soft bg-paper px-3 py-1 font-mono text-[11px] text-ink-soft">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                        <path
                          d="M3 4.5V3a2 2 0 114 0v1.5M2.5 4.5h5v4h-5v-4z"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      bariyan.com/owner/dashboard
                    </span>
                  </div>

                  <Image
                    src="/assets/banner.webp"
                    alt="Bariyan dashboard — collection pulse, buildings, units, and occupancy at a glance"
                    width={1894}
                    height={899}
                    priority
                    sizes="(min-width: 1024px) 80vw, 100vw"
                    className="block h-auto w-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
