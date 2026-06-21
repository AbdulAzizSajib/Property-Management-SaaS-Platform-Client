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
      <div className="flex h-16 items-center justify-center border-b border-rule-soft pt-4 ">
        <div className="">
          <Link
            href="/"
            className="flex flex-col items-center  text-jade-900 dark:text-jade-50 text-3xl font-bold tracking-tight relative"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block" }}
              viewBox="366.667 680 1230.667 682.667"
              className="h-7 w-auto absolute -top-3.5 left-[-15.5px]"
              preserveAspectRatio="none"
            >
              <path
                transform="translate(0,0)"
                fill="#247460"
                d="M 1156.17 704.057 C 1165.62 709.999 1189.79 730.077 1199.78 737.954 C 1232.79 763.92 1265.63 790.088 1298.32 816.455 L 1573.77 1033.95 C 1559.4 1034.24 1499.39 1036.14 1489.09 1032.69 C 1475.17 1028.02 1460.98 1016.83 1448.48 1009.03 L 1378 965.121 C 1306.39 920.635 1231.94 876.987 1161.12 831.747 C 1148.71 838.78 1123.69 857.081 1111.02 865.707 L 1014.95 930.551 C 907.585 1003.92 799.428 1076.13 690.502 1147.16 L 495.835 1273.03 C 463.437 1293.65 423.702 1320.34 390.529 1338.03 C 406.372 1321.62 437.975 1295.44 455.536 1280.56 C 488.408 1252.41 521.487 1224.51 554.77 1196.85 L 695.66 1078.95 C 722.179 1056.67 751.695 1030.44 778.776 1009.4 C 777.735 986.8 778.572 957.352 778.594 934.29 L 778.619 789.032 C 815.8 789.05 853.371 788.795 890.52 789.278 C 890.683 815.378 890.691 841.478 890.544 867.578 C 890.556 883.121 891.24 904.906 890.214 919.622 C 979.24 853.148 1069.25 774.057 1156.17 704.057 z"
              ></path>
              <path
                transform="translate(0,0)"
                fill="#247460"
                d="M 1088.78 1065.28 C 1107.1 1066.51 1133.97 1065.68 1152.84 1065.65 C 1153.36 1086.21 1152.99 1108.84 1153.02 1129.55 C 1131.64 1129.28 1110.25 1129.25 1088.87 1129.46 C 1088.45 1108.45 1088.77 1086.37 1088.78 1065.28 z"
              ></path>
              <path
                transform="translate(0,0)"
                fill="#247460"
                d="M 1183.02 1065.44 C 1201.98 1065.05 1222.24 1065.3 1241.28 1065.23 C 1241.26 1073.17 1242.03 1125.66 1240.39 1129.39 L 1236.25 1129.6 L 1177.8 1129.53 C 1177.87 1121.15 1176.43 1069.6 1178.98 1065.78 L 1183.02 1065.44 z"
              ></path>
              <path
                transform="translate(0,0)"
                fill="#247460"
                d="M 1088.78 977.918 C 1107.09 976.886 1133.96 977.588 1152.88 977.566 L 1153 1040.87 C 1132.12 1040.51 1109.73 1040.95 1088.74 1041.01 L 1088.78 977.918 z"
              ></path>
              <path
                transform="translate(0,0)"
                fill="#247460"
                d="M 1177.96 977.928 L 1241.14 977.684 C 1241.64 997.869 1241.19 1020.46 1241.2 1040.81 L 1177.98 1040.94 C 1177.81 1019.94 1177.8 998.932 1177.96 977.928 z"
              ></path>
            </svg>
            <h2 className="bg-coral-500 bg-clip-text text-transparent z-10">
              Bariyan
            </h2>
          </Link>
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
                <p className="text-[12px] font-bold text-jade-950">Pro plan</p>
                <span className="rounded-sm bg-coral-50 px-1 text-[9.5px] font-bold uppercase tracking-wider text-coral-600">
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
