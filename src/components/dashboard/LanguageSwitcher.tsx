"use client";

import { usePathname, useRouter } from "@/src/i18n/navigation";
import { routing } from "@/src/i18n/routing";
import { cn } from "@/src/lib/utils";
import { useLocale } from "next-intl";
import { useTransition } from "react";

const LABELS: Record<string, string> = {
    en: "EN",
    bn: "বাং",
};

/**
 * Compact segmented EN / বাং toggle for the topbar. Switching keeps the user
 * on the same path — only the locale prefix changes — via next-intl's
 * locale-aware router.
 */
export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    function switchTo(next: string) {
        if (next === locale) return;
        startTransition(() => {
            router.replace(pathname, { locale: next });
        });
    }

    return (
        <div
            className="inline-flex items-center rounded-md border border-rule-soft bg-cream/60 p-0.5"
            role="group"
            aria-label="Language"
        >
            {routing.locales.map((l) => (
                <button
                    key={l}
                    type="button"
                    disabled={isPending}
                    onClick={() => switchTo(l)}
                    aria-pressed={l === locale}
                    className={cn(
                        "rounded-[5px] px-2 py-1 text-[11.5px] font-semibold transition-colors disabled:opacity-60",
                        l === locale
                            ? "bg-jade-900 text-paper"
                            : "text-ink-soft hover:bg-paper hover:text-jade-900",
                        l === "bn" && "font-bangla",
                    )}
                >
                    {LABELS[l] ?? l.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
