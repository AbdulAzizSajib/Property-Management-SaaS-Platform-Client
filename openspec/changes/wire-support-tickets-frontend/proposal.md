## Why

The backend now has a working support ticket API (`/support-tickets`,
delivered in the `pmsp-server` change `add-support-tickets`), but the
client's Support pages (`owner/dashboard/support`,
`admin/dashboard/support`) are still static contact/FAQ cards with a
`mailto:` link. There's no way for an owner to actually file or track a
ticket, or for an admin to see and respond to one, inside the product —
the backend work has no UI in front of it yet.

## What Changes

- Owner-side Support page becomes a real ticket workspace: create a
  ticket (subject, message, category, priority), list "my
  organization's" tickets with status/category filters, open a ticket to
  see its full message thread, and reply (unless the ticket is
  `CLOSED`).
- Admin-side Support page becomes a cross-organization ticket inbox:
  list all tickets with status/category/organization filters, open a
  ticket to see its thread (with the reporting organization), reply, and
  change status among `OPEN` / `IN_PROGRESS` / `RESOLVED` / `CLOSED`.
- New service + hook layer (`supportTicket.services.ts`,
  `useSupportTickets.ts`) following the project's existing
  service/hook/type split, mirroring `complaint.services.ts` /
  `useComplaints.ts`.
- New types (`supportTicket.types.ts`) matching the backend's
  `SupportTicket` / `SupportTicketMessage` shapes and enums.
- Existing static contact/FAQ content (email, phone, FAQ list) is kept
  but demoted to a secondary panel alongside the new ticket UI — it's
  still useful for people who'd rather not file a ticket.

## Capabilities

### New Capabilities
- `support-tickets-ui`: owner- and admin-facing UI for creating,
  listing, viewing, replying to, and (admin-only) changing the status of
  support tickets, backed by the existing `/support-tickets` API.

### Modified Capabilities
<!-- none: no existing pmsp-client capability has a spec yet; this is additive to the Support pages, not a change to previously specified behavior -->

## Impact

- **New files**: `src/types/supportTicket.types.ts`,
  `src/services/supportTicket.services.ts`,
  `src/hooks/useSupportTickets.ts`, plus dialog/list/detail components
  under `src/components/dashboard/support/`.
- **Modified files**: `owner/dashboard/support/page.tsx` and
  `admin/dashboard/support/page.tsx` (replace static content with the
  ticket workspace; keep contact/FAQ as a secondary section). Adds a new
  route `owner/dashboard/support/[id]/page.tsx` and
  `admin/dashboard/support/[id]/page.tsx` for the thread/detail view,
  following the existing `complaints/[id]` pattern.
- **No backend changes** — this change only consumes the API delivered
  by `pmsp-server`'s `add-support-tickets` change.
