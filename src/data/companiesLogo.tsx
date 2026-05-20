import type { CompanyLogo } from "@/src/types";
import { Building2, Home, KeyRound, Landmark, LayoutGrid, Warehouse } from "lucide-react";

const companyClass = "mx-11 flex items-center gap-2 text-slate-400";

export const companiesLogo: CompanyLogo[] = [
    {
        name: "Bashundhara Properties",
        logo: (
            <div className={companyClass}>
                <Building2 size={28} strokeWidth={1.5} />
                <span className="text-lg font-semibold tracking-tight">Bashundhara Properties</span>
            </div>
        ),
    },
    {
        name: "Sheltech Living",
        logo: (
            <div className={companyClass}>
                <Home size={28} strokeWidth={1.5} />
                <span className="text-lg font-semibold tracking-tight">Sheltech Living</span>
            </div>
        ),
    },
    {
        name: "Rangs Estates",
        logo: (
            <div className={companyClass}>
                <Landmark size={28} strokeWidth={1.5} />
                <span className="text-lg font-semibold tracking-tight">Rangs Estates</span>
            </div>
        ),
    },
    {
        name: "Concord Realty",
        logo: (
            <div className={companyClass}>
                <LayoutGrid size={28} strokeWidth={1.5} />
                <span className="text-lg font-semibold tracking-tight">Concord Realty</span>
            </div>
        ),
    },
    {
        name: "Navana Housing",
        logo: (
            <div className={companyClass}>
                <KeyRound size={28} strokeWidth={1.5} />
                <span className="text-lg font-semibold tracking-tight">Navana Housing</span>
            </div>
        ),
    },
    {
        name: "Anwar Landmark",
        logo: (
            <div className={companyClass}>
                <Warehouse size={28} strokeWidth={1.5} />
                <span className="text-lg font-semibold tracking-tight">Anwar Landmark</span>
            </div>
        ),
    },
];
