

# Spread Royal Dividers Across More Components

## Overview
Add `RoyalDivider` to 6 more locations where plain `border` or `h-px` separators currently exist, giving the entire app a consistent luxury feel.

## Changes

### 1. `src/components/units/UnitDetailDrawer.tsx`
- Replace the plain gradient divider between action buttons (line 342: `h-px w-full bg-gradient-to-r...`) with `<RoyalDivider variant="line" />`
- Add `<RoyalDivider variant="subtle" />` between the header/price banner and the tabs section (after line 171)
- Add `<RoyalDivider variant="ornament" />` in the quote modal between the header and the form (after line 403)

### 2. `src/components/surroundings/SurroundingsBrowser.tsx`
- Replace the `h-px bg-white/[0.08]` divider between search and POI list (line 94) with `<RoyalDivider variant="subtle" />`
- Replace the `h-px bg-white/[0.08]` divider above the "Detailed Map" button (line 145) with `<RoyalDivider variant="subtle" />`

### 3. `src/components/parking/ParkingBrowser.tsx`
- Replace `border-t border-white/[0.06]` on the filters section (line 145) with a `<RoyalDivider variant="subtle" />` placed above it

### 4. `src/components/lokale/LokaleBrowser.tsx`
- Replace `border-t border-white/[0.06]` on the filters section (line 128) with a `<RoyalDivider variant="subtle" />` placed above it

### 5. `src/components/units/ComparePanel.tsx`
- Replace the `<Separator>` import with `<RoyalDivider variant="line" />` between comparison table sections
- Add `<RoyalDivider variant="ornament" />` between the dialog header and the comparison grid

### 6. `src/pages/BuildingInfoPage.tsx`
- Replace the inline gradient `h-px` dividers between accordion sections (line 53-57) with `<RoyalDivider variant="line" />`

## Summary
- 6 files updated
- ~12 plain dividers replaced with `RoyalDivider` variants
- No logic changes — purely visual consistency

