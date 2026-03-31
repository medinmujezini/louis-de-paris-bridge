

# Qeramika Integration — Import Fix & Route Setup

## Overview
Bulk-update ~50 files in `src/qeramika/` to fix import paths, add a `luxury` button variant, create the wrapper page, and add the route.

## Step 1: Bulk Import Path Updates (~50 files)

Rewrite all internal `@/` imports inside `src/qeramika/` to `@/qeramika/` for these prefixes:

| Old prefix | New prefix |
|---|---|
| `@/contexts/` | `@/qeramika/contexts/` |
| `@/hooks/useFloorPlan` | `@/qeramika/hooks/useFloorPlan` |
| `@/hooks/useFurnitureState` | `@/qeramika/hooks/useFurnitureState` |
| `@/hooks/useMEPState` | `@/qeramika/hooks/useMEPState` |
| `@/hooks/useTemplatesFromDB` | `@/qeramika/hooks/useTemplatesFromDB` |
| `@/hooks/useAdminAuth` | `@/qeramika/hooks/useAdminAuth` |
| `@/hooks/useConnectionStatus` | `@/qeramika/hooks/useConnectionStatus` |
| `@/types/floorPlan` | `@/qeramika/types/floorPlan` |
| `@/types/fixture` | `@/qeramika/types/fixture` |
| `@/types/mep` | `@/qeramika/types/mep` |
| `@/types/geometry` | `@/qeramika/types/geometry` |
| `@/types/floorPlanDigitizer` | `@/qeramika/types/floorPlanDigitizer` |
| `@/data/furnitureLibrary` | `@/qeramika/data/furnitureLibrary` |
| `@/data/fixtureLibrary` | `@/qeramika/data/fixtureLibrary` |
| `@/data/plumbingCodes` | `@/qeramika/data/plumbingCodes` |
| `@/utils/` | `@/qeramika/utils/` |
| `@/constants/` | `@/qeramika/constants/` |
| `@/webgpu/` | `@/qeramika/webgpu/` |
| `@/gi/` | `@/qeramika/gi/` |
| `@/product-view/` | `@/qeramika/product-view/` |
| `@/components/3d/` | `@/qeramika/components/3d/` |
| `@/components/tiles/` | `@/qeramika/components/tiles/` |
| `@/components/mep/` | `@/qeramika/components/mep/` |
| `@/components/tabs/` | `@/qeramika/components/tabs/` |
| `@/components/design/` | `@/qeramika/components/design/` |
| `@/components/home/BackToHome` | `@/qeramika/components/home/BackToHome` |
| `@/components/blueprint/` | `@/qeramika/components/blueprint/` |
| `@/components/auth/` | `@/qeramika/components/auth/` |

**Unchanged** (shared project code): `@/components/ui/*`, `@/integrations/supabase/*`, `@/lib/utils`, `@/hooks/use-mobile`, `@/hooks/use-toast`.

## Step 2: Create Stub Files for Missing Modules

These are imported but don't exist yet — create minimal stubs so the build passes:

| Stub file | Reason |
|---|---|
| `src/qeramika/utils/pdfExport.ts` | Referenced by TilesTab |
| `src/qeramika/utils/mepBillOfMaterials.ts` | Referenced by EstimateWizard |
| `src/qeramika/components/mep/MEPCanvas.tsx` | Referenced by MEPTab, PlumbingTab |
| `src/qeramika/components/mep/FixturePropertiesPanel.tsx` | Referenced by MEPTab, PlumbingTab |
| `src/qeramika/components/mep/AutoRoutingPanel.tsx` | Referenced by MEPTab, PlumbingTab |
| `src/qeramika/components/mep/RiserDiagramView.tsx` | Referenced by MEPTab, PlumbingTab |
| `src/qeramika/components/mep/BillOfMaterialsPanel.tsx` | Referenced by MEPTab |
| `src/qeramika/components/mep/IsometricMEPView.tsx` | Referenced by MEPTab, PlumbingTab |
| `src/qeramika/components/mep/NodePropertiesPanel.tsx` | Referenced by PlumbingTab |
| `src/qeramika/components/mep/InstallationGuidePanel.tsx` | Referenced by PlumbingTab |
| `src/qeramika/components/mep/InstallationChatbot.tsx` | Referenced by PlumbingTab |
| `src/qeramika/components/blueprint/BlueprintImportWizard.tsx` | Referenced by FloorPlanTab |
| `src/qeramika/components/auth/AuthForm.tsx` | Referenced by ProjectsTab |
| `src/qeramika/components/home/BackToHome.tsx` | Referenced by EndUserPlatform |

## Step 3: Add `luxury` Variant to Button

In `src/components/ui/button.tsx`, add a new variant:
```
luxury: "bg-[hsl(0,0%,4%)] text-primary border border-primary/30 hover:bg-primary/15 hover:border-primary/50"
```

## Step 4: Create UnitInteriorPage

New file `src/pages/UnitInteriorPage.tsx`:
- Reads `:id` from route params
- Wraps `EndUserPlatform` in `FloorPlanProvider` → `FurnitureProvider` → `MEPProvider` → `MaterialProvider`

## Step 5: Add Route to App.tsx

Add inside the `<AppLayout>` route group:
```tsx
<Route path="/unit/:id/interior" element={<UnitInteriorPage />} />
```

