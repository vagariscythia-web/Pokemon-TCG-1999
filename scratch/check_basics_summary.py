import json
import re

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

basic_pkm = {}
for c in cards:
    p_set = str(c.get('set', ''))
    p_super = str(c.get('supertype', ''))
    p_sub = str(c.get('subtype', ''))
    p_name = c.get('name')
    if any(s in p_set for s in ['Base', 'Jungle', 'Fossil']) and p_super == 'Pokemon' and p_sub == 'Basic':
        if p_name not in basic_pkm:
            basic_pkm[p_name] = [a.get('name') for a in c.get('attacks', []) if a.get('name')]

print(f"Total Unique Basic Pokemon in Base/Jungle/Fossil: {len(basic_pkm)}")

# Categorize them
has_stock_img = []
has_bespoke_svg = []
uses_generic = []

for name, attacks in sorted(basic_pkm.items()):
    clean = name.lower()
    # Check if there is an image in public/assets or BattleFXOverlay matching this pokemon
    # Find all occurrences of clean in BattleFXOverlay
    matches = [m.start() for m in re.finditer(rf"\b{re.escape(clean)}\b", tsx.lower())]
    
    # Check if any img tag is associated with this pokemon in BattleFXOverlay
    has_img = False
    for m in matches:
        snippet = tsx[max(0, m-200):min(len(tsx), m+500)]
        if '<img' in snippet or '.png' in snippet:
            has_img = True
            break
            
    # Also check if image exists in public/assets
    import os
    assets_match = [a for a in os.listdir('public/assets') if clean in a.lower()]
    
    if has_img or assets_match:
        has_stock_img.append((name, attacks, assets_match))
    elif matches:
        has_bespoke_svg.append((name, attacks))
    else:
        uses_generic.append((name, attacks))

print(f"\n1. HAS STOCK IMAGE ({len(has_stock_img)}):")
for n, a, imgs in has_stock_img:
    print(f"  - {n:<14} | Attacks: {', '.join(a):<30} | Imgs: {imgs}")

print(f"\n2. HAS BESPOKE SVG ({len(has_bespoke_svg)}):")
for n, a in has_bespoke_svg:
    print(f"  - {n:<14} | Attacks: {', '.join(a)}")

print(f"\n3. USES GENERIC FALLBACKS / NOT BESPOKE ({len(uses_generic)}):")
for n, a in uses_generic:
    print(f"  - {n:<14} | Attacks: {', '.join(a)}")
