// src/app/owner/dashboard/page.tsx
import { CollectionPulse } from "@/src/components/dashboard/CollectionPulse";
import { HeroKpi } from "@/src/components/dashboard/HeroKpi";
import { SupportingStats } from "@/src/components/dashboard/SupportingStats";
import { CollectionChart } from "@/src/components/dashboard/CollectionChart";
import { OccupancyBreakdown } from "@/src/components/dashboard/OccupancyBreakdown";
import { RecentLeases } from "@/src/components/dashboard/RecentLeases";
import { UpcomingDues } from "@/src/components/dashboard/UpcomingDues";
import { PageHeader } from "@/src/components/dashboard/PageHeader";

export default function OwnerDashboardPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto space-y-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader name="Aziz Bhai" />

        {/* HERO — what needs your attention right now */}
        <CollectionPulse />

        {/* PRIMARY KPI — asymmetric, one big number with context */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <CollectionChart />
          <SupportingStats />
        </div>

        {/* CHART ROW */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
          <HeroKpi />
          <OccupancyBreakdown />
        </div>

        {/* ACTIVITY ROW */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <UpcomingDues />
          <RecentLeases />
        </div>

        {/* Quiet footer */}
        <p className="pt-2 text-center font-bangla text-[12.5px] text-ink-soft/70">
          এক ফোনে — সব ভাড়াটিয়া, সব হিসাব। · BariBari
        </p>
      </div>
    </div>
  );
}
