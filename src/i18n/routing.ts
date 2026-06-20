import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    // The two languages this site supports.
    locales: ["en", "bn"],
    // English is the default; the UI can switch to Bangla.
    defaultLocale: "en",
    // Always show the locale in the URL (/en, /bn).
    localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
