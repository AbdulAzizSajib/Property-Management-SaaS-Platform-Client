import type { Floor } from "./floor.types";
import type { Unit } from "./unit.types";

export type BuildingType = "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE";

export const BUILDING_TYPE_OPTIONS: { value: BuildingType; label: string }[] = [
    { value: "RESIDENTIAL", label: "Residential" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "MIXED_USE", label: "Mixed Use" },
];

export interface CaretakerSummary {
    id: string;
    name: string;
    email: string | null;
    contactNumber: string | null;
}

export interface ManagerSummary {
    id: string;
    userId: string;
    name: string;
    email: string | null;
}

export interface Building {
    id: string;
    name: string;
    type: BuildingType;
    address: string;
    city: string;
    area: string | null;
    totalFloors: number;
    description: string | null;
    imageUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    caretakerId: string | null;
    caretaker: CaretakerSummary | null;
}

// GET /buildings — list item shape (includes counts for cards)
export interface BuildingListItem extends Building {
    _count: {
        floors: number;
        units: number;
    };
}

// GET /buildings/:id — detail shape (includes related collections)
export interface BuildingDetail extends Building {
    floors: Floor[];
    units: Unit[];
    managers: ManagerSummary[];
}

export interface CreateBuildingPayload {
    name: string;
    type: BuildingType;
    address: string;
    city: string;
    area?: string;
    totalFloors: number;
    description?: string;
    imageUrl?: string;
}

export type UpdateBuildingPayload = Partial<CreateBuildingPayload> & {
    isActive?: boolean;
};

export interface AssignCaretakerPayload {
    caretakerId: string | null;
}
