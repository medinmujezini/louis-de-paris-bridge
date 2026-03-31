## Plan: Update InteriorMaterialEditor Variant Data & Event Payload

### What changes

The `editInterior` event currently sends `{ name: label }` (display name like "Azuara"). It needs to send `{ name: variantId }` using the exact UE blueprint names provided. The variant data also needs to be restructured to match the 28 items provided.

### Changes to `src/components/interior/InteriorMaterialEditor.tsx`

**1. Update the event payload** (line 122):

- Change `sendToUnreal(UEEvents.EDIT_INTERIOR, { name: label })` → `sendToUnreal(UEEvents.EDIT_INTERIOR, { name: variantId })`

**2. Replace VARIANT_DATA** with the corrected 28 entries mapped to categories:


| Category               | variantId (sent to UE) | Label (displayed) |
| ---------------------- | ---------------------- | ----------------- |
| **Dritaret**           | `DritareWhite`         | White             |
| &nbsp;                 | `DritareZI`            | Black             |
| **Parketi**            | `ParketAzuara`         | Azuara            |
| &nbsp;                 | `ParketCodos`          | Codos             |
| &nbsp;                 | `ParketTarragona`      | Tarragona         |
| &nbsp;                 | `ParketJuneda`         | Juneda            |
| **Pllakat**            | `Pllaka1`              | Pllaka 1          |
| &nbsp;                 | `Pllaka2`              | Pllaka 2          |
| &nbsp;                 | `Pllaka3`              | Pllaka 3          |
| &nbsp;                 | `Pllaka4`              | Pllaka 4          |
| &nbsp;                 | `Pllaka5`              | Pllaka 5          |
| &nbsp;                 | `Pllaka6`              | Pllaka 6          |
| &nbsp;                 | `Pllaka7`              | Pllaka 7          |
| &nbsp;                 | &nbsp;                 | &nbsp;            |
| &nbsp;                 | &nbsp;                 | &nbsp;            |
| **Panelet & Dollapet** | `ClosetPineWood`       | Pine Wood         |
| &nbsp;                 | `ClosetOakWood`        | Oak Wood          |
| &nbsp;                 | `ClosetWhitePanels`    | White Panels      |
| **Baza e Sofas**       | `BazaSofaVariant`      | Variant 1         |
| &nbsp;                 | `BazaSofaVariant1`     | Variant 2         |
| &nbsp;                 | `BazaSofaVariant2`     | Variant 3         |
| **Tryezat**            | `Tryezari1`            | Tryezari 1        |
| &nbsp;                 | `Tryezari2`            | Tryezari 2        |
| &nbsp;                 | `Tryezari3`            | Tryezari 3        |
| &nbsp;                 | `Tryezari4`            | Tryezari 4        |
| **Krevatet**           | `Dyshat1`              | Dyshat 1          |
| &nbsp;                 | `Dyshat2`              | Dyshat 2          |
| &nbsp;                 | `Dyshat3``Dyshat4`    | Dyshat 3Dyshat 4 |


**3. Remove old categories** that are no longer in the data:

- Master Bed, Children Bed, Kitchen Table, Ndrysho Dritat — all removed
- Parketi loses "Ebony Parquet", gains "Juneda"

**4. Add new category icons**:

- Baza e Sofas → `Sofa` or similar icon
- Tryezat → `UtensilsCrossed` (reused from old Kitchen Table)
- Dyshat → `BedDouble` (reused from old Master Bed)

### File modified

- `src/components/interior/InteriorMaterialEditor.tsx`