import { ChevronRightIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <div className="flex flex-col items-center justify-center text-center bg-[url('/assets/hero-section-dot-image.png')] bg-cover bg-no-repeat">
            <a
                href="#"
                className="flex items-center gap-2 rounded-full p-1 pr-3 mt-44 text-indigo-600 bg-indigo-50"
            >
                <span className="bg-indigo-600 text-white text-xs px-3.5 py-1 rounded-full">
                    NEW
                </span>
                <p className="flex items-center gap-1">
                    <span>30 days free trial — no card required </span>
                    <ChevronRightIcon size={16} />
                </p>
            </a>
            <h1 className="text-[40px]/12 md:text-[54px]/16 font-semibold max-w-3xl mt-4">
                Manage every flat, tenant and{" "}
                <span className="bg-linear-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                    taka of rent
                </span>{" "}
                from one place
            </h1>
            <p className="text-base text-slate-600 max-w-lg mt-5">
                Bangladesh’s all-in-one property management platform — collect rent via
                bKash & Nagad, track leases, and keep tenants happy with automated Bangla
                SMS.
            </p>
            <div className="flex items-center gap-4 mt-6">
                <Link
                    href="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 transition px-8 py-3 rounded-md text-white"
                >
                    Start Free Trial
                </Link>
                <button className="flex items-center justify-center gap-2 border border-indigo-400 px-5 py-3 rounded-md text-indigo-600">
                    <SparklesIcon size={16} />
                    <span>Watch Demo</span>
                </button>
            </div>
            <Image
                className="w-full max-w-xl mt-16 drop-shadow-2xl drop-shadow-blue-500/15 mx-auto"
                src="/assets/hero-section-card-image.svg"
                alt="BariBari dashboard preview"
                width={1000}
                height={500}
                priority
                fetchPriority="high"
            />
        </div>
    );
}
