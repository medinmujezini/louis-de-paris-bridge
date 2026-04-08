

# Add Royal Dividers & Luxury UI Embellishments

## Overview
Add decorative royal dividers and upgrade UI elements across key components to feel more regal and luxurious — using gold gradients, fleur-de-lis SVG ornaments, and refined separator patterns.

## Step 1: Create a `RoyalDivider` Component
**New file:** `src/components/ui/royal-divider.tsx`

A reusable decorative divider with three variants:
- **`line`** — Gold gradient line with a centered diamond/fleur-de-lis ornament
- **`ornament`** — Wider decorative separator with dual lines and a centered gold motif (small SVG crown or fleur-de-lis)
- **`subtle`** — Thin gold-to-transparent gradient (already used in sidebar/chatbot, but standardized)

Props: `variant`, `className`. Pure CSS + inline SVG, no dependencies.

## Step 2: Apply Royal Dividers in Key Locations

### Sidebar (`AppSidebar.tsx`)
- Replace the plain `border-b border-white/10` header divider with `<RoyalDivider variant="ornament" />`
- Replace the footer `border-t border-white/10` with `<RoyalDivider variant="ornament" />`
- Add subtle gold separators between nav item groups (after "Home", before "Admin")

### Units Browser (`UnitsBrowser.tsx`)
- Replace the `h-px bg-primary/10` divider (line 281) with `<RoyalDivider variant="line" />`
- Add a `<RoyalDivider variant="subtle" />` between the header and search area

### Section Selector (`SectionSelector.tsx`)
- Add a `<RoyalDivider variant="ornament" />` between the title block and the cards
- Add decorative corner flourishes (CSS pseudo-elements) to the section cards

### DinoBot (`DinoBot.tsx`)
- Already has gold ornaments — add `<RoyalDivider variant="line" />` between message area and input

### Viewer Controls (`ViewerControls.tsx`)
- Add a `<RoyalDivider variant="subtle" />` between the time slider and weather controls

## Step 3: Add Royal CSS Utilities to `index.css`

Add utility classes:
- `.royal-corner` — CSS pseudo-element adding small gold corner flourishes (top-left + bottom-right L-shaped gold lines)
- `.royal-glow` — Subtle gold box-shadow on hover (`0 0 20px hsl(43 50% 54% / 0.15)`)
- `.royal-text` — Gold gradient text effect for headings using `background-clip: text`

## Step 4: Upgrade Section Selector Cards
- Add `.royal-corner` pseudo-elements to each card
- Apply `.royal-text` to the "Louis de Paris" heading
- Add a small crown SVG above the main title

## Step 5: Upgrade Sidebar Header
- Apply `.royal-text` gradient to "Louis de Paris" title text
- Add a tiny crown icon inline before the text when expanded

## Summary
- 1 new component (`RoyalDivider`)
- 3 new CSS utility classes
- 6 files updated with divider placements and royal styling
- No structural or logic changes — purely visual enhancement

