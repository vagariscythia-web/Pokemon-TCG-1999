from PIL import Image
import os

files_to_crop = [
    ('public/assets/raw/Chansey_scrunch_edited.png', 'public/assets/Chansey_Scrunch.png'),
    ('public/assets/raw/Hitmonlee_highjumpkick_edited.png', 'public/assets/Hitmonlee_High_Jump_Kick.png'),
    ('public/assets/raw/Hitmonlee_stretchkick_edited.png', 'public/assets/Hitmonlee_Stretch_Kick.png')
]

for src, dst in files_to_crop:
    img = Image.open(src)
    bbox = img.getbbox()
    margin = 16
    crop_box = (
        max(0, bbox[0] - margin),
        max(0, bbox[1] - margin),
        min(img.width, bbox[2] + margin),
        min(img.height, bbox[3] + margin)
    )
    cropped = img.crop(crop_box)
    cropped.save(dst, format='PNG')
    print(f"Saved {dst}: {cropped.size} (from {img.size})")
