import { useEffect, useRef, useState, useCallback } from "react";
import { X, Utensils, ShoppingBag, Landmark, Music, Briefcase, Bus, Heart, GraduationCap, List, Box } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { PROJECT_LOCATION } from "@/data/mock-pois";
import { SurroundingsPOIPanel } from "@/components/surroundings/SurroundingsPOIPanel";
import { POICategory, poiCategories } from "@/types/poi";
import { POI } from "@/types/poi";
import { usePOIs } from "@/hooks/usePOIs";
import { cn } from "@/lib/utils";

interface FullscreenMapProps {
  onClose: () => void;
  initialPOI?: POI;
  pois?: POI[];
}

const CATEGORY_COLORS: Record<POICategory, string> = {
  landmarks: "#F59E0B",
  dining: "#EA580C",
  shopping: "#DB2777",
  entertainment: "#9333EA",
  services: "#2563EB",
  transport: "#16A34A",
  health: "#EF4444",
  education: "#06B6D4",
};

const CATEGORY_FILTER_ICONS: Record<POICategory, typeof Landmark> = {
  landmarks: Landmark,
  dining: Utensils,
  shopping: ShoppingBag,
  entertainment: Music,
  services: Briefcase,
  transport: Bus,
  health: Heart,
  education: GraduationCap,
};

// SVG icon paths per category (lucide-style 24x24 viewBox)
const CATEGORY_SVG: Record<POICategory, string> = {
  landmarks: `<path d="M3 21h18M9 21V12h6v9M12 3l8 9H4l8-9z"/>`,
  dining: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>`,
  shopping: `<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>`,
  entertainment: `<path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z"/>`,
  services: `<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>`,
  transport: `<path d="M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H6c-1.1 0-2.1.8-2.4 1.8l-1.4 5c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3M7 18a2 2 0 104 0 2 2 0 00-4 0zm8 0a2 2 0 104 0 2 2 0 00-4 0z"/>`,
  health: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  education: `<path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5"/>`,
};

interface RouteInfo {
  profile: string;
  label: string;
  icon: string;
  distance: string;
  duration: string;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return "< 1 min";
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}

function formatRouteDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

async function fetchDirections(
  token: string,
  origin: [number, number],
  dest: [number, number],
  profile: string
): Promise<{ distance: number; duration: number; geometry: GeoJSON.LineString } | null> {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]};${dest[0]},${dest[1]}?geometries=geojson&overview=full&access_token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return { distance: route.distance, duration: route.duration, geometry: route.geometry };
    }
    return null;
  } catch {
    return null;
  }
}

const ROUTE_PROFILES = [
  { profile: "walking", label: "Walk", icon: "🚶" },
  { profile: "driving", label: "Drive", icon: "🚗" },
  { profile: "cycling", label: "Transit", icon: "🚌" },
];

// ── Marker creation ─────────────────────────────────────────────────
function createPOIMarkerElement(poi: POI, color: string): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    display:flex;flex-direction:column;align-items:center;cursor:pointer;
    filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4));
  `;

  // Tooltip label (show on hover, no movement)
  const label = document.createElement("div");
  label.textContent = poi.name;
  label.style.cssText = `
    position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(-50%);
    white-space:nowrap;background:rgba(8,8,16,0.9);backdrop-filter:blur(8px);color:white;
    font-size:10px;font-weight:600;padding:2px 6px;border-radius:8px;
    border:1px solid rgba(255,255,255,0.12);opacity:0;transition:opacity 0.15s;
    pointer-events:none;
  `;
  wrapper.onmouseenter = () => {
    wrapper.style.zIndex = "10";
    label.style.opacity = "1";
  };
  wrapper.onmouseleave = () => {
    wrapper.style.zIndex = "1";
    label.style.opacity = "0";
  };
  wrapper.appendChild(label);

  // Simple colored circle with category icon
  const size = 24;
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", "0 0 24 24");

  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "11");
  circle.setAttribute("fill", color);
  circle.setAttribute("stroke", "rgba(255,255,255,0.9)");
  circle.setAttribute("stroke-width", "1.5");
  svg.appendChild(circle);

  const iconG = document.createElementNS(svgNS, "g");
  iconG.setAttribute("transform", "translate(4,4) scale(0.667)");
  iconG.setAttribute("fill", "none");
  iconG.setAttribute("stroke", "white");
  iconG.setAttribute("stroke-width", "2");
  iconG.setAttribute("stroke-linecap", "round");
  iconG.setAttribute("stroke-linejoin", "round");
  iconG.innerHTML = CATEGORY_SVG[poi.category] || "";
  svg.appendChild(iconG);

  wrapper.appendChild(svg);
  return wrapper;
}

function createProjectMarkerElement(): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = "display:flex;flex-direction:column;align-items:center;";
  el.innerHTML = `
    <div style="position:relative;width:22px;height:22px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:hsla(0,72%,51%,0.3);animation:sonar 2s ease-out infinite;"></div>
      <div style="position:absolute;inset:0;border-radius:50%;background:hsla(0,72%,51%,0.3);animation:sonar 2s ease-out 0.7s infinite;"></div>
      <div style="position:absolute;inset:0;border-radius:50%;background:hsl(0,72%,51%);border:3px solid white;box-shadow:0 0 16px hsla(0,72%,51%,0.6);z-index:2;"></div>
    </div>
    <div style="margin-top:6px;background:rgba(10,10,20,0.85);backdrop-filter:blur(12px);color:white;font-size:10px;font-weight:700;letter-spacing:0.5px;padding:3px 10px;border-radius:20px;border:1px solid hsla(0,72%,51%,0.4);white-space:nowrap;text-transform:uppercase;">Dino Residence</div>
  `;
  return el;
}

// ── Popup ────────────────────────────────────────────────────────────
function createStarRating(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  let html = '<div style="display:flex;gap:1px;align-items:center;">';
  for (let i = 0; i < full; i++) html += '<span style="color:#FBBF24;font-size:12px;">★</span>';
  if (half) html += '<span style="color:#FBBF24;font-size:12px;opacity:0.5;">★</span>';
  for (let i = 0; i < empty; i++) html += '<span style="color:rgba(255,255,255,0.15);font-size:12px;">★</span>';
  if (rating) html += `<span style="color:rgba(255,255,255,0.5);font-size:10px;margin-left:4px;">${rating}</span>`;
  html += "</div>";
  return html;
}

function buildPopupHTML(poi: POI, color: string): string {
  const catLabel = poiCategories.find((c) => c.id === poi.category)?.label || poi.category;
  const tags = (poi.tags || [])
    .map(
      (t) =>
        `<span style="display:inline-block;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.65);font-size:9px;padding:2px 7px;border-radius:10px;margin-right:3px;margin-bottom:3px;">${t}</span>`
    )
    .join("");

  return `
    <div style="border-top:3px solid ${color};">
      <div style="padding:14px 16px 4px;">
        <div style="font-weight:700;font-size:14px;color:white;margin-bottom:6px;line-height:1.3;">${poi.name}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="display:inline-block;background:${color}22;color:${color};font-size:10px;font-weight:600;padding:2px 8px;border-radius:10px;border:1px solid ${color}44;">${catLabel}</span>
          ${poi.distance ? `<span style="color:rgba(255,255,255,0.4);font-size:11px;">📍 ${poi.distance}</span>` : ""}
        </div>
        ${poi.rating ? createStarRating(poi.rating) : ""}
        ${tags ? `<div style="margin-top:6px;display:flex;flex-wrap:wrap;">${tags}</div>` : ""}
      </div>
      <div id="route-info-${poi.id}" style="padding:4px 16px 14px;">
        <div style="border-top:1px solid rgba(255,255,255,0.08);margin-bottom:6px;"></div>
        <div style="color:rgba(255,255,255,0.3);font-size:11px;padding:8px 0;text-align:center;">Loading routes…</div>
      </div>
    </div>
  `;
}

function renderRouteInfo(containerId: string, routes: RouteInfo[]) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (routes.length === 0) {
    el.innerHTML = '<div style="color:rgba(255,255,255,0.3);font-size:11px;padding:8px 0;text-align:center;">Routes unavailable</div>';
    return;
  }
  el.innerHTML = `
    <div style="border-top:1px solid rgba(255,255,255,0.08);margin-bottom:4px;"></div>
    ${routes
      .map(
        (r) => `
      <div style="display:flex;align-items:center;gap:8px;padding:6px 0;${routes.indexOf(r) > 0 ? "border-top:1px solid rgba(255,255,255,0.06);" : ""}">
        <span style="font-size:14px;width:22px;text-align:center;">${r.icon}</span>
        <span style="color:rgba(255,255,255,0.45);font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;min-width:48px;">${r.label}</span>
        <span style="color:white;font-size:12px;font-weight:600;">${r.duration}</span>
        <span style="color:rgba(255,255,255,0.4);font-size:10px;margin-left:4px;">${r.distance}</span>
      </div>`
      )
      .join("")}
  `;
}

// ── Styles injection ────────────────────────────────────────────────
function injectMapStyles() {
  const id = "fullscreen-map-custom-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @keyframes sonar {
      0% { transform: scale(1); opacity: 0.7; }
      70% { transform: scale(2.5); opacity: 0; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    .dark-popup .mapboxgl-popup-content {
      background: rgba(12,12,24,0.92) !important; backdrop-filter: blur(16px) !important;
      border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 14px !important; padding: 0 !important;
      box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1) !important;
      min-width: 240px; max-width: 300px; overflow: hidden;
    }
    .dark-popup .mapboxgl-popup-tip { border-top-color: rgba(12,12,24,0.92) !important; border-bottom-color: rgba(12,12,24,0.92) !important; }
    .dark-popup .mapboxgl-popup-close-button { color: rgba(255,255,255,0.5) !important; font-size: 18px !important; right: 6px !important; top: 6px !important; }
    .dark-popup .mapboxgl-popup-close-button:hover { color: white !important; background: transparent !important; }
  `;
  document.head.appendChild(style);
}

// ── Component ───────────────────────────────────────────────────────
export function FullscreenMap({ onClose, initialPOI, pois: externalPOIs }: FullscreenMapProps) {
  const { data: hookPOIs } = usePOIs();
  const allPOIs = externalPOIs || hookPOIs || [];
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const activeRouteRef = useRef<string | null>(null);

  const mapboxToken = "pk.eyJ1IjoiZ3VyaXJ1Z292YSIsImEiOiJjbHZ3Y2Q1dzkyM2VpMm1ycno3NW5lbWFvIn0.IKRAqhSltHOnRvXIOi9-tQ";
  const [activeCategories, setActiveCategories] = useState<Set<POICategory>>(
    new Set(poiCategories.map((c) => c.id))
  );
  const [panelOpen, setPanelOpen] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const lastClickRef = useRef<{ cat: POICategory; time: number } | null>(null);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleCategory = (cat: POICategory) => {
    const now = Date.now();
    const last = lastClickRef.current;

    if (last && last.cat === cat && now - last.time < 300) {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      lastClickRef.current = null;
      setActiveCategories((prev) => {
        if (prev.size === 1 && prev.has(cat)) return new Set(poiCategories.map((c) => c.id));
        return new Set([cat]);
      });
    } else {
      lastClickRef.current = { cat, time: now };
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        setActiveCategories((prev) => {
          const next = new Set(prev);
          if (next.has(cat)) next.delete(cat);
          else next.add(cat);
          return next;
        });
        lastClickRef.current = null;
      }, 300);
    }
  };

  const clearRoutes = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    ["route-layer-outline", "route-layer-0"].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource("route-source-0")) map.removeSource("route-source-0");
    activeRouteRef.current = null;
  }, []);

  const drawRouteAndFetchInfo = useCallback(
    async (poi: POI) => {
      const map = mapRef.current;
      if (!map || !mapboxToken) return;

      clearRoutes();
      activeRouteRef.current = poi.id;

      const origin: [number, number] = [PROJECT_LOCATION.lng, PROJECT_LOCATION.lat];
      const dest: [number, number] = [poi.coordinates.lng, poi.coordinates.lat];

      const results: RouteInfo[] = [];
      let primaryGeometry: GeoJSON.LineString | null = null;

      await Promise.all(
        ROUTE_PROFILES.map(async (p) => {
          const result = await fetchDirections(mapboxToken, origin, dest, p.profile);
          if (result) {
            results.push({
              profile: p.profile,
              label: p.label,
              icon: p.icon,
              distance: formatRouteDistance(result.distance),
              duration: formatDuration(result.duration),
            });
            if (p.profile === "driving") primaryGeometry = result.geometry;
            if (!primaryGeometry) primaryGeometry = result.geometry;
          }
        })
      );

      if (activeRouteRef.current !== poi.id) return;

      if (primaryGeometry && map.isStyleLoaded()) {
        const sourceId = "route-source-0";
        const layerId = "route-layer-0";
        const outlineId = "route-layer-outline";

        if (map.getLayer(outlineId)) map.removeLayer(outlineId);
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);

        map.addSource(sourceId, {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: primaryGeometry },
        });

        map.addLayer({
          id: outlineId,
          type: "line",
          source: sourceId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#000", "line-width": 7, "line-opacity": 0.4 },
        });

        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#EF4444", "line-width": 4, "line-opacity": 0.9 },
        });

        const coords = (primaryGeometry as GeoJSON.LineString).coordinates as [number, number][];
        const bounds = coords.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(coords[0], coords[0]));
        map.fitBounds(bounds, { padding: 80, duration: 800 });
      }

      const order = ["walking", "driving", "cycling"];
      results.sort((a, b) => order.indexOf(a.profile) - order.indexOf(b.profile));
      renderRouteInfo(`route-info-${poi.id}`, results);
    },
    [mapboxToken, clearRoutes]
  );

  // Initialize map
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setMapError("WebGL is not supported. Please try the published app directly.");
        return;
      }
    } catch {
      setMapError("WebGL check failed. Please try the published app directly.");
      return;
    }

    injectMapStyles();
    mapboxgl.accessToken = mapboxToken;

    const center: [number, number] = initialPOI
      ? [initialPOI.coordinates.lng, initialPOI.coordinates.lat]
      : [PROJECT_LOCATION.lng, PROJECT_LOCATION.lat];

    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center,
        zoom: initialPOI ? 15 : 13,
        pitch: 0,
        bearing: 0,
      });
    } catch (e) {
      console.error("Mapbox init failed:", e);
      setMapError("Failed to initialize the map.");
      return;
    }

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.on("load", () => {

      // Project marker
      new mapboxgl.Marker({ element: createProjectMarkerElement(), anchor: "bottom" })
        .setLngLat([PROJECT_LOCATION.lng, PROJECT_LOCATION.lat])
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      try {
        map.remove();
      } catch {
        // Ignore teardown errors
      }
      mapRef.current = null;
    };
  }, [mapboxToken, initialPOI]);

  // Render POI markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    clearRoutes();

    const filteredPOIs = allPOIs.filter((poi) => activeCategories.has(poi.category));

    filteredPOIs.forEach((poi) => {
      const color = CATEGORY_COLORS[poi.category];

      const el = createPOIMarkerElement(poi, color);

      const popup = new mapboxgl.Popup({
        offset: [0, -14],
        maxWidth: "300px",
        className: "dark-popup",
        closeButton: true,
      }).setHTML(buildPopupHTML(poi, color));

      popup.on("open", () => drawRouteAndFetchInfo(poi));
      popup.on("close", () => {
        if (activeRouteRef.current === poi.id) clearRoutes();
      });

      // anchor: center for circle markers
      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([poi.coordinates.lng, poi.coordinates.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [activeCategories, allPOIs, drawRouteAndFetchInfo, clearRoutes]);

  const handleSelectPOI = useCallback((poi: POI) => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({ center: [poi.coordinates.lng, poi.coordinates.lat], zoom: 15, duration: 800 });
    const marker = markersRef.current.find((m) => {
      const lngLat = m.getLngLat();
      return Math.abs(lngLat.lng - poi.coordinates.lng) < 0.0001 && Math.abs(lngLat.lat - poi.coordinates.lat) < 0.0001;
    });
    if (marker) marker.togglePopup();
  }, []);

  if (mapError) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20">
          <X className="w-5 h-5 text-white" />
        </button>
        <GlassCard variant="strong" className="p-6 max-w-md w-full mx-4 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Map Unavailable</h3>
          <p className="text-sm text-muted-foreground">{mapError}</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {panelOpen && (
        <div className="z-[60]">
          <SurroundingsPOIPanel pois={allPOIs} activeCategories={activeCategories} onSelectPOI={handleSelectPOI} onClose={() => setPanelOpen(false)} />
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2">
        {/* Return to 3D button */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(220,20%,8%,0.65)] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] text-white text-xs font-medium hover:bg-[hsl(220,20%,12%,0.75)] transition-colors"
        >
          <Box className="w-3.5 h-3.5" />
          Return to 3D View
        </button>

        {/* Filter bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[hsl(220,20%,8%,0.65)] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <button
            onClick={() => setPanelOpen((v) => !v)}
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 hover:bg-white/10 mr-1",
              panelOpen && "bg-white/10"
            )}
            title={panelOpen ? "Hide places list" : "Show places list"}
          >
            <List className="w-4 h-4 text-muted-foreground" />
          </button>

          {poiCategories.map((cat) => {
            const active = activeCategories.has(cat.id);
            const IconComp = CATEGORY_FILTER_ICONS[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all duration-200 border select-none whitespace-nowrap",
                  active ? "text-white backdrop-blur-sm" : "text-white/30 hover:text-white/50"
                )}
                style={{
                  background: active ? `linear-gradient(135deg, ${cat.color}18, ${cat.color}08)` : "transparent",
                  borderColor: active ? `${cat.color}40` : "transparent",
                  boxShadow: active ? `0 0 12px ${cat.color}15, inset 0 1px 0 rgba(255,255,255,0.05)` : "none",
                }}
                title={`${cat.description} (double-click to solo)`}
              >
                <IconComp className="w-3 h-3" style={{ color: active ? cat.color : "rgba(255,255,255,0.3)" }} />
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? cat.color : "rgba(255,255,255,0.15)" }} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
