import re
import os

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all fx.type === '...'
fx_types = re.findall(r"fx\.type\s*===\s*'([^']+)'", content)
unique_fx = sorted(list(set(fx_types)))
print(f"Total unique fx.type branches: {len(unique_fx)}")

# Find all comments with numbered moves like {/* 1. ... */} or {/* 15c. ... */}
move_sections = re.findall(r"\{/\*\s*(\d+[a-z]?\.\s*[A-Z\s_\-\(\)—]+)\s*\*/\}", content)
print(f"Total numbered move sections: {len(move_sections)}")

# Split content by fx.type === '...'
blocks = re.split(r"fx\.type\s*===\s*'([^']+)'", content)

results = []
# blocks[0] is header, then pairs of (type, block_content)
for i in range(1, len(blocks), 2):
    fx_name = blocks[i]
    body = blocks[i+1][:3000] # truncate to reasonable length
    
    # Check what visual elements are in body
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', body)
    svg_paths = len(re.findall(r'<path', body))
    svg_polygons = len(re.findall(r'<polygon', body))
    has_img = len(imgs) > 0
    
    # Check animation names used
    anims = re.findall(r'animation:\s*[`\'"]([a-zA-Z0-9_]+)', body)
    
    results.append({
        'name': fx_name,
        'has_img': has_img,
        'imgs': imgs,
        'svg_paths': svg_paths,
        'svg_polygons': svg_polygons,
        'anims': anims
    })

print(f"{'FX Name':35} | {'Type':10} | {'Images':30} | {'Animations'}")
print("-" * 110)
for r in results:
    img_str = ", ".join(r['imgs']) if r['imgs'] else "Pure SVG/CSS"
    anim_str = ", ".join(r['anims'][:3])
    t = "STOCK IMG" if r['has_img'] else "SVG/CSS"
    print(f"{r['name']:35} | {t:10} | {img_str[:30]:30} | {anim_str}")
