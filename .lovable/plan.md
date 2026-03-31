

# Louis de Paris — Simplified UI Plan (Revised)

## Flow

1. **Intro Video** → fullscreen MP4 player with skip button
2. **Section Selector** → two elegant glassmorphic cards: "Apartments" and "Villas"
3. **Browsing** → sidebar + filters scoped to selected section; demo units (1 apt, 1 villa) get an "Explore Interior" button

## Plan

### 1. Create `AppFlowContext`
- Tracks phase: `intro` → `section-select` → `browsing`
- Stores selected section (`apartment | villa | null`)
- Actions: `skipIntro()`, `selectSection()`, `backToSections()`

### 2. Create `IntroVideoOverlay`
- Fullscreen fixed overlay, plays `/videos/intro.mp4`, autoplay
- Skip button bottom-right, advances to `section-select` on end/skip
- Fade-out transition

### 3. Create `SectionSelector`
- Two large glassmorphic cards side by side: "Residential Apartments" and "Luxury Villas"
- Each with an icon, short description, and hover glow effect
- On click: sends `UEEvents.FOCUS_SECTION` with `{ section }` to UE, sets phase to `browsing`

### 4. Update `HomePage`
- Renders flow phases: intro → section selector → existing camera/weather controls
- Sidebar and HUD hidden until `browsing` phase

### 5. Update `AppLayout`
- Read flow phase from context; hide sidebar + header during `intro` and `section-select`

### 6. Update types and data
- Add `"villa"` to `UnitType` in `types/units.ts`
- Add villa placeholder units to `mock-units.ts`, mark 1 apartment + 1 villa as demo
- Add `FOCUS_SECTION` and `ENTER_INTERIOR_EDIT` events to `ue-bridge.ts`

### 7. Scoped browsing
- `UnitsBrowser` filters by selected section type
- Demo units show "Explore Interior" CTA → **only** sends `ENTER_INTERIOR_EDIT` event to UE with the unit ID. No interior UI is built — Unreal Engine and Qeramika ShowRoom handle everything after this event.

### 8. Rebrand
- Update `index.html` title to "Louis de Paris"
- Update sidebar header, translation files (project name refs)
- **Color palette: strictly black (#0A0A0A) and gold (#C9A84C) only.** Replace the current dark red accent (`--primary`, `--accent`, `--ring`, etc.) with gold. Background stays black. No navy, no cream, no other colors.
- Update `mem://project/name`

## Files

**Create:** `AppFlowContext.tsx`, `IntroVideoOverlay.tsx`, `SectionSelector.tsx`

**Modify:** `HomePage.tsx`, `AppLayout.tsx`, `types/units.ts`, `mock-units.ts`, `ue-bridge.ts`, `AppSidebar.tsx`, `index.html`, translation files, `index.css`

