// Types for the TenantForm module (detailed tenant intake form).
// Mirrors the backend prisma TenantForm model + its child relations.

export interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    address: string | null;
    relationship: string | null;
}

export interface FamilyMember {
    id: string;
    name: string;
    age: string | null;
    relationship: string | null;
    occupation: string | null;
    contactNumber: string | null;
}

export interface StaffInfo {
    id: string;
    name: string;
    age: string | null;
    nidNumber: string | null;
    contactNumber: string | null;
    parmanentAddress: string | null;
}

export interface HouseOwner {
    id: string;
    name: string;
    contactNumber: string | null;
    address: string | null;
}

export interface TenantFormTenant {
    id: string;
    name: string;
    phone: string;
}

export interface TenantForm {
    id: string;
    name: string;
    fatherName: string;
    motherName: string | null;
    dateOfBirth: string | null;
    maritalStatus: string | null;
    parmanentAddress: string | null;
    occupationAndAddress: string | null;
    religion: string | null;
    educationalQualification: string | null;
    phone: string | null;
    email: string | null;
    nidNumber: string | null;
    passportNumber: string | null;
    reasonForMoving: string | null;
    rentDate: string | null;
    submittedToPolice: boolean;
    division: string | null;
    thana: string | null;
    flatFloor: string | null;
    houseNo: string | null;
    roadNo: string | null;
    areaName: string | null;
    postCode: string | null;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    tenantId: string;
}

// GET /tenant-forms and /tenant-forms/:id return the form with its relations.
export interface TenantFormDetail extends TenantForm {
    tenant: TenantFormTenant | null;
    emergencyContact: EmergencyContact | null;
    familyMembers: FamilyMember[];
    maidInfo: StaffInfo | null;
    driverInfo: StaffInfo | null;
    previousHouseOwner: HouseOwner | null;
    presentHouseOwner: HouseOwner | null;
}

// ── Payloads ────────────────────────────────────────────────────────

export interface EmergencyContactPayload {
    name: string;
    phone: string;
    address?: string;
    relationship?: string;
}

export interface FamilyMemberPayload {
    name: string;
    age?: string;
    relationship?: string;
    occupation?: string;
    contactNumber?: string;
}

export interface StaffPayload {
    name: string;
    age?: string;
    nidNumber?: string;
    contactNumber?: string;
    parmanentAddress?: string;
}

export interface HouseOwnerPayload {
    name: string;
    contactNumber?: string;
    address?: string;
}

export interface CreateTenantFormPayload {
    tenantId: string;
    name: string;
    fatherName: string;
    motherName?: string;
    dateOfBirth?: string;
    maritalStatus?: string;
    parmanentAddress?: string;
    occupationAndAddress?: string;
    religion?: string;
    educationalQualification?: string;
    phone?: string;
    email?: string;
    nidNumber?: string;
    passportNumber?: string;
    reasonForMoving?: string;
    rentDate?: string;
    submittedToPolice?: boolean;

    division?: string;
    thana?: string;
    flatFloor?: string;
    houseNo?: string;
    roadNo?: string;
    areaName?: string;
    postCode?: string;

    emergencyContact?: EmergencyContactPayload;
    familyMembers?: FamilyMemberPayload[];
    maidInfo?: StaffPayload;
    driverInfo?: StaffPayload;
    previousHouseOwner?: HouseOwnerPayload;
    presentHouseOwner?: HouseOwnerPayload;
}

export interface UpdateTenantFormPayload {
    name?: string;
    fatherName?: string;
    motherName?: string;
    dateOfBirth?: string;
    maritalStatus?: string;
    parmanentAddress?: string;
    occupationAndAddress?: string;
    religion?: string;
    educationalQualification?: string;
    phone?: string;
    email?: string;
    nidNumber?: string;
    passportNumber?: string;
    reasonForMoving?: string;
    rentDate?: string;
    submittedToPolice?: boolean;

    division?: string;
    thana?: string;
    flatFloor?: string;
    houseNo?: string;
    roadNo?: string;
    areaName?: string;
    postCode?: string;

    emergencyContact?: EmergencyContactPayload;
    familyMembers?: FamilyMemberPayload[];
    maidInfo?: StaffPayload;
    driverInfo?: StaffPayload;
    previousHouseOwner?: HouseOwnerPayload;
    presentHouseOwner?: HouseOwnerPayload;
}
