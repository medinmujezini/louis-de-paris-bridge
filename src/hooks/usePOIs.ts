import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { POI } from "@/types/poi";
import { poisWithDistances, getDistanceFromProject } from "@/data/mock-pois";

interface FetchPOIsResponse {
  source: string;
  pois: Array<{
    id: string;
    name: string;
    category: string;
    description: string | null;
    lat: number;
    lng: number;
    address: string | null;
    tags: string[] | null;
    rating: number | null;
  }>;
}

function mapToPOI(raw: FetchPOIsResponse["pois"][number]): POI {
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category as POI["category"],
    description: raw.description || "",
    address: raw.address || undefined,
    tags: raw.tags || undefined,
    rating: raw.rating || undefined,
    coordinates: { lat: raw.lat, lng: raw.lng },
    distance: getDistanceFromProject(raw.lat, raw.lng),
  };
}

async function fetchPOIs(): Promise<POI[]> {
  const { data, error } = await supabase.functions.invoke<FetchPOIsResponse>("fetch-pois");
  
  if (error || !data?.pois) {
    console.warn("Failed to fetch POIs from backend, using mock data:", error);
    return poisWithDistances;
  }

  const pois = data.pois.map(mapToPOI);
  return pois.length > 0 ? pois : poisWithDistances;
}

export function usePOIs() {
  return useQuery({
    queryKey: ["pois"],
    queryFn: fetchPOIs,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24,
    placeholderData: poisWithDistances,
    retry: 1,
  });
}
