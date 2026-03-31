

# Wire Up "Explore Interior" Navigation

## What
Update `src/components/units/UnitCard.tsx` to navigate to `/unit/${unit.id}/interior` after the existing UE event.

## Changes (single file)

**`src/components/units/UnitCard.tsx`**:
1. Add `import { useNavigate } from "react-router-dom"` at top
2. Add `const navigate = useNavigate()` inside the component body
3. In `handleExploreInterior`, add `navigate('/unit/' + unit.id + '/interior')` after the `sendToUnreal` call

No other files affected.

