import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation APIs. Use these (instead of next/link &
// next/navigation) inside the localized landing pages so links keep
// the active /en or /bn prefix.
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
