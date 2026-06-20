"use client";

import { useTranslations } from "next-intl";
import DashboardMockup from "./hero/DashboardMockup";

export default function HeroSection() {
  const t = useTranslations("Hero");
  const chips = t.raw("chips") as string[];

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20">
      {/* Background — soft jade aura + faint grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -right-1/4 top-0 h-170 w-170 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(31,152,118,0.16), transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(13,79,63,1) 1px, transparent 1px), linear-gradient(90deg, rgba(13,79,63,1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 20% 30%, black, transparent 75%)",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 20% 30%, black, transparent 75%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid container grid-cols-1 items-center gap-y-14 px-5 md:px-8 lg:grid-cols-[0.85fr_1.3fr] lg:gap-x-6">
        {/* ── Left: copy ── */}
        <div>
          {/* Eyebrow pill */}
          <a
            href="#report"
            className="group inline-flex items-center gap-2.5 rounded-full border border-rule-soft dark:border-white/10 bg-cream/80 dark:bg-night-2/80 py-1.5 pl-3.5 pr-1.5 text-[12.5px] text-ink-soft dark:text-mist-soft backdrop-blur transition-colors hover:border-jade-700/30"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-coral-600 opacity-60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-coral-600" />
            </span>
            <span className="capitalize">{t("eyebrow")}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-jade-900 px-2.5 py-1 text-[12px] font-semibold text-paper transition-colors group-hover:bg-jade-950">
              {t("pillCta")}
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </a>

          {/* Headline */}
          <h1 className="mt-7 text-balance font-bold leading-[0.98] tracking-[-0.04em] text-jade-900 dark:text-jade-50 text-[48px] sm:text-[66px] lg:text-[78px]">
            {t.rich("headline", {
              prop: (c) => (
                <span className="text-jade-700 dark:text-jade-300">{c}</span>
              ),
              fin: (c) => <span className="text-coral-600">{c}</span>,
              em: (c) => (
                <span className="font-serif font-normal italic tracking-[-0.02em]">
                  {c}
                </span>
              ),
              dot: (c) => <span className="text-coral-600">{c}</span>,
            })}
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 capitalize  text-[15px] leading-[1.6] text-ink-soft dark:text-mist-soft">
            {t("subhead")}
          </p>

          {/* Inline feature list */}
          <ul className="mt-6 max-w-sm flex flex-wrap gap-x-5 gap-y-2">
            {chips.map((c) => (
              <li
                key={c}
                className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink dark:text-mist capitalize"
              >
                <CheckIcon />
                <span>{c}</span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="group relative rounded-[10px] bg-jade-900 dark:bg-jade-700 px-6 py-3.5 text-[15px] font-semibold text-paper transition-all duration-200 hover:bg-jade-950 dark:hover:bg-jade-500 hover:shadow-[0_10px_30px_-10px_rgba(13,79,63,0.5)]"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {t("ctaPrimary")}
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
              className="group inline-flex items-center gap-2.5 rounded-[10px] px-5 py-3.5 text-[15px] font-semibold text-jade-900 dark:text-jade-50 transition-colors hover:text-coral-600"
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
                  opacity="0.35"
                />
                <path d="M8.5 7l4 3-4 3V7z" fill="currentColor" />
              </svg>
              {t("ctaSecondary")}
            </button>
          </div>

         

          {/* Stats */}
          <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-rule-soft dark:border-white/10 pt-6">
            {/* {stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))} */}

             {/* Honest early-stage line */}
          <p className="mt-0 inline-flex items-center gap-2 text-[13px] text-ink-soft dark:text-mist-soft">
            <span className="inline-flex h-4 items-center rounded-full bg-coral-100 px-2 text-[10px] font-semibold uppercase tracking-wider text-coral-600">
              {t("earlyBadge")}
            </span>
            {t("earlyText")}
          </p>
          </div>
        </div>

        {/* ── Right: angled product shot, bleeding off the edge ── */}
        <div className="relative" style={{ perspective: "1800px" }}>
          <div
            className="relative origin-left border-2 border-rule-soft dark:border-white/10 transition-transform duration-500 lg:-mr-4 xl:-mr-8 lg:scale-[1.06]"
            style={{
              transform: "rotateY(-12deg) rotateX(6deg) rotateZ(0.5deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Animated beam light traveling around the border */}
            <div className="pointer-events-none absolute -inset-0.5 overflow-hidden ">
              <div
                className="absolute left-1/2 top-1/2 aspect-square w-[180%] animate-beam-spin"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg 230deg, var(--color-jade-500) 300deg, #ffe2d4 335deg, var(--color-coral-500) 350deg, transparent 360deg)",
                }}
              />
            </div>
            <DashboardMockup />
          </div>
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
