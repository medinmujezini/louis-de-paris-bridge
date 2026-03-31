import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Unit } from "@/types/units";

interface SelectedUnitState {
  selectedUnit: Unit | null;
  setSelectedUnit: (unit: Unit | null) => void;
  detailOpen: boolean;
  setDetailOpen: (open: boolean) => void;
  openDetail: () => void;
}

const SelectedUnitContext = createContext<SelectedUnitState | undefined>(undefined);

export function SelectedUnitProvider({ children }: { children: ReactNode }) {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = useCallback(() => {
    if (selectedUnit) setDetailOpen(true);
  }, [selectedUnit]);

  return (
    <SelectedUnitContext.Provider value={{ selectedUnit, setSelectedUnit, detailOpen, setDetailOpen, openDetail }}>
      {children}
    </SelectedUnitContext.Provider>
  );
}

export function useSelectedUnit() {
  const ctx = useContext(SelectedUnitContext);
  if (!ctx) throw new Error("useSelectedUnit must be used within SelectedUnitProvider");
  return ctx;
}
