"use client";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Dashboard", href: "#product" },
  { name: "Integrations", href: "#integrations", pill: "6 New" },
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
    <div className="sticky top-0 z-50 bg-cream/85 backdrop-blur-md border-b border-rule-soft">
      <nav className="max-w-7xl mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-14 py-4 px-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-jade-900 text-4xl  font-rubita "
        >
          <img className="w-28 h-full" src="/logoB.png" alt="Bariyan Logo" />
        </Link>

        <div className="hidden lg:flex justify-center gap-8 text-[14.5px] text-ink-soft font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative py-2 hover:text-jade-900 transition-colors"
            >
              {link.name}
              {link.pill && (
                <span className="ml-1.5 align-middle bg-coral-100 text-coral-600 font-bold uppercase tracking-wider text-[9.5px] px-1.5 py-0.5 rounded">
                  {link.pill}
                </span>
              )}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center text-jade-900 hover:bg-cream-2 transition px-4 py-2.5 rounded-lg text-sm font-semibold"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="hidden sm:inline-flex items-center gap-2 bg-jade-800 hover:bg-jade-900 transition text-paper px-4 py-2.5 rounded-lg text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.3),0_4px_12px_rgba(13,79,63,0.18)] hover:-translate-y-0.5"
          >
            Start free trial
            <span className="font-mono">→</span>
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpenMobileMenu((s) => !s)}
            className="lg:hidden text-jade-900"
          >
            {openMobileMenu ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {openMobileMenu && (
        <div className="lg:hidden border-t border-rule-soft bg-cream px-5 py-5 flex flex-col gap-2 text-jade-900 font-medium">
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
            className="mt-2 inline-flex items-center justify-center bg-jade-800 text-paper px-4 py-2.5 rounded-lg sm:hidden"
          >
            Start free trial →
          </Link>
        </div>
      )}
    </div>
  );
}
