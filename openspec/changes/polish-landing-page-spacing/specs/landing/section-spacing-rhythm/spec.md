## Purpose

Defines the consistent outer vertical rhythm between landing page sections and the shared internal spacing scale within each section, so the page reads as one polished surface instead of independently-built blocks with mismatched gaps.

## ADDED Requirements

### Requirement: Uniform section vertical rhythm
Every active section rendered by `src/app/[locale]/(saasLandingPages)/page.tsx` (`HeroSection`, `FeaturesSection`, `ProductDeepDive`, `HowItWorks`, `Testimonials`, `Pricing`, `FaqSection`, `BottomBanner`) SHALL use the same top/bottom outer padding scale (a single value at the base breakpoint and a single value at the `lg` breakpoint), so no section reads as noticeably tighter or airier than its neighbors.

#### Scenario: Comparing padding across two adjacent standard sections
- **WHEN** the top padding of any active section is compared to the bottom padding of the section immediately before it in page order
- **THEN** both values belong to the same shared rhythm scale (same base-breakpoint value and same `lg`-breakpoint value as every other section-to-section boundary on the page)

#### Scenario: Hero and Features no longer read as cramped
- **WHEN** `HeroSection` and `FeaturesSection` are rendered against the sections that follow them
- **THEN** their outer vertical padding matches the shared rhythm scale used by `ProductDeepDive`, `HowItWorks`, `Testimonials`, `Pricing`, and `FaqSection`, rather than the narrower padding they use today

### Requirement: No stacked extra margin at section boundaries
A section SHALL NOT add its own extra top margin on top of the shared rhythm to create a bigger gap before it than exists at any other section boundary on the page.

#### Scenario: Gap before the closing CTA matches every other section gap
- **WHEN** the visual gap between `FaqSection` and `BottomBanner` is measured
- **THEN** it equals the shared rhythm gap used between every other pair of adjacent sections, with no additional stacked margin unique to `BottomBanner`

### Requirement: Consistent treatment of breakout card sections
Sections that render as an inset "card" against the page background (currently `ProductDeepDive` and `BottomBanner`, identifiable by rounded corners and a horizontal outdent) SHALL use the same horizontal outdent value and the same vertical spacing relationship to their neighbors as each other, so the two card sections feel like one consistent pattern rather than two independently-tuned ones.

#### Scenario: Both breakout cards share the same outdent
- **WHEN** the horizontal margin/outdent of `ProductDeepDive`'s rounded container is compared to `BottomBanner`'s rounded container
- **THEN** both use the same value at the same breakpoints

### Requirement: Shared internal spacing scale within sections
Recurring internal UI patterns that appear in more than one section — stat/metric tiles, list rows, tab/filter pills, step cards, testimonial cards, pricing cards, and FAQ rows — SHALL draw their padding and gap values from a small shared spacing scale rather than one-off arbitrary values chosen independently per section, so structurally similar elements have visually consistent padding regardless of which section they appear in.

#### Scenario: Redundant container width is reconciled
- **WHEN** an inner content wrapper declares a `max-width` that is wider than the outer container it is already constrained by (e.g. `Pricing`'s plan-grid wrapper today)
- **THEN** the inner value is removed or corrected so it no longer conflicts with, or is silently overridden by, the outer container's width

#### Scenario: Structurally similar cards share padding
- **WHEN** two structurally similar card/tile components in different sections (e.g. a `HowItWorks` step card and a `Testimonials` testimonial card) are compared
- **THEN** their internal padding values come from the same shared spacing scale rather than differing by an arbitrary, unexplained amount
