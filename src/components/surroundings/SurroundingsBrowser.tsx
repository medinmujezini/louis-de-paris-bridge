import { useState, useMemo } from "react";
import { Search, MapPin, X, Landmark, Utensils, ShoppingBag, Music, Briefcase, Bus, Heart, GraduationCap, Map } from "lucide-react";
import { POICategory, poiCategories } from "@/types/poi";
import { surroundingsPOIs, SurroundingsPOI } from "@/data/surroundings-pois";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { cn } from "@/lib/utils";

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

interface SurroundingsBrowserProps {
  activeCategories: Set<POICategory>;
  onOpenMap: () => void;
  onClose?: () => void;
  onSelectPOI?: (name: string, category: string) => void;
}

export function SurroundingsBrowser({ activeCategories, onOpenMap, onClose, onSelectPOI }: SurroundingsBrowserProps) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredPOIs = useMemo(() => {
    return surroundingsPOIs.filter((p) => {
      if (!activeCategories.has(p.category)) return false;
      if (search) {
        const s = search.toLowerCase();
        return p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s);
      }
      return true;
    });
  }, [activeCategories, search]);

  const getCategoryColor = (cat: POICategory) =>
    poiCategories.find((c) => c.id === cat)?.color || "#fff";

  const getCategoryLabel = (cat: POICategory) =>
    poiCategories.find((c) => c.id === cat)?.label || cat;

  const handleSelect = (poi: SurroundingsPOI) => {
    setSelectedId(poi.id);
    sendToUnreal(UEEvents.FOCUS_POI, { name: poi.name });
    onSelectPOI?.(poi.name, poi.category);
  };

  return (
    <div className="h-full rounded-xl flex flex-col overflow-hidden bg-[hsl(0,0%,4%)] border border-primary/20">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" aria-hidden="true" />

      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-3 pt-3 pb-2 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight">
                Surroundings
              </h2>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {filteredPOIs.length} places nearby
              </p>
            </div>
            <div className="flex items-center gap-1">
              {onClose && (
                <button onClick={onClose} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <GlassInput
              placeholder="Search places…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-7 text-xs"
            />
          </div>
        </div>

        {/* Divider */}
        <RoyalDivider variant="subtle" className="mx-3" />

        {/* POI list */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-1 py-1">
            {filteredPOIs.length > 0 ? (
              <div className="divide-y divide-white/[0.06]">
                {filteredPOIs.map((poi) => {
                  const color = getCategoryColor(poi.category);
                  const IconComp = CATEGORY_ICONS[poi.category];
                  const isSelected = selectedId === poi.id;
                  return (
                    <button
                      key={poi.id}
                      onClick={() => handleSelect(poi)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left",
                        isSelected
                          ? "bg-white/[0.08]"
                          : "hover:bg-white/[0.04]"
                      )}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${color}18` }}
                      >
                        <IconComp className="w-3.5 h-3.5" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{poi.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{getCategoryLabel(poi.category)}</p>
                      </div>
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-3 py-8 text-center">
                <MapPin className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-xs text-muted-foreground">No places found</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Detailed Map button */}
        <div className="p-3 pt-0">
          <RoyalDivider variant="subtle" className="mb-3" />
          <GlassButton
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={onOpenMap}
          >
            <Map className="w-3.5 h-3.5 mr-1.5" />
            Detailed Map
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
