"use client";

import { motion } from "framer-motion";
import { Download, Plus, ChevronDown } from "lucide-react";
import { useCurrentUser } from "@/src/hooks/useAuthActions";
import { useTranslations, useFormatter } from "next-intl";
const ease = [0.22, 1, 0.36, 1] as const;

export function PageHeader({ name }: { name: string }) {
  const t = useTranslations("Dashboard");
  const format = useFormatter();
  const today = format.dateTime(new Date(), {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const { data: me } = useCurrentUser();
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p className="mb-1  text-[14px] text-coral-600/90">{today}</p>
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[32px]">
          {t("welcomeBack", { name: me?.name ?? "" })}
          {/* Welcome back, {me?.name} */}
        </h1>
        <p className="mt-1 text-[14px] text-ink-soft">
          {/* What's happening today, at a glance. */}
          {t("glance")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[9px] border border-rule-soft bg-paper px-3.5 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:border-jade-700/30 hover:text-jade-900"
        >
          <Download size={14} />
          {/* Export */}
          {t("export")}
        </button>

        {/* QuickActions demoted: a single split-button menu instead of a rainbow grid */}
        <div className="relative inline-flex">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-l-[9px] bg-jade-900 px-4 py-2 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
          >
            <Plus size={14} />
            {/* Add new */}
            {t("addNew")}
          </button>
          <button
            type="button"
            aria-label="More actions"
            className="inline-flex items-center rounded-r-[9px] border-l border-jade-700/40 bg-jade-900 px-2 py-2 text-paper transition-colors hover:bg-jade-950"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
