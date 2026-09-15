from PIL import Image
import os

assets = {
    'Weedle': ('Weedle_Poison_Stinger.png', 110, 110),
    'Caterpie': ('Caterpie_Head_Osmeterium.png', 110, 110),
    'Pikachu': ('Pikachu_Spark_Cheeks.png', 120, 120),
    'Bulbasaur': ('Bulbasaur_Leech_Seed_Pod.png', 98, 98),
    'Charmander': ('Charmander_Tail_Flame.png', 110, 110),
    'Sandshrew': ('Sandshrew_Digging_Claws.png', 110, 110),
    'Cubone': ('Cubone_Bone_Club.png', 120, 120),
    'Horsea (New)': ('Horsea_Snout.png', 80, 64),
    'Scyther': ('Scyther_Scythe_Blade.png', 108, 76),
    'Gyarados': ('Gyarados_Dragon_Rage.png', 108, 108),
}

print(f"{'Pokemon':<14} | {'CSS Box':<10} | {'Render WxH':<12} | {'Solid Ratio':<12} | {'Solid Area px2':<14}")
print('-' * 75)

for name, (fname, css_w, css_h) in assets.items():
    p = os.path.join('public/assets', fname)
    if os.path.exists(p):
        im = Image.open(p).convert('RGBA')
        w, h = im.size
        alpha = im.split()[-1]
        solid_pixels = sum(1 for a in alpha.getdata() if a > 30)
        total_pixels = w * h
        solid_ratio = solid_pixels / total_pixels
        
        img_aspect = w / h
        box_aspect = css_w / css_h
        if img_aspect > box_aspect:
            render_w = css_w
            render_h = css_w / img_aspect
        else:
            render_h = css_h
            render_w = css_h * img_aspect
            
        rendered_solid_area = (render_w * render_h) * solid_ratio
        
        print(f"{name:<14} | {css_w}x{css_h:<6} | {render_w:4.0f}x{render_h:<5.0f} | {solid_ratio*100:8.1f}%   | {rendered_solid_area:8.0f} px2")
    else:
        print(f"{name:<14} | Not found")
