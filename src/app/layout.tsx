import QueryProviders from "@/src/providers/QueryProvider";
import type { Metadata } from "next";
import { Geist, Hind_Siliguri, Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
    variable: "--font-jakarta",
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

export const metadata: Metadata = {
    title: "BariBari — Smart Property Management for Bangladesh",
    description:
        "BariBari is an all-in-one property management platform built for Bangladeshi landlords, real estate firms and housing societies. Collect rent via bKash/Nagad, manage tenants, leases and maintenance from one dashboard.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html
            lang="en"
            className={`${jakarta.variable} ${geist.variable} ${hind.variable} ${jetbrains.variable} ${instrument.variable}`}
        >
            <body>
                <QueryProviders>{children}</QueryProviders>
                <ToastContainer position="top-right" autoClose={4000} closeOnClick pauseOnHover />
            </body>
        </html>
    );
}
