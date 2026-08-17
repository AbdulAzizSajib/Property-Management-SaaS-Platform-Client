## Why

The public marketing landing page (`src/app/[locale]/(saasLandingPages)/page.tsx`) stacks 8 active sections (`HeroSection`, `FeaturesSection`, `ProductDeepDive`, `HowItWorks`, `Testimonials`, `Pricing`, `FaqSection`, `BottomBanner`) that were each built independently. Their outer vertical padding is inconsistent (`HeroSection` and `FeaturesSection` use `py-16 lg:py-20`/`pb-16 pt-16 lg:pb-20 lg:pt-20` while the other five use `py-24 lg:py-32`), and `BottomBanner` stacks an extra `mt-20` on top of `FaqSection`'s own bottom padding, producing a visibly larger gap before the final CTA than any other section-to-section transition. Within sections, spacing utilities (heading-to-content gaps, card padding, list-row padding, badge/pill padding) are hand-picked per element with no shared scale, so near-identical UI (stat cards, list rows, pills) ends up with different padding depending on which section it lives in. The overall effect reads as uneven rhythm rather than one polished page.

## What Changes

- Establish one consistent vertical section rhythm (top/bottom padding) applied uniformly across all active landing sections, replacing the two different scales currently in use (`py-16/py-20` vs `py-24/py-32`).
- Normalize the transition into `BottomBanner`: remove the stacked extra `mt-20` so the gap before the closing CTA matches the rhythm used between every other pair of sections.
- Define a consistent outdent/margin treatment for the two "breakout card" sections (`ProductDeepDive`, `BottomBanner`, both `rounded-3xl`/`rounded-[28px]` with `mx-4 md:mx-8`) so they sit in the page flow the same way relative to their neighbors.
- Audit and consolidate the arbitrary, one-off spacing/padding values inside each section's internal UI (mockup cards, stat tiles, list rows, tab pills, step cards, testimonial cards, pricing cards, FAQ rows) onto a small shared spacing scale, removing redundant or conflicting values (e.g. `Pricing`'s inner `max-w-[1320px]` grids nested inside an already-narrower `max-w-7xl` container, which has no effect and should be reconciled).
- Keep the shared horizontal container (`max-w-7xl mx-auto px-5 md:px-8`) and the shared `SectionHead` heading component as-is — they are already consistent across sections and are not part of this change.
- No copy, color, animation, or component-logic changes — this is a spacing/padding/margin-only visual polish pass. `TrustedCompanies` and `IntegrationsSection` are currently commented out of `page.tsx` and are out of scope.
- **BREAKING**: None — purely visual spacing adjustments to an already-shipped public page, no API or markup contract changes.

## Capabilities

### New Capabilities
- `landing/section-spacing-rhythm`: The consistent outer vertical rhythm (section padding and inter-section gaps, including breakout card sections) and the shared internal spacing scale applied across all active landing page sections.

### Modified Capabilities
(none — no existing specs cover landing page section spacing yet; `landing/hero-scroll-reveal` covers the hero's scroll animation only and is unaffected)

## Impact

- Affected code: `src/sections/HeroSection.tsx`, `src/sections/FeaturesSection.tsx`, `src/sections/ProductDeepDive.tsx`, `src/sections/HowItWorks.tsx`, `src/sections/Testimonials.tsx`, `src/sections/Pricing.tsx`, `src/sections/FaqSection.tsx`, `src/sections/BottomBanner.tsx` (outer section padding/margin and internal spacing utility classes only).
- Not affected: `src/components/SectionHead.tsx` (already consistent), page composition in `src/app/[locale]/(saasLandingPages)/page.tsx`, any data-fetching/business logic, `HeroSection-copy.tsx` (unused reference file), `TrustedCompanies`/`IntegrationsSection` (currently disabled).
- No backend, API, or data model impact — purely a client-side Tailwind class change on the public marketing homepage.
- Visual regression risk: since every active section is touched, a full visual pass (desktop + mobile, light + dark) of the whole landing page is required before/after to confirm nothing shifts unexpectedly.
