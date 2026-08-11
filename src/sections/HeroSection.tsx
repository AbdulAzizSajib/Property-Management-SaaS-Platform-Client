"use client";

import Image from "next/image";
import NeatBackground from "@/src/components/NeatBackground";
import { RevealGroup, RevealItem } from "@/src/components/Reveal";

export default function HeroSection() {
  return (
    <section className="relative isolate -mt-20 overflow-hidden pb-16 pt-40 lg:-mt-24 lg:pb-20 lg:pt-52">
      {/* Background — animated gradient, full-bleed under the navbar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <NeatBackground className="h-full w-full dark:opacity-40" />
      </div>

      <RevealGroup
        className="relative z-10 mx-auto flex container flex-col items-center px-5 text-center md:px-8"
        stagger={0.1}
      >
        {/* Eyebrow pill */}
        <RevealItem>
          <a
            href="#report"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 py-1.5 pl-3.5 pr-1.5 text-[12.5px] text-white/90 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_24px_-12px_rgba(6,31,23,0.5)] backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/[0.14]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-amber-500 opacity-60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="capitalize">Built for Bangladeshi Land Owners</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-1 text-[12px] font-semibold text-paper shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset] transition-colors group-hover:bg-jade-900">
              Read the data
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </a>
        </RevealItem>

        {/* Headline */}
        <RevealItem>
          <h1 className="mt-7 max-w-4xl text-balance font-bold leading-[1.05] tracking-[-0.02em] text-white text-[42px] [text-shadow:0_2px_24px_rgba(6,31,23,0.35)] sm:text-[58px] lg:text-[72px]">
            Manage your property{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-cream">
              finances
            </span>{" "}
            easily.
          </h1>
        </RevealItem>

        {/* Sub-headline */}
        <RevealItem>
          <p className="mt-6 max-w-xl text-[16px] leading-[1.65] text-white/85 [text-shadow:0_1px_12px_rgba(6,31,23,0.25)]">
            Smartly manage your property, tenants, and finances in one place —
            rent collection, bills, and reports, without the spreadsheet chaos.
          </p>
        </RevealItem>

        {/* CTAs */}
        <RevealItem className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="group relative overflow-hidden rounded-[10px] bg-jade-950 px-6 py-3.5 text-[15px] font-semibold text-paper shadow-[0_1px_0_0_rgba(255,255,255,0.16)_inset,0_14px_34px_-10px_rgba(6,31,23,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_20px_40px_-12px_rgba(6,31,23,0.6)]"
          >
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent" />
            <span className="relative z-10 inline-flex items-center gap-2">
              Get Started Free
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path
                  d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          <button
            type="button"
            className="group inline-flex items-center gap-2.5 rounded-[10px] border border-white/20 bg-white/10 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/[0.16]"
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
        <RevealItem className="mt-10 w-full max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_30px_70px_-20px_rgba(6,31,23,0.55)] backdrop-blur-xl">
            {/* window chrome */}
            <div className="flex items-center gap-1.5 border-b border-white/15 bg-white/5 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="ml-3 rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/60">
                app.bariyan.com/dashboard
              </span>
            </div>

            <Image
              src="/assets/banner.webp"
              alt="Bariyan dashboard — collection pulse, buildings, units, and occupancy at a glance"
              width={1894}
              height={899}
              priority
              className="h-auto w-full"
            />
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
