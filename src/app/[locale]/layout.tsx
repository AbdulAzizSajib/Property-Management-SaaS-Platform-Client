import QueryProviders from "@/src/providers/QueryProvider";
import type { Metadata } from "next";
import {  Hind_Siliguri,  Noto_Sans_Bengali , Poppins, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import { ThemeProvider } from "../../components/theme-provider";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";



const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});
const NotoSansBengali = Noto_Sans_Bengali({
    variable: "--font-NotoSansBengali",
    subsets: ["bengali", "latin"],
    weight: ["400", "500", "600", "700", "800"],
});


const hind = Hind_Siliguri({
    variable: "--font-bangla",
    subsets: ["bengali", "latin"],
    weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});




// Local brand font — used only for the "Bariyan" wordmark in the navbar.
const rubita = localFont({
    src: "../../font/RubitaSmile.ttf",
    variable: "--font-rubita",
    display: "swap",
});

const Shadhinata = localFont({
    src: "../../font/Shadhinata.ttf",
    variable: "--font-shadhinata",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Bariyan - Property Management for Bangladeshi Landlords, Real Estate Firms and Housing Societies",
    description:
        "Bariyan is an all-in-one property management platform built for Bangladeshi landlords, real estate firms and housing societies. Collect rent via bKash/Nagad, manage tenants, leases and maintenance from one dashboard.",
};

// Pre-render a static shell for every supported locale.
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Guard against unsupported locales in the URL.
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html
            lang={locale} suppressHydrationWarning
            className={` ${poppins.variable} ${hind.variable} ${rubita.variable} ${NotoSansBengali.variable}  ${Shadhinata.variable} ${spaceGrotesk.variable}  ${locale === "bn" ? "locale-bn" : "locale-en"}`}
        >
            <body>
                <NextIntlClientProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        disableTransitionOnChange
                    >
                        <QueryProviders>{children}</QueryProviders>
                        <ToastContainer position="top-right" autoClose={4000} closeOnClick pauseOnHover theme="light" />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
