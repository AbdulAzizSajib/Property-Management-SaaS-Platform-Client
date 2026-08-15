## 1. Background parallax reveal (confined to the hero)

- [x] 1.1 On the hero background `<Image>` (`hero12.jpg`), set `object-cover object-top` (or the crop position that best frames the artwork) so it renders undistorted at any viewport width.
- [x] 1.2 Build the confined wrapper: outer `absolute inset-0 overflow-hidden` inside the hero `<section>`, containing an inner `motion.div` sized taller than the clip window (e.g. `h-[130%] top-[-12%]`) that holds the `<Image>`.
- [x] 1.3 Wire a `useScroll({ target: sectionRef, offset: ["start start", "end start"] })` call and drive the inner layer's `y` via `useTransform(..., [0, 1], ["0%", "-18%"])` — only `y` animates, no scale/opacity. Remove the earlier prototype's `bgScale`/`bgOpacity` values entirely.
- [ ] 1.4 Verify visually (via `/run`) that: (a) the background no longer looks stretched/squashed, (b) it never renders outside the hero section's bounds at any scroll position (including well past the hero, into `FeaturesSection` and later), and (c) scrolling through the hero visibly reveals more of the source photo (sky → flower field), not just a static crop.

## 2. Product preview: in-place scroll-linked scale

- [x] 2.1 Add a dedicated `previewRef` on the screenshot's own wrapper and track `useScroll` against it directly (`offset: ["start end", "end center"]`, widened from the initially-tried `["start end", "center center"]`) instead of the whole hero section — keeps growth in sync with when the screenshot itself is actually scrolling through the viewport, and the wider range keeps it from being overly sensitive to a light, Lenis-smoothed scroll input.
- [x] 2.2 Update `previewScale` to `useTransform(scrollYProgress, [0, 1], [0.6, 1.15])` and confirm it's applied via `style={{ scale: previewScale }}` on the existing screenshot wrapper — no full-bleed/breakout container, no `position: sticky`.
- [ ] 2.3 Verify the screenshot renders at its small (~0.6) scale on first paint (before scrolling into range), grows smoothly (no decoupled shrink-then-jump) as it scrolls, and that a light/brief scroll touch only moves it a little rather than swinging through most of the range.
- [ ] 2.4 Verify scrolling backward within that range shrinks the screenshot back in sync (no snapping/jump), and that the screenshot isn't excessively clipped above the viewport once fully grown.

## 3. Accessibility and final verification

- [x] 3.1 Add a single `useReducedMotion()` check gating both effects: the background's `y` pinned to `"0%"` and the screenshot's `scale` pinned to `1` when reduced motion is requested, instead of tracking their respective `scrollYProgress`.
- [ ] 3.2 Test with `prefers-reduced-motion: reduce` enabled (OS or devtools emulation) and confirm the background does not shift and the screenshot renders at one stable scale, with no animation on either.
- [ ] 3.3 Run the hero interaction end-to-end via `/run` (or manual scroll test) at desktop and mobile widths and confirm it matches the spec scenarios in `specs/landing/hero-scroll-reveal/spec.md`.
- [ ] 3.4 Run `openspec validate hero-scroll-pin-reveal --strict` and fix any reported issues before archiving.
