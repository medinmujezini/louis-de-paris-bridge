import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useThreeDMode } from "@/contexts/ThreeDModeContext";
import { ViewerControls } from "@/components/home/ViewerControls";
import { GlassCard } from "@/components/ui/glass-card";
import { InteriorFloorPlanOverlay } from "./InteriorFloorPlanOverlay";
import { InteriorOnboarding } from "./InteriorOnboarding";
import { InteriorContextMenu, SelectedObjectData } from "./InteriorContextMenu";
import { InteriorMaterialEditor } from "./InteriorMaterialEditor";
import { UnitPrintBrochure } from "@/components/units/UnitPrintBrochure";
import { UnitContactForm } from "@/components/units/UnitContactForm";
import { sendToUnreal, registerHandler, UEEvents, isMockMode, simulateMockObjectSelected } from "@/lib/ue-bridge";
import { useToast } from "@/hooks/use-toast";
import { mockUnits } from "@/data/mock-units";
import {
  Bed, Bath, Maximize, Building2, DoorOpen,
  Compass, Sun as SunIcon, Move, Settings, Printer, MessageSquareQuote, X, Square,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TimeOfDay = "dawn" | "morning" | "noon" | "sunset" | "night";
type Weather = "clear" | "cloudy" | "rainy" | "foggy";

const orientationLabels: Record<string, string> = {
  north: "North",
  south: "South",
  east: "East",
  west: "West",
};

export function InteriorUI() {
  const { unit: contextUnit, startExit } = useThreeDMode();
  const navigate = useNavigate();

  // Fallback unit for direct URL access
  const fallbackUnit = mockUnits.find(u => u.unitType === "apartment" && u.available) || mockUnits[0];
  const unit = contextUnit || fallbackUnit;
  const { toast } = useToast();
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("noon");
  const [weather, setWeather] = useState<Weather>("clear");
  const [showHint, setShowHint] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [selectedObject, setSelectedObject] = useState<SelectedObjectData | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unTime = registerHandler(UEEvents.TIME_CHANGED, (data) => {
      setTimeOfDay((data as { time: TimeOfDay }).time);
    });
    const unWeather = registerHandler(UEEvents.WEATHER_CHANGED, (data) => {
      setWeather((data as { weather: Weather }).weather);
    });
    const unObjSelected = registerHandler(UEEvents.OBJECT_SELECTED, (data) => {
      const obj = data as SelectedObjectData;
      setSelectedObject(obj);
      setContextMenuPos(obj.position);
    });
    const unObjDeselected = registerHandler(UEEvents.OBJECT_DESELECTED, () => {
      setSelectedObject(null);
    });
    const unObjMoved = registerHandler(UEEvents.OBJECT_MOVED, (data) => {
      const d = data as { actor?: string };
      toast({ title: "Object placed", description: d.actor ? `${d.actor} moved to new position` : "Object placed successfully" });
    });
    const unMatChanged = registerHandler(UEEvents.MATERIAL_CHANGED, (data) => {
      const d = data as { slot?: number; color?: string };
      if (d.color) {
        toast({ title: "Material updated", description: `Slot ${d.slot ?? 0} color set to ${d.color}` });
      }
    });
    return () => { unTime(); unWeather(); unObjSelected(); unObjDeselected(); unObjMoved(); unMatChanged(); };
  }, [toast]);

  const handleTimeChange = (time: TimeOfDay) => {
    setTimeOfDay(time);
    sendToUnreal(UEEvents.SET_TIME_OF_DAY, { time });
  };

  const handleWeatherChange = (w: Weather) => {
    setWeather(w);
    sendToUnreal(UEEvents.SET_WEATHER, { weather: w });
  };

  const handleExit = () => {
    sendToUnreal(UEEvents.EXIT_INTERIOR, {});
    setSelectedObject(null);
    if (contextUnit) {
      startExit();
    } else {
      navigate("/units");
    }
  };

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (!isEditing) return;
    e.preventDefault();
    if (isMockMode()) {
      simulateMockObjectSelected(e.clientX, e.clientY);
    }
  }, [isEditing]);

  const handleMoveActivated = useCallback(() => {
    // Close context menu when move mode starts — user needs full viewport
    setSelectedObject(null);
  }, []);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>${unit.name} - Brochure</title>
      <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        .print-brochure { max-width: 800px; margin: 0 auto; }
        .print-brochure__header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
        .print-brochure__logo { height: 48px; }
        .print-brochure__title { font-size: 24px; font-weight: bold; margin: 0; }
        .print-brochure__subtitle { font-size: 14px; color: #666; margin: 0; }
        .print-brochure__accent-line { height: 3px; background: linear-gradient(90deg, #c0392b, transparent); margin: 12px 0; }
        .print-brochure__unit-header { margin-bottom: 16px; }
        .print-brochure__unit-name { font-size: 20px; font-weight: bold; margin: 0 0 8px; }
        .print-brochure__unit-meta { display: flex; gap: 16px; color: #666; font-size: 13px; }
        .print-brochure__meta-item { display: flex; align-items: center; gap: 4px; }
        .print-brochure__section { margin-bottom: 20px; }
        .print-brochure__section-title { font-size: 16px; font-weight: 600; margin: 0 0 12px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
        .print-brochure__specs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .print-brochure__spec-card { text-align: center; padding: 12px; border: 1px solid #eee; border-radius: 8px; }
        .print-brochure__spec-icon { color: #c0392b; margin: 0 auto 4px; }
        .print-brochure__spec-value { display: block; font-size: 18px; font-weight: bold; }
        .print-brochure__spec-label { display: block; font-size: 12px; color: #888; }
        .print-brochure__features { display: flex; flex-wrap: wrap; gap: 8px; }
        .print-brochure__feature-tag { padding: 4px 10px; background: #f5f5f5; border-radius: 4px; font-size: 13px; }
        .print-brochure__floorplan { border: 1px solid #eee; border-radius: 8px; padding: 40px; text-align: center; }
        .print-brochure__floorplan-sub { color: #888; font-size: 13px; }
        .print-brochure__footer { margin-top: 24px; }
        .print-brochure__footer-content { text-align: center; padding: 12px 0; }
        .print-brochure__footer-brand { font-weight: bold; margin: 0 0 4px; }
        .print-brochure__footer-contact { font-size: 12px; color: #666; margin: 0 0 4px; }
        .print-brochure__footer-disclaimer { font-size: 10px; color: #999; margin: 0; }
      </style></head><body>${printContent.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!unit) return null; // Safety check (should never hit due to fallback)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[50] pointer-events-none"
      onContextMenu={handleContextMenu}
    >
      {/* Hidden print brochure */}
      <div className="hidden">
        <UnitPrintBrochure ref={printRef} unit={unit} />
      </div>

      {/* Interior onboarding tutorial */}
      <InteriorOnboarding />

      {/* Top-right: Floor plan + Unit info card + Exit button */}
      <div className="absolute top-6 right-6 pointer-events-auto flex flex-col gap-3 w-72">
        {/* Floor plan */}
        <InteriorFloorPlanOverlay unit={unit} />

        <GlassCard variant="strong" className="p-5 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">{unit.name}</h3>
            <p className="text-sm text-foreground/70 flex items-center gap-1.5 mt-1">
              <Building2 className="w-4 h-4" />
              Floor {unit.floor}
            </p>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/10 to-transparent my-3" />
          <div className="flex flex-col gap-2 text-sm">
            <span className="flex items-center gap-2 text-foreground">
              <Maximize className="w-4 h-4 text-primary" />
              {unit.surface} m²
            </span>
            <span className="flex items-center gap-2 text-foreground">
              <Bed className="w-4 h-4 text-primary" />
              {unit.bedrooms} bed
            </span>
            <span className="flex items-center gap-2 text-foreground">
              <Bath className="w-4 h-4 text-primary" />
              {unit.bathrooms} bath
            </span>
            {unit.orientation && (
              <span className="flex items-center gap-2 text-foreground">
                <Compass className="w-4 h-4 text-primary" />
                {orientationLabels[unit.orientation] || unit.orientation}
              </span>
            )}
            {unit.terrace && unit.terrace > 0 && (
              <span className="flex items-center gap-2 text-foreground">
                <SunIcon className="w-4 h-4 text-primary" />
                Terrace: {unit.terrace} m²
              </span>
            )}
          </div>
        </GlassCard>

        {/* Action buttons */}
        <GlassCard variant="strong" className="p-1.5">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md text-sm font-semibold transition-all duration-200 ${
              isEditing
                ? "bg-primary/20 border border-primary/40 text-primary"
                : "text-foreground hover:bg-white/10"
            }`}
          >
            {isEditing ? <Square className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            {isEditing ? "Stop Editing" : "Edit Interior"}
          </button>
          <div className="h-px mx-2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md text-sm font-semibold transition-all duration-200 text-foreground hover:bg-white/10"
          >
            <Printer className="w-5 h-5" />
            Print Plan
          </button>
          <div className="h-px mx-2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <button
            onClick={() => setShowQuoteDialog(true)}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md text-sm font-semibold transition-all duration-200 text-foreground hover:bg-white/10"
          >
            <MessageSquareQuote className="w-5 h-5" />
            Ask for Quote
          </button>
        </GlassCard>

        {/* Exit button */}
        <GlassCard variant="strong" className="p-1.5">
          <button
            onClick={handleExit}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md text-sm font-semibold transition-all duration-200 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 hover:border-red-500/50"
          >
            <DoorOpen className="w-5 h-5" />
            Exit Interior
          </button>
        </GlassCard>
      </div>

      {/* Top-left: Material editor — visible when editing */}
      <AnimatePresence>
        {isEditing && (
          <div className="absolute top-6 left-6 pointer-events-auto">
            <InteriorMaterialEditor />
          </div>
        )}
      </AnimatePresence>

      {/* Quote Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="text-foreground">Send Inquiry — {unit.name}</DialogTitle>
          </DialogHeader>
          <UnitContactForm unitId={unit.id} unitName={unit.name} />
        </DialogContent>
      </Dialog>

      {/* Right-click context menu for object editing */}
      {selectedObject && isEditing && (
        <InteriorContextMenu
          objectData={selectedObject}
          position={contextMenuPos}
          onClose={() => setSelectedObject(null)}
          onMoveActivated={handleMoveActivated}
        />
      )}

      {/* Bottom-center: Time & Weather controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        <ViewerControls
          timeOfDay={timeOfDay}
          weather={weather}
          onTimeChange={handleTimeChange}
          onWeatherChange={handleWeatherChange}
          compact
        />
      </div>

      {/* Navigation hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Move className="w-3 h-3" />
              Click and drag to look around
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
