import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

with open('src/index.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# 1. Find all img tags and which FX type they belong to
pattern = r"\{fx\.type === '([^']+)'\s*&& \((.*?)(?=\n\s*\{fx\.type ===|\n\s*\{\(fx\.type ===|\n\s*export |\n\s*const |\n\s*function )"
blocks = re.findall(pattern, content, re.DOTALL)

print("=== 1. FX USING IMAGES ===")
for fx_type, body in blocks:
    imgs = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*>', body)
    if imgs:
        print(f"FX: {fx_type} -> images: {imgs}")
        anims = re.findall(r"animation:\s*['\"`]?([a-zA-Z0-9_\-]+)", body)
        print(f"   animations: {set(anims)}")

print("\n=== 2. ALL DUST / SMOKE / CLOUD / GAS / SPORE / POWDER / FOG / EMBER FX ===")
keywords = ['dust', 'smoke', 'cloud', 'gas', 'spore', 'powder', 'fog', 'haze', 'vapor', 'sand', 'ember', 'flame', 'sludge', 'wind']
for fx_type, body in blocks:
    if any(k in fx_type for k in keywords):
        anims = re.findall(r"animation:\s*['\"`]?([a-zA-Z0-9_\-]+)", body)
        imgs = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*>', body)
        has_svg = '<svg' in body
        print(f"FX: {fx_type} | images: {len(imgs)} | svg: {has_svg} | anims: {len(anims)} -> {list(set(anims))[:4]}")

