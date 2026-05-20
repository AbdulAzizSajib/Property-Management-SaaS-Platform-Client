import SectionTitle from "@/src/components/SectionTitle";
import {
    Banknote,
    CreditCard,
    Landmark,
    type LucideIcon,
    MessageSquare,
    Smartphone,
    Wallet,
} from "lucide-react";

type Integration = {
    name: string;
    icon: LucideIcon;
    tag: string;
};

const integrations: Integration[] = [
    { name: "bKash", icon: Smartphone, tag: "Mobile Financial Service" },
    { name: "Nagad", icon: Wallet, tag: "Mobile Financial Service" },
    { name: "Rocket", icon: Banknote, tag: "DBBL Mobile Banking" },
    { name: "Upay", icon: CreditCard, tag: "UCB Mobile Wallet" },
    { name: "City Bank", icon: Landmark, tag: "Direct Bank Settlement" },
    { name: "SMS Gateway BD", icon: MessageSquare, tag: "Bangla & English SMS" },
];

export default function IntegrationsSection() {
    return (
        <div id="integrations">
            <SectionTitle
                text1="Integrations"
                text2="Built for the way Bangladesh pays"
                text3="Native integration with the payment methods, banks and SMS gateways your tenants already use every day."
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-16 max-w-5xl mx-auto px-6">
                {integrations.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-center size-12 rounded-full bg-indigo-50 text-indigo-600">
                                <Icon size={22} strokeWidth={1.8} />
                            </div>
                            <p className="mt-3 font-semibold text-slate-800">{item.name}</p>
                            <p className="text-xs text-slate-500 mt-1">{item.tag}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
