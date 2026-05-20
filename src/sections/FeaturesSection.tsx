import SectionTitle from "@/src/components/SectionTitle";
import {
    BellRing,
    ClipboardList,
    FileText,
    type LucideIcon,
    Users,
    Wallet,
    Wrench,
} from "lucide-react";

type Feature = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const features: Feature[] = [
    {
        icon: Wallet,
        title: "Rent collection on bKash & Nagad",
        description:
            "Tenants pay rent in one tap. Funds settle into your bank account with auto-generated receipts.",
    },
    {
        icon: Users,
        title: "Tenant & lease management",
        description:
            "Digital lease agreements, NID verification, deposit tracking and renewal reminders in one place.",
    },
    {
        icon: Wrench,
        title: "Maintenance & complaints",
        description:
            "Tenants raise issues from their phone. Assign caretakers, track repairs and close tickets faster.",
    },
    {
        icon: BellRing,
        title: "Auto SMS in Bangla & English",
        description:
            "Rent reminders, dues notices and announcements delivered automatically — no more chasing tenants.",
    },
    {
        icon: ClipboardList,
        title: "Service charge & utilities",
        description:
            "Split gas, water, lift, security and service charges across flats with one click.",
    },
    {
        icon: FileText,
        title: "Reports for owners & auditors",
        description:
            "Monthly income, occupancy and TDS-ready statements exportable to Excel and PDF.",
    },
];

export default function FeaturesSection() {
    return (
        <div id="features">
            <SectionTitle
                text1="Features"
                text2="Everything you need to run a property"
                text3="From a single flat in Mirpur to a 30-storey tower in Bashundhara — BariBari adapts to the way you already work."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto px-6">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={index}
                            className="group bg-white border border-slate-200 rounded-xl p-6 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition duration-300"
                        >
                            <div className="flex items-center justify-center size-11 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                                <Icon size={22} strokeWidth={1.8} />
                            </div>
                            <h3 className="text-base font-semibold text-slate-800 mt-5">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
