"use client";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Dashboard", href: "#product" },
  { name: "How it Works", href: "#howitworks" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  useEffect(() => {
    if (openMobileMenu) {
      document.body.classList.add("max-md:overflow-hidden");
    } else {
      document.body.classList.remove("max-md:overflow-hidden");
    }
  }, [openMobileMenu]);

  return (
    <div className="sticky top-4 z-50 px-4 will-change-transform ">
      <div className="mx-auto flex w-fit max-w-full items-center gap-6">
        
        <nav className="flex w-fit max-w-full items-center gap-10 rounded-[10px] border border-white/20  bg-white/10 backdrop-blur-md py-2 pl-5 pr-2  dark:border-white/10 dark:bg-night-2 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]  transition-colors ">
        <Link
          href="/"
          className="flex shrink-0  items-center text-2xl font-bold tracking-tight relative gap-2"
        > 
          <svg
            viewBox="0 0 216 177"
            fill="none"
            aria-hidden="true"
            className="h-8 w-auto text-sky-500 dark:text-sky-400"
          >
            <path d="M0 0H215L126 88V176H0V0Z" fill="currentColor" />
            <rect x="176" y="100" width="39" height="50" fill="currentColor" />
          </svg>
          <h2
            className="z-10 font-black text-white wordmark text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px]"
          >
            Bariyan
          </h2>
        </Link>

          <div className="hidden lg:flex items-center gap-6 whitespace-nowrap text-[13.5px] font-medium text-white dark:text-mist-soft">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative py-2 transition-colors hover:text-sky-900 dark:hover:text-sky-50"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {/* <ModeToggle /> */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center whitespace-nowrap text-ink transition px-3.5 py-2 rounded-[10px] text-[13.5px] font-semibold hover:bg-sky-950/5 dark:text-mist dark:hover:bg-white/10"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center gap-2 whitespace-nowrap bg-zinc-800 hover:bg-sky-950 transition text-paper px-4 py-2 rounded-[10px] text-[13.5px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(13,79,63,0.25)] hover:-translate-y-0.5"
            >
              Get Started Free
              <span className="font-mono">→</span>
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpenMobileMenu((s) => !s)}
              className="lg:hidden text-ink px-1.5 dark:text-mist"
            >
              {openMobileMenu ? <XIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {openMobileMenu && (
        <div className="lg:hidden mt-2 rounded-2xl border border-rule-soft bg-paper px-5 py-5 flex flex-col gap-2 text-ink font-medium dark:border-white/10 dark:bg-night-2 dark:text-mist">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setOpenMobileMenu(false)}
              className="py-2"
            >
              {link.name}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setOpenMobileMenu(false)}
            className="py-2 sm:hidden"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            onClick={() => setOpenMobileMenu(false)}
            className="mt-2 inline-flex items-center justify-center bg-sky-800 dark:bg-sky-700 dark:hover:bg-sky-500 text-paper px-4 py-2.5 rounded-lg sm:hidden"
          >
            Start free trial →
          </Link>
        </div>
      )}
    </div>
  );
}
