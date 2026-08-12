"use client";

import Image from "next/image";
import { RevealGroup, RevealItem } from "@/src/components/Reveal";

export default function HeroSection() {
  return (
    <section className="relative isolate -mt-20 overflow-hidden pb-16 pt-16 lg:-mt-24 lg:pb-20 lg:pt-20">
      {/* Background — sky/skyline artwork, full-bleed under the navbar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/assets/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover scale-110"
        />
        {/* fade into the page's cream bg at the bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-cream" />
      </div>

      <RevealGroup
        className="relative z-10 mx-auto flex container flex-col items-center px-5 text-center md:px-8"
        stagger={0.1}
      > {/* Headline */}
        <RevealItem>
          <h1 className="mt-24 max-w-4xl text-balance font-bold leading-20 tracking-[-0.02em] text-white text-[42px] [text-shadow:0_2px_24px_rgba(6,31,23,0.35)] sm:text-[58px] lg:text-[72px]">
            Manage your  property{" "}
            <span className=" tracking-[-0.02em] ">
              
              <span className="text-rotate duration-10000 text-sky-1006">
                <span className="justify-items-center mr-4">
                  <span>finances</span>
                  <span>rentals</span>
                  <span>expenses</span>
                  <span>income</span>
                </span>
              </span>
               easily
            </span>
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
            className="group relative overflow-hidden rounded-[10px] bg-sky-950 px-6 py-3.5 text-[15px] font-semibold text-paper shadow-[0_1px_0_0_rgba(255,255,255,0.16)_inset,0_14px_34px_-10px_rgba(6,31,23,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_20px_40px_-12px_rgba(6,31,23,0.6)]"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Try Bariyan Now
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
            className="group inline-flex items-center gap-2.5 rounded-[10px] border border-white/20 bg-white/10 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/16"
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
          <div className="aura aura-gold p-1 border rounded-2xl border-white/25 bg-white/10  backdrop-blur-xl">
          <div className="card overflow-hidden rounded-2xl border border-white/25 bg-white/10  backdrop-blur-xl">
            {/* window chrome */}
            <div className="flex items-center gap-1.5 border-b border-white/15 bg-white/5 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
              <span className="ml-3 rounded-full bg-white/20 px-3 py-1 text-[11px] text-sky-950 tracking-wider">
                https://bariyan.com/owner/dashboard
              </span>
            </div>

            <Image
              src="/assets/banner.webp"
              alt="Bariyan dashboard — collection pulse, buildings, units, and occupancy at a glance"
              width={194}
              height={899}
              priority
              className="h-auto w-full"
            />
          </div>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
