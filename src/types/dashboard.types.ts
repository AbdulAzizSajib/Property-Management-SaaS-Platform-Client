import type { UserRole } from "@/src/lib/authUtils";

export interface NavItem {
    title: string;
    href: string;
    icon?: string;
    roles?: UserRole[];
}

export interface NavSection {
    title?: string;
    items: NavItem[];
    roles?: UserRole[];
}

// ── Owner dashboard overview (GET /dashboard/overview) ──────────────
// All money values are plain numbers.

export interface DashboardCollection {
    month: string;
    monthLabel: string;
    collected: number;
    /** Monthly target = active-lease rent roll (rent + service charge). */
    target: number;
    outstanding: number;
    rate: number;
    deltaVsLastMonth: number;
    deltaPct: number;
    daysLeftInMonth: number;
}

export interface DashboardPulseBucket {
    tenants: number;
    amount: number;
}

export interface DashboardPulse {
    overdue: DashboardPulseBucket;
    outstanding: DashboardPulseBucket;
    paidThisMonth: DashboardPulseBucket;
}

export interface DashboardStats {
    buildings: number;
    buildingsNewThisQuarter: number;
    totalUnits: number;
    unitsNewThisMonth: number;
    occupancyRate: number;
    occupied: number;
    vacant: number;
    underMaintenance: number;
}

export interface DashboardOccupancy {
    occupied: number;
    vacant: number;
    underMaintenance: number;
    total: number;
}

export interface DashboardTrendPoint {
    month: string;
    label: string;
    collected: number;
    target: number;
    current: boolean;
}

export interface DashboardRecentLease {
    id: string;
    tenantName: string;
    unitName: string;
    buildingName: string;
    monthlyRent: number;
    status: string;
}

export interface DashboardUpcomingDue {
    id: string;
    invoiceNumber: string;
    tenantName: string;
    unitLabel: string;
    amount: number;
    dueInDays: number;
    overdue: boolean;
}

export interface DashboardOverview {
    collection: DashboardCollection;
    pulse: DashboardPulse;
    stats: DashboardStats;
    occupancy: DashboardOccupancy;
    collectionTrend: DashboardTrendPoint[];
    recentLeases: DashboardRecentLease[];
    upcomingDues: DashboardUpcomingDue[];
}
