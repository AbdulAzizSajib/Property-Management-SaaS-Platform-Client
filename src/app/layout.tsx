import QueryProviders from "@/src/providers/QueryProvider";
import type { Metadata } from "next";
import { Geist, Hind_Siliguri, Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans, Poppins  } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

const jakarta = Plus_Jakarta_Sans({
    variable: "--font-jakarta",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const geist = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const hind = Hind_Siliguri({
    variable: "--font-hind",
    subsets: ["bengali", "latin"],
    weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
    variable: "--font-jetbrains",
    subsets: ["latin"],
    weight: ["400", "500"],
});

const instrument = Instrument_Serif({
    variable: "--font-instrument",
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
});

// Local brand font — used only for the "Bariyan" wordmark in the navbar.
const rubita = localFont({
    src: "../font/RubitaSmile.ttf",
    variable: "--font-rubita",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Bariyan - Property Management for Bangladeshi Landlords",
    description:
        "Bariyan is an all-in-one property management platform built for Bangladeshi landlords, real estate firms and housing societies. Collect rent via bKash/Nagad, manage tenants, leases and maintenance from one dashboard.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html
            lang="en" suppressHydrationWarning
            className={`${jakarta.variable} ${poppins.variable} ${geist.variable} ${hind.variable} ${jetbrains.variable} ${instrument.variable} ${rubita.variable}`}
        >
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryProviders>{children}</QueryProviders>
                    <ToastContainer position="top-right" autoClose={4000} closeOnClick pauseOnHover />
                </ThemeProvider>
            </body>
        </html>
    );
}
