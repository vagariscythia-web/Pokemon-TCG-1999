import os
import re
from PIL import Image

overlay_path = 'src/components/BattleFXOverlay.tsx'
with open(overlay_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Find all /assets/*.png references
asset_matches = sorted(list(set(re.findall(r'[\'"](/assets/[^\'"]+\.(?:png|jpg|webp))[\'"]', code))))
print(f"Total unique assets in BattleFXOverlay: {len(asset_matches)}")

results = []
for a in asset_matches:
    clean_path = os.path.join('public', a.lstrip('/'))
    if not os.path.exists(clean_path):
        results.append((a, "NOT FOUND", 0, 0, 0, 0, 0))
        continue
    try:
        im = Image.open(clean_path)
        bbox = im.getbbox() if im.mode in ('RGBA', 'LA') or 'transparency' in im.info else (0, 0, im.width, im.height)
        if bbox:
            cw = bbox[2] - bbox[0]
            ch = bbox[3] - bbox[1]
        else:
            cw, ch = im.width, im.height
        area_ratio = (cw * ch) / (im.width * im.height)
        results.append((a, im.size, bbox, cw, ch, area_ratio))
    except Exception as e:
        results.append((a, f"ERR: {e}", 0, 0, 0, 0))

print("\n--- ASSET CANVAS VS CONTENT BOUNDING BOX ---")
for r in results:
    if len(r) == 6:
        a, size, bbox, cw, ch, ratio = r
        warn = " *** LOW FILL (EMPTY MARGINS!) ***" if ratio < 0.5 else ""
        print(f"{a:40} | Canvas: {size[0]:4}x{size[1]:<4} | BBox: {cw:4}x{ch:<4} | Fill: {ratio:5.1%}{warn}")
    else:
        print(r)
