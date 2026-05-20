import QueryProviders from "@/src/providers/QueryProvider";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({
    variable: "--font-geist",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "BariBari — Smart Property Management for Bangladesh",
    description:
        "BariBari is an all-in-one property management platform built for Bangladeshi landlords, real estate firms and housing societies. Collect rent via bKash/Nagad, manage tenants, leases and maintenance from one dashboard.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={geist.variable}>
            <body>
                <QueryProviders>{children}</QueryProviders>
                <Toaster position="top-right" richColors closeButton />
            </body>
        </html>
    );
}
