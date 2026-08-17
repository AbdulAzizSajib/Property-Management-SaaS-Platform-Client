## 1. Standardize outer section rhythm on `py-24 lg:py-32`

- [x] 1.1 `HeroSection.tsx`: change the section's `pb-16 pt-16 lg:pb-20 lg:pt-20` to `pb-24 pt-24 lg:pb-32 lg:pt-32`, keeping the existing `-mt-20 lg:-mt-24` negative offset untouched.
- [x] 1.2 `FeaturesSection.tsx`: change the section's `py-16 lg:py-20` to `py-24 lg:py-32`.
- [x] 1.3 Confirm `ProductDeepDive.tsx`, `HowItWorks.tsx`, `Testimonials.tsx`, `Pricing.tsx`, and `FaqSection.tsx` already use `py-24 lg:py-32` on their outer `<section>` — leave unchanged, no action needed beyond confirming.

## 2. Fix the `BottomBanner` transition

- [x] 2.1 `BottomBanner.tsx`: remove the `mt-20` utility from the section wrapper's className so its gap to `FaqSection` comes only from `FaqSection`'s bottom padding plus `BottomBanner`'s own top padding, matching every other section boundary.
- [x] 2.2 Visually confirm the gap above `BottomBanner` now looks the same size as the gap above `Pricing` and `FaqSection`. Confirmed via full-page screenshots (desktop/mobile, light/dark) — the gap now matches every other section boundary.

## 3. Align the two breakout-card sections

- [x] 3.1 Confirm `ProductDeepDive.tsx` and `BottomBanner.tsx` both use the exact same horizontal outdent (`mx-4 md:mx-8`) on their rounded wrapper — correct either one if it has drifted.
- [x] 3.2 Confirm neither section adds a bespoke extra top/bottom margin beyond the shared rhythm from Section 1 (re-check after task 2.1).

## 4. Reconcile the `Pricing` container width conflict

- [x] 4.1 `Pricing.tsx`: on the two `max-w-[1320px] mx-auto` grid wrappers (monthly and yearly plan grids), remove the ineffective `max-w-[1320px]` (replace with `max-w-full` or drop the utility) since both sit inside the outer `max-w-7xl` container and the wider value never applies.

## 5. Consolidate internal spacing scale — stat/metric tiles and cards

- [x] 5.1 `FeaturesSection.tsx`: review the report-stat tiles and utility rows (`gap-3`, `p-2.5`/`py-1.5`, `mt-3`, `mb-0.5` etc.) and align padding/gap values to the shared scale (`gap-3`/`gap-4`/`gap-6`, `p-5`/`p-6`, `px-4`/`px-5`, `py-2`/`py-3`) from design.md Decision 4; keep any half-step value only where it serves genuine optical alignment, with a short comment noting why. Done: `reportStats` number→label gap `mb-0.5` → `mb-1` to match the same value→caption gap used elsewhere (Testimonials `Stat`, ProductDeepDive stat change text). Kept the dense collection-row `px-2.5 py-1.5` (fitted around a 28px avatar circle) with an explanatory comment per the optical-alignment carve-out.
- [x] 5.2 `ProductDeepDive.tsx`: review the stat cards, tab pills, and table row padding (`px-4.5 py-2.5`, `px-4.5 py-3.5`, `mt-4.5 mb-2.5`, etc.) and align to the shared scale under the same rule. Done: the `topTabs` segmented-toggle pill (a real, interactive control, not screenshot chrome) changed from `px-4.5 py-2.5` to `px-4 py-2`, converging it with `Pricing`'s billing-cycle toggle — the same UI pattern in two sections. Left the fake dashboard screenshot's internal chrome (sidebar, stat tiles, table rows inside the `Reveal`-wrapped browser frame) untouched — those half-step values are precise fits for a simulated product screenshot, not marketing-page rhythm, and edits there carry the regression risk noted in design.md.
- [x] 5.3 `HowItWorks.tsx`: review step card padding (`p-5`, `pb-3.5 mb-4.5`) and align to the shared scale. Done: `pb-3.5 mb-4.5` → `pb-4 mb-4` on the step-number divider, heading `mb-2.5` → `mb-3`. Card's own `p-5` was already a coarse-scale value (4-column density explains it differing from the 3-column testimonial/pricing cards' `p-7`) — left as is.
- [x] 5.4 `Testimonials.tsx`: review testimonial card padding and meta spacing (`pt-7`, `mt-8`, `mt-0.5`) and align to the shared scale; compare directly against the `HowItWorks` step card from 5.3 so structurally similar cards end up with matching padding. Done: both name/meta caption gaps `mt-0.5` → `mt-1`, matching the same value→caption gap used in `Stat` and the FeaturesSection/ProductDeepDive equivalents from 5.1/5.2. `pt-7`/`mt-8`/`p-9`/`p-7` were already coarse-scale values proportional to card role (featured vs. standard) — left as is.
- [x] 5.5 `Pricing.tsx`: review plan card internal spacing (`mb-3`, `mb-6`, `pt-6 mb-8`) and align to the shared scale; keep consistent between the featured and standard plan card variants. Reviewed: both variants already use identical coarse-scale values (`p-7`, `mb-3`, `mb-6`, `pt-6 mb-8`) — no drift found, no change needed.
- [x] 5.6 `FaqSection.tsx`: review FAQ row padding (`py-6`, `mt-3.5`) and align to the shared scale. Done: expanded-answer gap `mt-3.5` → `mt-4`. Row `py-6` was already a coarse-scale value — left as is.

## 6. Verify

- [x] 6.1 Run the app via `/run` and visually compare the full landing page before/after at desktop and mobile widths, in both light and dark mode, confirming every section-to-section gap now reads as the same rhythm and no card's internal layout broke. Verified with Playwright full-page screenshots against the running dev server at desktop (1440px) and mobile (390px) widths, light and dark mode — rhythm is even end-to-end, no broken cards, no console errors.
- [x] 6.2 Spot-check the `Pricing` monthly/yearly toggle still renders the plan grid correctly after the `max-w-[1320px]` fix (task 4.1). Confirmed in the desktop screenshot: all 4 plan cards render in a row with equal gaps, no overflow.
- [x] 6.3 Run `openspec validate polish-landing-page-spacing --strict` and fix any reported issues.
