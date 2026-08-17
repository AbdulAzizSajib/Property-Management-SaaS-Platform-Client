## Purpose

Defines how the client displays monthly vs. yearly plan pricing on the public pricing section and lets an owner choose a billing cycle when submitting a manual subscription payment request.

## ADDED Requirements

### Requirement: Public pricing section offers a monthly/yearly toggle
The public pricing section SHALL provide a control to switch every displayed plan price between its monthly and yearly amount. All non-FREE plan cards SHALL reflect the same selected cycle at once (no per-card toggling). The FREE plan card SHALL always show ৳0 regardless of the selected cycle.

#### Scenario: Default view is monthly
- **WHEN** the pricing section first renders
- **THEN** every paid plan card shows its monthly price with a "/mo" period label

#### Scenario: Switching to yearly
- **WHEN** the visitor switches the toggle to Yearly
- **THEN** every paid plan card updates to show its yearly price with a "/yr" period label, and a savings indicator communicating the yearly discount is shown

#### Scenario: A plan has no yearly price
- **WHEN** the toggle is set to Yearly and a plan's catalog entry has no yearly price
- **THEN** that plan card falls back to a sensible display (e.g. shows its monthly price, or hides the toggle-driven change for that card) rather than showing a blank or invalid price

### Requirement: Plan selection CTA is unaffected by the toggle
Clicking a plan card's CTA SHALL navigate to registration carrying only the selected plan, not the currently toggled billing cycle — the visitor confirms their billing cycle later, at actual payment time.

#### Scenario: CTA click while Yearly is toggled
- **WHEN** the visitor has the pricing toggle set to Yearly and clicks a plan's CTA
- **THEN** navigation still uses the existing `/register?plan=<PLAN>` shape with no billing-cycle parameter added

### Requirement: Payment request dialog lets the owner choose a billing cycle
When an owner opens the subscription payment-request dialog for a paid plan, the dialog SHALL offer a choice between Monthly and Yearly billing, defaulting to Monthly. The displayed "amount to send" SHALL update to match the selected cycle, and the submitted request SHALL include the selected cycle.

#### Scenario: Dialog opens with Monthly selected by default
- **WHEN** the payment request dialog opens for any paid plan
- **THEN** Monthly is selected by default and the displayed amount is that plan's monthly price

#### Scenario: Owner switches to Yearly
- **WHEN** the owner selects Yearly in the dialog
- **THEN** the displayed amount updates to the plan's yearly price, and submitting the form sends `billingCycle: "YEARLY"`

#### Scenario: Plan has no yearly price available
- **WHEN** the dialog opens for a plan whose catalog entry has no yearly price
- **THEN** Yearly is not offered as a selectable option for that plan (Monthly is the only choice)

#### Scenario: Dialog reopened for a different plan or occasion
- **WHEN** the dialog is opened again (same or different plan), including via the auto-open flow from a carried plan after registration
- **THEN** the billing cycle selection resets to Monthly by default, regardless of any prior selection
