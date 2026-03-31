export interface POI {
  id: string;
  name: string;
  category: POICategory;
  description: string;
  distance?: string;
  rating?: number;
  address?: string;
  tags?: string[];
  thumbnail?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  website?: string;
  phone?: string;
}

export type POICategory = "dining" | "shopping" | "entertainment" | "services" | "transport" | "landmarks" | "health" | "education";

export interface POICategoryInfo {
  id: POICategory;
  label: string;
  description: string;
  color: string;
}

export const poiCategories: POICategoryInfo[] = [
  { id: "landmarks", label: "Landmarks", description: "Cultural and historical sites", color: "#F59E0B" },
  { id: "dining", label: "Dining", description: "Restaurants, cafes, and bars", color: "#EA580C" },
  { id: "shopping", label: "Shopping", description: "Retail stores and markets", color: "#DB2777" },
  { id: "entertainment", label: "Entertainment", description: "Parks and recreation", color: "#9333EA" },
  { id: "services", label: "Services", description: "Hospitals and utilities", color: "#2563EB" },
  { id: "transport", label: "Transport", description: "Bus and transit", color: "#16A34A" },
  { id: "health", label: "Health", description: "Hospitals, clinics, and pharmacies", color: "#EF4444" },
  { id: "education", label: "Education", description: "Schools, universities, and libraries", color: "#06B6D4" },
];
