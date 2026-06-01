"use client";

// src/components/dashboard/AdminSidebar.tsx
//
// Sidebar for SUPER_ADMIN / ADMIN — the SaaS platform operators.
// Mirrors OwnerSidebar's structure and visual language (jade rail,
// coral active accent, cream surfaces), but swaps the landlord
// workspace context for a platform/console framing.

import { getIconComponent } from "@/src/lib/iconMapper";
import { adminNavItems, getCommonNavItems } from "@/src/lib/navItems";
import { cn } from "@/src/lib/utils";
import { LifeBuoy, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const commonItems = getCommonNavItems("SUPER_ADMIN");
const sections = [...commonItems, ...adminNavItems];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const activeHref = sections
    .flatMap((s) => s.items.map((i) => i.href))
    .filter((href) => pathname === href || pathname.startsWith(href + "/"))
    .reduce(
      (longest, href) => (href.length > longest.length ? href : longest),
      "",
    );

  return (
    <aside className="relative flex h-full w-64 flex-col border-r border-rule-soft bg-paper">
      {/* Thin jade rail — the dark accent that keeps this from blurring into the page */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px] bg-jade-900"
      />

      {/* Brand header */}
      <div className="flex h-16 items-center gap-2.5 border-b border-rule-soft pl-6 pr-4">
        <div className="flex flex-col leading-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-28" src="/logoB.png" alt="Bariyan" />
          <span className="font-bangla text-[10.5px] text-ink-soft">
            অ্যাডমিন কনসোল
          </span>
        </div>
      </div>

      {/* Platform context strip */}
      <Link
        href="/admin/dashboard"
        className="group flex items-center justify-between border-b border-rule-soft px-4 py-2.5 hover:bg-cream/60 transition-colors"
      >
        <div className="min-w-0">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft/75">
            Platform
          </p>
          <p className="truncate text-[13px] font-semibold text-ink">
            Bariyan SaaS
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-jade-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-jade-800">
          <ShieldCheck size={11} className="text-jade-700" />
          Super
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin] [scrollbar-color:var(--color-rule)_transparent]">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-5 last:mb-0">
            {section.title && (
              <p className="px-2.5 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft/70">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon ? getIconComponent(item.icon) : null;
                const isActive = item.href === activeHref;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-md py-2 pl-3 pr-2.5 text-[13.5px] font-medium transition-colors",
                        isActive
                          ? "bg-jade-50 text-jade-950"
                          : "text-ink-soft hover:bg-cream hover:text-jade-900",
                      )}
                    >
                      {isActive && (
                        <span
                          aria-hidden
                          className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-r-full bg-coral-600"
                        />
                      )}
                      {Icon && (
                        <Icon
                          size={16}
                          className={cn(
                            "shrink-0 transition-colors",
                            isActive
                              ? "text-coral-600"
                              : "text-ink-soft/70 group-hover:text-jade-700",
                          )}
                        />
                      )}
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer: platform health, not a generic placeholder */}
      <div className="border-t border-rule-soft p-3">
        <div className="rounded-[10px] border border-rule-soft bg-cream/60 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[12px] font-bold text-jade-950">
                  System health
                </p>
                <span className="rounded-sm bg-jade-50 px-1 text-[9.5px] font-bold uppercase tracking-wider text-jade-800">
                  Live
                </span>
              </div>
              <p className="font-bangla text-[10.5px] text-ink-soft/85">
                সিস্টেম স্বাস্থ্য
              </p>
            </div>
            <Link
              href="/admin/dashboard/support"
              aria-label="Contact support"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-paper hover:text-jade-900"
            >
              <LifeBuoy size={13} />
            </Link>
          </div>

          {/* Operational status row */}
          <div className="mt-2.5 space-y-1.5">
            <div className="flex items-baseline justify-between text-[10.5px] tabular-nums">
              <span className="text-ink-soft">API uptime</span>
              <span className="font-semibold text-ink">
                99.98<span className="text-ink-soft/70">%</span>
              </span>
            </div>
            <div className="flex items-baseline justify-between text-[10.5px] tabular-nums">
              <span className="text-ink-soft">Active orgs</span>
              <span className="font-semibold text-ink">128</span>
            </div>
          </div>

          <Link
            href="/admin/dashboard/subscriptions"
            className="mt-2.5 block text-center text-[11.5px] font-semibold text-jade-900 hover:text-coral-600 transition-colors"
          >
            Review plans →
          </Link>
        </div>
      </div>
    </aside>
  );
}
