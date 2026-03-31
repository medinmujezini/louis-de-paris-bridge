import { useState, useCallback } from "react";
import { LokaleBrowser } from "@/components/lokale/LokaleBrowser";
import { CompareFloatingBar } from "@/components/units/CompareFloatingBar";
import { ComparePanel } from "@/components/units/ComparePanel";
import { Unit } from "@/types/units";
import { Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MAX_COMPARE_UNITS = 6;

function LokaleActionButtons({
  selectedUnit,
  onViewDetails,
}: {
  selectedUnit: Unit | null;
  onViewDetails: () => void;
}) {
  if (!selectedUnit) return null;

  return (
    <div
      className="absolute bottom-20 z-10 flex flex-col items-center gap-2.5"
      style={{ left: "44.5%", transform: "translateX(-50%)" }}
    >
      <button
        onClick={onViewDetails}
        className="group relative px-6 py-2.5 rounded-xl overflow-visible flex items-center gap-2.5 text-sm font-bold text-foreground transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105"
        style={{
          background: "linear-gradient(180deg, hsl(var(--primary) / 0.3) 0%, hsl(var(--primary) / 0.08) 100%)",
          boxShadow: "0 0 20px hsl(var(--primary) / 0.25), 0 0 6px hsl(var(--primary) / 0.15), 0 8px 32px rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300 group-hover:w-full" aria-hidden="true" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[4px] blur-[4px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300 group-hover:w-3/4 group-hover:blur-[6px]" aria-hidden="true" />
        <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: "0 0 36px hsl(var(--primary) / 0.4), 0 0 14px hsl(var(--primary) / 0.2)" }} />
        <Eye className="w-4 h-4" />
        VIEW DETAILS
      </button>
    </div>
  );
}

const LokalePage = () => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [compareUnits, setCompareUnits] = useState<Unit[]>([]);
  const [comparePanelOpen, setComparePanelOpen] = useState(false);

  const toggleCompare = useCallback((unit: Unit) => {
    setCompareUnits((prev) => {
      const isIn = prev.some((u) => u.id === unit.id);
      if (isIn) return prev.filter((u) => u.id !== unit.id);
      if (prev.length >= MAX_COMPARE_UNITS) {
        toast({ title: "Maximum compare units reached", variant: "destructive" });
        return prev;
      }
      return [...prev, unit];
    });
  }, []);

  const removeFromCompare = useCallback((unitId: string) => {
    setCompareUnits((prev) => prev.filter((u) => u.id !== unitId));
  }, []);

  const clearCompare = useCallback(() => setCompareUnits([]), []);

  return (
    <div className="relative w-full h-[calc(100vh-6rem)]">
      <LokaleActionButtons
        selectedUnit={selectedUnit}
        onViewDetails={() => setDetailOpen(true)}
      />

      <div className="absolute right-3 top-0 bottom-3 w-[340px] max-w-[85vw] z-10">
        <LokaleBrowser
          selectedUnit={selectedUnit}
          onSelectUnit={setSelectedUnit}
          detailOpen={detailOpen}
          onDetailOpenChange={setDetailOpen}
          compareUnits={compareUnits}
          onToggleCompare={toggleCompare}
          compareDisabled={compareUnits.length >= MAX_COMPARE_UNITS}
        />
      </div>

      <CompareFloatingBar
        units={compareUnits}
        maxUnits={MAX_COMPARE_UNITS}
        onRemove={removeFromCompare}
        onCompare={() => setComparePanelOpen(true)}
        onClear={clearCompare}
      />

      <ComparePanel
        units={compareUnits}
        open={comparePanelOpen}
        onOpenChange={setComparePanelOpen}
        onRemove={removeFromCompare}
      />
    </div>
  );
};

export default LokalePage;
