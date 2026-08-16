import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import SmoothScroll from "@/src/components/SmoothScroll";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="space-grotesk">
            <SmoothScroll />
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
