import type { Unit } from "./unit.types";

export interface Floor {
    id: string;
    name: string;
    floorNumber: number;
    buildingId: string;
    createdAt: string;
    updatedAt: string;
}

// GET /floors?buildingId=... — list item shape includes unit count
export interface FloorListItem extends Floor {
    _count: {
        units: number;
    };
}

// GET /floors/:id — detail shape includes related units
export interface FloorDetail extends Floor {
    units: Unit[];
}

export interface CreateFloorPayload {
    buildingId: string;
    name: string;
    floorNumber: number;
}

export interface UpdateFloorPayload {
    name?: string;
    floorNumber?: number;
}
