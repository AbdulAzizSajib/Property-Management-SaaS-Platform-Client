import { OwnerSidebar } from "@/src/components/dashboard/OwnerSidebar";
import { OwnerTopbar } from "@/src/components/dashboard/OwnerTopbar";
import type { ReactNode } from "react";

export default function OwnerDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#faf6ec]">
            {/* Desktop sidebar */}
            <div className="hidden lg:block sticky top-0 h-screen self-start">
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
