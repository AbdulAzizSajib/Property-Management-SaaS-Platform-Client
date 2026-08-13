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

      <div className="relative w-full max-w-lg text-center flex flex-col items-center justify-center">
        {/* Brand wordmark — small, atmospheric */}
        <Link
          href="/"
          className="flex flex-col items-start  text-jade-900 dark:text-jade-50 text-3xl font-bold tracking-tight relative"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
            viewBox="366.667 680 1230.667 682.667"
            className="h-7 w-auto absolute -top-3.5 left-[-15.5px]"
            preserveAspectRatio="none"
          >
            <path
              transform="translate(0,0)"
              fill="#247460"
              d="M 1156.17 704.057 C 1165.62 709.999 1189.79 730.077 1199.78 737.954 C 1232.79 763.92 1265.63 790.088 1298.32 816.455 L 1573.77 1033.95 C 1559.4 1034.24 1499.39 1036.14 1489.09 1032.69 C 1475.17 1028.02 1460.98 1016.83 1448.48 1009.03 L 1378 965.121 C 1306.39 920.635 1231.94 876.987 1161.12 831.747 C 1148.71 838.78 1123.69 857.081 1111.02 865.707 L 1014.95 930.551 C 907.585 1003.92 799.428 1076.13 690.502 1147.16 L 495.835 1273.03 C 463.437 1293.65 423.702 1320.34 390.529 1338.03 C 406.372 1321.62 437.975 1295.44 455.536 1280.56 C 488.408 1252.41 521.487 1224.51 554.77 1196.85 L 695.66 1078.95 C 722.179 1056.67 751.695 1030.44 778.776 1009.4 C 777.735 986.8 778.572 957.352 778.594 934.29 L 778.619 789.032 C 815.8 789.05 853.371 788.795 890.52 789.278 C 890.683 815.378 890.691 841.478 890.544 867.578 C 890.556 883.121 891.24 904.906 890.214 919.622 C 979.24 853.148 1069.25 774.057 1156.17 704.057 z"
            ></path>
            <path
              transform="translate(0,0)"
              fill="#247460"
              d="M 1088.78 1065.28 C 1107.1 1066.51 1133.97 1065.68 1152.84 1065.65 C 1153.36 1086.21 1152.99 1108.84 1153.02 1129.55 C 1131.64 1129.28 1110.25 1129.25 1088.87 1129.46 C 1088.45 1108.45 1088.77 1086.37 1088.78 1065.28 z"
            ></path>
            <path
              transform="translate(0,0)"
              fill="#247460"
              d="M 1183.02 1065.44 C 1201.98 1065.05 1222.24 1065.3 1241.28 1065.23 C 1241.26 1073.17 1242.03 1125.66 1240.39 1129.39 L 1236.25 1129.6 L 1177.8 1129.53 C 1177.87 1121.15 1176.43 1069.6 1178.98 1065.78 L 1183.02 1065.44 z"
            ></path>
            <path
              transform="translate(0,0)"
              fill="#247460"
              d="M 1088.78 977.918 C 1107.09 976.886 1133.96 977.588 1152.88 977.566 L 1153 1040.87 C 1132.12 1040.51 1109.73 1040.95 1088.74 1041.01 L 1088.78 977.918 z"
            ></path>
            <path
              transform="translate(0,0)"
              fill="#247460"
              d="M 1177.96 977.928 L 1241.14 977.684 C 1241.64 997.869 1241.19 1020.46 1241.2 1040.81 L 1177.98 1040.94 C 1177.81 1019.94 1177.8 998.932 1177.96 977.928 z"
            ></path>
          </svg>
          <h2 className="bg-coral-500 bg-clip-text text-transparent z-10">
            Bariyan
          </h2>
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

        {/* Body */}
        <p className="mx-auto mt-4 max-w-sm text-[14px] leading-[1.6] text-ink-soft">
          The link may be broken, or the page may have moved. Let&apos;s get you
          back on track.
        </p>

        {/* CTAs */}
        <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[10px] bg-sky-950 hover:bg-sky-950 transition-colors px-5 py-3 text-[14px] font-semibold text-paper shadow-[0_10px_30px_-12px_rgba(13,79,63,0.45)]"
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
