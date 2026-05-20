import { OwnerSidebar } from "@/src/components/dashboard/OwnerSidebar";
import { OwnerTopbar } from "@/src/components/dashboard/OwnerTopbar";
import type { ReactNode } from "react";

export default function OwnerDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Desktop sidebar */}
            <div className="hidden lg:block">
                <OwnerSidebar />
            </div>

            {/* Main column */}
            <div className="flex min-w-0 flex-1 flex-col">
                <OwnerTopbar />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
