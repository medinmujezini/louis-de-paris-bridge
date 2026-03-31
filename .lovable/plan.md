

# Fix Import Paths in Qeramika Floor Plan Components

## Problem
The newly added `Canvas2D.tsx`, `PropertiesPanel.tsx`, `FloorPlanToolbar.tsx`, `Toolbar.tsx`, `CeilingPlanePanel.tsx`, `DigitizedPlanEditor.tsx`, `ScaleCalibrator.tsx`, and `DesignToolbar.tsx` all use old `@/` imports that need `@/qeramika/` prefixes. Additionally, two utility modules referenced by Canvas2D don't exist and need stub files.

## Files to Fix (import path updates only)

### 1. `src/qeramika/components/floor-plan/Canvas2D.tsx`
| Old import | New import |
|---|---|
| `@/contexts/FloorPlanContext` | `@/qeramika/contexts/FloorPlanContext` |
| `@/types/floorPlan` (×2) | `@/qeramika/types/floorPlan` |
| `@/utils/collisionDetection` | `@/qeramika/utils/fixtureCollision` (see note below) |
| `@/hooks/useConnectionStatus` | `@/qeramika/hooks/useConnectionStatus` |
| `@/utils/arcUtils` | `@/qeramika/utils/arcUtils` |

**Note:** `collisionDetection.ts` doesn't exist. The exports `checkFixtureCollisions` and `getClearanceZone` don't exist anywhere in the codebase. `FIXTURE_CLEARANCES` exists in `plumbingCodes.ts` but with a different shape. A stub `src/qeramika/utils/collisionDetection.ts` will be created exporting no-op functions so the file compiles.

### 2. `src/qeramika/components/floor-plan/PropertiesPanel.tsx`
| Old import | New import |
|---|---|
| `@/contexts/FloorPlanContext` | `@/qeramika/contexts/FloorPlanContext` |
| `@/types/floorPlan` | `@/qeramika/types/floorPlan` |
| `@/utils/wallHeightUtils` | `@/qeramika/utils/wallHeightUtils` |
| `@/utils/ceilingUtils` | `@/qeramika/utils/ceilingUtils` |

### 3. `src/qeramika/components/floor-plan/CeilingPlanePanel.tsx`
| Old import | New import |
|---|---|
| `@/contexts/FloorPlanContext` | `@/qeramika/contexts/FloorPlanContext` |
| `@/utils/ceilingUtils` | `@/qeramika/utils/ceilingUtils` |

### 4. `src/qeramika/components/floor-plan/Toolbar.tsx`
| Old import | New import |
|---|---|
| `@/contexts/FloorPlanContext` | `@/qeramika/contexts/FloorPlanContext` |

### 5. `src/qeramika/components/toolbars/FloorPlanToolbar.tsx`
| Old import | New import |
|---|---|
| `@/contexts/FloorPlanContext` | `@/qeramika/contexts/FloorPlanContext` |

### 6. `src/qeramika/components/toolbars/DesignToolbar.tsx`
| Old import | New import |
|---|---|
| `@/components/design/QualitySettingsPanel` | `@/qeramika/components/design/QualitySettingsPanel` |

### 7. `src/qeramika/components/floor-plan/DigitizedPlanEditor.tsx`
| Old import | New import |
|---|---|
| `@/types/floorPlanDigitizer` | `@/qeramika/types/floorPlanDigitizer` |
| `@/utils/scaleCalibration` | See note below |

### 8. `src/qeramika/components/floor-plan/ScaleCalibrator.tsx`
| Old import | New import |
|---|---|
| `@/types/floorPlanDigitizer` | `@/qeramika/types/floorPlanDigitizer` |
| `@/utils/scaleCalibration` | See note below |

## Missing Utility Files (create stubs)

### `src/qeramika/utils/scaleCalibration.ts`
The functions `createScaleCalibration`, `calculatePixelDistance`, `validateCalibration`, and `pixelsToCm` are referenced. `pixelsToCm` exists in `dimensions.ts`. Create a stub that re-exports `pixelsToCm` from dimensions and adds no-op implementations for the other three.

### `src/qeramika/utils/collisionDetection.ts`
The functions `checkFixtureCollisions`, `getClearanceZone` and constant `FIXTURE_CLEARANCES` are referenced. Create a stub with no-op implementations that return safe defaults (empty arrays, null zones).

## Summary
- 8 files get import path fixes (simple find-and-replace of `@/` to `@/qeramika/`)
- 2 new stub utility files to prevent missing-module errors
- No rebuilding of any component logic
