import { useState, useMemo } from "react";
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
import { Store, Search, SlidersHorizontal, X } from "lucide-react";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { cn } from "@/lib/utils";

interface LokaleBrowserProps {
  selectedUnit: Unit | null;
  onSelectUnit: (unit: Unit | null) => void;
  detailOpen: boolean;
  onDetailOpenChange: (open: boolean) => void;
  compareUnits: Unit[];
  onToggleCompare: (unit: Unit) => void;
  compareDisabled: boolean;
}

export function LokaleBrowser({
  selectedUnit,
  onSelectUnit,
  detailOpen,
  onDetailOpenChange,
  compareUnits,
  onToggleCompare,
  compareDisabled,
}: LokaleBrowserProps) {
  const { data: allUnits = [] } = useUnits();
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [floor, setFloor] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [minSurface, setMinSurface] = useState<number | null>(null);
  const [maxSurface, setMaxSurface] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const units = useMemo(() => {
    return allUnits.filter((u) => u.unitType === "commercial");
  }, [allUnits]);

  const floors = useMemo(() => [...new Set(units.map((u) => u.floor))].sort((a, b) => a - b), [units]);
  const surfaceRange = useMemo(() => {
    if (units.length === 0) return { min: 0, max: 200 };
    const surfaces = units.map((u) => u.surface);
    return { min: Math.min(...surfaces), max: Math.max(...surfaces) };
  }, [units]);
  const priceRange = useMemo(() => {
    if (units.length === 0) return { min: 0, max: 500000 };
    const prices = units.map((u) => u.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max: max > min ? max : min + 50000 };
  }, [units]);

  const filtered = useMemo(() => {
    return units.filter((u) => {
      if (availableOnly && !u.available) return false;
      if (floor !== null && u.floor !== floor) return false;
      if (minSurface !== null && u.surface < minSurface) return false;
      if (maxSurface !== null && u.surface > maxSurface) return false;
      if (minPrice !== null && u.price < minPrice) return false;
      if (maxPrice !== null && u.price > maxPrice) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!u.name.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [units, search, availableOnly, floor, minSurface, maxSurface, minPrice, maxPrice]);

  const availableCount = filtered.filter((u) => u.available).length;

  const hasActiveFilters = availableOnly || floor !== null || minSurface !== null || maxSurface !== null || minPrice !== null || maxPrice !== null;

  const resetFilters = () => {
    setAvailableOnly(false);
    setFloor(null);
    setMinSurface(null);
    setMaxSurface(null);
    setMinPrice(null);
    setMaxPrice(null);
  };

  const formatPrice = (value: number) => `€${(value / 1000).toFixed(0)}k`;

  return (
    <>
      <div className="h-full rounded-xl flex flex-col overflow-hidden bg-[hsl(0,0%,4%)] border border-primary/20">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" aria-hidden="true" />

        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-3 pt-3 pb-2 space-y-2">
            <div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight">
                Lokale
              </h2>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {filtered.length} found · {availableCount} available
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <GlassInput
                placeholder="Search commercial spaces..."
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
                  id="lokale-available"
                  checked={availableOnly}
                  onCheckedChange={setAvailableOnly}
                  className="scale-75"
                />
                <Label htmlFor="lokale-available" className="text-[10px] cursor-pointer text-muted-foreground">
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
                    min={surfaceRange.min} max={surfaceRange.max} step={5}
                    value={[minSurface || surfaceRange.min, maxSurface || surfaceRange.max]}
                    onValueChange={([min, max]) => {
                      setMinSurface(min === surfaceRange.min ? null : min);
                      setMaxSurface(max === surfaceRange.max ? null : max);
                    }}
                    className="py-1"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">
                    Price: {formatPrice(minPrice || priceRange.min)}–{formatPrice(maxPrice || priceRange.max)}
                  </Label>
                  <Slider
                    min={priceRange.min} max={priceRange.max} step={5000}
                    value={[minPrice || priceRange.min, maxPrice || priceRange.max]}
                    onValueChange={([min, max]) => {
                      setMinPrice(min === priceRange.min ? null : min);
                      setMaxPrice(max === priceRange.max ? null : max);
                    }}
                    className="py-1"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-white/[0.08] mx-3" />

          <ScrollArea className="flex-1 min-h-0">
            <div className="px-1 py-1">
              {filtered.length > 0 ? (
                <div className="divide-y divide-white/[0.06] pb-4">
                  {filtered.map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => { sendToUnreal(UEEvents.FOCUS_UNIT, { name: unit.name.replace(/\s*Duplex$/i, '').toUpperCase() }); onSelectUnit(unit); }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 hover:bg-white/[0.04] transition-colors",
                        selectedUnit?.id === unit.id && "bg-white/[0.06]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">{unit.name}</span>
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded",
                          unit.available ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                        )}>
                          {unit.available ? "Available" : "Sold"}
                        </span>
                      </div>
                      <div className="flex gap-3 mt-0.5 text-[10px] text-muted-foreground">
                        <span>Floor {unit.floor}</span>
                        <span>{unit.surface} m²</span>
                        <span>€{unit.price.toLocaleString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-8 text-center">
                  <Store className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-xs text-muted-foreground">No commercial spaces found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <UnitDetailDrawer
        unit={selectedUnit}
        open={detailOpen}
        onOpenChange={onDetailOpenChange}
        onToggleCompare={onToggleCompare}
        isInCompare={selectedUnit ? compareUnits.some((u) => u.id === selectedUnit.id) : false}
        compareDisabled={compareDisabled}
      />
    </>
  );
}
