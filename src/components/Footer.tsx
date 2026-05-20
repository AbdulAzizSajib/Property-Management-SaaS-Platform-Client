import { navLinks } from "@/src/data/navLinks";
import {
    Building2,
    Facebook,
    Linkedin,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 mt-40 w-full text-slate-500">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-200 pb-6">
                <div className="md:max-w-114">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex items-center justify-center size-9 rounded-md bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
                            <Building2 size={20} strokeWidth={2.2} />
                        </span>
                        <span className="text-xl font-semibold text-slate-800">
                            Bari<span className="text-indigo-600">Bari</span>
                        </span>
                    </Link>
                    <p className="mt-6">
                        BariBari is Bangladesh’s modern property management platform — built
                        for landlords, real estate firms and housing societies to collect
                        rent, manage tenants and grow their portfolio with confidence.
                    </p>
                    <div className="flex items-center gap-3 mt-6">
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="size-9 flex items-center justify-center rounded-md border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                            <Facebook size={16} />
                        </a>
                        <a
                            href="#"
                            aria-label="LinkedIn"
                            className="size-9 flex items-center justify-center rounded-md border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                            <Linkedin size={16} />
                        </a>
                    </div>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
                        <ul className="space-y-2">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="hover:text-indigo-600">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
                        <div className="space-y-3">
                            <p className="flex items-center gap-2">
                                <Phone size={14} className="text-indigo-600" /> +880 1700-000000
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail size={14} className="text-indigo-600" />{" "}
                                hello@baribari.com.bd
                            </p>
                            <p className="flex items-start gap-2">
                                <MapPin size={14} className="text-indigo-600 mt-0.5" />{" "}
                                Gulshan-1, Dhaka 1212, Bangladesh
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center pb-5">
                Copyright {new Date().getFullYear()} © BariBari Technologies Ltd. All
                Rights Reserved.
            </p>
        </footer>
    );
}
