#!/usr/bin/env python3
"""Turn a folder of photographs into the demo-gallery images.

The eight example websites in site-src/industries.js each show one photograph in their hero and one
small photograph per priced item. This script does the cropping, resizing and webp conversion, so the
only manual step is dropping the originals in a folder, named after the slot they belong to:

    flowers.jpg  flowers-1.jpg  flowers-2.jpg  flowers-3.jpg
    restaurant.jpg  restaurant-1.jpg  ...

Any extension Pillow reads works. The slots and the subject each one wants are listed in
public/img/demos/README.md. Run it with the folder of originals:

    python3 tools/demo_photos.py ~/Pictures/outreach-demos

It writes public/img/demos/<slot>.webp and never touches a slot it has no original for: the gallery
falls back to its drawn artwork for whatever is missing, so a half-filled folder is fine.
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "img" / "demos"
IDS = ["flowers", "restaurant", "pizzeria", "detailing", "bakery", "salon", "guesthouse", "fitness"]
HERO = (480, 360)      # the hero slot measures about 169x127 on a laptop, so this is a little under 3x
THUMB = (320, 88)      # the item thumbnails are about 96x25
READS = (".jpg", ".jpeg", ".png", ".webp", ".heic", ".tif", ".tiff", ".bmp", ".avif")


def slots():
    for i in IDS:
        yield i, HERO
        for n in (1, 2, 3):
            yield f"{i}-{n}", THUMB


def find(src: Path, slot: str):
    for ext in READS:
        for name in (slot + ext, slot + ext.upper()):
            if (src / name).exists():
                return src / name
    return None


def fit(im: Image.Image, size: tuple) -> Image.Image:
    """Centre-crop to the target aspect, then resize."""
    tw, th = size
    w, h = im.size
    want = tw / th
    have = w / h
    if have > want:                       # too wide: trim the sides
        nw = round(h * want)
        box = ((w - nw) // 2, 0, (w - nw) // 2 + nw, h)
    else:                                 # too tall: trim top and bottom, a little above centre
        nh = round(w / want)
        top = round((h - nh) * 0.4)
        box = (0, top, w, top + nh)
    return im.resize(size, Image.LANCZOS, box=box)


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    src = Path(sys.argv[1]).expanduser()
    if not src.is_dir():
        print(f"not a folder: {src}")
        return 2
    OUT.mkdir(parents=True, exist_ok=True)
    done = missing = 0
    for slot, size in slots():
        found = find(src, slot)
        if not found:
            missing += 1
            continue
        with Image.open(found) as im:
            im = im.convert("RGB")
            fit(im, size).save(OUT / f"{slot}.webp", "WEBP", quality=78, method=6)
        done += 1
    print(f"{done} written to {OUT}, {missing} slot(s) still without a photograph")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
