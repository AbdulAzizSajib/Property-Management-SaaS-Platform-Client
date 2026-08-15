"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RevealGroup, RevealItem } from "@/src/components/Reveal";
import { Icon } from "@iconify/react";

const rotatingWords = ["finances", "rentals", "expenses", "income"];
// Widest word reserves the rotating slot's width so swapping words never
// changes the h1's line width/height — see the grid-stack trick below.
const longestRotatingWord = rotatingWords.reduce((a, b) => (b.length > a.length ? b : a));

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const prefersReducedMotion = useReducedMotion();

  // Background parallax: confined to the hero section (never fixed to the
  // whole page). The image is rendered taller than its clipped window and
  // translated upward as the hero scrolls, so more of the tall photo (sky
  // → flower field) is revealed — no scaling, just a vertical reveal.
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgYRaw = useTransform(heroScrollProgress, [0, 1], ["0%", "-18%"]);
  const bgY = prefersReducedMotion ? "0%" : bgYRaw;

  // Product preview screenshot: scales up in place as it scrolls into view.
  // Tracked against the screenshot's own element (not the whole tall hero
  // section) so the growth stays in sync with when it's actually visible —
  // progress 0 as it enters from the bottom of the viewport, progress 1 once
  // it's mostly scrolled past center. The range is deliberately wider than
  // "start end" -> "center center" (its own height + ~half the viewport more)
  // so that with Lenis's eased smooth-scroll, a light/brief scroll input only
  // covers a small fraction of it instead of visibly swinging the whole scale.
  const { scrollYProgress: previewScrollProgress } = useScroll({
    target: previewRef,
    offset: ["start end", "end center"],
  });
  const previewScaleRaw = useTransform(previewScrollProgress, [0, 1], [0.6, 1.15]);
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
              {/* Grid-stack: an invisible copy of the widest word reserves this
                  slot's size, so swapping the visible word never resizes the
                  h1 — a resize here would cascade into a layout shift that
                  retriggers scroll-linked animations further down the page
                  (e.g. the product preview's scale). */}
              <span className="relative mr-4 inline-grid align-baseline text-left">
                <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
                  {longestRotatingWord}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="col-start-1 row-start-1 inline-block whitespace-nowrap text-sky-900"
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
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
          {/* Scroll tracking lives on this OUTER, never-transformed wrapper.
              The scale itself is applied one level down. If both were on the
              same element, getBoundingClientRect() (which reflects the live
              CSS transform) would feed the already-scaled rect back into the
              scroll-progress calculation — scale grows -> rect grows -> scale
              recalculated -> rect changes again -> repeat, i.e. a feedback
              loop that looks like it's endlessly shrinking/growing on its own. */}
          <div ref={previewRef}>
            <motion.div style={{ scale: previewScale, transformOrigin: "top center" }}>
              {/* daisyUI's `.aura` glow runs a 6s-infinite CSS animation that
                  also drives `transform` (a repaint-forcing hack, see its
                  `@keyframes aura`). A running CSS animation always wins the
                  cascade over an inline style, so if it lived on the same
                  element as the scale above, the browser would keep
                  interpolating between the two competing `transform`s every
                  6s — which bleeds into the scale and looks like it's
                  auto-zooming in and out on a loop, independent of scroll.
                  Keeping `.aura` one level down avoids that collision. */}
              <div className="aura aura-gold text-orange-500 aura-xl p-1 border rounded-3xl">
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
