# Demo gallery photographs

The eight example websites in the "Built for real businesses" section each show a hero photograph, one
photograph per item on offer (six) and one beside their "about" text — 64 in all. Drop the originals in a
folder, any size and any common format, named after the slot, and run:

    python3 tools/demo_photos.py <that folder>

It centre-crops, resizes and writes the `.webp` files next to this README (hero 1100×990, items 760×570,
about 1100×880). A slot with no photograph shows a plain frame in the brand's colours, so the slots can be
filled a few at a time.

| Slot | Photograph |
| --- | --- |
| `flowers` | a florist bench with wrapped bouquets |
| `flowers-1` … `-6` | rose bouquet · peony box · dried bunch · tulip armful · wedding posy · plant of the month |
| `flowers-about` | hands wrapping a bouquet |
| `restaurant` | a laid table on a terrace at dusk, old-town view |
| `restaurant-1` … `-6` | Khachapuri · grilled trout · glass of wine · pkhali trio · Mtsvadi · churchkhela sundae |
| `restaurant-about` | a cook at a clay oven or grill |
| `pizzeria` | a pizza coming out of a wood oven |
| `pizzeria-1` … `-6` | Margherita · Diavola · Calzone · quattro formaggi · Funghi · Tiramisu |
| `pizzeria-about` | dough being stretched |
| `detailing` | a car being polished in a workshop |
| `detailing-1` … `-6` | exterior wash · interior clean · full detail · paint correction · ceramic coating · headlight restore |
| `detailing-about` | close-up of polish on paint |
| `bakery` | bread and pastry on a counter |
| `bakery-1` … `-6` | croissant · sourdough loaf · cinnamon bun · flat white · Penovani · seed rye |
| `bakery-about` | a baker shaping loaves |
| `salon` | a hairdresser at the chair |
| `salon-1` … `-6` | haircut · colour · manicure · balayage · blow-dry · brows & lashes |
| `salon-about` | a stylist mid-cut, face not shown |
| `guesthouse` | a sunlit room with a carved wooden balcony |
| `guesthouse-1` … `-6` | double room · family room · studio · single room · balcony suite · airport pickup |
| `guesthouse-about` | an old Tbilisi street or balcony |
| `fitness` | a bright training floor with barbells |
| `fitness-1` … `-6` | day pass · monthly pass · personal training · strength · conditioning · mobility |
| `fitness-about` | a coach spotting a lift |

Licensing: only photographs we may publish — our own, a client's with their permission, or stock under a
licence that allows commercial use without attribution (the Unsplash and Pexels licences both do). Keep a
note of each photo's source page in `SOURCES.md` here all the same. The businesses are invented, so the
photographs should not show a recognisable real shopfront, sign or person's face.
