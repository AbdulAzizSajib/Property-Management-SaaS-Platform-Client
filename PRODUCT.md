# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user: individual landlords/property owners in Bangladesh, managing anywhere from a single flat to a 30-storey tower themselves. Owner is both buyer and daily user.

Supporting roles invited by the owner into the same workspace: manager, caretaker, and tenant, each with their own dashboard (`/owner`, `/manager`, `/caretaker`, `/tenant` under `(dashboardLayout)`). A platform `admin` role manages the SaaS itself (plans, subscriptions) separately from any landlord's workspace.

Tenants are a secondary audience reached through the product (SMS/payment links) rather than through the marketing site — they use their existing mobile banking app (bKash/Nagad/Rocket) to pay, not a Bariyan-specific app.

## Product Purpose

Bariyan is a rental-property management workspace for Bangladeshi landlords. It replaces the spreadsheet-plus-messaging-app workflow (Excel for records, WhatsApp/phone calls for rent reminders, paper receipts) with one connected system: rent collection, tenant/lease records, maintenance requests, utility/service-charge splits, and reporting, in one place, in Bangla or English.

Success = a landlord can go from signup to tracking every taka in under 10 minutes, without spreadsheet migration or an installer visit (per existing landing copy), and can see collection/occupancy/expense status without manual reconciliation.

## Positioning

The differentiator is consolidation, not any single local-market mechanism: Bariyan's edge is being the one workspace that replaces the *combination* a landlord currently duct-tapes together (Excel + bKash/Nagad app + WhatsApp reminders + paper receipts + phone calls for disputes), rather than being a generic property-management tool that happens to support BDT and Bangla. A competitor could copy Bangla-language support or bKash integration piecemeal; the harder-to-copy part is owning the full landlord workflow end to end so nothing has to be reconciled by hand across tools.

Local specifics (BDT currency, Bangla dashboard/SMS, bKash/Nagad/Rocket payment rails, TDS/tax reporting) are real product capabilities that serve this consolidation, not the positioning claim itself.

## Operating Context

- Landlords manage buildings composed of flats/units; each unit has a tenant, a lease, a rent amount, and a running balance.
- Recurring monthly workflow: record rent payments (cash, bKash, Nagad, bank), send/auto-send reminders for unpaid rent, log utility and service-charge bills (gas, water, lift, security/generator) and split them, handle tenant-reported maintenance/complaints, and pull reports (financial, collection, occupancy, expense).
- Tenants pay via payment links sent over SMS/WhatsApp, confirmed in their own mobile banking app — no separate tenant app to install.
- The whole product (marketing site and dashboard) is bilingual: a single toggle switches between Bangla and English.
- Disputes over a payment are resolved by Bariyan support liaising with the wallet provider, using logged transaction IDs and timestamps.
- Support is offered in Bangla and English via WhatsApp, phone, and email.

## Capabilities and Constraints

- Confirmed roles/routes in the codebase: `admin`, `owner`, `manager`, `caretaker`, `tenant`, each with a distinct dashboard.
- Payment rails referenced: bKash, Nagad, Rocket, Upay, City Bank (bank transfer) — `--color-bkash`, `--color-nagad`, `--color-rocket`, `--color-upay`, `--color-citybank` are registered brand-color tokens in `globals.css`.
- Locales: `en` (default) and `bn`, routed via `next-intl` (`src/i18n/routing.ts`).
- Currency is always BDT (৳), formatted with `Intl.NumberFormat("en-BD")` — no multi-currency support implied anywhere in the code.
- Subscription/billing exists (plans fetched via `usePlans`/`useSubscription`, unit and building usage limits shown in the owner sidebar) — plan names, prices, and tiers currently rendered are **illustrative, not finalized pricing**; do not treat specific numbers seen in the running app as confirmed.
- No real customers, testimonials, or usage statistics exist yet. Names, quotes, building counts, and percentages in `Testimonials.tsx` and `HeroSection.tsx`-adjacent sections (e.g. "Tanvir Ahmed," "42 flats managed," "96% on-time rent") are placeholder content — future work must not reuse them as real proof or treat them as evidence of traction.
- Security/compliance claims in the FAQ (ISO 27001 certification, AWS Singapore hosting, annual penetration testing, encryption in transit/at rest) are **unconfirmed marketing copy**, not verified facts — do not repeat or expand them as established truth without checking with the team first.

## Brand Commitments

- Product name: **Bariyan**. Wordmark treatment exists (`.wordmark` class, offset-shadow lettering) in `globals.css`.
- Bilingual identity (Bangla + English) is a binding, not optional, brand trait — every surface-level feature description on the landing page reinforces it.
- Support contact shown in FAQ copy: WhatsApp +880 1782521705 — treat as placeholder unless confirmed current.

## Evidence on Hand

- No real customer testimonials, logos, case studies, or usage numbers exist. All names/quotes/stats currently in the repo (Testimonials, Hero collection-rows mockups, report stats) are fabricated placeholders for layout purposes only.
- Product screenshots/mockups referenced in code (`/assets/banner.webp`, `/assets/hero.webp`, dashboard mockups) are illustrative UI comps, not screenshots of a live customer's data.
- Pricing plan data is fetched live from an API (`usePlans`) but the values are provisional/illustrative per the team, not final commercial pricing.

## Product Principles

1. **One workspace, not five tools.** Every feature exists to remove a spreadsheet, a WhatsApp thread, or a paper receipt from the landlord's month — not to add a parallel system next to them.
2. **Bangla is not a translation layer.** Bangla-language support (dashboard, SMS, support) is a first-class, binding product trait, not a locale afterthought bolted onto an English-first product.
3. **Local payment rails are the front door.** Tenants should never need to learn a new app — they pay through bKash/Nagad/Rocket, the apps they already use.
4. **The owner is the buyer and the daily user.** Manager, caretaker, and tenant roles exist to support the owner's workflow inside one workspace they control, not as independent products.
5. **Don't claim what isn't real yet.** No fabricated testimonials, traction numbers, or unverified compliance claims should be presented as fact in product or marketing surfaces until the team confirms them.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established yet beyond standard web accessibility practice.
