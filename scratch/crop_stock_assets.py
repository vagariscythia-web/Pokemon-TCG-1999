import os
import shutil
from PIL import Image

TARGET_ASSETS = [
    'Pinsir_Horn_Left.png',
    'Pinsir_Horn_Right.png',
    'Alakazam_Psychic_Spoons.png',
    'Exeggutor_Coconut_Bomb.png',
    'Koffing_Foul_Gas.png',
    'Gengar_Dark_Mind.png',
    'Starmie_Star_Freeze.png',
    'Rhydon_Horn_Drill.png',
    'Machamp_Karate_Chop.png',
    'Clefairy_Metronome_Finger.png',
    'Jigglypuff_Lullaby_Notes.png',
    'Lickitung_Tongue_Wrap.png',
    'Bulbasaur_Leech_Seed_Pod.png',
    'Charmander_Tail_Flame.png'
]

raw_dir = 'public/assets/raw'
assets_dir = 'public/assets'

print(f"Processing {len(TARGET_ASSETS)} assets for tight cropping...")

for filename in TARGET_ASSETS:
    src_path = os.path.join(assets_dir, filename)
    if not os.path.exists(src_path):
        print(f"SKIP (not found): {filename}")
        continue
    
    # 1. Backup original to raw/ if not already backed up
    raw_backup = os.path.join(raw_dir, f"{os.path.splitext(filename)[0]}_orig.png")
    if not os.path.exists(raw_backup):
        shutil.copy2(src_path, raw_backup)
        print(f"Backed up {filename} to {raw_backup}")
    
    # 2. Open image and compute bounding box
    im = Image.open(src_path)
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    
    bbox = im.getbbox()
    if not bbox:
        print(f"SKIP (empty image): {filename}")
        continue
    
    # Safety margin: 16px around content
    margin = 16
    left = max(0, bbox[0] - margin)
    top = max(0, bbox[1] - margin)
    right = min(im.width, bbox[2] + margin)
    bottom = min(im.height, bbox[3] + margin)
    
    old_size = im.size
    cropped = im.crop((left, top, right, bottom))
    new_size = cropped.size
    
    # Save cropped image back
    cropped.save(src_path, "PNG")
    print(f"CROPPED {filename:30} : {old_size[0]}x{old_size[1]} -> {new_size[0]}x{new_size[1]} (BBox was {bbox})")

print("\nCropping complete!")
