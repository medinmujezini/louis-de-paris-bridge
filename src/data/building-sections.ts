export type SectionType = 'floor' | 'wing' | 'zone';

export interface BuildingSection {
  id: string;
  name: string;
  type: SectionType;
  unitIds: string[];
}

export const buildingSections: BuildingSection[] = [
  // Building 1 floors
  { id: 'b1-floor-2', name: 'B1 Kati 2', type: 'floor', unitIds: ['b1-a1', 'b1-a2', 'b1-a3', 'b1-a4', 'b1-a5', 'b1-a6'] },
  { id: 'b1-floor-3', name: 'B1 Kati 3', type: 'floor', unitIds: ['b1-a7', 'b1-a8'] },
  { id: 'b1-floor-4', name: 'B1 Kati 4', type: 'floor', unitIds: ['b1-a9', 'b1-a10', 'b1-a11', 'b1-a12', 'b1-a13'] },
  { id: 'b1-floor-5', name: 'B1 Kati 5', type: 'floor', unitIds: ['b1-a14', 'b1-a15', 'b1-a16', 'b1-a17', 'b1-a18'] },
  { id: 'b1-floor-7', name: 'B1 Kati 7', type: 'floor', unitIds: ['b1-a19', 'b1-a20', 'b1-a21', 'b1-a22', 'b1-a24'] },
  { id: 'b1-floor-8', name: 'B1 Kati 8', type: 'floor', unitIds: ['b1-a23', 'b1-a25', 'b1-a26', 'b1-a27', 'b1-a25-1', 'b1-a26-1', 'b1-a27-1'] },
  { id: 'b1-floor-9', name: 'B1 Kati 9', type: 'floor', unitIds: ['b1-a28', 'b1-a29', 'b1-a30', 'b1-a31', 'b1-a32'] },
  { id: 'b1-floor-10', name: 'B1 Kati 10', type: 'floor', unitIds: ['b1-a33', 'b1-a34', 'b1-a35', 'b1-a36', 'b1-a37'] },
  { id: 'b1-floor-11', name: 'B1 Kati 11', type: 'floor', unitIds: ['b1-a38', 'b1-a39', 'b1-a40'] },

  // Building 2 floors
  { id: 'b2-floor-2', name: 'B2 Kati 2', type: 'floor', unitIds: ['b2-a1', 'b2-a2', 'b2-a3', 'b2-a4', 'b2-a5', 'b2-a6'] },
  { id: 'b2-floor-3', name: 'B2 Kati 3', type: 'floor', unitIds: ['b2-a7', 'b2-a8'] },
  { id: 'b2-floor-4', name: 'B2 Kati 4', type: 'floor', unitIds: ['b2-a9', 'b2-a10', 'b2-a11', 'b2-a12', 'b2-a13'] },
  { id: 'b2-floor-5', name: 'B2 Kati 5', type: 'floor', unitIds: ['b2-a14', 'b2-a15', 'b2-a16', 'b2-a17', 'b2-a18'] },
  { id: 'b2-floor-7', name: 'B2 Kati 7', type: 'floor', unitIds: ['b2-a19', 'b2-a20', 'b2-a21', 'b2-a22', 'b2-a23', 'b2-a24'] },
  { id: 'b2-floor-8', name: 'B2 Kati 8', type: 'floor', unitIds: ['b2-a25', 'b2-a26', 'b2-a27', 'b2-a26-1', 'b2-a27-1'] },
  { id: 'b2-floor-9', name: 'B2 Kati 9', type: 'floor', unitIds: ['b2-a28', 'b2-a29', 'b2-a30', 'b2-a31', 'b2-a32'] },
  { id: 'b2-floor-10', name: 'B2 Kati 10', type: 'floor', unitIds: ['b2-a33', 'b2-a34', 'b2-a35', 'b2-n1', 'b2-n2'] },

  // Commercial
  { id: 'commercial-basement', name: 'Sutereni', type: 'zone', unitIds: ['lok-01', 'lok-02', 'lok-03', 'lok-04'] },
  { id: 'commercial-ground', name: 'Përdhesa', type: 'zone', unitIds: ['lok-05', 'lok-06', 'lok-07', 'lok-08', 'lok-09', 'lok-10', 'lok-11'] },
  { id: 'commercial-floor-1', name: 'Kati 1', type: 'zone', unitIds: ['lok-12', 'lok-13', 'lok-14', 'lok-15', 'lok-16', 'lok-17', 'lok-18', 'lok-19', 'lok-28'] },
  { id: 'commercial-floor-6', name: 'Kati 6', type: 'zone', unitIds: ['lok-20', 'lok-21', 'lok-22', 'lok-23', 'lok-24', 'lok-25', 'lok-26', 'lok-27'] },
];

export const getSectionById = (id: string): BuildingSection | undefined => {
  return buildingSections.find((s) => s.id === id);
};

export const getSectionForUnit = (unitId: string): BuildingSection | undefined => {
  return buildingSections.find((s) => s.unitIds.includes(unitId));
};

export const getSectionsByType = (type: SectionType): BuildingSection[] => {
  return buildingSections.filter((s) => s.type === type);
};
