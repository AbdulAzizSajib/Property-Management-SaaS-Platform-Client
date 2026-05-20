import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
            {/* Decorative background */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,theme(colors.indigo.100),transparent_60%),radial-gradient(circle_at_80%_80%,theme(colors.violet.100),transparent_55%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,theme(colors.slate.200)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.slate.200)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
            />

            <div className="w-full max-w-md text-center">
                {/* 404 mark */}
                <div className="relative mx-auto mb-8 flex items-center justify-center">
                    <span
                        aria-hidden
                        className="select-none bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-[140px] font-bold leading-none tracking-tighter text-transparent sm:text-[180px]"
                    >
                        404
                    </span>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    Page not found
                </h1>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been
                    moved or no longer exists.
                </p>

                <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
                    <Link
                        href="/"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 sm:w-auto"
                    >
                        <Home size={15} />
                        Back to home
                    </Link>
                    <Link
                        href="/owner/dashboard"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto"
                    >
                        <ArrowLeft size={15} />
                        Go to dashboard
                    </Link>
                </div>

                <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs text-slate-500 backdrop-blur">
                    <Search size={12} />
                    <span>Need help? </span>
                    <Link
                        href="/"
                        className="font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        Contact support
                    </Link>
                </div>
            </div>
        </main>
    );
}
