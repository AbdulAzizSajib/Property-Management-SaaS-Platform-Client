export interface RentIncrease {
    id: string;
    leaseId: string;
    /** Prisma Decimal — string on the wire. */
    previousRent: string;
    newRent: string;
    effectiveFrom: string;
    reason: string | null;
    createdAt: string;
    createdById: string;
    createdBy?: {
        id: string;
        name: string;
        email: string;
    } | null;
}

export interface CreateRentIncreasePayload {
    newRent: number;
    effectiveFrom: string;
    reason?: string;
}
