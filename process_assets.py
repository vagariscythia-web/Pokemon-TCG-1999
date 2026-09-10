"""
Pokemon TCG 1999 Asset Processing Pipeline
Automated Ken Sugimori Asset Background Removal & Quality Assurance
"""
from PIL import Image, ImageDraw
import numpy as np
import os

def process_sugimori_asset(
    input_path,
    output_path,
    thresh=32,
    internal_seeds=None,
    remove_bottom_shadow=False,
    shadow_y_start=800,
    clean_spark_halos=False
):
    """
    High-fidelity transparency pipeline for 1996 Ken Sugimori assets.
    1. Outer perimeter floodfill across 8 key boundary anchor points.
    2. Internal enclosed cavity floodfill (clears white paper trapped inside coils/limbs).
    3. Ground shadow & floor wash removal if character was drawn on a surface.
    4. Spark / filament halo de-fringing (removes paper fuzz around lightning/flames).
    5. Quality assurance alpha audit.
    """
    img = Image.open(input_path).convert('RGBA')
    w, h = img.size

    # 1. Perimeter floodfill from 8 exterior boundary anchors
    perimeter_pts = [
        (0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
        (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)
    ]
    for pt in perimeter_pts:
        try:
            ImageDraw.floodfill(img, pt, (0, 0, 0, 0), thresh=thresh)
        except Exception:
            pass

    # 2. Internal enclosed cavity clearing
    if internal_seeds:
        for seed in internal_seeds:
            try:
                ImageDraw.floodfill(img, seed, (0, 0, 0, 0), thresh=thresh - 5)
            except Exception:
                pass

    arr = np.array(img)

    # 3. Ground shadow removal
    if remove_bottom_shadow:
        for y in range(shadow_y_start, h):
            for x in range(w):
                if arr[y, x, 3] > 0:
                    r, g, b = int(arr[y,x,0]), int(arr[y,x,1]), int(arr[y,x,2])
                    is_shadow = abs(r - g) < 22 and abs(g - b) < 22 and r > 130 and r < 240
                    if is_shadow:
                        arr[y, x, 3] = 0

    # 4. Spark halo de-fringing (removes paper texture trapped in thin electrical arcs)
    if clean_spark_halos:
        for y in range(h):
            for x in range(w):
                if arr[y, x, 3] > 0:
                    r, g, b = int(arr[y,x,0]), int(arr[y,x,1]), int(arr[y,x,2])
                    if r > 225 and g > 225 and b > 215 and abs(r - g) < 20 and abs(g - b) < 20:
                        arr[y, x, 3] = 0

    result = Image.fromarray(arr)
    result.save(output_path, 'PNG')
    
    a0 = np.sum(arr[:, :, 3] == 0)
    pct = a0 / (w * h) * 100
    print(f"[OK] {os.path.basename(output_path):32s} -> Alpha 0%: {pct:5.1f}%")
    return pct

if __name__ == "__main__":
    print("Asset processing utility loaded.")
