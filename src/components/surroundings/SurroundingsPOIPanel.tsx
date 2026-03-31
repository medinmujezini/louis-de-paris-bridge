import { useState, useMemo } from "react";
import { Search, X, Landmark, Utensils, ShoppingBag, Music, Briefcase, Bus, MapPin, Heart, GraduationCap } from "lucide-react";
import { POI, POICategory, poiCategories } from "@/types/poi";
import { ScrollArea } from "@/components/ui/scroll-area";

const CATEGORY_ICONS: Record<POICategory, typeof Landmark> = {
  landmarks: Landmark,
  dining: Utensils,
  shopping: ShoppingBag,
  entertainment: Music,
  services: Briefcase,
  transport: Bus,
  health: Heart,
  education: GraduationCap,
};

interface SurroundingsPOIPanelProps {
  pois: POI[];
  activeCategories: Set<POICategory>;
  onSelectPOI: (poi: POI) => void;
  onClose: () => void;
}

export function SurroundingsPOIPanel({ pois, activeCategories, onSelectPOI, onClose }: SurroundingsPOIPanelProps) {
  const [search, setSearch] = useState("");

  const parseDistance = (d?: string): number => {
    if (!d) return Infinity;
    const val = parseFloat(d);
    if (isNaN(val)) return Infinity;
    if (d.includes("km")) return val * 1000;
    return val;
  };

  const filteredPOIs = useMemo(() => {
    return pois
      .filter((p) => {
        if (!activeCategories.has(p.category)) return false;
        if (search) {
          const s = search.toLowerCase();
          return (
            p.name.toLowerCase().includes(s) ||
            p.category.toLowerCase().includes(s) ||
            p.address?.toLowerCase().includes(s)
          );
        }
        return true;
      })
      .sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
  }, [pois, activeCategories, search]);

  const getCategoryColor = (cat: POICategory) =>
    poiCategories.find((c) => c.id === cat)?.color || "#fff";

  return (
    <div
      className="absolute right-4 top-4 bottom-24 w-80 z-10 rounded-xl overflow-hidden flex flex-col animate-fade-in glass-card glass-card--strong"
    >
      {/* Top light bar */}
      <div className="glass-card__light-bar glass-card__light-bar--strong" aria-hidden="true" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-foreground">Nearby Places</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Close panel"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Search bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nearby places…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>
      </div>

      {/* POI list */}
      <ScrollArea className="flex-1">
        <div className="px-3 pb-3 space-y-0.5">
          {filteredPOIs.length > 0 ? (
            filteredPOIs.map((poi) => {
              const color = getCategoryColor(poi.category);
              const IconComp = CATEGORY_ICONS[poi.category];
              return (
                <button
                  key={poi.id}
                  onClick={() => onSelectPOI(poi)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}18` }}
                  >
                    <IconComp className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{poi.name}</p>
                    {poi.address && (
                      <p className="text-[10px] text-muted-foreground truncate">{poi.address}</p>
                    )}
                  </div>
                  {poi.distance && (
                    <span className="text-[10px] text-muted-foreground shrink-0">{poi.distance}</span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="py-6 text-center">
              <MapPin className="w-6 h-6 mx-auto text-muted-foreground/40 mb-1" />
              <p className="text-xs text-muted-foreground">No places found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
