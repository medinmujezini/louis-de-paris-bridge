

# Rewire 3D VIEW to Qeramika Interior Editor

## Changes

### 1. `src/pages/UnitsPage.tsx` — Update `handleEnter3D`
- Change navigation from `/interioredit` to `/unit/${selectedUnit.id}/interior`
- Send `ENTER_INTERIOR_EDIT` UE event instead of calling `enter(selectedUnit)` from ThreeDMode
- Remove the `useThreeDMode` import (no longer needed)

### 2. `src/components/units/UnitCard.tsx` — Remove "Explore Interior" button
- Delete the `handleExploreInterior` function
- Remove the "Explore Interior" button block (the conditional `isSelected && unit.available` section)
- Remove unused imports (`useNavigate`, `Sparkles`, `sendToUnreal`, `UEEvents`)

