import { useRef, useMemo } from "react";
import { Landmark, Utensils, ShoppingBag, Music, Briefcase, Bus, List, Heart, GraduationCap, Map } from "lucide-react";
import { POICategory, poiCategories } from "@/types/poi";
import { surroundingsPOIs } from "@/data/surroundings-pois";
import { cn } from "@/lib/utils";
import { sendToUnreal } from "@/lib/ue-bridge";

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

interface SurroundingsFiltersProps {
  activeCategories: Set<POICategory>;
  onToggleCategory: (cat: POICategory) => void;
  onOpenMap: () => void;
  panelOpen: boolean;
  onTogglePanel: () => void;
}

export function SurroundingsFilters({ activeCategories, onToggleCategory, onOpenMap, panelOpen, onTogglePanel }: SurroundingsFiltersProps) {
  const lastClickRef = useRef<{ cat: POICategory; time: number } | null>(null);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only show categories that exist in the hardcoded 3D POI set
  const usedCategories = useMemo(() => {
    const used = new Set(surroundingsPOIs.map((p) => p.category));
    return poiCategories.filter((c) => used.has(c.id));
  }, []);

  const handleClick = (cat: POICategory) => {
    const now = Date.now();
    const last = lastClickRef.current;

    if (last && last.cat === cat && now - last.time < 300) {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      lastClickRef.current = null;

      if (activeCategories.size === 1 && activeCategories.has(cat)) {
        poiCategories.forEach((c) => {
          if (!activeCategories.has(c.id)) onToggleCategory(c.id);
        });
      } else {
        poiCategories.forEach((c) => {
          if (c.id === cat && !activeCategories.has(c.id)) onToggleCategory(c.id);
          if (c.id !== cat && activeCategories.has(c.id)) onToggleCategory(c.id);
        });
      }

      sendToUnreal("filterPOIs", { categories: [cat], solo: true });
    } else {
      lastClickRef.current = { cat, time: now };
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        onToggleCategory(cat);
        lastClickRef.current = null;
        sendToUnreal("filterPOIs", {
          category: cat,
          active: !activeCategories.has(cat),
        });
      }, 300);
    }
  };

  return (
    <div data-tutorial="surr-movement" className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
      {/* Detailed Map button */}
      <button
        data-tutorial="surr-map-toggle"
        onClick={onOpenMap}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(220,20%,8%,0.65)] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] text-white text-xs font-medium hover:bg-[hsl(220,20%,12%,0.75)] transition-colors"
        title="Open Detailed Map"
      >
        <Map className="w-3.5 h-3.5" />
        Detailed Map
      </button>

      {/* Filter bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[hsl(220,20%,8%,0.65)] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]">
        {/* Top light bar */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Invisible tutorial anchors for elevation */}
        <div data-tutorial="surr-elevation" className="absolute inset-0 pointer-events-none" />

        {/* List toggle */}
        <button
          onClick={onTogglePanel}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 hover:bg-white/10 mr-1",
            panelOpen && "bg-white/10"
          )}
          title={panelOpen ? "Hide places list" : "Show places list"}
        >
          <List className="w-4 h-4 text-muted-foreground" />
        </button>

        <div data-tutorial="surr-filter-click" className="flex items-center gap-1.5">
        {usedCategories.map((cat) => {
          const active = activeCategories.has(cat.id);
          const IconComp = CATEGORY_ICONS[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all duration-200 border select-none whitespace-nowrap",
                active
                  ? "text-white backdrop-blur-sm"
                  : "text-white/30 hover:text-white/50"
              )}
              style={{
                background: active
                  ? `linear-gradient(135deg, ${cat.color}18, ${cat.color}08)`
                  : "transparent",
                borderColor: active ? `${cat.color}40` : "transparent",
                boxShadow: active
                  ? `0 0 12px ${cat.color}15, inset 0 1px 0 rgba(255,255,255,0.05)`
                  : "none",
              }}
              title={`${cat.description} (double-click to solo)`}
            >
              <IconComp
                className="w-3 h-3"
                style={{ color: active ? cat.color : "rgba(255,255,255,0.3)" }}
              />
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: active ? cat.color : "rgba(255,255,255,0.15)" }}
              />
              {cat.label}
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}