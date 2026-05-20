import type { UserRole } from "@/src/lib/authUtils";

export interface NavItem {
    title: string;
    href: string;
    icon?: string;
    roles?: UserRole[];
}

export interface NavSection {
    title?: string;
    items: NavItem[];
    roles?: UserRole[];
}
