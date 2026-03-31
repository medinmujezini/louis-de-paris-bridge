import { useState, useCallback } from "react";
import { PROJECT_LOCATION } from "@/data/mock-pois";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZ3VyaXJ1Z292YSIsImEiOiJjbHZ3Y2Q1dzkyM2VpMm1ycno3NW5lbWFvIn0.IKRAqhSltHOnRvXIOi9-tQ";

export interface TravelMode {
  profile: string;
  label: string;
  icon: string;
  distance: string;
  duration: string;
}

export interface POITravelInfo {
  name: string;
  category: string;
  straightDistance: string;
  modes: TravelMode[];
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return "< 1 min";
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

const PROFILES = [
  { profile: "walking", label: "Walk", icon: "🚶" },
  { profile: "cycling", label: "Transit", icon: "🚌" },
  { profile: "driving", label: "Drive", icon: "🚗" },
];

async function geocodePOI(name: string): Promise<[number, number] | null> {
  try {
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(name)}&proximity=${PROJECT_LOCATION.lng},${PROJECT_LOCATION.lat}&limit=1&access_token=${MAPBOX_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    const coords = data.features?.[0]?.geometry?.coordinates;
    if (coords && coords.length >= 2) return coords as [number, number];
    return null;
  } catch {
    return null;
  }
}

async function fetchDirections(
  origin: [number, number],
  dest: [number, number],
  profile: string
): Promise<{ distance: number; duration: number } | null> {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]};${dest[0]},${dest[1]}?access_token=${MAPBOX_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes?.[0]) {
      return { distance: data.routes[0].distance, duration: data.routes[0].duration };
    }
    return null;
  } catch {
    return null;
  }
}

// Haversine straight-line distance
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function usePOITravelInfo() {
  const [info, setInfo] = useState<POITravelInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTravelInfo = useCallback(async (poiName: string, poiCategory: string) => {
    setLoading(true);
    setInfo({ name: poiName, category: poiCategory, straightDistance: "", modes: [] });

    const coords = await geocodePOI(poiName);
    if (!coords) {
      setInfo(null);
      setLoading(false);
      return;
    }

    const origin: [number, number] = [PROJECT_LOCATION.lng, PROJECT_LOCATION.lat];
    const straight = haversine(PROJECT_LOCATION.lat, PROJECT_LOCATION.lng, coords[1], coords[0]);

    const results = await Promise.all(
      PROFILES.map(async (p) => {
        const result = await fetchDirections(origin, coords, p.profile);
        if (result) {
          return {
            profile: p.profile,
            label: p.label,
            icon: p.icon,
            distance: formatDistance(result.distance),
            duration: formatDuration(result.duration),
          };
        }
        return null;
      })
    );

    setInfo({
      name: poiName,
      category: poiCategory,
      straightDistance: formatDistance(straight),
      modes: results.filter(Boolean) as TravelMode[],
    });
    setLoading(false);
  }, []);

  const clearInfo = useCallback(() => {
    setInfo(null);
    setLoading(false);
  }, []);

  return { info, loading, fetchTravelInfo, clearInfo };
}
