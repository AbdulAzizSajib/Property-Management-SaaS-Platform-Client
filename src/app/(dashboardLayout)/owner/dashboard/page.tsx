import { OccupancyBreakdown } from "@/src/components/dashboard/OccupancyBreakdown";
import { QuickActions } from "@/src/components/dashboard/QuickActions";
import { RecentLeases } from "@/src/components/dashboard/RecentLeases";
import { RevenueChart } from "@/src/components/dashboard/RevenueChart";
import { StatCard } from "@/src/components/dashboard/StatCard";
import { UpcomingDues } from "@/src/components/dashboard/UpcomingDues";
import { Button } from "@/src/components/ui/button";
import { Building, DoorOpen, Percent, TrendingUp, Download, Plus } from "lucide-react";

export default function OwnerDashboardPage() {
    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Page heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Welcome back, Aziz
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Here&apos;s what&apos;s happening across your properties today.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download size={14} />
                        Export
                    </Button>
                    <Button size="sm">
                        <Plus size={14} />
                        New Building
                    </Button>
                </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Buildings"
                    value="8"
                    delta={{ value: "+2", trend: "up" }}
                    icon={Building}
                    accent="indigo"
                />
                <StatCard
                    label="Total Units"
                    value="166"
                    delta={{ value: "+12", trend: "up" }}
                    icon={DoorOpen}
                    accent="emerald"
                />
                <StatCard
                    label="Occupancy"
                    value="85.5%"
                    delta={{ value: "+3.2%", trend: "up" }}
                    icon={Percent}
                    accent="amber"
                />
                <StatCard
                    label="Monthly Revenue"
                    value="৳ 4.12L"
                    delta={{ value: "+5.8%", trend: "up" }}
                    icon={TrendingUp}
                    accent="rose"
                />
            </div>

            {/* Quick actions */}
            <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-700">Quick actions</h2>
                <QuickActions />
            </section>

            {/* Chart + Occupancy */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>
                <OccupancyBreakdown />
            </div>

            {/* Recent leases + Upcoming dues */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <RecentLeases />
                <UpcomingDues />
            </div>
        </div>
    );
}
