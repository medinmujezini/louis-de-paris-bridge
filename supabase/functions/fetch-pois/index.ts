import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROJECT_LAT = 42.63471242484946;
const PROJECT_LNG = 21.153919390222214;
const CACHE_MAX_AGE_HOURS = 24;
const MAPBOX_TOKEN = "pk.eyJ1IjoiZ3VyaXJ1Z292YSIsImEiOiJjbHZ3Y2Q1dzkyM2VpMm1ycno3NW5lbWFvIn0.IKRAqhSltHOnRvXIOi9-tQ";

type POICategory = "dining" | "shopping" | "landmarks" | "entertainment" | "services" | "transport" | "health" | "education";

interface MappedPOI {
  id: string;
  name: string;
  category: POICategory;
  description: string | null;
  lat: number;
  lng: number;
  address: string | null;
  tags: string[];
  rating: number | null;
}

// Mapbox Search Box category IDs mapped to our categories
const CATEGORY_SEARCHES: { category: POICategory; mapboxCategories: string[]; tags: string[] }[] = [
  { category: "dining", mapboxCategories: ["restaurant", "cafe", "bar", "fast_food"], tags: ["Restaurant", "Dining"] },
  { category: "shopping", mapboxCategories: ["shopping_mall", "clothing_store", "supermarket", "shop"], tags: ["Shopping"] },
  { category: "landmarks", mapboxCategories: ["museum", "monument", "attraction", "place_of_worship"], tags: ["Landmark", "Culture"] },
  { category: "entertainment", mapboxCategories: ["park", "stadium", "cinema", "theatre", "playground"], tags: ["Entertainment", "Recreation"] },
  { category: "services", mapboxCategories: ["bank", "post_office", "police_station"], tags: ["Services"] },
  { category: "transport", mapboxCategories: ["bus_station", "bus_stop", "railway_station"], tags: ["Transit"] },
  { category: "health", mapboxCategories: ["hospital", "clinic", "pharmacy", "dentist", "doctor"], tags: ["Health"] },
  { category: "education", mapboxCategories: ["school", "university", "college", "kindergarten", "library"], tags: ["Education"] },
];

async function fetchMapboxCategory(
  mapboxCategory: string,
  ourCategory: POICategory,
  defaultTags: string[]
): Promise<MappedPOI[]> {
  const pois: MappedPOI[] = [];
  try {
    const url = `https://api.mapbox.com/search/searchbox/v1/category/${mapboxCategory}?access_token=${MAPBOX_TOKEN}&proximity=${PROJECT_LNG},${PROJECT_LAT}&limit=25&language=en`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Mapbox category ${mapboxCategory} returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    const features = data.features || [];

    for (const feat of features) {
      const props = feat.properties || {};
      const name = props.name;
      if (!name) continue;

      const coords = feat.geometry?.coordinates;
      if (!coords || coords.length < 2) continue;

      const [lng, lat] = coords;

      // Filter to ~3km radius
      const dlat = Math.abs(lat - PROJECT_LAT);
      const dlng = Math.abs(lng - PROJECT_LNG);
      if (dlat > 0.027 || dlng > 0.04) continue;

      const id = props.mapbox_id || `mbx-${mapboxCategory}-${feat.id || Math.random().toString(36).slice(2)}`;
      const address = props.full_address || props.address || null;
      const poiTags = [...defaultTags];
      if (props.poi_category) {
        const cats = Array.isArray(props.poi_category) ? props.poi_category : [props.poi_category];
        for (const c of cats.slice(0, 2)) {
          const label = String(c).replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
          if (!poiTags.includes(label)) poiTags.push(label);
        }
      }

      pois.push({
        id,
        name,
        category: ourCategory,
        description: props.description || null,
        lat,
        lng,
        address,
        tags: poiTags,
        rating: null,
      });
    }
  } catch (err) {
    console.warn(`Error fetching Mapbox category ${mapboxCategory}:`, err);
  }
  return pois;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Check cache freshness
    const { data: latest } = await supabase
      .from("poi_cache")
      .select("fetched_at")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single();

    if (latest?.fetched_at) {
      const age = (Date.now() - new Date(latest.fetched_at).getTime()) / (1000 * 60 * 60);
      if (age < CACHE_MAX_AGE_HOURS) {
        const { data: cached } = await supabase.from("poi_cache").select("*");
        return new Response(JSON.stringify({ source: "cache", pois: cached || [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fetch from Mapbox Search Box API — all categories in parallel
    const allFetches: Promise<MappedPOI[]>[] = [];
    for (const catGroup of CATEGORY_SEARCHES) {
      for (const mbCat of catGroup.mapboxCategories) {
        allFetches.push(fetchMapboxCategory(mbCat, catGroup.category, catGroup.tags));
      }
    }

    const results = await Promise.all(allFetches);
    const allPois = results.flat();

    // Deduplicate by name+proximity
    const deduped: MappedPOI[] = [];
    const seenKeys = new Set<string>();
    for (const poi of allPois) {
      const key = `${poi.name.toLowerCase().trim()}-${poi.lat.toFixed(4)}-${poi.lng.toFixed(4)}`;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      deduped.push(poi);
    }

    // Clear old cache and upsert new data
    if (deduped.length > 0) {
      await supabase.from("poi_cache").delete().neq("id", "");

      const now = new Date().toISOString();
      for (let i = 0; i < deduped.length; i += 100) {
        const chunk = deduped.slice(i, i + 100).map((p) => ({ ...p, fetched_at: now }));
        await supabase.from("poi_cache").upsert(chunk, { onConflict: "id" });
      }
    }

    return new Response(JSON.stringify({ source: "mapbox", count: deduped.length, pois: deduped }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("fetch-pois error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
