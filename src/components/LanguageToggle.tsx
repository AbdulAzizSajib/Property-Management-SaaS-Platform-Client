"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";

// Toggles between English (/en) and Bangla (/bn) while staying on the
// same page. Shows the language you'll switch TO.
export function LanguageToggle() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const next = locale === "en" ? "bn" : "en";
    const label = locale === "en" ? "বাং" : "ENG";

    return (
        <button
            type="button"
            onClick={() => router.replace(pathname, { locale: next })}
            aria-label="Toggle language"
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-rule-soft dark:border-white/10 px-2.5 text-[13px] font-semibold text-jade-900 dark:text-jade-50 transition-colors hover:bg-cream-2 dark:hover:bg-night-3"
        >
            {label}
        </button>
    );
}
