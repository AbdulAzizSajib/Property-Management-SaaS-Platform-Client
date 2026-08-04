"use client";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Dashboard", href: "#product" },
  { name: "How it Works", href: "#howitworks" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  useEffect(() => {
    if (openMobileMenu) {
      document.body.classList.add("max-md:overflow-hidden");
    } else {
      document.body.classList.remove("max-md:overflow-hidden");
    }
  }, [openMobileMenu]);

  return (
    <div className="sticky top-4 z-50 px-4 will-change-transform">
      <nav className="mx-auto flex w-fit max-w-full items-center gap-10 rounded-full  border-b border-white/25  py-2.5 pl-5 pr-2 backdrop-blur-md shadow-[0_8px_32px_-12px_rgba(10,46,34,0.35)]">
        <Link
          href="/"
          className="flex shrink-0 flex-col items-center  text-jade-900 dark:text-jade-50 text-2xl font-bold tracking-tight relative"
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
              fill="#fff"
              d="M 1156.17 704.057 C 1165.62 709.999 1189.79 730.077 1199.78 737.954 C 1232.79 763.92 1265.63 790.088 1298.32 816.455 L 1573.77 1033.95 C 1559.4 1034.24 1499.39 1036.14 1489.09 1032.69 C 1475.17 1028.02 1460.98 1016.83 1448.48 1009.03 L 1378 965.121 C 1306.39 920.635 1231.94 876.987 1161.12 831.747 C 1148.71 838.78 1123.69 857.081 1111.02 865.707 L 1014.95 930.551 C 907.585 1003.92 799.428 1076.13 690.502 1147.16 L 495.835 1273.03 C 463.437 1293.65 423.702 1320.34 390.529 1338.03 C 406.372 1321.62 437.975 1295.44 455.536 1280.56 C 488.408 1252.41 521.487 1224.51 554.77 1196.85 L 695.66 1078.95 C 722.179 1056.67 751.695 1030.44 778.776 1009.4 C 777.735 986.8 778.572 957.352 778.594 934.29 L 778.619 789.032 C 815.8 789.05 853.371 788.795 890.52 789.278 C 890.683 815.378 890.691 841.478 890.544 867.578 C 890.556 883.121 891.24 904.906 890.214 919.622 C 979.24 853.148 1069.25 774.057 1156.17 704.057 z"
            ></path>
            <path
              transform="translate(0,0)"
              fill="#fff"
              d="M 1088.78 1065.28 C 1107.1 1066.51 1133.97 1065.68 1152.84 1065.65 C 1153.36 1086.21 1152.99 1108.84 1153.02 1129.55 C 1131.64 1129.28 1110.25 1129.25 1088.87 1129.46 C 1088.45 1108.45 1088.77 1086.37 1088.78 1065.28 z"
            ></path>
            <path
              transform="translate(0,0)"
              fill="#fff"
              d="M 1183.02 1065.44 C 1201.98 1065.05 1222.24 1065.3 1241.28 1065.23 C 1241.26 1073.17 1242.03 1125.66 1240.39 1129.39 L 1236.25 1129.6 L 1177.8 1129.53 C 1177.87 1121.15 1176.43 1069.6 1178.98 1065.78 L 1183.02 1065.44 z"
            ></path>
            <path
              transform="translate(0,0)"
              fill="#fff"
              d="M 1088.78 977.918 C 1107.09 976.886 1133.96 977.588 1152.88 977.566 L 1153 1040.87 C 1132.12 1040.51 1109.73 1040.95 1088.74 1041.01 L 1088.78 977.918 z"
            ></path>
            <path
              transform="translate(0,0)"
              fill="#fff"
              d="M 1177.96 977.928 L 1241.14 977.684 C 1241.64 997.869 1241.19 1020.46 1241.2 1040.81 L 1177.98 1040.94 C 1177.81 1019.94 1177.8 998.932 1177.96 977.928 z"
            ></path>
          </svg>
          <h2 className="bg-white bg-clip-text text-transparent z-10">
            Bariyan
          </h2>
        </Link>

        <div className="hidden lg:flex items-center gap-6 whitespace-nowrap text-[13.5px] font-medium text-white/90">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative py-2 transition-colors hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <ModeToggle />
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center whitespace-nowrap text-white transition px-3.5 py-2 rounded-full text-[13.5px] font-semibold hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="hidden sm:inline-flex items-center gap-2 whitespace-nowrap bg-jade-900 hover:bg-jade-950 transition text-paper px-4 py-2 rounded-full text-[13.5px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(13,79,63,0.25)] hover:-translate-y-0.5"
          >
            Get Started Free
            <span className="font-mono">→</span>
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpenMobileMenu((s) => !s)}
            className="lg:hidden text-white px-1.5"
          >
            {openMobileMenu ? <XIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {openMobileMenu && (
        <div className="lg:hidden mt-2 rounded-2xl border border-white/25 bg-white/15 backdrop-blur-xl px-5 py-5 flex flex-col gap-2 text-white font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setOpenMobileMenu(false)}
              className="py-2"
            >
              {link.name}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setOpenMobileMenu(false)}
            className="py-2 sm:hidden"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            onClick={() => setOpenMobileMenu(false)}
            className="mt-2 inline-flex items-center justify-center bg-jade-800 dark:bg-jade-700 dark:hover:bg-jade-500 text-paper px-4 py-2.5 rounded-lg sm:hidden"
          >
            Start free trial →
          </Link>
        </div>
      )}
    </div>
  );
}
