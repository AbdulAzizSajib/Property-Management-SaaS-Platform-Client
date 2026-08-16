## Context

The client follows a strict layered convention per domain: `types/*.types.ts`
(shapes + option constants) → `services/*.services.ts` (`"use server"`,
thin `httpClient` wrappers, one per endpoint) → `hooks/use*.ts` (`"use
client"`, TanStack Query wrapping the services, toast on
success/error) → page/dialog components that call the hooks. `Complaint`
(`useComplaints.ts`, `complaint.services.ts`, `complaint.types.ts`) and
`SubscriptionRequest` are the two closest precedents: `Complaint` for the
list/detail/dialog UI shape, `SubscriptionRequest` for the
owner-side/admin-side split within one hook file. See proposal.md for
why this exists; see the backend's `add-support-tickets` change
(`pmsp-server`) for the API contract this UI consumes.

Backend contract (already implemented, not part of this change):
- Owner: `POST /support-tickets`, `GET /support-tickets/me`,
  `GET /support-tickets/me/:id`, `POST /support-tickets/me/:id/messages`
- Admin: `GET /support-tickets`, `GET /support-tickets/:id`,
  `POST /support-tickets/:id/messages`, `PATCH /support-tickets/:id/status`
- List endpoints are paginated (`ApiResponse.meta`); ticket responses
  embed `messages[]` ordered oldest-first with `author: {id, name, role}`.

## Goals / Non-Goals

**Goals:**
- Reuse the existing service → hook → page/dialog layering exactly as
  `Complaint` does, so this doesn't introduce a second convention.
- One shared type/service/hook module serves both the owner and admin
  UI (mirroring `subscriptionRequest.services.ts`), since the underlying
  ticket shape is identical — only the endpoint prefix and available
  actions differ by role.
- Replace the placeholder Support pages in place (same route), not add
  new top-level nav entries.

**Non-Goals:**
- Real-time thread updates (polling/refetch-on-focus via React Query is
  enough, matching how `Complaint`/`SubscriptionRequest` already behave).
- File/image upload UI for `attachmentUrls` — the field exists on the
  API but this change does not add an uploader; can be added later the
  same way `Complaint`'s `imageUrls` would be.
- Any change to the backend API itself.

## Decisions

**One hook file, `useSupportTickets.ts`, covering both roles.**
Mirrors `useSubscriptionRequests.ts`'s "owner hooks, then `// ─── Admin
──` section, admin hooks" structure rather than splitting into two
files. The ticket data shape returned to owner vs. admin differs only in
whether `organization`/`createdBy` are embedded (admin responses include
them) — one `SupportTicket` type covers both, with those fields optional.

**List pagination: fetch page 1 at a generous page size, no infinite
scroll/pager UI in this pass.** `Complaint`'s list hook
(`useComplaints`) already ignores `meta` entirely and just renders
`data`. Support ticket volume per org is expected to be low (same
justification `Complaint` implicitly makes), so this change follows
that precedent rather than building pagination UI. If ticket volume
grows, a follow-up change adds a pager — noted as a limitation, not
solved here.

**Detail route: `owner/dashboard/support/[id]` and
`admin/dashboard/support/[id]`, not a modal.** A ticket thread is
read-heavy (potentially many messages) and benefits from a full page and
a shareable URL, unlike the create-ticket form which fits a dialog.
Mirrors `complaints/[id]/page.tsx` exactly: back link, hero header with
status/category/priority chips, then a thread panel, then a reply
composer.

**Create ticket via dialog, following `CreateComplaintDialog`.** A new
`CreateSupportTicketDialog` opens from a button on the list page; on
success it invalidates the ticket list query and closes. No separate
full-page create route, matching how complaints are filed.

**Status change on the admin detail page is an inline `Select`, not a
separate dialog.** Complaint's status update uses a dialog
(`UpdateComplaintStatusDialog`) because it also carries a resolution
note field; support tickets have no such note (resolution context lives
in the reply thread itself), so a plain `Select` bound to
`useUpdateSupportTicketStatus` is enough and avoids an unnecessary
dialog.

**Style helpers module**: a `supportTicketStyles.ts` under
`components/dashboard/support/`, mirroring `complaintStyles.ts` — status
label/badge classes, category label map, relative-time formatting reused
from the same `formatRelativeTime` pattern (import if exported generically,
otherwise duplicate the small helper as `complaintStyles.ts` does not
currently export it for reuse).

**Reuse `Field`/`FormActions`/`fieldClass` form primitives, `Select`,
`Skeleton`, `Dialog` UI components** — no new primitives needed.

## Risks / Trade-offs

- **No pagination UI** → if an org accumulates many tickets, the list
  becomes long. Mitigation: same trade-off `Complaint` already accepts;
  revisit if it becomes a real problem.
- **No attachment upload UI** → users can't attach screenshots yet even
  though the API supports URLs. Mitigation: `attachmentUrls` stays
  `undefined`/empty from this UI; additive follow-up, not a breaking
  change later.
- **Status auto-advance (OPEN → IN_PROGRESS on first admin reply) is
  server-driven** → the client must refetch/invalidate the ticket detail
  query after posting an admin reply so the displayed status doesn't go
  stale. Mitigation: `useAddSupportTicketMessage` invalidates the ticket
  detail + list query keys on success, same pattern
  `useAssignComplaint` already uses.

## Migration Plan

Purely additive/replacement within the client: two existing page files
are rewritten in place (no route path changes for the list pages), two
new `[id]` detail routes are added, new service/hook/type files are
added. No environment variables, no backend coordination beyond the
already-shipped API. Rollback is a plain revert of these files.
