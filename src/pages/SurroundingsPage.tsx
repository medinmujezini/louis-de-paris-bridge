import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { sendToUnreal, registerHandler, UEEvents } from "@/lib/ue-bridge";
import { POICategory, poiCategories } from "@/types/poi";
import { usePOIs } from "@/hooks/usePOIs";
import { usePOITravelInfo } from "@/hooks/usePOITravelInfo";
import { FullscreenMap } from "@/components/surroundings/FullscreenMap";
import { SurroundingsFilters } from "@/components/surroundings/SurroundingsFilters";
import { SurroundingsBrowser } from "@/components/surroundings/SurroundingsBrowser";
import { SurroundingsPOIInfoCard } from "@/components/surroundings/SurroundingsPOIInfoCard";
import { surroundingsPOIs } from "@/data/surroundings-pois";

const SurroundingsPage = () => {
  const { data: pois = [] } = usePOIs();
  const { info: travelInfo, loading: travelLoading, fetchTravelInfo, clearInfo: clearTravelInfo } = usePOITravelInfo();
  const [showMap, setShowMap] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeCategories, setActiveCategories] = useState<Set<POICategory>>(
    new Set(poiCategories.map((c) => c.id))
  );

  const poisSentRef = useRef(false);

  // Activate surroundings mode in UE
  useEffect(() => {
    sendToUnreal(UEEvents.ACTIVATE_SURROUNDINGS);
    return () => {
      sendToUnreal(UEEvents.CLEAR_POIS);
      sendToUnreal(UEEvents.DEACTIVATE_SURROUNDINGS);
      poisSentRef.current = false;
    };
  }, []);

  // Register onPOISelected so UE can call ue.interface.onPOISelected("name")
  useEffect(() => {
    const cleanup = registerHandler("onPOISelected", (data) => {
      const name = typeof data === "string" ? data : (data as { name?: string })?.name;
      if (!name) return;

      const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
      const target = normalize(name);

      const match = surroundingsPOIs.find(
        (p) => normalize(p.name) === target || p.id === name
      );

      if (match) {
        // Ensure the category is active so the POI is visible
        setActiveCategories((prev) => {
          if (prev.has(match.category)) return prev;
          const next = new Set(prev);
          next.add(match.category);
          return next;
        });
        setPanelOpen(true);
        fetchTravelInfo(match.name, match.category);
      }
    });

    return cleanup;
  }, [fetchTravelInfo]);

  // Send only the 22 hardcoded POIs to UE
  useEffect(() => {
    if (!poisSentRef.current) {
      const colorMap = Object.fromEntries(poiCategories.map((c) => [c.id, c.color]));
      const payload = surroundingsPOIs.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        color: colorMap[p.category] || "#FFFFFF",
      }));
      sendToUnreal(UEEvents.SEND_POI_DATA, { pois: payload });
      poisSentRef.current = true;
    }
  }, []);

  // Sync category filters to UE
  useEffect(() => {
    sendToUnreal(UEEvents.FILTER_POIS, {
      activeCategories: Array.from(activeCategories),
    });
  }, [activeCategories]);

  return (
    <div className="relative w-full h-[calc(100vh-6rem)]">
      {/* POI travel info card – top center */}
      {travelInfo && (
        <SurroundingsPOIInfoCard
          info={travelInfo}
          loading={travelLoading}
          onClose={clearTravelInfo}
        />
      )}

      {/* Right-side browser panel */}
      {panelOpen && (
        <div className="absolute right-4 top-4 bottom-24 w-80 z-10 animate-fade-in">
          <SurroundingsBrowser
            activeCategories={activeCategories}
            onOpenMap={() => setShowMap(true)}
            onClose={() => setPanelOpen(false)}
            onSelectPOI={(name, category) => fetchTravelInfo(name, category)}
          />
        </div>
      )}

      {/* Category filters – bottom center */}
      <SurroundingsFilters
        activeCategories={activeCategories}
        onOpenMap={() => setShowMap(true)}
        onToggleCategory={(cat) => {
          setActiveCategories((prev) => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat);
            else next.add(cat);
            return next;
          });
        }}
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen((v) => !v)}
      />

      {/* Fullscreen map overlay – uses full database POIs */}
      {showMap && (
        <FullscreenMap
          onClose={() => setShowMap(false)}
          pois={pois}
        />
      )}
    </div>
  );
};

export default SurroundingsPage;
