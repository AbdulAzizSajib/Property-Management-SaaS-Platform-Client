import { Building2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="px-6 md:px-16 lg:px-24 xl:px-32 py-5 border-b border-slate-200 bg-white">
                <Link href="/" className="flex items-center gap-2 w-fit">
                    <span className="flex items-center justify-center size-9 rounded-md bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
                        <Building2 size={20} strokeWidth={2.2} />
                    </span>
                    <span className="text-xl font-semibold text-slate-800">
                        Bari<span className="text-indigo-600">Bari</span>
                    </span>
                </Link>
            </header>
            <main className="flex-1 flex items-center justify-center px-4 py-10">
                {children}
            </main>
            <footer className="py-5 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} BariBari Technologies Ltd.
            </footer>
        </div>
    );
}
