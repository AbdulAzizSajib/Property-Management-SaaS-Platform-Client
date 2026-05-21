"use client";
import { navLinks } from "@/src/data/navLinks";
import { MenuIcon, MoonIcon, SunIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="size-9" />;

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center size-9 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
        >
            {resolvedTheme === "dark" ? (
                <SunIcon size={18} className="text-yellow-400" />
            ) : (
                <MoonIcon size={18} className="text-slate-600" />
            )}
        </button>
    );
}

function BrandLogo() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                <span className="text-indigo-600">My</span>Nibash
            </span>
        </Link>
    );
}

export default function Navbar() {
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    useEffect(() => {
        if (openMobileMenu) {
            document.body.classList.add("max-md:overflow-hidden");
        } else {
            document.body.classList.remove("max-md:overflow-hidden");
        }
    }, [openMobileMenu]);

    return (
        <nav
            className={`flex items-center justify-between fixed z-50 top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 ${openMobileMenu ? "bg-white/80 dark:bg-slate-900/80" : "backdrop-blur"}`}
        >
            <BrandLogo />
            <div className="hidden items-center md:gap-8 lg:gap-9 md:flex lg:pl-20">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="hover:text-indigo-600"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
            {/* Mobile menu */}
            <div
                className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium bg-white/40 dark:bg-slate-900/40 backdrop-blur-md md:hidden transition duration-300 ${openMobileMenu ? "translate-x-0" : "-translate-x-full"}`}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setOpenMobileMenu(false)}
                    >
                        {link.name}
                    </Link>
                ))}
                <Link href="/login" onClick={() => setOpenMobileMenu(false)}>
                    Sign in
                </Link>
                <Link
                    href="/register"
                    onClick={() => setOpenMobileMenu(false)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md"
                >
                    Get started
                </Link>
                <button
                    className="aspect-square size-10 p-1 items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md flex"
                    onClick={() => setOpenMobileMenu(false)}
                >
                    <XIcon />
                </button>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link
                    href="/login"
                    className="hidden md:block hover:bg-slate-100 dark:hover:bg-slate-800 transition px-4 py-2 border border-indigo-600 rounded-md"
                >
                    Sign in
                </Link>
                <Link
                    href="/register"
                    className="hidden md:block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md"
                >
                    Get started
                </Link>
                <button
                    onClick={() => setOpenMobileMenu(!openMobileMenu)}
                    className="md:hidden"
                >
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </div>
        </nav>
    );
}
