import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    // Supported locales. `en` = English, `bn` = বাংলা.
    locales: ["en", "bn"],
    defaultLocale: "en",
});
