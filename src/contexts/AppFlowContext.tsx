import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type FlowPhase = "intro" | "section-select" | "browsing";
export type SectionType = "apartment" | "villa" | null;

interface AppFlowContextType {
  phase: FlowPhase;
  selectedSection: SectionType;
  skipIntro: () => void;
  selectSection: (section: "apartment" | "villa") => void;
  backToSections: () => void;
}

const AppFlowContext = createContext<AppFlowContextType | null>(null);

export function AppFlowProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<FlowPhase>("intro");
  const [selectedSection, setSelectedSection] = useState<SectionType>(null);

  const skipIntro = useCallback(() => setPhase("section-select"), []);

  const selectSection = useCallback((section: "apartment" | "villa") => {
    setSelectedSection(section);
    setPhase("browsing");
  }, []);

  const backToSections = useCallback(() => {
    setSelectedSection(null);
    setPhase("section-select");
  }, []);

  return (
    <AppFlowContext.Provider value={{ phase, selectedSection, skipIntro, selectSection, backToSections }}>
      {children}
    </AppFlowContext.Provider>
  );
}

export function useAppFlow() {
  const ctx = useContext(AppFlowContext);
  if (!ctx) throw new Error("useAppFlow must be used within AppFlowProvider");
  return ctx;
}
