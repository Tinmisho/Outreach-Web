# Demo gallery photographs

The eight example websites in the "Built for real businesses" section each show one photograph in their
hero and one small photograph per priced item. Drop the originals in a folder — any size, any common
format — named after the slot, and run:

    python3 tools/demo_photos.py <that folder>

It centre-crops, resizes and writes the `.webp` files next to this README. A slot with no photograph
keeps the drawn artwork the gallery shipped with, so filling them in a few at a time is fine.

The hero wants a wide photograph (it is cropped to 480 × 360); the items are small squares-ish strips
(320 × 88), so something simple and close-up reads best.

| Slot | Photograph |
| --- | --- |
| `flowers` | a florist bench with wrapped bouquets |
| `flowers-1` `-2` `-3` | rose bouquet · peonies in a box · dried flowers |
| `restaurant` | a laid table on a terrace at dusk |
| `restaurant-1` `-2` `-3` | khachapuri · grilled trout · a glass of wine |
| `pizzeria` | a pizza coming out of a wood oven |
| `pizzeria-1` `-2` `-3` | margherita · diavola · calzone |
| `detailing` | a car being polished in a workshop |
| `detailing-1` `-2` `-3` | exterior wash · interior cleaning · a finished car |
| `bakery` | bread and pastry on a counter |
| `bakery-1` `-2` `-3` | croissant · sourdough loaf · cinnamon bun |
| `salon` | a hairdresser at the chair |
| `salon-1` `-2` `-3` | a haircut · colouring · a manicure |
| `guesthouse` | a sunlit room with an old-town window |
| `guesthouse-1` `-2` `-3` | a double room · a family room · a studio |
| `fitness` | weights and a bright training floor |
| `fitness-1` `-2` `-3` | the floor by the day · a membership card wall · a trainer with a client |

Licensing: only photographs we may publish — our own, a client's with their permission, or stock under
a licence that allows commercial use (Unsplash and Pexels both do). The businesses themselves are
invented, so the photographs should not show a recognisable real shopfront, sign or person's face.
