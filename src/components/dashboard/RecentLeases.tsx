import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/src/components/ui/card";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Lease {
    id: string;
    tenant: string;
    initials: string;
    unit: string;
    building: string;
    rent: number;
    status: "ACTIVE" | "PENDING" | "TERMINATED";
}

const leases: Lease[] = [
    { id: "L-1042", tenant: "Rahim Uddin", initials: "RU", unit: "3A", building: "Lalmatia Block A", rent: 18000, status: "ACTIVE" },
    { id: "L-1041", tenant: "Salma Khan", initials: "SK", unit: "2B", building: "Lalmatia Block A", rent: 22000, status: "ACTIVE" },
    { id: "L-1040", tenant: "Karim Hossain", initials: "KH", unit: "5C", building: "Dhanmondi Tower", rent: 28000, status: "PENDING" },
    { id: "L-1039", tenant: "Nadia Rahman", initials: "NR", unit: "1A", building: "Gulshan Heights", rent: 35000, status: "ACTIVE" },
    { id: "L-1038", tenant: "Tahsin Ahmed", initials: "TA", unit: "4D", building: "Lalmatia Block A", rent: 19500, status: "TERMINATED" },
];

const statusStyles: Record<Lease["status"], string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    TERMINATED: "bg-slate-100 text-slate-600 border-slate-200",
};

const fmt = (n: number) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(n);

export function RecentLeases() {
    return (
        <Card className="px-5">
            <CardHeader className="px-0">
                <CardTitle>Recent leases</CardTitle>
                <CardDescription>Newest tenant agreements across all buildings</CardDescription>
                <CardAction>
                    <Link
                        href="/owner/dashboard/leases"
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        View all <ArrowUpRight size={12} />
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent className="px-0">
                <ul className="divide-y divide-slate-100">
                    {leases.map((lease) => (
                        <li
                            key={lease.id}
                            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                        >
                            <Avatar className="size-9">
                                <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
                                    {lease.initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-slate-800">
                                    {lease.tenant}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                    Unit {lease.unit} · {lease.building}
                                </p>
                            </div>
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold text-slate-900 tabular-nums">
                                    {fmt(lease.rent)}
                                </p>
                                <p className="text-[11px] text-slate-500">/month</p>
                            </div>
                            <Badge
                                variant="outline"
                                className={`${statusStyles[lease.status]} text-[10px]`}
                            >
                                {lease.status}
                            </Badge>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
