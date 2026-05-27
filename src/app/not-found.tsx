import Link from "next/link";
import { ArrowRight, Home, LifeBuoy } from "lucide-react";

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-5 py-12">
            {/* Atmospheric dotted backdrop — same family as the hero */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(13,79,63,0.07) 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                    maskImage:
                        "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 75%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 75%)",
                }}
            />
            {/* Soft jade wash, top-right */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-32 right-[-10%] h-[600px] w-[600px] opacity-60"
                style={{
                    background:
                        "radial-gradient(circle, rgba(13,79,63,0.10), transparent 60%)",
                }}
            />
            {/* Coral wash, bottom-left */}
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-40 left-[-10%] h-[500px] w-[500px] opacity-40"
                style={{
                    background:
                        "radial-gradient(circle, rgba(255,123,87,0.25), transparent 60%)",
                }}
            />

            <div className="relative w-full max-w-lg text-center">
                {/* Brand wordmark — small, atmospheric */}
                <Link
                    href="/"
                    className="inline-flex items-center text-jade-900 text-[28px] font-rubita mb-10"
                >
                    Bari<span className="text-coral-600">yan</span>
                </Link>

                {/* 404 — bold + editorial italic accent */}
                <div className="relative mb-2 select-none leading-none">
                    <span className="block text-[140px] sm:text-[180px] font-bold tracking-[-0.05em] text-jade-950">
                        404
                        <span className="text-coral-600">.</span>
                    </span>
                </div>

                {/* Eyebrow */}
                <p className="font-serif italic text-coral-600/90 text-[15px] mb-3">
                    Lost in the building.
                </p>

                {/* H1 */}
                <h1 className="text-[28px] sm:text-[34px] font-bold tracking-[-0.025em] text-jade-950">
                    Page not found
                </h1>

                {/* Bangla sub */}
                <p className="font-bangla mt-1.5 text-[16px] text-jade-800">
                    এই পৃষ্ঠাটি খুঁজে পাওয়া যাচ্ছে না
                </p>

                {/* Body */}
                <p className="mx-auto mt-4 max-w-sm text-[14px] leading-[1.6] text-ink-soft">
                    The link may be broken, or the page may have moved.
                    Let&apos;s get you back on track.
                </p>

                {/* CTAs */}
                <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
                    <Link
                        href="/"
                        className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[10px] bg-jade-900 hover:bg-jade-950 transition-colors px-5 py-3 text-[14px] font-semibold text-paper shadow-[0_10px_30px_-12px_rgba(13,79,63,0.45)]"
                    >
                        <Home size={15} />
                        Back to home
                        <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-0.5"
                        />
                    </Link>
                    <Link
                        href="/owner/dashboard"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[10px] border border-rule-soft bg-paper hover:border-jade-700/30 hover:text-jade-900 transition-colors px-5 py-3 text-[14px] font-medium text-ink"
                    >
                        Go to dashboard
                    </Link>
                </div>

                {/* Support pill */}
                <div className="mt-9 inline-flex items-center gap-2 rounded-full border border-rule-soft bg-paper/70 backdrop-blur-md px-3 py-1.5 text-[12px] text-ink-soft">
                    <LifeBuoy size={12} className="text-jade-700" />
                    <span>Need help?</span>
                    <Link
                        href="/"
                        className="font-semibold text-jade-900 hover:text-coral-600 transition-colors"
                    >
                        Contact support
                    </Link>
                </div>
            </div>
        </main>
    );
}
