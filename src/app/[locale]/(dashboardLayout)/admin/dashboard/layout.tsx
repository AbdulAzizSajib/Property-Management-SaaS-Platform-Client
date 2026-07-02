import { AdminSidebar } from "@/src/components/dashboard/AdminSidebar";
import { AdminTopbar } from "@/src/components/dashboard/AdminTopbar";
import type { ReactNode } from "react";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#faf6ec]">
            {/* Desktop sidebar */}
            <div className="hidden lg:block sticky top-0 h-screen self-start">
                <AdminSidebar />
            </div>

            {/* Main column */}
            <div className="flex min-w-0 flex-1 flex-col">
                <AdminTopbar />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
