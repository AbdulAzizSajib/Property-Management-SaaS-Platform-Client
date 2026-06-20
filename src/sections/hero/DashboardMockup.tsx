import Image from "next/image";

export default function DashboardMockup() {
    return (
        <div className="relative">
            {/* Soft glow behind the window */}
            <div
                aria-hidden
                className="absolute -inset-4 -z-10 rounded-[32px] opacity-70 blur-2xl"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 35%, rgba(13,79,63,0.18), transparent 70%)",
                }}
            />

            {/* hover-3d wrapper — must NOT clip overflow, or the 3D faces flatten */}
            <div className="">
                {/* content (front face) — rounded corners & clip live here */}
                <figure
                    className="m-0 overflow-hidden"
                    style={{
                        boxShadow:
                            "0 1px 0 rgba(255,255,255,0.6) inset, 0 40px 80px -28px rgba(10,46,34,0.35), 0 16px 40px -16px rgba(10,46,34,0.20)",
                    }}
                >
                    {/* Chrome bar */}
                    <div className="flex items-center gap-2 border-b border-rule-soft bg-cream px-3.5 py-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#f9beb2]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#fadea2]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#b4ddc5]" />
                        <span className="ml-3 inline-flex max-w-65 flex-1 items-center gap-1.5 rounded-md border border-rule-soft bg-paper px-3 py-1 font-mono text-[11px] text-ink-soft">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path
                                    d="M3 4.5V3a2 2 0 114 0v1.5M2.5 4.5h5v4h-5v-4z"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            bariyan.com / owner / dashboard
                        </span>
                    </div>

                    <Image
                        src="/assets/dashboard.png"
                        alt="Bariyan owner dashboard"
                        width={1887}
                        height={907}
                        priority
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="block h-auto w-full"
                    />
                </figure>
            </div>
        </div>
    );
}
