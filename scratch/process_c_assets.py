import os
from PIL import Image

raw_dir = 'public/assets/raw'
dest_dir = 'public/assets'

mappings = [
    ('Shellder_raw_edited.png', 'Shellder_Shell.png'),
    ('Horsea_raw_edited.png', 'Horsea_Snout.png'),
    ('Tentacool_raw_edited.png', 'Tentacool_Acid.png')
]

padding = 16

for src_name, dest_name in mappings:
    src_path = os.path.join(raw_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    im = Image.open(src_path).convert('RGBA')
    bbox = im.getbbox()
    if bbox:
        w, h = im.size
        crop_box = (
            max(0, bbox[0] - padding),
            max(0, bbox[1] - padding),
            min(w, bbox[2] + padding),
            min(h, bbox[3] + padding)
        )
        cropped = im.crop(crop_box)
        cropped.save(dest_path, 'PNG', optimize=True)
        print(f"Saved {dest_name}: Original BBox={bbox} -> Padded Size={cropped.size}")
    else:
        print(f"Error: No bbox for {src_name}")
