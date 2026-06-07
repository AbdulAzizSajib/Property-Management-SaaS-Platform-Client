export type RentAgreementStatus = "DRAFT" | "PARTIALLY_SIGNED" | "SIGNED";

export interface RentAgreement {
    id: string;
    leaseId: string;
    content: string;
    validFrom: string;
    validUntil: string;
    status: RentAgreementStatus;
    ownerSignatureUrl: string | null;
    ownerSignedAt: string | null;
    tenantSignatureUrl: string | null;
    tenantSignedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRentAgreementPayload {
    content: string;
    validFrom: string;
    validUntil: string;
}

export interface SignRentAgreementPayload {
    role: "owner" | "tenant";
    signatureUrl: string;
}
