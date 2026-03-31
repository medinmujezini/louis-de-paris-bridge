import { UnitFilters, Orientation } from "@/types/units";
import { GlassButton } from "@/components/ui/glass-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

interface UnitsFiltersProps {
  filters: UnitFilters;
  onFiltersChange: (filters: UnitFilters) => void;
  floors: number[];
  priceRange: { min: number; max: number };
  surfaceRange: { min: number; max: number };
  forceExpanded?: boolean;
}

export function UnitsFilters({
  filters,
  onFiltersChange,
  floors,
  priceRange,
  surfaceRange,
  forceExpanded,
}: UnitsFiltersProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  // Auto-expand when DinoBot sets filters
  const isExpanded = forceExpanded || expanded;

  const orientationOptions: { value: Orientation; label: string }[] = [
    { value: "north", label: t.units.orientation.north },
    { value: "south", label: t.units.orientation.south },
    { value: "east", label: t.units.orientation.east },
    { value: "west", label: t.units.orientation.west },
  ];

  const updateFilter = <K extends keyof UnitFilters>(key: K, value: UnitFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: filters.search, // keep search intact
      minSurface: null, maxSurface: null,
      minBedrooms: null, maxBedrooms: null,
      minBathrooms: null, maxBathrooms: null,
      minPrice: null, maxPrice: null,
      availableOnly: false, floor: null,
      orientation: null, building: null, unitType: null,
    });
  };

  const hasActiveFilters =
    filters.minSurface || filters.maxSurface ||
    filters.minBedrooms || filters.maxBedrooms ||
    filters.minBathrooms || filters.maxBathrooms ||
    filters.minPrice || filters.maxPrice ||
    filters.availableOnly || filters.floor ||
    filters.orientation || filters.building || filters.unitType;

  const formatPrice = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <div className="px-3 py-2 space-y-2">
      {/* Quick row: available toggle + dropdowns */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1" data-tutorial="available-toggle">
          <Switch
            id="available-only"
            checked={filters.availableOnly}
            onCheckedChange={(checked) => updateFilter("availableOnly", checked)}
            className="scale-75"
          />
          <Label htmlFor="available-only" className="text-[10px] cursor-pointer text-muted-foreground">
            {t.units.filters.availableOnly}
          </Label>
        </div>

        <Select
          value={filters.floor?.toString() || "all"}
          onValueChange={(v) => updateFilter("floor", v === "all" ? null : parseInt(v))}
        >
          <SelectTrigger className="w-[4.5rem] h-6 text-[10px] bg-white/5 border-white/10 rounded-md px-1.5">
            <SelectValue placeholder={t.units.filters.floor} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.units.filters.allFloors}</SelectItem>
            {floors.map((floor) => (
              <SelectItem key={floor} value={floor.toString()}>F{floor}</SelectItem>
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

      {/* Expanded: sliders + extra selects */}
      {isExpanded && (
        <div className="space-y-2 pt-1 border-t border-white/[0.06] animate-fade-in">
          {/* Building + Orientation */}
          <div className="flex gap-1.5">
            <Select
              value={filters.building || "all"}
              onValueChange={(v) => updateFilter("building", v === "all" ? null : v)}
            >
              <SelectTrigger className="h-6 text-[10px] bg-white/5 border-white/10 rounded-md px-1.5">
                <SelectValue placeholder="Building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bldg</SelectItem>
                <SelectItem value="1">B1</SelectItem>
                <SelectItem value="2">B2</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.orientation || "all"}
              onValueChange={(v) => updateFilter("orientation", v === "all" ? null : v as Orientation)}
            >
              <SelectTrigger className="h-6 text-[10px] bg-white/5 border-white/10 rounded-md px-1.5">
                <SelectValue placeholder={t.units.orientation.title} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.units.filters.all}</SelectItem>
                {orientationOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms */}
          <div className="flex items-center gap-2.5">
            <Label className="text-[10px] text-muted-foreground w-12 shrink-0">{t.units.filters.bedrooms}</Label>
            <Select value={filters.minBedrooms?.toString() || "any"} onValueChange={(v) => updateFilter("minBedrooms", v === "any" ? null : parseInt(v))}>
              <SelectTrigger className="h-6 text-[10px] bg-white/5 border-white/10 rounded-md px-1.5 w-14"><SelectValue placeholder={t.units.filters.min} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t.units.filters.any}</SelectItem>
                {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n}+</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="text-[10px] text-muted-foreground">–</span>
            <Select value={filters.maxBedrooms?.toString() || "any"} onValueChange={(v) => updateFilter("maxBedrooms", v === "any" ? null : parseInt(v))}>
              <SelectTrigger className="h-6 text-[10px] bg-white/5 border-white/10 rounded-md px-1.5 w-14"><SelectValue placeholder={t.units.filters.max} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t.units.filters.any}</SelectItem>
                {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center gap-2.5">
            <Label className="text-[10px] text-muted-foreground w-12 shrink-0">{t.units.filters.bathrooms}</Label>
            <Select value={filters.minBathrooms?.toString() || "any"} onValueChange={(v) => updateFilter("minBathrooms", v === "any" ? null : parseInt(v))}>
              <SelectTrigger className="h-6 text-[10px] bg-white/5 border-white/10 rounded-md px-1.5 w-14"><SelectValue placeholder={t.units.filters.min} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t.units.filters.any}</SelectItem>
                {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n}+</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="text-[10px] text-muted-foreground">–</span>
            <Select value={filters.maxBathrooms?.toString() || "any"} onValueChange={(v) => updateFilter("maxBathrooms", v === "any" ? null : parseInt(v))}>
              <SelectTrigger className="h-6 text-[10px] bg-white/5 border-white/10 rounded-md px-1.5 w-14"><SelectValue placeholder={t.units.filters.max} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t.units.filters.any}</SelectItem>
                {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Surface slider */}
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">
              {t.units.filters.surface}: {filters.minSurface || surfaceRange.min}–{filters.maxSurface || surfaceRange.max}m²
            </Label>
            <Slider
              min={surfaceRange.min} max={surfaceRange.max} step={5}
              value={[filters.minSurface || surfaceRange.min, filters.maxSurface || surfaceRange.max]}
              onValueChange={([min, max]) => {
                onFiltersChange({
                  ...filters,
                  minSurface: min === surfaceRange.min ? null : min,
                  maxSurface: max === surfaceRange.max ? null : max,
                });
              }}
              className="py-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}
