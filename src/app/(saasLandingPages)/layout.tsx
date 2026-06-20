import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
