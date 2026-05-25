"use client";

// src/components/layout/OwnerSidebar.tsx
//
// Rebranded sidebar matching the dashboard's jade/coral/cream system.
// - Light cream surface with a thin jade-900 rail on the far left for personality
// - Active state uses the brand's signature: coral left-bar + jade-50 bg + jade-900 text
// - Logo glyph mirrors the landing-page mockup
// - Footer now shows plan/usage instead of a generic "Need help?" placeholder

import { getIconComponent } from "@/src/lib/iconMapper";
import { ownerNavItems, getCommonNavItems } from "@/src/lib/navItems";
import { cn } from "@/src/lib/utils";
import { LifeBuoy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const commonItems = getCommonNavItems("OWNER");
const sections = [...commonItems, ...ownerNavItems];

export function OwnerSidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();

    const activeHref = sections
        .flatMap((s) => s.items.map((i) => i.href))
        .filter((href) => pathname === href || pathname.startsWith(href + "/"))
        .reduce((longest, href) => (href.length > longest.length ? href : longest), "");

    return (
        <aside className="relative flex h-full w-64 flex-col border-r border-rule-soft bg-paper">
            {/* Thin jade rail — the dark accent that keeps this from blurring into the page */}
            <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-jade-900" />

            {/* Brand header */}
            <div className="flex h-16 items-center gap-2.5 border-b border-rule-soft pl-6 pr-4">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-[8px] bg-jade-900 text-paper">
                    <span className="text-[15px] font-bold leading-none">B</span>
                    <span
                        aria-hidden
                        className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-coral-600 ring-2 ring-paper"
                    />
                </span>
                <div className="flex flex-col leading-tight">
                    <span className="text-[14px] font-bold tracking-tight text-jade-950">
                        BariBari
                    </span>
                    <span className="font-bangla text-[10.5px] text-ink-soft">
                        মালিক ওয়ার্কস্পেস
                    </span>
                </div>
            </div>

            {/* Workspace context strip */}
            <Link
                href="/owner/dashboard/buildings"
                className="group flex items-center justify-between border-b border-rule-soft px-4 py-2.5 hover:bg-cream/60 transition-colors"
            >
                <div className="min-w-0">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft/75">
                        Workspace
                    </p>
                    <p className="truncate text-[13px] font-semibold text-ink">
                        Aziz Rahman
                    </p>
                </div>
                <span className="rounded-md bg-jade-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-jade-800 tabular-nums">
                    8 bldgs
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
                                            {/* Active accent bar — the brand signature */}
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

            {/* Footer: plan + usage, not generic support */}
            <div className="border-t border-rule-soft p-3">
                <div className="rounded-[10px] border border-rule-soft bg-cream/60 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="text-[12px] font-bold text-jade-950">
                                    Pro plan
                                </p>
                                <span className="rounded-sm bg-coral-50 px-1 text-[9.5px] font-bold uppercase tracking-wider text-coral-700">
                                    Active
                                </span>
                            </div>
                            <p className="font-bangla text-[10.5px] text-ink-soft/85">
                                প্রো প্ল্যান
                            </p>
                        </div>
                        <Link
                            href="/owner/dashboard/support"
                            aria-label="Contact support"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-paper hover:text-jade-900"
                        >
                            <LifeBuoy size={13} />
                        </Link>
                    </div>

                    {/* Usage bar */}
                    <div className="mt-2.5">
                        <div className="flex items-baseline justify-between text-[10.5px] tabular-nums">
                            <span className="text-ink-soft">Units used</span>
                            <span className="font-semibold text-ink">
                                166 <span className="text-ink-soft/70">/ 250</span>
                            </span>
                        </div>
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-paper">
                            <div
                                className="h-full rounded-full bg-jade-700"
                                style={{ width: `${(166 / 250) * 100}%` }}
                            />
                        </div>
                    </div>

                    <Link
                        href="/owner/dashboard/billing"
                        className="mt-2.5 block text-center text-[11.5px] font-semibold text-jade-900 hover:text-coral-600 transition-colors"
                    >
                        Manage plan →
                    </Link>
                </div>
            </div>
        </aside>
    );
}