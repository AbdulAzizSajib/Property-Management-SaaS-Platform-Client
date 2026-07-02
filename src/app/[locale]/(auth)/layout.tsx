import type { ReactNode } from "react";

// Minimal shell — each auth page owns its own layout (split-screen, etc.)
export default function AuthLayout({ children }: { children: ReactNode }) {
    return <div className="min-h-screen bg-paper">{children}</div>;
}
