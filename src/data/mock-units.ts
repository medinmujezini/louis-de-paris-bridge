import { Unit } from "@/types/units";

export const mockUnits: Unit[] = [
  { id: "b1-a1", name: "A1", floor: 2, surface: 137.19, bedrooms: 3, bathrooms: 3, price: 0, available: false, orientation: "south", features: [], building: "1", unitType: "apartment" },
  { id: "b1-a9", name: "A9", floor: 4, surface: 137.8, bedrooms: 3, bathrooms: 3, price: 0, available: true, orientation: "south", features: [], building: "1", unitType: "apartment" },
  { id: "b1-a38", name: "A38 Penthouse", floor: 11, surface: 189.56, bedrooms: 4, bathrooms: 3, price: 0, available: true, orientation: "south", features: ["Penthouse", "Terrace"], building: "1", unitType: "apartment", terrace: 250.78, duplexTotal: 440.34 },
  { id: "b2-a1", name: "A1", floor: 2, surface: 137.19, bedrooms: 3, bathrooms: 3, price: 0, available: true, orientation: "south", features: [], building: "2", unitType: "apartment" },
  { id: "lok-01", name: "Lokali 1", floor: -1, surface: 685.37, bedrooms: 0, bathrooms: 0, price: 0, available: true, orientation: "south", features: [], unitType: "commercial" },
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
