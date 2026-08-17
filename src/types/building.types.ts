import type { Floor } from "./floor.types";
import type { Unit } from "./unit.types";

export type BuildingType =
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "MIXED"
  | "HOSTEL"
  | "MESS";

export const BUILDING_TYPE_OPTIONS: {
  value: BuildingType;
  label: string;
}[] = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "MIXED", label: "Mixed" },
  { value: "HOSTEL", label: "Hostel" },
  { value: "MESS", label: "Mess" },
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
  hasGroundFloor: boolean;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  caretakerId: string | null;
  caretaker: CaretakerSummary | null;
}

// GET /buildings — list item shape (includes lean floors/units + counts for cards)
export interface BuildingListItem extends Building {
  floors: Pick<Floor, "id" | "floorNumber" | "name">[];
  units: Pick<Unit, "id" | "type" | "status" | "baseRent" | "serviceCharge">[];
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
  hasGroundFloor?: boolean;
  description?: string;
}

export type UpdateBuildingPayload = Partial<CreateBuildingPayload> & {
  isActive?: boolean;
};

export interface AssignCaretakerPayload {
  caretakerId: string | null;
}
