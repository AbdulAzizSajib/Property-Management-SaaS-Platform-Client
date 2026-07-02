import type { ReactNode } from "react";

// Root layout is intentionally minimal: the real <html>/<body> shell lives in
// app/[locale]/layout.tsx so `lang` can reflect the active locale. Next.js
// still requires a root layout to exist, so this just passes children through.
export default function RootLayout({ children }: { children: ReactNode }) {
    return children;
}
