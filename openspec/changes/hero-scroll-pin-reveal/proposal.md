## Why

The marketing homepage hero (`src/sections/HeroSection.tsx`) currently renders its background artwork with no `object-fit`, so the tall/portrait photo (`hero12.jpg`) gets stretched to the section's wide-short box and looks visibly squashed. Separately, the hero's "Product preview screenshot" is a static, small mockup with no scroll interaction, which undersells the product on first impression. The site should open with two simple, classic scroll effects: the background artwork reveals a shifting vertical slice of itself (sky → flower field) as the visitor scrolls through the hero — confined entirely to the hero section, never resizing or leaking into later sections — and the dashboard screenshot gently scales up in place as the visitor scrolls through the top portion of the hero.

## What Changes

- Fix the hero background image so it is no longer squished: apply proper `object-fit`/crop handling and let it keep its natural/portrait proportions.
- Give the hero background a scroll-linked, confined parallax reveal: it is clipped to the hero section's own bounds (`overflow-hidden`) and vertically translates as the visitor scrolls through the hero, revealing more of the tall source photo — no scaling, no opacity change, and it can never render outside the hero.
- Give the "Product preview screenshot" mockup a scroll-linked, in-place scale animation: it starts at a reduced scale (~0.85) and grows to a slightly enlarged scale (~1.15) as the visitor scrolls from the hero entering the viewport to the hero reaching the viewport's center. It stays within its normal `max-w-7xl` content container throughout — no full-width breakout, no viewport pinning.
- Remove the previously prototyped `useScroll`/`useTransform` wiring that scaled and faded the background; the background now only ever translates vertically, confined to the hero.
- **BREAKING**: None — this is a visual/behavioral change to an already-shipped hero section with no external API.

## Capabilities

### New Capabilities
- `landing/hero-scroll-reveal`: Scroll-driven hero behavior on the marketing homepage — a section-confined parallax reveal on the background and an in-place scroll-linked scale on the product preview screenshot.

### Modified Capabilities
(none — no existing specs cover the hero section yet)

## Impact

- Affected code: `src/sections/HeroSection.tsx` (background image markup/positioning, scroll wiring, product preview screenshot scale transform).
- Affected assets: `public/assets/hero12.jpg` (background artwork), `public/assets/banner.webp` (dashboard screenshot).
- New dependency behavior: relies on `framer-motion`'s `useScroll`/`useTransform` for both the background's vertical reveal and the screenshot's scale (already a project dependency); no new packages required.
- Layout impact: the background reveal relies on the hero section's own `overflow-hidden` clipping to stay confined — this is what prevents it from ever rendering outside the hero, resolving the earlier bleed-through concern by construction rather than by convention (no reliance on later sections having opaque backgrounds). No full-bleed breakout is introduced, so no new horizontal-overflow risk.
- No backend, API, or data model impact — purely a client-side presentational change on the public marketing homepage.
