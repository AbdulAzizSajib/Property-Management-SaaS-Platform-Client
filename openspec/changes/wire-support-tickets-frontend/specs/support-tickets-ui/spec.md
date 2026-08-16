## Purpose

Gives an organization a working screen to raise and track support
requests, and gives platform admins a working screen to triage and
respond to them, replacing the current static contact-only Support
pages.

## ADDED Requirements

### Requirement: Owner can create a support ticket from the dashboard
An OWNER or MANAGER SHALL be able to open a form from the Support page,
enter a subject and message (and optionally category/priority), submit
it, and see the new ticket appear in their ticket list.

#### Scenario: Successful submission
- **WHEN** the user fills in subject and message and submits the form
- **THEN** the client calls the create-ticket endpoint, closes the form
  on success, and the new ticket appears in the "My tickets" list with
  status Open

#### Scenario: Missing required fields
- **WHEN** the user tries to submit with an empty subject or message
- **THEN** the form blocks submission and shows which field is required,
  without calling the API

#### Scenario: Submission fails
- **WHEN** the create request fails (network or server error)
- **THEN** the client shows an error message and keeps the form open
  with the user's input intact

### Requirement: Owner can see their organization's tickets
The Support page SHALL show a list of the caller's organization's
tickets with subject, status, category, priority, and last-activity
time, filterable by status and category.

#### Scenario: Viewing the list
- **WHEN** an OWNER opens the Support page
- **THEN** the client fetches and displays their organization's tickets,
  most recently updated first

#### Scenario: Filtering by status
- **WHEN** the user selects a status filter (e.g. Open)
- **THEN** the list shows only tickets matching that status

#### Scenario: No tickets yet
- **WHEN** the organization has no tickets
- **THEN** the client shows an empty state that offers to create one,
  instead of an empty list

### Requirement: Owner can view and reply to a ticket's thread
Selecting a ticket SHALL open a detail view showing its full message
thread in chronological order, with a reply box that is disabled (with
an explanation) when the ticket is closed.

#### Scenario: Opening a ticket
- **WHEN** an OWNER selects one of their organization's tickets
- **THEN** the client fetches and displays that ticket's messages in
  order, oldest first

#### Scenario: Replying on an open or resolved ticket
- **WHEN** the user submits a reply on a ticket that is not Closed
- **THEN** the client posts the message and it appears at the end of the
  thread without a full page reload

#### Scenario: Reply box on a closed ticket
- **WHEN** the user opens a ticket with status Closed
- **THEN** the reply box is disabled and the client explains that closed
  tickets can't receive replies

### Requirement: Admin can see and filter tickets across all organizations
The admin Support page SHALL list tickets from every organization, each
row showing which organization it belongs to, and SHALL be filterable by
status, category, and organization.

#### Scenario: Viewing the cross-org list
- **WHEN** an ADMIN or SUPER_ADMIN opens the Support page
- **THEN** the client fetches and displays tickets from all
  organizations, each showing the reporting organization's name

#### Scenario: Filtering the admin list
- **WHEN** the admin sets a status or category filter
- **THEN** the list updates to show only matching tickets across all
  organizations

### Requirement: Admin can reply to and change the status of any ticket
Opening a ticket from the admin side SHALL show its thread and let the
admin post a reply and change its status among Open, In Progress,
Resolved, and Closed.

#### Scenario: Admin replies to a ticket
- **WHEN** an admin submits a reply on any ticket
- **THEN** the client posts the message, it appears in the thread, and
  if the ticket's status was Open the displayed status updates to
  reflect the server's auto-advance to In Progress

#### Scenario: Admin resolves or closes a ticket
- **WHEN** an admin selects Resolved or Closed from the status control
- **THEN** the client updates the ticket's status and the change is
  reflected immediately in both the detail view and the ticket list

### Requirement: Support page still surfaces direct contact info
The Support page SHALL continue to show the organization's/platform's
direct contact details (email, phone) and FAQ content alongside the
ticket UI, so users who prefer not to file a ticket still have a way to
reach out.

#### Scenario: Contact info remains visible
- **WHEN** a user opens either Support page
- **THEN** the contact email/phone and FAQ section are still visible,
  positioned as secondary to the ticket list/form
