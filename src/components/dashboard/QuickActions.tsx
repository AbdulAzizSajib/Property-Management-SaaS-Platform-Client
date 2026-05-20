import Link from "next/link";
import { Building, DoorOpen, FileText, Receipt, UserPlus } from "lucide-react";

const actions = [
    { label: "Add Building", href: "/owner/dashboard/buildings", icon: Building, color: "from-indigo-500 to-indigo-600" },
    { label: "Add Unit", href: "/owner/dashboard/units/new", icon: DoorOpen, color: "from-violet-500 to-violet-600" },
    { label: "Add Tenant", href: "/owner/dashboard/tenants/new", icon: UserPlus, color: "from-emerald-500 to-emerald-600" },
    { label: "New Lease", href: "/owner/dashboard/leases/new", icon: FileText, color: "from-amber-500 to-amber-600" },
    { label: "Generate Invoice", href: "/owner/dashboard/invoices/new", icon: Receipt, color: "from-rose-500 to-rose-600" },
];

export function QuickActions() {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {actions.map((action) => {
                const Icon = action.icon;
                return (
                    <Link
                        key={action.href}
                        href={action.href}
                        className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <span
                            className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${action.color} text-white shadow-sm`}
                        >
                            <Icon size={18} />
                        </span>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                            {action.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
