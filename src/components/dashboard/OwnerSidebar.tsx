"use client";

import { getIconComponent } from "@/src/lib/iconMapper";
import { ownerNavItems, getCommonNavItems } from "@/src/lib/navItems";
import { cn } from "@/src/lib/utils";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const commonItems = getCommonNavItems("OWNER");
const sections = [...commonItems, ...ownerNavItems];

export function OwnerSidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
            <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
                    <Building2 size={18} />
                </span>
                <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-slate-800">BariBari</span>
                    <span className="text-[11px] text-slate-500">Owner workspace</span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {sections.map((section, idx) => (
                    <div key={idx} className="mb-5 last:mb-0">
                        {section.title && (
                            <p className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                                {section.title}
                            </p>
                        )}
                        <ul className="space-y-0.5">
                            {section.items.map((item) => {
                                const Icon = item.icon ? getIconComponent(item.icon) : null;
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/" && pathname.startsWith(item.href));

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={onNavigate}
                                            className={cn(
                                                "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-indigo-50 text-indigo-700"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                                            )}
                                        >
                                            {Icon && (
                                                <Icon
                                                    size={16}
                                                    className={cn(
                                                        "shrink-0",
                                                        isActive
                                                            ? "text-indigo-600"
                                                            : "text-slate-400 group-hover:text-slate-600",
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

            <div className="border-t border-slate-200 p-4">
                <div className="rounded-lg bg-linear-to-br from-indigo-50 to-violet-50 p-3">
                    <p className="text-xs font-semibold text-indigo-900">Need help?</p>
                    <p className="mt-0.5 text-[11px] text-indigo-700/80">
                        Contact support for assistance with your account.
                    </p>
                </div>
            </div>
        </aside>
    );
}
