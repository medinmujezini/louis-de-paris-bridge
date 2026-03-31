import { Unit } from "@/types/units";

export const mockUnits: Unit[] = [
  // Apartments
  { id: "b1-a1", name: "A1", floor: 2, surface: 137.19, bedrooms: 3, bathrooms: 3, price: 0, available: false, orientation: "south", features: [], building: "1", unitType: "apartment" },
  { id: "b1-a9", name: "A9", floor: 4, surface: 137.8, bedrooms: 3, bathrooms: 3, price: 0, available: true, orientation: "south", features: [], building: "1", unitType: "apartment", isDemo: true },
  { id: "b1-a38", name: "A38 Penthouse", floor: 11, surface: 189.56, bedrooms: 4, bathrooms: 3, price: 0, available: true, orientation: "south", features: ["Penthouse", "Terrace"], building: "1", unitType: "apartment", terrace: 250.78, duplexTotal: 440.34 },
  { id: "b2-a1", name: "A1", floor: 2, surface: 137.19, bedrooms: 3, bathrooms: 3, price: 0, available: true, orientation: "south", features: [], building: "2", unitType: "apartment" },
  // Villas
  { id: "v-01", name: "Villa 01", floor: 0, surface: 320, bedrooms: 5, bathrooms: 4, price: 0, available: true, orientation: "south", features: ["Garden", "Pool"], unitType: "villa", isDemo: true },
  { id: "v-02", name: "Villa 02", floor: 0, surface: 280, bedrooms: 4, bathrooms: 3, price: 0, available: true, orientation: "east", features: ["Garden"], unitType: "villa" },
  { id: "v-03", name: "Villa 03", floor: 0, surface: 350, bedrooms: 5, bathrooms: 4, price: 0, available: false, orientation: "west", features: ["Garden", "Pool"], unitType: "villa" },
  { id: "v-04", name: "Villa 04", floor: 0, surface: 290, bedrooms: 4, bathrooms: 3, price: 0, available: true, orientation: "north", features: ["Garden"], unitType: "villa" },
  // Commercial
  { id: "lok-01", name: "Lokali 1", floor: -1, surface: 685.37, bedrooms: 0, bathrooms: 0, price: 0, available: true, orientation: "south", features: [], unitType: "commercial" },
  // Parking & Storage
  { id: "gar-1-01", name: "Garazha 01", floor: -1, surface: 15, bedrooms: 0, bathrooms: 0, price: 0, available: true, orientation: "south", features: [], unitType: "garage" },
  { id: "dep-1-01", name: "Depo 01", floor: -1, surface: 5, bedrooms: 0, bathrooms: 0, price: 0, available: true, orientation: "south", features: [], unitType: "storage" },
];

export const getFloors = (): number[] => {
  return [...new Set(mockUnits.map((u) => u.floor))].sort((a, b) => a - b);
};

export const getPriceRange = (): { min: number; max: number } => {
  const prices = mockUnits.map((u) => u.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

export const getSurfaceRange = (): { min: number; max: number } => {
  const surfaces = mockUnits.map((u) => u.surface);
  return { min: Math.min(...surfaces), max: Math.max(...surfaces) };
};
