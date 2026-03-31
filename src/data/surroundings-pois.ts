import { POICategory } from "@/types/poi";

export interface SurroundingsPOI {
  id: string;
  name: string;
  category: POICategory;
  type: "POI" | "POI_Center";
}

export const surroundingsPOIs: SurroundingsPOI[] = [
  { id: "BP_POI2", name: "Fakulteti Ekonomik", category: "education", type: "POI" },
  { id: "BP_POI3", name: "Kolegji Heimerer", category: "education", type: "POI" },
  { id: "BP_POI6", name: "Albi Mall", category: "shopping", type: "POI" },
  { id: "BP_POI7", name: "Stacioni i Autobusave", category: "transport", type: "POI" },
  { id: "BP_POI8", name: "Fusha Ramiz Sadiku", category: "entertainment", type: "POI" },
  { id: "BP_POI9", name: "Stadioni Fadil Vokrri", category: "entertainment", type: "POI" },
  { id: "BP_POI10", name: "Grand Hotel Prishtina", category: "landmarks", type: "POI" },
  { id: "BP_POI11", name: "Adem Jashari Airport", category: "transport", type: "POI" },
  { id: "BP_POI12", name: "QKUK", category: "health", type: "POI" },
  { id: "BP_POI13", name: "Highway Roundabout", category: "transport", type: "POI" },
  { id: "BP_POI14", name: "HIB Petrol", category: "services", type: "POI" },
  { id: "BP_POI15", name: "Gjimnazi Xhevdet Doda", category: "education", type: "POI" },
  { id: "BP_POI16", name: "Shkolla Fillore Dardania", category: "education", type: "POI" },
  { id: "BP_POI17", name: "ILG International School", category: "education", type: "POI" },
  { id: "BP_POI18", name: "Shkolla Fillore Afrim Gashi", category: "education", type: "POI" },
  { id: "BP_POI19", name: "Shkolla Fillore 7 Marsi", category: "education", type: "POI" },
  { id: "BP_POI20", name: "Dino Qeramika", category: "landmarks", type: "POI" },
  { id: "BP_POI21", name: "Dino Residence", category: "landmarks", type: "POI_Center" },
  { id: "BP_POI22", name: "Shkolla Hasan Prishtina", category: "education", type: "POI" },
  { id: "BP_POI23", name: "Stacioni 24 Yjet 10A", category: "transport", type: "POI" },
  { id: "BP_POI24", name: "Stacioni 24 Yjet 10B", category: "transport", type: "POI" },
  { id: "BP_POI25", name: "Valoni Petrol", category: "services", type: "POI" },
];
