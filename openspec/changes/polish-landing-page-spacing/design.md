## Context

See `proposal.md` - Why. This touches all 8 active section components under `src/sections/` plus the composition in `src/app/[locale]/(saasLandingPages)/page.tsx`. There is no existing spacing token system for the landing page (unlike the dashboard's documented design system) — every section was hand-tuned with Tailwind arbitrary values. Six of the eight sections (`ProductDeepDive`, `HowItWorks`, `Testimonials`, `Pricing`, `FaqSection`, and `BottomBanner`'s own `py-*`) already converge on `py-24 lg:py-32`, so that is the existing majority convention rather than a new invention.

## Goals / Non-Goals

**Goals:**
- Pick one section-rhythm value (base + `lg`) and apply it to every active section's outer padding.
- Remove `BottomBanner`'s extra stacked `mt-20` so its gap to `FaqSection` matches the shared rhythm.
- Give `ProductDeepDive` and `BottomBanner` (the two rounded "breakout card" sections) the same horizontal outdent and consistent spacing relative to neighbors.
- Define a short internal spacing scale (a handful of allowed padding/gap steps) and reapply it to the recurring internal patterns named in the spec, fixing the `Pricing` inner `max-w-[1320px]`-inside-`max-w-7xl` conflict along the way.

**Non-Goals:**
- No copy, color, dark-mode token, animation/`Reveal`, or component-logic changes.
- No change to the shared horizontal container (`max-w-7xl mx-auto px-5 md:px-8`) or `SectionHead` — both are already consistent and out of scope.
- No changes to `TrustedCompanies`/`IntegrationsSection` (currently commented out) or `HeroSection-copy.tsx` (unused).
- Not building a formal design-token file/CSS variables for this pass — this is a Tailwind-class normalization, not a tokenization system. (A future change could formalize a shared scale if the dashboard-style system in memory is ever extended to the landing page.)

## Decisions

1. **Standardize the section rhythm on `py-24 lg:py-32`, adjusting `HeroSection` and `FeaturesSection` up to match** (rather than pulling the other six sections down to `py-16 lg:py-20`).
   - Rationale: six of eight active sections already use this value — it's the existing majority pattern, so this is normalization, not a new invention. Pulling everything down to the tighter scale would be a bigger, more visually disruptive change (shrinking five already-shipped sections) for the same consistency outcome.
   - `HeroSection` keeps its own `-mt-20 lg:-mt-24` negative offset (it compensates for the fixed navbar/hero background bleed, not part of the inter-section rhythm) — only its `pt-*`/`pb-*` pair changes to match the shared rhythm.
   - Alternative considered: introduce a distinct "hero" rhythm value since the hero is visually unique (dark background image vs. the paper/cream sections after it). Rejected — the user's complaint is specifically about inconsistent gaps, and a hero-specific exception would reintroduce the same kind of special-casing this change removes elsewhere.

2. **Drop `BottomBanner`'s `mt-20` entirely**; its gap to `FaqSection` comes only from `FaqSection`'s bottom padding plus `BottomBanner`'s own top padding, same as every other section pair.
   - Alternative considered: keep a small extra margin because `BottomBanner` is a color/shape break (rounded card). Rejected by Decision 3 — the breakout-card treatment already accounts for the visual separation via its outdent and rounded corners; no additional margin is needed on top of that.

3. **Give both breakout-card sections the same horizontal outdent and let them sit in the normal flow like any other section** — no bespoke top/bottom margin beyond the shared rhythm. `ProductDeepDive` and `BottomBanner` already both use `mx-4 md:mx-8`; verify both stay on that exact pair of values and that neither adds a competing margin utility.

4. **Introduce a small internal spacing scale used across recurring UI patterns** (stat tiles, list rows, pills, step/testimonial/pricing cards, FAQ rows): standardize on the existing Tailwind default steps already dominant in the codebase (`gap-3`/`gap-4`/`gap-6`, `p-5`/`p-6`, `px-4`/`px-5`, `py-2`/`py-3`) and remove near-duplicate half-step arbitrary values (`px-4.5`, `mb-4.5`, `mt-4.5`, `gap-2.5` used inconsistently, etc.) where they don't serve a specific optical-alignment purpose. Where a half-step value is intentionally there for genuine optical alignment (e.g. aligning an icon baseline), keep it and leave a short comment rather than force it onto the coarser scale.
   - Rationale: matches the "no rainbow, no one-offs" discipline already established for the product's dashboard design system — same spirit applied to spacing instead of color.
   - Alternative considered: define a formal spacing token file (CSS custom properties or a Tailwind theme extension) now. Rejected as out of scope for this pass (see Non-Goals) — the fix here is consistency of usage, not a new abstraction layer; revisit if/when the landing page gets its own documented design system.

5. **Fix `Pricing`'s inner `max-w-[1320px]` grids**: since they sit inside the outer `max-w-7xl` (1280px) container, the 1320px value never takes effect. Change it to `max-w-full` (or remove the utility) so the class list no longer implies a width that can't actually apply.

## Risks / Trade-offs

- [Risk] Standardizing `HeroSection`/`FeaturesSection` up to `py-24 lg:py-32` measurably increases the page's total scroll height. → Mitigation: this is an accepted, intentional part of the fix (both were the outliers); verify on mobile that the hero doesn't push the fold too far before first content.
- [Risk] Touching every section's outer wrapper in one change is easy to visually miss a regression in. → Mitigation: task list requires a full-page visual pass (desktop + mobile, light + dark) comparing before/after screenshots per section, not just a diff read.
- [Risk] Collapsing half-step spacing values (`px-4.5`, `gap-2.5`, etc.) onto the coarser scale could subtly shift alignment in a few dense UI mockups (e.g. `ProductDeepDive`'s dashboard preview, `FeaturesSection`'s collection-row preview) that were likely hand-tuned pixel-by-pixel. → Mitigation: Decision 4 explicitly allows keeping a half-step value with a comment when it's there for optical alignment rather than forcing every value onto the coarse scale.

## Open Questions

None — the rhythm value, breakout-card treatment, and internal scale are decided above; remaining work is mechanical application per `tasks.md`.
