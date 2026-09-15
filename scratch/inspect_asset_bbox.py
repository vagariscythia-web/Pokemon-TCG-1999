from PIL import Image
import os

assets = [
    'Weedle_Poison_Stinger.png',
    'Caterpie_Head_Osmeterium.png',
    'Pikachu_Spark_Cheeks.png',
    'Bulbasaur_Leech_Seed_Pod.png',
    'Charmander_Tail_Flame.png',
    'Sandshrew_Digging_Claws.png',
    'Cubone_Bone_Club.png',
    'Horsea_Snout.png',
    'Scyther_Scythe_Blade.png'
]

print(f"{'Asset':<32} | {'Image Size':<12} | {'Bbox Size':<14} | {'Fill W%':<8} | {'Fill H%':<8}")
print('-' * 85)

for a in assets:
    p = os.path.join('public/assets', a)
    if os.path.exists(p):
        im = Image.open(p)
        w, h = im.size
        bbox = im.getbbox()
        if bbox:
            bw = bbox[2] - bbox[0]
            bh = bbox[3] - bbox[1]
            fill_w = (bw / w) * 100
            fill_h = (bh / h) * 100
            print(f"{a:<32} | {w}x{h:<8} | {bw}x{bh:<10} | {fill_w:.1f}%   | {fill_h:.1f}%")
        else:
            print(f"{a:<32} | {w}x{h:<8} | Empty")
    else:
        print(f"{a:<32} | Not found")
