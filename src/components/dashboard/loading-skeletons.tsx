import { cn } from "@/src/lib/utils";

/**
 * Shared route-level loading skeletons for the owner dashboard.
 *
 * These render from `loading.tsx` files while a route segment's JS chunk
 * loads during navigation, before the page's own React Query skeletons take
 * over. They mirror the real layouts (list vs. detail) so navigation feels
 * instant and on-brand instead of falling back to a generic spinner.
 */

/** Skeleton block tuned for the cream surface (design system: rounded-[10px]). */
function Sk({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-[10px] bg-rule-soft/55", className)}
    />
  );
}

/** Matches the standard list page: header + summary strip + table/list card. */
export function ListPageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto container container space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Sk className="h-3 w-24" />
            <Sk className="h-7 w-44" />
            <Sk className="h-3 w-36" />
          </div>
          <Sk className="h-9 w-36 rounded-[9px]" />
        </header>

        {/* Summary strip + search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-7 rounded-[14px] border border-rule-soft bg-paper px-5 py-3.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Sk className="size-4 rounded-md" />
                <Sk className="h-5 w-16" />
              </div>
            ))}
          </div>
          <Sk className="h-9 w-full rounded-md sm:w-72" />
        </div>

        {/* List card */}
        <div className="overflow-hidden rounded-[14px] border border-rule-soft bg-paper">
          <div className="border-b border-rule-soft bg-cream/60 px-4 py-2.5">
            <Sk className="h-3 w-32 bg-rule-soft/70" />
          </div>
          <ul className="divide-y divide-rule-soft">
            {Array.from({ length: rows }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3.5">
                <Sk className="size-9 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Sk className="h-3.5 w-1/3" />
                  <Sk className="h-3 w-1/2" />
                </div>
                <Sk className="hidden h-5 w-16 rounded-md sm:block" />
                <Sk className="hidden h-5 w-20 rounded-md md:block" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Matches detail pages: back link + header + content cards grid. */
export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-270 space-y-5 p-4 sm:p-6 lg:p-8">
        {/* Back link */}
        <Sk className="h-4 w-28" />

        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Sk className="h-3 w-20" />
            <Sk className="h-7 w-56" />
            <Sk className="h-3 w-40" />
          </div>
          <div className="flex gap-2">
            <Sk className="h-9 w-24 rounded-[9px]" />
            <Sk className="h-9 w-24 rounded-[9px]" />
          </div>
        </header>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
              <Sk className="h-4 w-28" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4"
                  >
                    <Sk className="h-3 w-24" />
                    <Sk className="h-3 w-32" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
              <Sk className="h-4 w-24" />
              <Sk className="mt-4 h-24 w-full" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
              <Sk className="h-4 w-20" />
              <Sk className="mt-4 h-16 w-full" />
            </div>
            <div className="rounded-[14px] border border-rule-soft bg-paper p-5">
              <Sk className="h-4 w-28" />
              <div className="mt-4 space-y-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Sk key={i} className="h-9 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
