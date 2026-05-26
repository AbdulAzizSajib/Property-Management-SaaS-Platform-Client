export type DocumentType =
    | "NID"
    | "PASSPORT"
    | "DRIVING_LICENSE"
    | "TENANT_PHOTO"
    | "LEASE_AGREEMENT"
    | "RENTAL_AGREEMENT"
    | "BUILDING_DEED"
    | "PROPERTY_TAX_RECEIPT"
    | "UTILITY_BILL"
    | "INSURANCE"
    | "INVOICE_RECEIPT"
    | "EXPENSE_RECEIPT"
    | "MAINTENANCE_RECORD"
    | "BANK_STATEMENT"
    | "OTHER";

export const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
    { value: "NID", label: "National ID (NID)" },
    { value: "PASSPORT", label: "Passport" },
    { value: "DRIVING_LICENSE", label: "Driving license" },
    { value: "TENANT_PHOTO", label: "Tenant photo" },
    { value: "LEASE_AGREEMENT", label: "Lease agreement" },
    { value: "RENTAL_AGREEMENT", label: "Rental agreement" },
    { value: "BUILDING_DEED", label: "Building deed" },
    { value: "PROPERTY_TAX_RECEIPT", label: "Property tax receipt" },
    { value: "UTILITY_BILL", label: "Utility bill" },
    { value: "INSURANCE", label: "Insurance" },
    { value: "INVOICE_RECEIPT", label: "Invoice receipt" },
    { value: "EXPENSE_RECEIPT", label: "Expense receipt" },
    { value: "MAINTENANCE_RECORD", label: "Maintenance record" },
    { value: "BANK_STATEMENT", label: "Bank statement" },
    { value: "OTHER", label: "Other" },
];

export interface DocumentBuildingSummary {
    id: string;
    name: string;
}

export interface DocumentTenantSummary {
    id: string;
    name: string;
}

export interface DocumentUserSummary {
    id: string;
    name: string;
    role?: string;
}

export interface DocumentRecord {
    id: string;
    type: DocumentType;
    name: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    createdAt: string;
    organizationId: string;
    tenantId: string | null;
    buildingId: string | null;
    leaseId: string | null;
    uploadedById: string;
    building: DocumentBuildingSummary | null;
    tenant: DocumentTenantSummary | null;
    uploadedBy: DocumentUserSummary;
}

export type DocumentListItem = DocumentRecord;

// Detail returns a richer tenant payload (phone, email, NID, etc.)
export interface DocumentDetailTenant extends DocumentTenantSummary {
    phone?: string;
    email?: string | null;
    nidNumber?: string | null;
}

export interface DocumentDetail
    extends Omit<DocumentRecord, "tenant"> {
    tenant: DocumentDetailTenant | null;
}

export interface DocumentFilters {
    type?: DocumentType;
    tenantId?: string;
    buildingId?: string;
    leaseId?: string;
}
