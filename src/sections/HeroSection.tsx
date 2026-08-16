"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RevealGroup, RevealItem } from "@/src/components/Reveal";
import { Icon } from "@iconify/react";

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
            src="/assets/h2.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-top "
          />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-cream" />
      </div>

      <RevealGroup
        className="relative z-10 mx-auto flex container flex-col items-center px-5 text-center md:px-8"
        stagger={0.1}
      > {/* Headline */}
        <RevealItem>
          <h1 className="mt-24 space-grotesk max-w-4xl text-balance font-bold leading-20 tracking-[-0.02em] text-[#1d1d1d] text-[42px] sm:text-[58px] lg:text-[72px]">
            Manage your  property{" "}
            <span className="">
              <span className="mr-4 text-black">finances</span>
              easily
            </span>
          </h1>
        </RevealItem>

        {/* Sub-headline */}
        <RevealItem>
          <p className="mt-6 max-w-sm text-[16px] leading-[1.65] text-[#4D585F] [text-shadow:0_1px_12px_rgba(6,31,23,0.25)]">
           Smartly manage your properties, tenants, and finances in one place. Get real-time insights and stay in control.
          </p>
        </RevealItem>

        {/* CTAs */}
        <RevealItem className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="group relative overflow-hidden rounded-full bg-sky-950 pr-2 pl-4 py-2 text-[15px] font-semibold text-paper shadow-[0_1px_0_0_rgba(255,255,255,0.16)_inset,0_14px_34px_-10px_rgba(6,31,23,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_20px_40px_-12px_rgba(6,31,23,0.6)]"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Get started now
                 <Icon className="text-lg  p-0.5 bg-white rounded-full text-stone-600" icon="mdi-light:arrow-right" />
            </span>
          </button>

          <button
            type="button"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white px-4 py-2 text-[15px] font-semibold text-black shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/16"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="transition-transform group-hover:scale-110"
            >
              <circle
                cx="10"
                cy="10"
                r="9.25"
                stroke="currentColor"
                strokeWidth="1.3"
                opacity="0.7"
              />
              <path d="M8.5 7l4 3-4 3V7z" fill="currentColor" />
            </svg>
            Watch the 90-second demo
          </button>
        </RevealItem>

        {/* Product preview screenshot */}
        <RevealItem className="mt-10 w-full max-w-7xl">
         
          <div ref={previewRef}>
            <motion.div style={{ scale: previewScale, transformOrigin: "top center" }}>
             
              <div className="p-2  border-2 rounded-3xl">
                <div className="mockup-browser overflow-hidden rounded-2xl  bg-white backdrop-blur-xl">
                  <div className="mockup-browser-toolbar before:opacity-100! before:shadow-[1.4em_0_#fca5a5,2.8em_0_#fde047,4.2em_0_#86efac]!">
                    <div className="input bg-stone-100 rounded-full py-1.5 text-[11px] text-sky-950 tracking-wider">
                      https://bariyan.com/owner/dashboard
                    </div>
                  </div>

                  <Image
                    src="/assets/banner.webp"
                    alt="Bariyan dashboard — collection pulse, buildings, units, and occupancy at a glance"
                    width={194}
                    height={899}
                    priority
                    className="h-auto w-full border-t border-sky-950/10 "
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
