export type Orientation = "north" | "south" | "east" | "west";
export type UnitType = "apartment" | "villa" | "commercial" | "garage" | "storage";

export interface Unit {
  id: string;
  name: string;
  floor: number;
  surface: number; // in sq meters
  bedrooms: number;
  bathrooms: number;
  price: number;
  available: boolean;
  orientation?: Orientation;
  thumbnail?: string;
  features?: string[];
  section?: string; // Building section ID
  building?: string; // "1" or "2" for residential
  unitType?: UnitType;
  terrace?: number; // terrace area in m2
  duplexTotal?: number; // total duplex area
}

export interface UnitFilters {
  search: string;
  minSurface: number | null;
  maxSurface: number | null;
  minBedrooms: number | null;
  maxBedrooms: number | null;
  minBathrooms: number | null;
  maxBathrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  availableOnly: boolean;
  floor: number | null;
  orientation: Orientation | null;
  building: string | null;
  unitType: UnitType | null;
}

export const defaultFilters: UnitFilters = {
  search: "",
  minSurface: null,
  maxSurface: null,
  minBedrooms: null,
  maxBedrooms: null,
  minBathrooms: null,
  maxBathrooms: null,
  minPrice: null,
  maxPrice: null,
  availableOnly: true,
  floor: null,
  orientation: null,
  building: null,
  unitType: null,
};
