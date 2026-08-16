export type SupportTicketStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED";

export type SupportTicketCategory =
    | "BILLING"
    | "TECHNICAL"
    | "ACCOUNT"
    | "FEATURE_REQUEST"
    | "OTHER";

export type SupportTicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export const SUPPORT_TICKET_STATUS_OPTIONS: {
    value: SupportTicketStatus;
    label: string;
}[] = [
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "In progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CLOSED", label: "Closed" },
];

export const SUPPORT_TICKET_CATEGORY_OPTIONS: {
    value: SupportTicketCategory;
    label: string;
}[] = [
    { value: "BILLING", label: "Billing" },
    { value: "TECHNICAL", label: "Technical" },
    { value: "ACCOUNT", label: "Account" },
    { value: "FEATURE_REQUEST", label: "Feature request" },
    { value: "OTHER", label: "Other" },
];

export const SUPPORT_TICKET_PRIORITY_OPTIONS: {
    value: SupportTicketPriority;
    label: string;
}[] = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" },
];

export interface SupportTicketUserSummary {
    id: string;
    name: string;
    role?: string;
}

export interface SupportTicketOrganizationSummary {
    id: string;
    name: string;
    email?: string | null;
}

export interface SupportTicketMessage {
    id: string;
    body: string;
    attachmentUrls: string[];
    createdAt: string;
    authorId: string | null;
    author?: SupportTicketUserSummary | null;
}

export interface SupportTicket {
    id: string;
    subject: string;
    category: SupportTicketCategory;
    priority: SupportTicketPriority;
    status: SupportTicketStatus;
    resolvedAt: string | null;
    closedAt: string | null;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    createdById: string | null;
    messages: SupportTicketMessage[];
    // Present on admin-side responses (list + detail); absent on owner-side.
    organization?: SupportTicketOrganizationSummary;
    createdBy?: SupportTicketUserSummary | null;
}

export interface CreateSupportTicketPayload {
    subject: string;
    message: string;
    category?: SupportTicketCategory;
    priority?: SupportTicketPriority;
    attachmentUrls?: string[];
}

export interface CreateSupportTicketMessagePayload {
    body: string;
    attachmentUrls?: string[];
}

export interface UpdateSupportTicketStatusPayload {
    status: SupportTicketStatus;
}

export interface SupportTicketFilters {
    status?: SupportTicketStatus;
    category?: SupportTicketCategory;
    organizationId?: string;
}
