import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware drop-in replacements for next/link and next/navigation.
// Use these instead of the next/* originals so the active locale prefix
// (/en, /bn) is preserved across navigation.
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
