import { useState, useMemo, useCallback } from "react";
import { Unit } from "@/types/units";
import { useUnits } from "@/hooks/useUnits";
import { UnitDetailDrawer } from "@/components/units/UnitDetailDrawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlassInput } from "@/components/ui/glass-input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Search, SlidersHorizontal, X, ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { useThreeDMode } from "@/contexts/ThreeDModeContext";
import { CompareFloatingBar } from "@/components/units/CompareFloatingBar";
import { ComparePanel } from "@/components/units/ComparePanel";
import { toast } from "@/hooks/use-toast";

const MAX_COMPARE = 6;

interface ParkingBrowserProps {
  onBack: () => void;
}

export function ParkingBrowser({ onBack }: ParkingBrowserProps) {
  const { data: allUnits = [] } = useUnits();
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [floor, setFloor] = useState<number | null>(null);
  const [subType, setSubType] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [minSurface, setMinSurface] = useState<number | null>(null);
  const [maxSurface, setMaxSurface] = useState<number | null>(null);
  const [savedUnits, setSavedUnits] = useState<Set<string>>(new Set());
  const [compareUnits, setCompareUnits] = useState<Unit[]>([]);
  const [comparePanelOpen, setComparePanelOpen] = useState(false);

  const units = useMemo(() => {
    return allUnits.filter((u) => u.unitType === "garage" || u.unitType === "storage");
  }, [allUnits]);

  const floors = useMemo(() => [...new Set(units.map((u) => u.floor))].sort((a, b) => a - b), [units]);
  const surfaceRange = useMemo(() => {
    if (units.length === 0) return { min: 0, max: 100 };
    const surfaces = units.map((u) => u.surface);
    return { min: Math.min(...surfaces), max: Math.max(...surfaces) };
  }, [units]);

  const filtered = useMemo(() => {
    return units.filter((u) => {
      if (availableOnly && !u.available) return false;
      if (floor !== null && u.floor !== floor) return false;
      if (subType !== null && u.unitType !== subType) return false;
      if (minSurface !== null && u.surface < minSurface) return false;
      if (maxSurface !== null && u.surface > maxSurface) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!u.name.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [units, search, availableOnly, floor, subType, minSurface, maxSurface]);

  const availableCount = filtered.filter((u) => u.available).length;
  const hasActiveFilters = availableOnly || floor !== null || subType !== null || minSurface !== null || maxSurface !== null;

  const resetFilters = () => {
    setAvailableOnly(true);
    setFloor(null);
    setSubType(null);
    setMinSurface(null);
    setMaxSurface(null);
  };

  const toggleSaved = useCallback((unitId: string) => {
    setSavedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) next.delete(unitId);
      else next.add(unitId);
      return next;
    });
  }, []);

  const toggleCompare = useCallback((unit: Unit) => {
    setCompareUnits((prev) => {
      const exists = prev.some((u) => u.id === unit.id);
      if (exists) return prev.filter((u) => u.id !== unit.id);
      if (prev.length >= MAX_COMPARE) {
        toast({ title: "Maximum compare limit reached", variant: "destructive" });
        return prev;
      }
      return [...prev, unit];
    });
  }, []);

  const removeFromCompare = useCallback((unitId: string) => {
    setCompareUnits((prev) => prev.filter((u) => u.id !== unitId));
  }, []);

  return (
    <>
      <div className="glass-card glass-card--strong h-full rounded-xl flex flex-col overflow-hidden">
        <div className="glass-card__light-bar glass-card__light-bar--strong" aria-hidden="true" />

        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-3 pt-3 pb-2 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-sm font-semibold text-foreground tracking-tight">
                  Parking & Depo
                </h2>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {filtered.length} found · {availableCount} available
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <GlassInput
                placeholder="Search parking & storage..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-7 text-xs"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="px-3 py-2 space-y-2 border-t border-white/[0.06]">
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-1">
                <Switch
                  id="parking-available"
                  checked={availableOnly}
                  onCheckedChange={setAvailableOnly}
                  className="scale-75"
                />
                <Label htmlFor="parking-available" className="text-[10px] cursor-pointer text-muted-foreground">
                  Available
                </Label>
              </div>

              <Select
                value={floor?.toString() || "all"}
                onValueChange={(v) => setFloor(v === "all" ? null : parseInt(v))}
              >
                <SelectTrigger className="w-[4.5rem] h-6 text-[10px] bg-white/5 border-white/10 rounded-md px-1.5">
                  <SelectValue placeholder="Floor" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="all">All Floors</SelectItem>
                  {floors.map((f) => (
                    <SelectItem key={f} value={f.toString()}>F{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={subType || "all"}
                onValueChange={(v) => setSubType(v === "all" ? null : v)}
              >
                <SelectTrigger className="w-[4.5rem] h-6 text-[10px] bg-white/5 border-white/10 rounded-md px-1.5">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="garage">Garage</SelectItem>
                  <SelectItem value="storage">Depo</SelectItem>
                </SelectContent>
              </Select>

              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 rounded-md text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <SlidersHorizontal className="w-3 h-3" />
              </button>

              {hasActiveFilters && (
                <button onClick={resetFilters} className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {expanded && (
              <div className="space-y-2 pt-1 border-t border-white/[0.06] animate-fade-in">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">
                    Surface: {minSurface || surfaceRange.min}–{maxSurface || surfaceRange.max} m²
                  </Label>
                  <Slider
                    min={surfaceRange.min} max={surfaceRange.max} step={1}
                    value={[minSurface || surfaceRange.min, maxSurface || surfaceRange.max]}
                    onValueChange={([min, max]) => {
                      setMinSurface(min === surfaceRange.min ? null : min);
                      setMaxSurface(max === surfaceRange.max ? null : max);
                    }}
                    className="py-1"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-white/[0.08] mx-3" />

          {/* Unit list */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-1 py-1">
              {filtered.length > 0 ? (
                <div className="divide-y divide-white/[0.06] pb-4">
                  {filtered.map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => {
                        setSelectedUnit(unit);
                        setDetailOpen(true);
                        sendToUnreal(UEEvents.FOCUS_UNIT, { name: unit.name.replace(/\s*Duplex$/i, ''), building: unit.building, animate: true });
                      }}
                      onMouseEnter={() => sendToUnreal(UEEvents.HIGHLIGHT_UNIT, { name: unit.name, highlight: true })}
                      onMouseLeave={() => sendToUnreal(UEEvents.HIGHLIGHT_UNIT, { name: unit.name, highlight: false })}
                      className={cn(
                        "w-full text-left px-3 py-2.5 hover:bg-white/[0.04] transition-colors",
                        "border-b border-white/[0.08]"
                      )}
                      style={{
                        borderImage: "linear-gradient(90deg, transparent 5%, hsl(0 0% 100% / 0.15) 30%, hsl(0 0% 100% / 0.25) 50%, hsl(0 0% 100% / 0.15) 70%, transparent 95%) 1",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">{unit.name}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaved(unit.id);
                            }}
                            className={cn(
                              "shrink-0 transition-opacity p-0.5",
                              savedUnits.has(unit.id) ? "text-primary opacity-100" : "text-muted-foreground opacity-40 hover:opacity-100"
                            )}
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded",
                            unit.available ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                          )}>
                            {unit.available ? "Available" : "Sold"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-0.5 text-[10px] text-muted-foreground">
                        <span>Floor {unit.floor}</span>
                        <span>{unit.surface} m²</span>
                        <span className="capitalize">{unit.unitType}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-8 text-center">
                  <Car className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-xs text-muted-foreground">No units found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <CompareFloatingBar
        units={compareUnits}
        maxUnits={MAX_COMPARE}
        onRemove={removeFromCompare}
        onCompare={() => setComparePanelOpen(true)}
        onClear={() => setCompareUnits([])}
      />

      <ComparePanel
        units={compareUnits}
        open={comparePanelOpen}
        onOpenChange={setComparePanelOpen}
        onRemove={removeFromCompare}
      />

      <UnitDetailDrawer
        unit={selectedUnit}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onToggleCompare={toggleCompare}
        isInCompare={selectedUnit ? compareUnits.some((u) => u.id === selectedUnit.id) : false}
        compareDisabled={compareUnits.length >= MAX_COMPARE}
      />
    </>
  );
}
