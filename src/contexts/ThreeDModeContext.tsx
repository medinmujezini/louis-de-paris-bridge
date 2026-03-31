import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Unit } from "@/types/units";

export type InteriorPhase = "loading" | "video" | "interior" | "exiting-loading" | "exiting-video" | null;

interface ThreeDModeState {
  active: boolean;
  phase: InteriorPhase;
  unit: Unit | null;
  enter: (unit: Unit) => void;
  setPhase: (phase: InteriorPhase) => void;
  startExit: () => void;
  finalizeExit: () => void;
}

const ThreeDModeContext = createContext<ThreeDModeState | undefined>(undefined);

export function ThreeDModeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [phase, setPhaseState] = useState<InteriorPhase>(null);
  const [unit, setUnit] = useState<Unit | null>(null);

  const enter = useCallback((u: Unit) => {
    setUnit(u);
    setActive(true);
    setPhaseState("loading");
  }, []);

  const setPhase = useCallback((p: InteriorPhase) => {
    setPhaseState(p);
  }, []);

  const startExit = useCallback(() => {
    setPhaseState("exiting-loading");
  }, []);

  const finalizeExit = useCallback(() => {
    setActive(false);
    setPhaseState(null);
    setUnit(null);
  }, []);

  return (
    <ThreeDModeContext.Provider value={{ active, phase, unit, enter, setPhase, startExit, finalizeExit }}>
      {children}
    </ThreeDModeContext.Provider>
  );
}

export function useThreeDMode() {
  const ctx = useContext(ThreeDModeContext);
  if (!ctx) throw new Error("useThreeDMode must be used within ThreeDModeProvider");
  return ctx;
}
