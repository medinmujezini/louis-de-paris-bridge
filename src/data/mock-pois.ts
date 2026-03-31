import { POI, POICategory } from "@/types/poi";

// Project location (Dino Residence) for distance calculations
export const PROJECT_LOCATION = {
  lat: 42.63471242484946,
  lng: 21.153919390222214,
};

// Haversine formula for calculating distance between two points
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
}

export function getDistanceFromProject(lat: number, lng: number): string {
  const distance = calculateDistance(PROJECT_LOCATION.lat, PROJECT_LOCATION.lng, lat, lng);
  return formatDistance(distance);
}

export const mockPOIs: POI[] = [
  // ─── Landmarks & Culture ───────────────────────────────────────────
  {
    id: "landmark-1",
    name: "NEWBORN Monument",
    category: "landmarks",
    description: "Iconic typographic sculpture celebrating Kosovo's 2008 independence. Repainted annually with new themes.",
    rating: 4.7,
    address: "Bulevardi Nënë Tereza, Pristina",
    tags: ["Monument", "Independence", "Photography"],
    coordinates: { lat: 42.660539, lng: 21.158209 },
  },
  {
    id: "landmark-2",
    name: "National Library of Kosovo",
    category: "landmarks",
    description: "Brutalist masterpiece with 99 domes and metal lattice. One of the world's most unusual buildings.",
    rating: 4.5,
    address: "Sheshi Hasan Prishtina, Pristina",
    tags: ["Architecture", "Brutalist", "Library"],
    coordinates: { lat: 42.65722, lng: 21.16222 },
  },
  {
    id: "landmark-3",
    name: "Cathedral of Saint Mother Teresa",
    category: "landmarks",
    description: "Modern Roman Catholic cathedral with twin bell towers and striking contemporary design.",
    rating: 4.8,
    address: "Rruga Nëna Terezë, Pristina",
    tags: ["Cathedral", "Religious", "Modern"],
    coordinates: { lat: 42.65639, lng: 21.15944 },
  },
  {
    id: "landmark-4",
    name: "Clock Tower (Sahat Kulla)",
    category: "landmarks",
    description: "19th-century Ottoman hexagonal clock tower, 26 meters tall. One of the oldest structures in Pristina.",
    rating: 4.3,
    address: "Old Town, Pristina",
    tags: ["Ottoman", "Historic", "Tower"],
    coordinates: { lat: 42.66674, lng: 21.16726 },
  },
  {
    id: "landmark-5",
    name: "Skanderbeg Square & Statue",
    category: "landmarks",
    description: "Central square with an equestrian statue of the Albanian national hero George Kastrioti Skanderbeg.",
    rating: 4.4,
    address: "Sheshi Skënderbeu, Pristina",
    tags: ["Monument", "Square", "Historic"],
    coordinates: { lat: 42.6636, lng: 21.1638 },
  },
  {
    id: "landmark-6",
    name: "Emin Gjiku Ethnographic Museum",
    category: "landmarks",
    description: "Two beautifully preserved 18th-century Ottoman houses showcasing traditional Kosovo life and artifacts.",
    rating: 4.2,
    address: "Rruga Emin Gjiku, Pristina",
    tags: ["Museum", "Ottoman", "Culture"],
    coordinates: { lat: 42.66850, lng: 21.16811 },
  },
  {
    id: "landmark-7",
    name: "Imperial Mosque (Xhamia e Mbretit)",
    category: "landmarks",
    description: "Ottoman mosque from 1461, built by Sultan Mehmed the Conqueror. The largest of its kind in the former Yugoslavia.",
    rating: 4.6,
    address: "Old Town, Pristina",
    tags: ["Mosque", "Ottoman", "Historic"],
    coordinates: { lat: 42.66650, lng: 21.16680 },
  },
  {
    id: "landmark-8",
    name: "Grand Hotel Prishtina",
    category: "landmarks",
    description: "Iconic 13-floor brutalist hotel from 1978 on Mother Teresa Boulevard. A symbol of the city's modern history.",
    rating: 3.8,
    address: "Bulevardi Nënë Tereza, Pristina",
    tags: ["Hotel", "Brutalist", "Landmark"],
    coordinates: { lat: 42.66005, lng: 21.15949 },
  },

  // ─── Dining ────────────────────────────────────────────────────────
  {
    id: "dining-1",
    name: "Soma Book Station",
    category: "dining",
    description: "Trendy bookstore-café hybrid with excellent brunch, specialty coffee, and cocktails.",
    rating: 4.6,
    address: "Rr. Garibaldi 18, Pristina",
    tags: ["Café", "Books", "Brunch"],
    coordinates: { lat: 42.65980, lng: 21.15850 },
  },
  {
    id: "dining-2",
    name: "Babalokja",
    category: "dining",
    description: "Traditional Kosovo cuisine in a cozy Ottoman-style interior. Famous for flija and tavë kosi.",
    rating: 4.5,
    address: "Rruga Rexhep Luci, Pristina",
    tags: ["Traditional", "Kosovo", "Local"],
    coordinates: { lat: 42.66280, lng: 21.16520 },
  },
  {
    id: "dining-3",
    name: "Tiffany Restaurant",
    category: "dining",
    description: "Upscale Mediterranean dining with an elegant interior and extensive wine selection.",
    rating: 4.5,
    address: "Rruga Fehmi Agani, Pristina",
    tags: ["Mediterranean", "Fine Dining", "Wine"],
    coordinates: { lat: 42.65720, lng: 21.15850 },
  },
  {
    id: "dining-4",
    name: "Prince Coffee House",
    category: "dining",
    description: "Historic café in the old bazaar area, perfect for traditional Turkish coffee.",
    rating: 4.3,
    address: "Old Bazaar, Pristina",
    tags: ["Coffee", "Traditional", "Historic"],
    coordinates: { lat: 42.66690, lng: 21.16700 },
  },
  {
    id: "dining-5",
    name: "Dit' e Nat'",
    category: "dining",
    description: "Beloved local café and bookshop, a cultural hub for Pristina's intellectual scene.",
    rating: 4.7,
    address: "Rr. Garibaldi, Pristina",
    tags: ["Café", "Culture", "Books"],
    coordinates: { lat: 42.66020, lng: 21.15920 },
  },
  {
    id: "dining-6",
    name: "Liburnia Restaurant",
    category: "dining",
    description: "Popular restaurant serving traditional Albanian and Mediterranean cuisine since the 1990s.",
    rating: 4.4,
    address: "Rruga UCK, Pristina",
    tags: ["Albanian", "Mediterranean", "Traditional"],
    coordinates: { lat: 42.65950, lng: 21.16100 },
  },

  // ─── Shopping ──────────────────────────────────────────────────────
  {
    id: "shopping-1",
    name: "Albi Mall",
    category: "shopping",
    description: "Kosovo's largest shopping center with 200+ stores, cinema, and food court.",
    rating: 4.2,
    address: "Zona Industriale, Veternik, Pristina",
    tags: ["Mall", "Fashion", "Entertainment"],
    coordinates: { lat: 42.63180, lng: 21.13610 },
  },
  {
    id: "shopping-2",
    name: "Prishtina Mall",
    category: "shopping",
    description: "Modern shopping center on the western edge of the city with international brands.",
    rating: 4.1,
    address: "Rruga B, Pristina",
    tags: ["Mall", "Shopping", "Brands"],
    coordinates: { lat: 42.64420, lng: 21.12830 },
  },
  {
    id: "shopping-3",
    name: "Old Bazaar (Çarshia e Vjetër)",
    category: "shopping",
    description: "Historic Ottoman bazaar area with traditional crafts, souvenirs, and artisan shops.",
    rating: 4.4,
    address: "Old Town, Pristina",
    tags: ["Bazaar", "Traditional", "Souvenirs"],
    coordinates: { lat: 42.66720, lng: 21.16720 },
  },
  {
    id: "shopping-4",
    name: "Nënë Tereza Boulevard Shops",
    category: "shopping",
    description: "Pristina's main pedestrian boulevard lined with retail shops, boutiques, and cafés.",
    rating: 4.0,
    address: "Bulevardi Nënë Tereza, Pristina",
    tags: ["Boulevard", "Boutiques", "Central"],
    coordinates: { lat: 42.66050, lng: 21.16050 },
  },

  // ─── Entertainment ─────────────────────────────────────────────────
  {
    id: "entertainment-1",
    name: "Germia Park",
    category: "entertainment",
    description: "Pristina's 62 km² green oasis with hiking trails, outdoor swimming pool, and picnic areas.",
    rating: 4.7,
    address: "Germia, northeast Pristina",
    tags: ["Park", "Nature", "Hiking"],
    coordinates: { lat: 42.673, lng: 21.195 },
  },
  {
    id: "entertainment-2",
    name: "Palace of Youth and Sports",
    category: "entertainment",
    description: "Multi-purpose arena hosting concerts, basketball, and cultural events. Two halls seating up to 8,000.",
    rating: 4.3,
    address: "Rruga Luan Haradinaj, Pristina",
    tags: ["Sports", "Arena", "Concerts"],
    coordinates: { lat: 42.6611, lng: 21.1572 },
  },
  {
    id: "entertainment-3",
    name: "Fadil Vokrri Stadium",
    category: "entertainment",
    description: "Home ground of FC Prishtina and the Kosovo national football team. Capacity 13,980.",
    rating: 4.3,
    address: "Rruga Enver Zymberi, Pristina",
    tags: ["Football", "Stadium", "Sports"],
    coordinates: { lat: 42.66297, lng: 21.15688 },
  },
  {
    id: "entertainment-4",
    name: "Cineplexx Pristina",
    category: "entertainment",
    description: "Modern multiplex cinema at Albi Mall with IMAX and VIP screening rooms.",
    rating: 4.4,
    address: "Albi Mall, Veternik, Pristina",
    tags: ["Cinema", "IMAX", "Movies"],
    coordinates: { lat: 42.63200, lng: 21.13580 },
  },

  // ─── Services ──────────────────────────────────────────────────────
  {
    id: "services-3",
    name: "ProCredit Bank HQ",
    category: "services",
    description: "Full-service bank with headquarters on the main boulevard. ATM network and international transfers.",
    rating: 4.1,
    address: "Bulevardi Nënë Tereza, Pristina",
    tags: ["Bank", "ATM", "Finance"],
    coordinates: { lat: 42.66050, lng: 21.16280 },
  },

  // ─── Transport ─────────────────────────────────────────────────────
  {
    id: "transport-1",
    name: "Pristina Bus Station",
    category: "transport",
    description: "Main bus terminal with regional and international connections to the Balkans and Europe.",
    rating: 3.8,
    address: "Rruga Lidhja e Prizrenit, Pristina",
    tags: ["Bus", "Transit", "Regional"],
    coordinates: { lat: 42.650307, lng: 21.146886 },
  },
  {
    id: "transport-2",
    name: "Pristina International Airport (PRN)",
    category: "transport",
    description: "Adem Jashari International Airport. Kosovo's only international airport with European connections.",
    rating: 4.2,
    address: "Vrellë, Lipjan",
    tags: ["Airport", "International", "Flights"],
    coordinates: { lat: 42.57357, lng: 21.035929 },
  },

  // ─── Health ────────────────────────────────────────────────────────
  {
    id: "health-1",
    name: "University Clinical Center of Kosovo (UCCK)",
    category: "health",
    description: "Kosovo's main hospital and medical center with emergency services, clinics, and specialists.",
    rating: 3.9,
    address: "Rrethi i Spitalit, Pristina",
    tags: ["Hospital", "Emergency", "Medical"],
    coordinates: { lat: 42.65920, lng: 21.15580 },
  },
  {
    id: "health-2",
    name: "American Hospital Kosovo",
    category: "health",
    description: "Private hospital with modern facilities, English-speaking staff, and international standards.",
    rating: 4.5,
    address: "Rruga Muharrem Fejza, Pristina",
    tags: ["Hospital", "Private", "International"],
    coordinates: { lat: 42.64850, lng: 21.14250 },
  },
  {
    id: "health-3",
    name: "Pharmacy Bejtullahu",
    category: "health",
    description: "Well-stocked pharmacy in the city center with extended hours and prescription services.",
    rating: 4.2,
    address: "Bulevardi Nënë Tereza, Pristina",
    tags: ["Pharmacy", "Medical", "Central"],
    coordinates: { lat: 42.65800, lng: 21.16000 },
  },
  {
    id: "health-4",
    name: "DentPrishtina Dental Clinic",
    category: "health",
    description: "Modern dental clinic offering general and cosmetic dentistry with multilingual staff.",
    rating: 4.6,
    address: "Rruga Agim Ramadani, Pristina",
    tags: ["Dentist", "Clinic", "Health"],
    coordinates: { lat: 42.65500, lng: 21.15700 },
  },

  // ─── Education ─────────────────────────────────────────────────────
  {
    id: "education-1",
    name: "University of Pristina",
    category: "education",
    description: "Kosovo's largest public university, founded in 1969. Multiple faculties across the city.",
    rating: 4.0,
    address: "Sheshi Nëna Terezë, Pristina",
    tags: ["University", "Public", "Higher Education"],
    coordinates: { lat: 42.65480, lng: 21.16350 },
  },
  {
    id: "education-2",
    name: "National and University Library",
    category: "education",
    description: "Brutalist masterpiece with 99 domes and metal lattice. Houses national archives and academic collections.",
    rating: 4.5,
    address: "Sheshi Hasan Prishtina, Pristina",
    tags: ["Library", "Architecture", "Academic"],
    coordinates: { lat: 42.65722, lng: 21.16222 },
  },
  {
    id: "education-3",
    name: "RIT Kosovo (A.U.K)",
    category: "education",
    description: "American University in Kosovo, affiliated with Rochester Institute of Technology. English-language instruction.",
    rating: 4.4,
    address: "Germia Campus, Pristina",
    tags: ["University", "Private", "American"],
    coordinates: { lat: 42.66200, lng: 21.17800 },
  },
  {
    id: "education-4",
    name: "Loyola Gymnasium",
    category: "education",
    description: "Prestigious secondary school run by the Jesuit order. Known for high academic standards.",
    rating: 4.7,
    address: "Rruga Arbëria, Pristina",
    tags: ["School", "Secondary", "Private"],
    coordinates: { lat: 42.64100, lng: 21.15200 },
  },
];

// Add calculated distances to POIs
export const poisWithDistances: POI[] = mockPOIs.map(poi => ({
  ...poi,
  distance: getDistanceFromProject(poi.coordinates.lat, poi.coordinates.lng),
}));

export const getPOIsByCategory = (category: POICategory): POI[] => {
  return poisWithDistances.filter((poi) => poi.category === category);
};

export const getPOIById = (id: string): POI | undefined => {
  return poisWithDistances.find((poi) => poi.id === id);
};
