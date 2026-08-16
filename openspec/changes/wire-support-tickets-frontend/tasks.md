## 1. Types

- [x] 1.1 Create `src/types/supportTicket.types.ts`: `SupportTicketStatus` (`OPEN, IN_PROGRESS, RESOLVED, CLOSED`), `SupportTicketCategory` (`BILLING, TECHNICAL, ACCOUNT, FEATURE_REQUEST, OTHER`), reuse `ComplaintPriority` shape (`LOW, MEDIUM, HIGH, URGENT`) as `SupportTicketPriority`, plus `SUPPORT_TICKET_STATUS_OPTIONS` / `SUPPORT_TICKET_CATEGORY_OPTIONS` / `SUPPORT_TICKET_PRIORITY_OPTIONS` label arrays (mirror `COMPLAINT_*_OPTIONS`)
- [x] 1.2 Add `SupportTicketMessage` (`id, body, attachmentUrls, createdAt, authorId, author?: {id, name, role}`), `SupportTicket` (`id, subject, category, priority, status, resolvedAt, closedAt, createdAt, updatedAt, organizationId, createdById, messages: SupportTicketMessage[], organization?: {id, name, email}, createdBy?: {id, name, email}`)
- [x] 1.3 Add payload types: `CreateSupportTicketPayload` (`subject, message, category?, priority?, attachmentUrls?`), `CreateSupportTicketMessagePayload` (`body, attachmentUrls?`), `UpdateSupportTicketStatusPayload` (`status`), `SupportTicketFilters` (`status?, category?, organizationId?`)

## 2. Services

- [x] 2.1 Create `src/services/supportTicket.services.ts` (`"use server"`, `httpClient` wrappers, JSDoc per function matching `complaint.services.ts`'s style) with a `buildSupportTicketQuery(filters)` helper
- [x] 2.2 Owner functions: `createSupportTicket(payload)` → `POST /support-tickets`; `getMySupportTickets(filters?)` → `GET /support-tickets/me`; `getMySupportTicketById(id)` → `GET /support-tickets/me/:id`; `addMySupportTicketMessage(id, payload)` → `POST /support-tickets/me/:id/messages`
- [x] 2.3 Admin functions: `listAllSupportTickets(filters?)` → `GET /support-tickets`; `getSupportTicketById(id)` → `GET /support-tickets/:id`; `addSupportTicketMessage(id, payload)` → `POST /support-tickets/:id/messages`; `updateSupportTicketStatus(id, payload)` → `PATCH /support-tickets/:id/status`

## 3. Hooks

- [x] 3.1 Create `src/hooks/useSupportTickets.ts` (`"use client"`) with `supportTicketKeys` (`all`, `me(filters)`, `meDetail(id)`, `list(filters)`, `detail(id)`), following `subscriptionRequestKeys`'s shape
- [x] 3.2 Owner hooks: `useMySupportTickets(filters?)`, `useMySupportTicket(id)`, `useCreateSupportTicket()` (invalidates `me` list on success, toast), `useAddMySupportTicketMessage(id)` (invalidates `meDetail(id)` + `me` list, toast)
- [x] 3.3 Admin hooks (`// ─── Admin ──` section): `useAllSupportTickets(filters?)`, `useSupportTicket(id)`, `useAddSupportTicketMessage(id)` (invalidates `detail(id)` + `all` list, toast), `useUpdateSupportTicketStatus(id)` (invalidates `detail(id)` + `all` list, toast)

## 4. Shared UI helpers

- [x] 4.1 Create `src/components/dashboard/support/supportTicketStyles.ts`: status label/badge/accent classes for `OPEN/IN_PROGRESS/RESOLVED/CLOSED`, category label map, priority label/dot classes (mirror `complaintStyles.ts`'s `complaintStatusStyles`/`complaintStatusLabel`/etc. naming), `formatRelativeTime`/`formatSupportTicketDate` helpers
- [x] 4.2 Create `src/components/dashboard/support/CreateSupportTicketDialog.tsx`: subject (Input), message (Textarea), category + priority (Select, using `SUPPORT_TICKET_CATEGORY_OPTIONS`/`SUPPORT_TICKET_PRIORITY_OPTIONS`), `Field`/`FormActions` primitives, calls `useCreateSupportTicket()`, closes + resets on success — mirror `CreateComplaintDialog.tsx`
- [x] 4.3 Create `src/components/dashboard/support/TicketThread.tsx`: renders a `SupportTicketMessage[]` in chronological order (author name/role, relative time, body, attachmentUrls as links), a reply `Textarea` + submit button, disabled with an explanatory note when `ticket.status === "CLOSED"`; accepts an `onReply(body)` callback and `isReplying` boolean so it can be reused by both owner and admin detail pages

## 5. Owner-side pages

- [x] 5.1 Rewrite `src/app/[locale]/(dashboardLayout)/owner/dashboard/support/page.tsx`: ticket list (status/category filters, "New ticket" button opening `CreateSupportTicketDialog`), empty state, loading skeleton, error state — mirror `complaints/page.tsx`'s list/filter/empty-state structure; keep the existing contact email/phone + FAQ content as a secondary section below or beside the list
- [x] 5.2 Create `src/app/[locale]/(dashboardLayout)/owner/dashboard/support/[id]/page.tsx`: hero header (subject, status/category/priority chips, created date) + `TicketThread` wired to `useMySupportTicket`/`useAddMySupportTicketMessage`, back link to `/owner/dashboard/support` — mirror `complaints/[id]/page.tsx`'s hero/detail-row structure (no assign/delete actions)
- [x] 5.3 Add `src/app/[locale]/(dashboardLayout)/owner/dashboard/support/[id]/loading.tsx` mirroring `complaints/[id]/loading.tsx`

## 6. Admin-side pages

- [x] 6.1 Rewrite `src/app/[locale]/(dashboardLayout)/admin/dashboard/support/page.tsx`: cross-org ticket list (status/category/organization filters, each row showing organization name), empty state, loading skeleton, error state; keep existing contact/FAQ content as a secondary section
- [x] 6.2 Create `src/app/[locale]/(dashboardLayout)/admin/dashboard/support/[id]/page.tsx`: hero header (subject, organization name, status/category/priority chips) + `TicketThread` wired to `useSupportTicket`/`useAddSupportTicketMessage`, plus a status `Select` wired to `useUpdateSupportTicketStatus`, back link to `/admin/dashboard/support`
- [x] 6.3 Add a `loading.tsx` for the admin `[id]` route mirroring the owner one

## 7. Verification

- [x] 7.1 Run `npx tsc --noEmit` and fix any type errors
- [x] 7.2 Run the project's lint command and fix any issues in new/changed files
- [x] 7.3 Manually walk each scenario in `specs/support-tickets-ui/spec.md` against a running dev server with real OWNER and ADMIN/SUPER_ADMIN accounts: create ticket (success + validation), list + filter (owner and admin), open thread, reply (open/resolved allowed, closed disabled), admin status change reflected in list and detail, contact/FAQ content still visible on both pages
- [x] 7.4 Run `openspec validate wire-support-tickets-frontend --strict` and fix any reported issues
