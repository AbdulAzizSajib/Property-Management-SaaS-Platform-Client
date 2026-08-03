"use client";

import { Banknote, FileCheck2, Users } from "lucide-react";
import Image from "next/image";

const chips = [
  "Rent & dues tracking",
  "Bills & invoices",
  "Income & expenses",
  "One-click reports",
];

const avatars = ["bg-jade-500", "bg-coral-500", "bg-amber-500", "bg-jade-800"];

const stats = [
  { icon: Banknote, value: "৳4,82,000", label: "Collected this month" },
  { icon: Users, value: "42", label: "Active tenants" },
  { icon: FileCheck2, value: "100%", label: "Auto-generated receipts" },
];

export default function HeroSection() {
  return (
    <section className="relative isolate -mt-20 overflow-hidden pb-24 pt-40 lg:-mt-24 lg:pb-32 lg:pt-52">
      {/* Background — illustrated skyline, full-bleed under the navbar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/assets/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top dark:opacity-40"
        />
      </div>

      <div className="relative z-10 mx-auto flex container flex-col items-center px-5 text-center md:px-8">
        {/* Eyebrow pill */}
        <a
          href="#report"
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/15 py-1.5 pl-3.5 pr-1.5 text-[12.5px] text-white backdrop-blur transition-colors hover:border-white/50"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-coral-500 opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-coral-500" />
          </span>
          <span className="capitalize">Built for Bangladeshi Land Owners</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-jade-900 px-2.5 py-1 text-[12px] font-semibold text-paper transition-colors group-hover:bg-jade-950">
            Read the data
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </a>

        {/* Headline */}
        <h1 className="mt-7 max-w-4xl text-balance font-bold leading-[1.05] text-white text-[42px] drop-shadow-[0_2px_20px_rgba(10,46,34,0.25)] sm:text-[58px] lg:text-[72px]">
          Manage your <span className="text-jade-200">property</span>{" "}
          <span className="text-coral-400">finances</span>{" "}
          <span className="font-serif font-normal italic tracking-[-0.02em]">
            easily
          </span>
          <span className="text-coral-400">.</span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 max-w-xl text-[16px] leading-[1.65] text-white/85">
          Smartly manage your property, tenants, and finances in one place —
          rent collection, bills, and reports, without the spreadsheet chaos.
        </p>

        {/* Inline feature list */}
        <ul className="mt-7 flex max-w-xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {chips.map((c) => (
            <li
              key={c}
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white"
            >
              <CheckIcon className="text-jade-300" />
              <span>{c}</span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="group relative rounded-[10px] bg-jade-900 dark:bg-jade-700 px-6 py-3.5 text-[15px] font-semibold text-paper transition-all duration-200 hover:bg-jade-950 dark:hover:bg-jade-500 hover:shadow-[0_10px_30px_-10px_rgba(13,79,63,0.5)]"
          >
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
            className="group inline-flex items-center gap-2.5 rounded-[10px] px-5 py-3.5 text-[15px] font-semibold text-white transition-colors hover:text-coral-300"
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
                opacity="0.6"
              />
              <path d="M8.5 7l4 3-4 3V7z" fill="currentColor" />
            </svg>
            Watch the 90-second demo
          </button>
        </div>

        {/* Social proof */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex items-center -space-x-2">
            {avatars.map((c, i) => (
              <span
                key={i}
                className={`h-8 w-8 rounded-full ring-2 ring-white/70 ${c}`}
              />
            ))}
          </div>
          <p className="inline-flex flex-wrap items-center justify-center gap-2 text-[13px] text-white/85">
            <span className="inline-flex h-4.5 items-center rounded-full bg-coral-500 px-2 text-[10px] font-semibold uppercase tracking-wider text-white">
              Early access
            </span>
            Be one of the first landlords — free, no card required.
          </p>
        </div>

        {/* Stat strip */}
        <div className="mt-16 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-white/25 bg-white/15 px-4 py-3.5 text-left backdrop-blur-md"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/20 text-white">
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <div>
                <div className="text-[15px] font-bold text-white">
                  {value}
                </div>
                <div className="text-[11.5px] text-white/75">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CheckIcon({ className = "text-jade-500 dark:text-jade-400" }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M2.5 6.5l2.5 2.5 5.5-5.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
