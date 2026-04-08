import { useState, useMemo, useEffect, useCallback } from "react";
import { Unit, UnitFilters, defaultFilters } from "@/types/units";
import { useAppFlow } from "@/contexts/AppFlowContext";
import { useUnits } from "@/hooks/useUnits";
import { buildingSections, getSectionById } from "@/data/building-sections";
import { UnitCard } from "./UnitCard";
import { UnitsFilters } from "./UnitsFilters";
import { UnitDetailDrawer } from "./UnitDetailDrawer";

import { CompareFloatingBar } from "./CompareFloatingBar";
import { ComparePanel } from "./ComparePanel";
import { GlassCard } from "@/components/ui/glass-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, Search, X } from "lucide-react";
import { GlassInput } from "@/components/ui/glass-input";
import { registerHandler, sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { useSelectedUnit } from "@/contexts/SelectedUnitContext";

interface UnitsBrowserProps {
  onClose?: () => void;
}

const MAX_COMPARE_UNITS = 6;

export function UnitsBrowser({ onClose }: UnitsBrowserProps) {
  const { t } = useLanguage();
  const { data: dbUnits = [] } = useUnits();
  const { selectedSection } = useAppFlow();
  const { selectedUnit, setSelectedUnit, detailOpen, setDetailOpen } = useSelectedUnit();
  const [units, setUnits] = useState<Unit[]>([]);
  const [filters, setFilters] = useState<UnitFilters>(defaultFilters);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null);
  const [compareUnits, setCompareUnits] = useState<Unit[]>([]);
  const [comparePanelOpen, setComparePanelOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filtersForceExpanded, setFiltersForceExpanded] = useState(false);

  // Initialize units from database — filter by selected section type
  useEffect(() => {
    if (dbUnits.length > 0) {
      const sectionFilter = selectedSection || "apartment";
      setUnits(dbUnits.filter((u) => u.unitType === sectionFilter || (!u.unitType && sectionFilter === "apartment")));
    }
  }, [dbUnits, selectedSection]);

  const floors = useMemo(() => [...new Set(units.map((u) => u.floor))].sort((a, b) => a - b), [units]);
  const priceRange = useMemo(() => {
    if (units.length === 0) return { min: 0, max: 1000000 };
    const prices = units.map((u) => u.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max: max > min ? max : min + 100000 };
  }, [units]);
  const surfaceRange = useMemo(() => {
    if (units.length === 0) return { min: 0, max: 200 };
    const surfaces = units.map((u) => u.surface);
    const min = Math.min(...surfaces);
    const max = Math.max(...surfaces);
    return { min, max: max > min ? max : min + 100 };
  }, [units]);

  // Register for unit updates from Unreal Engine
  useEffect(() => {
    const cleanup = registerHandler(UEEvents.UPDATE_UNIT_LIST, (data) => {
      const { units: ueUnits } = data as { units: Unit[] };
      if (ueUnits && Array.isArray(ueUnits)) {
        setUnits(ueUnits);
      }
    });
    return cleanup;
  }, []);

  // Listen for unit selection from Unreal Engine
  useEffect(() => {
    const normalizeUnitName = (n: string) => n.replace(/\s+/g, " ").trim().toLowerCase();

    const handleUnitSelected = (data: unknown) => {
      // Support both plain string name and object payload
      let id: string | undefined;
      let name: string | undefined;
      let building: string | undefined;

      if (typeof data === "string") {
        name = data;
      } else {
        const obj = data as { id?: string; name?: string; building?: string };
        id = obj.id;
        name = obj.name;
        building = obj.building;
      }

      let unit: Unit | undefined;

      // Priority 1: match by ID
      if (id) unit = units.find((u) => u.id === id);

      // Priority 2: match by name + building
      if (!unit && name) {
        const norm = normalizeUnitName(name);
        unit = units.find(
          (u) => normalizeUnitName(u.name) === norm && (!building || u.building === building)
        );
        // Fallback: name only (ignore building)
        if (!unit) {
          unit = units.find((u) => normalizeUnitName(u.name) === norm);
        }
      }

      if (unit) {
        setSelectedUnit(unit);
        setDetailOpen(true);
      }
    };

    const cleanup1 = registerHandler(UEEvents.UNIT_SELECTED, handleUnitSelected);
    const cleanup2 = registerHandler("onUnitSelected", handleUnitSelected);
    return () => { cleanup1(); cleanup2(); };
  }, [units]);

  // Listen for section changes from Unreal Engine
  useEffect(() => {
    const cleanup = registerHandler(UEEvents.SECTION_CHANGED, (data) => {
      const { id } = data as { id: string };
      setActiveSection(id);
    });
    return cleanup;
  }, []);

  // Listen for DinoBot filter events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail === "object") {
        setFilters({ ...defaultFilters, ...detail });
        // Auto-expand filters so user sees them move
        setFiltersForceExpanded(true);
        // Reset after 5 seconds so user can collapse again
        setTimeout(() => setFiltersForceExpanded(false), 5000);
      }
    };
    window.addEventListener("dinobot-filter", handler);
    return () => window.removeEventListener("dinobot-filter", handler);
  }, []);

  const handleSectionChange = useCallback((sectionId: string | null) => {
    setActiveSection(sectionId);
    if (sectionId) {
      sendToUnreal(UEEvents.FOCUS_SECTION, { id: sectionId, animate: true });
    }
  }, []);

  const handleUnitHover = useCallback((unitId: string | null) => {
    if (hoveredUnitId !== unitId) {
      if (hoveredUnitId) {
        sendToUnreal(UEEvents.HIGHLIGHT_UNIT, { id: hoveredUnitId, highlight: false });
      }
      if (unitId) {
        sendToUnreal(UEEvents.HIGHLIGHT_UNIT, { id: unitId, highlight: true });
      }
      setHoveredUnitId(unitId);
    }
  }, [hoveredUnitId]);

  const toggleCompare = useCallback((unit: Unit) => {
    setCompareUnits((prev) => {
      const isInCompare = prev.some((u) => u.id === unit.id);
      if (isInCompare) return prev.filter((u) => u.id !== unit.id);
      if (prev.length >= MAX_COMPARE_UNITS) {
        toast({ title: t.units.compare.maxReached, variant: "destructive" });
        return prev;
      }
      return [...prev, unit];
    });
  }, [t]);

  const removeFromCompare = useCallback((unitId: string) => {
    setCompareUnits((prev) => prev.filter((u) => u.id !== unitId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareUnits([]);
  }, []);

  // Filter logic
  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      if (activeSection) {
        const section = getSectionById(activeSection);
        if (section && !section.unitIds.includes(unit.id)) return false;
      }
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const match = unit.name.toLowerCase().includes(s) ||
          unit.features?.some((f) => f.toLowerCase().includes(s));
        if (!match) return false;
      }
      if (filters.availableOnly && !unit.available) return false;
      if (filters.floor !== null && unit.floor !== filters.floor) return false;
      if (filters.orientation !== null && unit.orientation !== filters.orientation) return false;
      if (filters.building !== null && unit.building !== filters.building) return false;
      if (filters.unitType !== null && unit.unitType !== filters.unitType) return false;
      if (filters.minBedrooms !== null && unit.bedrooms < filters.minBedrooms) return false;
      if (filters.maxBedrooms !== null && unit.bedrooms > filters.maxBedrooms) return false;
      if (filters.minBathrooms !== null && unit.bathrooms < filters.minBathrooms) return false;
      if (filters.maxBathrooms !== null && unit.bathrooms > filters.maxBathrooms) return false;
      if (filters.minSurface !== null && unit.surface < filters.minSurface) return false;
      if (filters.maxSurface !== null && unit.surface > filters.maxSurface) return false;
      if (filters.minPrice !== null && unit.price < filters.minPrice) return false;
      if (filters.maxPrice !== null && unit.price > filters.maxPrice) return false;
      return true;
    });
  }, [units, filters, activeSection]);

  const availableCount = filteredUnits.filter((u) => u.available).length;

  return (
    <>
      <div className="h-full rounded-xl flex flex-col overflow-hidden bg-[hsl(0,0%,4%)] border border-primary/20">
        {/* Gold accent bar at top */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" aria-hidden="true" />

        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          {/* ── Header: count + search ── */}
          <div className="px-3 pt-3 pb-2 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground tracking-tight">
                  {t.units.title}
                </h2>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {filteredUnits.length} {t.units.found} · {availableCount} {t.units.available}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors text-muted-foreground hover:text-foreground",
                    showFilters && "text-primary bg-primary/10"
                  )}
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                {onClose && (
                  <button onClick={onClose} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                placeholder={t.units.filters.searchPlaceholder}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-8 h-7 text-xs rounded-lg bg-[hsl(0,0%,8%)] border border-primary/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>

          </div>

          {/* ── Filters ── */}
          <div data-tutorial="units-filters">
            <UnitsFilters
              filters={filters}
              onFiltersChange={setFilters}
              floors={floors}
              priceRange={priceRange}
              surfaceRange={surfaceRange}
              forceExpanded={filtersForceExpanded}
            />
          </div>

          {/* ── Divider ── */}
          <RoyalDivider variant="line" className="my-1" />

          {/* ── Scrollable unit list ── */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-1 py-1">
              {filteredUnits.length > 0 ? (
                <div className="divide-y divide-white/[0.06] pb-4">
                  {filteredUnits.map((unit, index) => (
                    <div key={unit.id} data-tutorial={index === 0 ? "unit-card" : undefined}>
                      <UnitCard
                        unit={unit}
                        isSelected={selectedUnit?.id === unit.id}
                        isHighlighted={hoveredUnitId === unit.id}
                        isInCompare={compareUnits.some((u) => u.id === unit.id)}
                        compareDisabled={compareUnits.length >= MAX_COMPARE_UNITS}
                        onSelect={(u) => {
                          setSelectedUnit(u);
                          sendToUnreal(UEEvents.FOCUS_UNIT, { name: u.name.replace(/\s*Duplex$/i, ''), building: u.building, animate: true });
                        }}
                        onHover={handleUnitHover}
                        onToggleCompare={toggleCompare}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-8 text-center">
                  <Building2 className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-xs text-muted-foreground">{t.units.noResults}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Detail Drawer */}
      <UnitDetailDrawer
        unit={selectedUnit}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onToggleCompare={toggleCompare}
        isInCompare={selectedUnit ? compareUnits.some((u) => u.id === selectedUnit.id) : false}
        compareDisabled={compareUnits.length >= MAX_COMPARE_UNITS}
      />

      {/* Compare Bar - rendered outside the card */}
      <div data-tutorial="unit-compare">
        <CompareFloatingBar
          units={compareUnits}
          maxUnits={MAX_COMPARE_UNITS}
          onRemove={removeFromCompare}
          onCompare={() => setComparePanelOpen(true)}
          onClear={clearCompare}
        />
      </div>

      <ComparePanel
        units={compareUnits}
        open={comparePanelOpen}
        onOpenChange={setComparePanelOpen}
        onRemove={removeFromCompare}
      />
    </>
  );
}
