from PIL import Image
import os

files = [
    'public/assets/raw/Chansey_scrunch_edited.png',
    'public/assets/raw/Hitmonlee_highjumpkick_edited.png',
    'public/assets/raw/Hitmonlee_stretchkick_edited.png'
]

for f in files:
    if os.path.exists(f):
        img = Image.open(f)
        bbox = img.getbbox()
        alpha = img.split()[-1] if img.mode == 'RGBA' else None
        extrema = alpha.getextrema() if alpha else None
        print(f"File: {f}")
        print(f"  Mode: {img.mode}, Size: {img.size}, Bbox: {bbox}, Alpha Extrema: {extrema}")
    else:
        print(f"Not found: {f}")
