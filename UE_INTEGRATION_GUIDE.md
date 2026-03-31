# Dino Residence — Web UI ↔ Unreal Engine Integration Guide

> This document describes everything the Unreal Engine agent needs to know about the React web overlay that runs inside UE via the WebUI plugin.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [HUD Transparency & Hit-Testing](#hud-transparency--hit-testing)
3. [Communication Bridge](#communication-bridge)
4. [Event Reference (React → UE)](#events-react--ue)
5. [Event Reference (UE → React)](#events-ue--react)
6. [Page / Tab System](#page--tab-system)
7. [Camera System Contract](#camera-system-contract)
8. [Interior View Lifecycle](#interior-view-lifecycle)
9. [Unit Data Model](#unit-data-model)
10. [Building Sections](#building-sections)
11. [POI / Surroundings System](#poi--surroundings-system)
12. [Time of Day & Weather](#time-of-day--weather)
13. [Onboarding & Tutorials](#onboarding--tutorials)
14. [Mock Mode (Browser Testing)](#mock-mode-browser-testing)

---

## Architecture Overview

The web app is a **React + TypeScript + Vite** single-page application designed as a **transparent HUD overlay** rendered inside Unreal Engine via the **WebUI plugin**. The entire UI is glassmorphic (frosted-glass panels) on a fully transparent background — there are no opaque backgrounds anywhere.

**Tech stack:** React 18, React Router, Framer Motion, Tailwind CSS, shadcn/ui, Lucide icons.

**Design tokens:** Dark theme with dark red accent (`hsl(7, 85%, 36%)` — `#A91B0B`). All UI uses glassmorphism with backdrop blur.

---

## HUD Transparency & Hit-Testing

- The HTML `<body>` has `background: transparent !important` enforced.
- The WebUI plugin uses **pixel-based alpha hit-testing** with a threshold of **0.333**.
  - Pixels with `alpha > 0.333` → captured by the web UI (clicks go to React).
  - Pixels with `alpha ≤ 0.333` → passed through to the 3D scene.
- This means transparent gaps between UI elements naturally let users interact with the 3D world.

---

## Communication Bridge

**File:** `src/lib/ue-bridge.ts`

The bridge provides bidirectional communication between React and UE.

### Sending from React → UE

```typescript
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";

sendToUnreal(UEEvents.FOCUS_UNIT, { id: "b1-a1" });
```

**Transport priority:**
1. `window.ue5(eventName, payload)` — preferred for mobile compatibility. Payload is a raw JS object (auto-serialized by the helper script).
2. `window.ue.interface.broadcast(eventName, jsonString)` — fallback. Payload is **manually JSON.stringify'd**.

### Receiving from UE → React

```typescript
import { registerHandler, UEEvents } from "@/lib/ue-bridge";

const unsubscribe = registerHandler(UEEvents.UNIT_SELECTED, (data) => {
  console.log("User clicked unit in 3D:", data);
});

// Cleanup
unsubscribe();
```

UE calls handlers via `ue.interface.handlerName(data)`.

---

## Events: React → UE

### Camera Control
| Event | Payload | Description |
|-------|---------|-------------|
| `setCameraView` | `{ view: "exterior" \| "aerial" \| "street" }` | Switch to a preset camera position |
| `resetCamera` | `{}` | Return camera to default position |
| `toggleAutoRotate` | `{ enabled: boolean }` | Toggle orbital auto-rotation |

### Focus / Highlight
| Event | Payload | Description |
|-------|---------|-------------|
| `focusUnit` | `{ id: string }` | Fly camera to focus on a specific unit |
| `focusSection` | `{ id: string }` | Fly camera to focus on a building section/floor |
| `focusPOI` | `{ id: string }` | Fly camera to a point of interest |
| `highlightUnit` | `{ id: string, highlight: boolean }` | Toggle highlight glow on a unit mesh |

### Time & Weather
| Event | Payload | Description |
|-------|---------|-------------|
| `setTimeOfDay` | `{ time: "dawn" \| "morning" \| "noon" \| "sunset" \| "night" }` | Change lighting/sky |
| `setWeather` | `{ weather: "clear" \| "cloudy" \| "rainy" \| "foggy" }` | Change weather FX |

### Interior Mode
| Event | Payload | Description |
|-------|---------|-------------|
| `enterInterior` | `{ id: string }` | Begin loading the interior for a unit |
| `exitInterior` | `{}` | Unload interior, return to exterior view |

### Tab Activation (Navigation)
Each tab sends an activation event when the user navigates to it, and a deactivation event when leaving:

| Activate Event | Deactivate Event | Tab |
|---------------|-----------------|-----|
| `activateHome` | `deactivateHome` | Home (exterior overview) |
| `activateUnits` | `deactivateUnits` | Apartments browser |
| `activateParking` | `deactivateParking` | Parking/storage browser |
| `activateLokale` | `deactivateLokale` | Commercial spaces |
| `activateSurroundings` | `deactivateSurroundings` | POI / Map view |
| `activateBuildingInfo` | `deactivateBuildingInfo` | Building information |

**Use these to:** show/hide 3D markers, change camera behavior, toggle scene layers, etc.

### Surroundings / POI
| Event | Payload | Description |
|-------|---------|-------------|
| `sendPOIData` | `{ pois: POI[] }` | Push full POI JSON array for procedural 3D marker spawning |
| `filterPOIs` | `{ categories: string[] }` | Sync which POI categories are visible |
| `clearPOIs` | `{}` | Remove all POI 3D markers from the scene |

### Other
| Event | Payload | Description |
|-------|---------|-------------|
| `navigateCategory` | `{ category: string }` | Sidebar nav item clicked |
| `requestPOIList` | `{}` | Request POI list from UE |
| `requestUnitList` | `{}` | Request unit list from UE |
| `setMaterial` | `{ unitId: string, material: string }` | Change material in interior edit mode |
| `toggleUI` | `{ visible: boolean }` | Show/hide the web UI overlay |

---

## Events: UE → React

| Event | Payload | Description |
|-------|---------|-------------|
| `unitSelected` | `{ id: string }` | User clicked a unit in the 3D scene |
| `unitHovered` | `{ id: string \| null }` | User hovered over / left a unit mesh |
| `poiSelected` | `{ id: string }` | User clicked a POI marker in 3D |
| `cameraReady` | `{ unitId?: string }` | Camera finished flying to a target |
| `cameraMoved` | `{ position: {x,y,z}, rotation: {pitch,yaw,roll} }` | Camera position update (for syncing minimap etc.) |
| `sectionChanged` | `{ id: string }` | Camera entered a new building section zone |
| `timeChanged` | `{ time: string }` | Time of day was changed from UE side |
| `weatherChanged` | `{ weather: string }` | Weather was changed from UE side |
| `interiorReady` | `{ unitId: string }` | Interior room has finished loading — triggers UI transition |
| `updatePOIList` | `{ categories: [...] }` | POI data response |
| `updateUnitList` | `{ units: [...] }` | Unit data response |

---

## Page / Tab System

The app has 6 main tabs accessible via a left sidebar:

| Route | Tab | UE Events | What happens in 3D |
|-------|-----|-----------|-------------------|
| `/` | **Home** | `activateHome` / `deactivateHome` | Exterior overview with camera presets (exterior, aerial, street), auto-rotate, time/weather controls |
| `/units` | **Apartments** | `activateUnits` / `deactivateUnits` | Unit browser panel on right. Clicking a unit sends `focusUnit`. Selected units get `highlightUnit`. Can enter interior via `enterInterior`. |
| `/parking` | **Parking/Depo** | `activateParking` / `deactivateParking` | Parking & storage browser |
| `/lokale` | **Lokale** | `activateLokale` / `deactivateLokale` | Commercial spaces browser |
| `/surroundings` | **Surroundings** | `activateSurroundings` / `deactivateSurroundings` | POI category filters. Sends `sendPOIData` with full POI arrays. `filterPOIs` syncs active categories. `clearPOIs` on deactivate. |
| `/building-info` | **Building Info** | `activateBuildingInfo` / `deactivateBuildingInfo` | Static info page |

### What hides during Interior Mode
When the user enters interior mode (3D apartment walkthrough), the following UI elements are **hidden**:
- Left sidebar navigation
- App header
- Unit browser panel
- "View Details" / "3D View" floating CTAs
- Section tabs

Only the **interior HUD** remains (unit info card, floor plan, action buttons, time/weather controls, exit button).

---

## Camera System Contract

The UE orbital camera should support:

- **Mouse-driven rotation** with vertical pitch clamps: **-10° to 70°**
- **Scroll-based zoom** clamps: **500 to 5000 units**
- **XY panning**
- **Reset** to base coordinates (triggered by `resetCamera` event)
- **Auto-rotate** toggle (triggered by `toggleAutoRotate`)
- **Focus/fly-to** — smooth interpolation to specific targets:
  - Units: `focusUnit({ id })` → fly to unit's 3D position
  - Sections: `focusSection({ id })` → fly to floor/wing overview
  - POIs: `focusPOI({ id })` → fly to POI marker position
- Each focus target should have its own **position + zoom** constraints

### Camera presets (Home page):
- `exterior` — standard building overview angle
- `aerial` — top-down bird's eye view
- `street` — ground-level pedestrian view

---

## Interior View Lifecycle

The interior mode has a **3-phase lifecycle**:

### Phase 1: Loading
1. React sends `enterInterior({ id: "unit-id" })` to UE
2. React shows a **black splash screen** with logo and animated progress bar
3. **UE must respond** with `interiorReady({ unitId })` when the room is loaded
4. React then transitions to Phase 2

### Phase 2: Video Transition
1. React plays a cinematic fly-through video (or logo animation fallback)
2. A "Skip" button appears after 2 seconds
3. On skip or video end → transitions to Phase 3

### Phase 3: Interior HUD
The interior HUD provides:
- **Floor plan overlay** (top-right)
- **Unit info card** — name, floor, specs (area, beds, baths, orientation, terrace)
- **Action buttons:**
  - **Edit Interior** — toggles a boolean editing mode (can be used to enable material selection in UE)
  - **Print Plan** — opens a printable brochure in a new window
  - **Ask for Quote** — opens a contact/inquiry form modal
- **Exit Interior** button → sends `exitInterior({})` to UE, returns to `/units`
- **Time & Weather controls** (compact single-row layout at bottom center)
- **Interior onboarding tutorial** (first visit only) — teaches WASD movement, mouse look, and button locations

### Interior Camera Controls (taught in tutorial):
- **WASD keys** — walk forward, backward, strafe left/right
- **Mouse movement** — rotate/look around (no click required)

---

## Unit Data Model

```typescript
interface Unit {
  id: string;           // e.g. "b1-a1", "b2-a15", "lok-05"
  name: string;         // e.g. "Apartament A1"
  floor: number;        // Floor number
  surface: number;      // Total area in m²
  bedrooms: number;
  bathrooms: number;
  price: number;        // In USD
  available: boolean;
  orientation?: "north" | "south" | "east" | "west";
  features?: string[];  // e.g. ["Balcony", "Sea View"]
  section?: string;     // Building section ID
  building?: string;    // "1" or "2"
  unitType?: "apartment" | "commercial" | "garage" | "storage";
  terrace?: number;     // Terrace area in m²
  duplexTotal?: number; // Total duplex area in m²
  thumbnail?: string;   // Image URL
}
```

### ID Convention
- **Building 1 apartments:** `b1-a1` through `b1-a40`
- **Building 2 apartments:** `b2-a1` through `b2-a35`, plus `b2-n1`, `b2-n2`
- **Commercial/Lokale:** `lok-01` through `lok-28`
- **Parking:** Uses same ID pattern

---

## Building Sections

Sections group units by floor/zone. Used for `focusSection` events.

### Building 1 Floors
| Section ID | Name | Unit IDs |
|-----------|------|----------|
| `b1-floor-2` | B1 Kati 2 | b1-a1 through b1-a6 |
| `b1-floor-3` | B1 Kati 3 | b1-a7, b1-a8 |
| `b1-floor-4` | B1 Kati 4 | b1-a9 through b1-a13 |
| `b1-floor-5` | B1 Kati 5 | b1-a14 through b1-a18 |
| `b1-floor-7` | B1 Kati 7 | b1-a19 through b1-a24 |
| `b1-floor-8` | B1 Kati 8 | b1-a23 through b1-a27-1 |
| `b1-floor-9` | B1 Kati 9 | b1-a28 through b1-a32 |
| `b1-floor-10` | B1 Kati 10 | b1-a33 through b1-a37 |
| `b1-floor-11` | B1 Kati 11 | b1-a38 through b1-a40 |

### Building 2 Floors
| Section ID | Name | Unit IDs |
|-----------|------|----------|
| `b2-floor-2` | B2 Kati 2 | b2-a1 through b2-a6 |
| `b2-floor-3` | B2 Kati 3 | b2-a7, b2-a8 |
| `b2-floor-4` | B2 Kati 4 | b2-a9 through b2-a13 |
| `b2-floor-5` | B2 Kati 5 | b2-a14 through b2-a18 |
| `b2-floor-7` | B2 Kati 7 | b2-a19 through b2-a24 |
| `b2-floor-8` | B2 Kati 8 | b2-a25 through b2-a27-1 |
| `b2-floor-9` | B2 Kati 9 | b2-a28 through b2-a32 |
| `b2-floor-10` | B2 Kati 10 | b2-a33 through b2-n2 |

### Commercial Zones
| Section ID | Name | Unit IDs |
|-----------|------|----------|
| `commercial-basement` | Sutereni | lok-01 through lok-04 |
| `commercial-ground` | Përdhesa | lok-05 through lok-11 |
| `commercial-floor-1` | Kati 1 | lok-12 through lok-28 |
| `commercial-floor-6` | Kati 6 | lok-20 through lok-27 |

---

## POI / Surroundings System

When the user navigates to the Surroundings tab:

1. React sends `activateSurroundings` to UE
2. React fetches POI data from the backend and sends `sendPOIData({ pois: [...] })` with the full array
3. **UE should spawn 3D markers** for each POI at the given lat/lng coordinates (converted to world position)
4. As the user toggles category filters, React sends `filterPOIs({ categories: ["dining", "shopping"] })` with the active set
5. When leaving the tab, React sends `clearPOIs({})` then `deactivateSurroundings`

### POI Data Shape
```typescript
interface POI {
  id: string;
  name: string;
  category: "dining" | "shopping" | "entertainment" | "services" | "transport" | "landmarks" | "health" | "education";
  description: string;
  coordinates: { lat: number; lng: number };
  rating?: number;
  address?: string;
  tags?: string[];
}
```

### POI Categories & Colors
| Category | Color |
|----------|-------|
| Landmarks | `#F59E0B` (amber) |
| Dining | `#EA580C` (orange) |
| Shopping | `#DB2777` (pink) |
| Entertainment | `#9333EA` (purple) |
| Services | `#2563EB` (blue) |
| Transport | `#16A34A` (green) |
| Health | `#EF4444` (red) |
| Education | `#06B6D4` (cyan) |

---

## Time of Day & Weather

### Time of Day
Controlled via a slider. Values: `dawn`, `morning`, `noon`, `sunset`, `night`.

**Event:** `setTimeOfDay({ time: "sunset" })`

UE should adjust: sky sphere, directional light angle/color/intensity, ambient lighting, shadows.

### Weather
Controlled via toggle buttons. Values: `clear`, `cloudy`, `rainy`, `foggy`.

**Event:** `setWeather({ weather: "rainy" })`

UE should adjust: cloud density, rain/fog particles, puddle reflections, ambient audio.

### Bidirectional Sync
If UE changes time/weather internally, send `timeChanged({ time })` or `weatherChanged({ weather })` back to React to keep the UI slider in sync.

---

## Onboarding & Tutorials

### First-Visit Onboarding (Exterior)
A 3-phase overlay on first visit:
1. **Move** — Drag to orbit the camera (mouse icon animation)
2. **Zoom** — Scroll to zoom (scroll wheel animation)
3. **Sidebar** — Guided tour of each navigation tab

Stored in `localStorage` as `dino_onboarding_complete`.

### Interior Onboarding (First Interior Visit)
A 3-phase overlay on first interior entry:
1. **WASD Movement** — Shows animated keyboard keys
2. **Mouse Look** — Shows mouse movement for camera rotation
3. **Action Buttons** — Shows Edit Interior, Print Plan, Ask for Quote

Stored in `localStorage` as `dino_interior_onboarding_complete`.

### Page-Specific Tutorials
Each tab has a `?` help button that triggers step-by-step tooltips with images pointing to UI elements. These are independent of the onboarding.

---

## Mock Mode (Browser Testing)

When the app runs outside UE (no `window.ue` or `window.ue5` detected), it enters **mock mode**:
- All `sendToUnreal` calls are logged to console with `[Mock UE]` prefix
- Simulated responses are sent back after 300ms delay (e.g., `cameraReady`, `interiorReady`)
- `interiorReady` mock response fires after 2500ms to simulate load time

This allows full UI testing in a browser without UE running.

---

## Quick Reference: Event Flow Examples

### User selects a unit in the browser
```
React → focusUnit({ id: "b1-a5" })
React → highlightUnit({ id: "b1-a5", highlight: true })
UE → cameraReady({ unitId: "b1-a5" })
```

### User enters interior mode
```
React → enterInterior({ id: "b1-a5" })
  [React shows loading screen]
UE → interiorReady({ unitId: "b1-a5" })
  [React plays video transition → shows interior HUD]
```

### User exits interior mode
```
React → exitInterior({})
  [React hides interior HUD, navigates to /units]
```

### User switches to Surroundings tab
```
React → activateSurroundings
React → sendPOIData({ pois: [...] })
  [User toggles filters]
React → filterPOIs({ categories: ["dining", "health"] })
  [User leaves tab]
React → clearPOIs({})
React → deactivateSurroundings
```

### User changes time and weather
```
React → setTimeOfDay({ time: "sunset" })
React → setWeather({ weather: "rainy" })
```

---

## Supported Languages

The UI supports 4 languages via i18n: **English (en)**, **German (de)**, **French (fr)**, **Albanian (sq)**. Language switching is handled entirely on the web side — UE does not need to be aware of languages.

---

*Generated from the Dino Residence web codebase. Last updated: February 2026.*
