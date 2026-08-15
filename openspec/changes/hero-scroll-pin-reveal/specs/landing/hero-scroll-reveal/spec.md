## Purpose

Defines the scroll-driven visual behavior of the marketing homepage hero: an undistorted, section-confined parallax background and a product preview screenshot that scales up in place as the visitor scrolls, so the first impression of the product feels alive rather than static.

## ADDED Requirements

### Requirement: Undistorted hero background artwork
The hero background image SHALL render at its natural aspect ratio, cropped to fill its container without being stretched or squashed in either dimension.

#### Scenario: Background renders without distortion
- **WHEN** the homepage hero loads at any supported viewport width
- **THEN** the background artwork fills its container with a proportional crop, showing no visible stretching or squashing of the source image

### Requirement: Background parallax is confined to the hero and reveals vertically
The hero background SHALL remain visually confined to the hero section's bounds at all times, and SHALL reveal a vertically shifting portion of the source artwork as the visitor scrolls through the hero, without changing its rendered size or opacity.

#### Scenario: Background never renders outside the hero section
- **WHEN** the visitor scrolls the page to any position, including well past the hero into later sections
- **THEN** the background artwork is not visible outside the hero section's bounds

#### Scenario: Scrolling reveals more of the artwork
- **WHEN** the visitor scrolls from the top of the hero through the hero's scroll range
- **THEN** the visible portion of the background artwork shifts smoothly (for example, from the sky near the top of the range toward the flower field lower in the source image), while its rendered width, height, and opacity remain the same as at the top of the hero

### Requirement: Product preview starts compact
On initial load (before scrolling into the hero's animation range), the product preview screenshot SHALL render at a reduced scale within the page's normal content width, not enlarged.

#### Scenario: Screenshot is small on first paint
- **WHEN** the homepage loads and the visitor has not yet scrolled into the hero's animation range
- **THEN** the product preview screenshot is displayed at its reduced initial scale, constrained within the page's centered content container

### Requirement: In-place scroll-linked screenshot growth
As the visitor scrolls from the hero entering the viewport to the hero reaching the viewport's center, the product preview screenshot SHALL scale up smoothly in place, tracking scroll progress, without leaving its normal content container.

#### Scenario: Screenshot grows in step with scroll progress
- **WHEN** the visitor scrolls forward from the point the hero enters the viewport toward the point the hero reaches the viewport's center
- **THEN** the product preview screenshot's displayed scale increases smoothly in proportion to scroll progress through that range, remaining within its normal content container (no full-width breakout, no viewport pinning)

#### Scenario: Scrolling backward shrinks the screenshot back
- **WHEN** the visitor scrolls back upward while inside that same animation range
- **THEN** the product preview screenshot's displayed scale decreases in proportion to the new scroll position, matching the same progression used when scrolling forward

### Requirement: Reduced motion is respected
When the visitor has requested reduced motion at the operating-system level, the hero SHALL skip both the background's scroll-linked reveal and the screenshot's scroll-linked scale animation, instead rendering each in a single stable state.

#### Scenario: Reduced-motion visitor sees a static hero
- **WHEN** the visitor has `prefers-reduced-motion: reduce` enabled and loads the homepage
- **THEN** the background artwork does not shift on scroll and the product preview screenshot does not change scale on scroll, with both shown at one stable state regardless of scroll position
