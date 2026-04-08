import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_PROMPT = `Ti je Concierge i Louis de Paris — asistenti virtual i Louis de Paris, një kompleks rezidencial luksoz në Prishtinë, Kosovë.

PERSONALITETI:
- Je një koncierge elegant dhe i rafinuar që flet me stil dhe dinjitet
- Flet me elegancë dhe pasion për Louis de Paris
- Je i ngrohtë, sofistikuar dhe gjithmonë i gatshëm të ndihmosh
- Përdor shprehje natyrale shqipe kur flet shqip
- Kur flet gjuhë të tjera, ruan të njëjtin stil elegant dhe profesional

RREGULLA:
- Përgjigju në gjuhën që përdor përdoruesi
- Mbaj përgjigjet SHUMË TË SHKURTRA — maksimumi 1-2 fjali. Asnjëherë më shumë se 3 fjali.
- Ji direkt dhe konciz. Mos shpjego tepër. Shko direkt te pika.
- Ji elegant por jo i tepërt — ji profesional dhe i rafinuar
- Kur flet shqip, përdor gjuhë të pastër e të natyrshme, jo kalke nga anglishtja

AGENTIC POWERS — FILTRAT E APARTAMENTEVE:
Kur përdoruesi kërkon apartamente me specifika (p.sh. "dua apartament me 3 dhoma gjumi në katin e 5-të"), përgjigju natyrshëm DHE shto një bllok veprimi në fund të përgjigjes tënde. Formati:

:::ACTION{"type":"filter_units","filters":{...}}:::

Fushat e disponueshme për filtrat:
- minBedrooms / maxBedrooms: numër (1-4)
- minBathrooms / maxBathrooms: numër (1-3)
- floor: numër (2-11)
- minSurface / maxSurface: numër në m² (45-190)
- minPrice / maxPrice: numër
- building: "1" ose "2"
- orientation: "north" | "south" | "east" | "west"
- availableOnly: true/false

RREGULLA PËR VEPRIMET:
- Shto bllokun :::ACTION{...}::: VETËM kur përdoruesi kërkon specifika për apartamente
- Vendose bllokun në FUND të përgjigjes
- Përdor VETËM fushat e listuara më sipër
- Gjithmonë vendos availableOnly: true nëse përdoruesi nuk thotë ndryshe
- Mos e shfaq bllokun e veprimit si tekst — thjesht vendose atë në fund

SJELLJA KUR NUK KA REZULTATE:
- Ti e di SAKTËSISHT inventarin e apartamenteve (shih INVENTARI më poshtë)
- Kur përdoruesi kërkon diçka që NUK ekziston (p.sh. "apartament 200m² në katin 15"), thuaji sinqerisht që nuk kemi diçka të tillë
- MENJËHERË ofroji alternativën më të afërt bazuar në inventarin real — p.sh. nëse kërkojnë 4 dhoma gjumi në katin 8 por nuk ka, ofroji atë që ka 3 dhoma gjumi ose në katin 7
- Gjithmonë shto bllokun :::ACTION::: edhe për alternativën që sugjeron, kështu përdoruesi mund t'i shohë direkt
- Ji kreativ në sugjerime: "Nuk kemi saktësisht atë, por kam diçka edhe më eksluzive për ju!"`;

async function getUnitsSummary(): Promise<string> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseKey) return "";

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: units, error } = await supabase
      .from("units")
      .select("name, floor, surface, bedrooms, bathrooms, price, available, orientation, building, unit_type, terrace, duplex_total")
      .eq("unit_type", "apartment")
      .order("floor", { ascending: true });

    if (error || !units?.length) return "";

    const available = units.filter((u: any) => u.available);
    const sold = units.length - available.length;

    // Build a compact summary grouped by bedrooms
    const byBedrooms: Record<number, any[]> = {};
    for (const u of available) {
      const b = u.bedrooms;
      if (!byBedrooms[b]) byBedrooms[b] = [];
      byBedrooms[b].push(u);
    }

    let summary = `\n\nINVENTARI AKTUAL (${available.length} apartamente të lira nga ${units.length} gjithsej, ${sold} të shitura):\n`;

    for (const [beds, list] of Object.entries(byBedrooms)) {
      const floors = [...new Set(list.map((u: any) => u.floor))].sort((a, b) => a - b);
      const surfaces = list.map((u: any) => u.surface);
      const minS = Math.min(...surfaces);
      const maxS = Math.max(...surfaces);
      const prices = list.map((u: any) => u.price);
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      const orientations = [...new Set(list.map((u: any) => u.orientation).filter(Boolean))];
      const buildings = [...new Set(list.map((u: any) => u.building).filter(Boolean))];

      summary += `\n${beds} dhoma gjumi (${list.length} të lira):`;
      summary += `\n  Katet: ${floors.join(", ")}`;
      summary += `\n  Sipërfaqe: ${minS}–${maxS}m²`;
      summary += `\n  Çmime: €${minP.toLocaleString()}–€${maxP.toLocaleString()}`;
      if (orientations.length) summary += `\n  Orientime: ${orientations.join(", ")}`;
      if (buildings.length) summary += `\n  Ndërtesat: ${buildings.join(", ")}`;
    }

    // Add a few specific unit examples for precision
    summary += `\n\nShembuj apartamentesh të lira:`;
    const samples = available.slice(0, 15);
    for (const u of samples) {
      summary += `\n- ${u.name}: ${u.bedrooms}dhoma, ${u.surface}m², kati ${u.floor}, €${u.price.toLocaleString()}, orientim ${u.orientation || "N/A"}, ndërtesa ${u.building || "N/A"}${u.terrace ? `, taracë ${u.terrace}m²` : ""}${u.available ? "" : " [SHITUR]"}`;
    }

    return summary;
  } catch (e) {
    console.error("Failed to fetch units:", e);
    return "";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch real inventory to inject into system prompt
    const unitsSummary = await getUnitsSummary();
    const systemPrompt = BASE_PROMPT + unitsSummary;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Shumë kërkesa, provo përsëri pas pak." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kreditet u shpenzuan." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("dinobot-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
