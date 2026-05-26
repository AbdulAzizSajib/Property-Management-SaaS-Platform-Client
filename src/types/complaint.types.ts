export type ComplaintCategory =
    | "PLUMBING"
    | "ELECTRICAL"
    | "AC"
    | "ELEVATOR"
    | "WATER"
    | "GAS"
    | "SECURITY"
    | "CLEANLINESS"
    | "NOISE"
    | "PEST_CONTROL"
    | "STRUCTURAL"
    | "INTERNET"
    | "PARKING"
    | "OTHER";

export type ComplaintStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED";

export type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export const COMPLAINT_CATEGORY_OPTIONS: {
    value: ComplaintCategory;
    label: string;
}[] = [
    { value: "PLUMBING", label: "Plumbing" },
    { value: "ELECTRICAL", label: "Electrical" },
    { value: "AC", label: "Air conditioning" },
    { value: "ELEVATOR", label: "Elevator / Lift" },
    { value: "WATER", label: "Water supply" },
    { value: "GAS", label: "Gas" },
    { value: "SECURITY", label: "Security" },
    { value: "CLEANLINESS", label: "Cleanliness" },
    { value: "NOISE", label: "Noise" },
    { value: "PEST_CONTROL", label: "Pest control" },
    { value: "STRUCTURAL", label: "Structural" },
    { value: "INTERNET", label: "Internet" },
    { value: "PARKING", label: "Parking" },
    { value: "OTHER", label: "Other" },
];

export const COMPLAINT_STATUS_OPTIONS: {
    value: ComplaintStatus;
    label: string;
}[] = [
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "In progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CLOSED", label: "Closed" },
];

export const COMPLAINT_PRIORITY_OPTIONS: {
    value: ComplaintPriority;
    label: string;
}[] = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" },
];

export interface ComplaintBuildingSummary {
    id: string;
    name: string;
}

export interface ComplaintUnitSummary {
    id: string;
    name: string;
}

export interface ComplaintTenantSummary {
    id: string;
    name: string;
}

export interface ComplaintUserSummary {
    id: string;
    name: string;
    role?: string;
}

export interface Complaint {
    id: string;
    title: string;
    description: string;
    category: ComplaintCategory;
    status: ComplaintStatus;
    priority: ComplaintPriority;
    imageUrls: string[];
    resolutionNote: string | null;
    resolvedAt: string | null;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    buildingId: string | null;
    unitId: string | null;
    tenantId: string | null;
    createdById: string;
    assignedToId: string | null;
    building: ComplaintBuildingSummary | null;
    unit: ComplaintUnitSummary | null;
    tenant: ComplaintTenantSummary | null;
    createdBy?: ComplaintUserSummary;
    assignedTo: ComplaintUserSummary | null;
}

// List item (omits createdBy in the listing payload — present in some responses)
export type ComplaintListItem = Complaint;

// Detail returns richer building / unit / tenant / createdBy / assignedTo
export interface ComplaintDetailBuilding extends ComplaintBuildingSummary {
    type?: string;
    address?: string;
    city?: string;
    area?: string | null;
}

export interface ComplaintDetailUnit extends ComplaintUnitSummary {
    type?: string;
    status?: string;
    bedrooms?: number;
    bathrooms?: number;
}

export interface ComplaintDetail extends Omit<Complaint, "building" | "unit"> {
    building: ComplaintDetailBuilding | null;
    unit: ComplaintDetailUnit | null;
}

export interface CreateComplaintPayload {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    buildingId?: string;
    unitId?: string;
    tenantId?: string;
    imageUrls?: string[];
}

export interface UpdateComplaintPayload {
    title?: string;
    description?: string;
    category?: ComplaintCategory;
    priority?: ComplaintPriority;
    status?: ComplaintStatus;
    resolutionNote?: string;
    imageUrls?: string[];
}

export interface AssignComplaintPayload {
    assignedToId: string;
}

export interface ComplaintFilters {
    status?: ComplaintStatus;
    priority?: ComplaintPriority;
    category?: ComplaintCategory;
    buildingId?: string;
    unitId?: string;
}
