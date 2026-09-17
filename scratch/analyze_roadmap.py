import json
import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

# Unique basic pokemon attacks
basic_cards = [c for c in cards if c.get('subtype') == 'Basic']
pkm_attacks = {}
for c in basic_cards:
    pname = c.get('name')
    for a in c.get('attacks', []):
        aname = a.get('name')
        if pname not in pkm_attacks:
            pkm_attacks[pname] = set()
        pkm_attacks[pname].add(aname)

# Let's inspect which moves use stock png assets in BattleFXOverlay
fx_with_stock = set()
for match in re.finditer(r"fx\.type === '([^']+)'", tsx):
    m_name = match.group(1)
    pos = match.start()
    end_pos = tsx.find('fx.type ===', pos + 20)
    sub = tsx[pos:end_pos if end_pos != -1 else pos + 4000]
    if '.png' in sub or '.jpg' in sub:
        fx_with_stock.add(m_name)

print(f"Total fx types with stock assets in code: {len(fx_with_stock)}")

# Check which of the 75 Basic Pokemon have signature FX with stock assets
stock_pkm = set()
svg_pkm = set()
generic_pkm = set()

for p, atts in sorted(pkm_attacks.items()):
    p_lower = p.lower()
    has_stock = False
    has_custom_svg = False
    for a in atts:
        # Check if p_lower has a dedicated dispatch in BattleFXOverlay
        matches = re.findall(rf"pkm\.includes\('{p_lower}'\)[^}}]*return '([^']+)'", tsx)
        for fx_type in matches:
            if fx_type in fx_with_stock:
                has_stock = True
            else:
                has_custom_svg = True
    if has_stock:
        stock_pkm.add(p)
    elif has_custom_svg:
        svg_pkm.add(p)
    else:
        generic_pkm.add(p)

print(f"\n1. Basic Pokemon with Dedicated Stock Assets ({len(stock_pkm)}):")
for p in sorted(stock_pkm):
    print(f"   - {p}")

print(f"\n2. Basic Pokemon with Bespoke 5-Layer SVG ({len(svg_pkm)}):")
for p in sorted(svg_pkm):
    print(f"   - {p}")

print(f"\n3. Basic Pokemon using Shared/Generic fallbacks ({len(generic_pkm)}):")
for p in sorted(generic_pkm):
    print(f"   - {p}: {list(pkm_attacks[p])}")
