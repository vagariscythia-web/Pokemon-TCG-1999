import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Split into fx.type blocks
blocks = re.split(r"(\{\s*fx\.type\s*===?\s*['\"][^'\"]+['\"])", text)

print(f"Total blocks detected: {len(blocks)//2}")

crude_fx = []

for i in range(1, len(blocks), 2):
    header = blocks[i]
    body = blocks[i+1] if i+1 < len(blocks) else ""
    fx_name = re.search(r"['\"]([^'\"]+)['\"]", header).group(1)
    
    # Check if this block contains cloud/smoke/gas/dust/spore terms
    is_gas_related = any(k in fx_name or k in body[:200].lower() for k in [
        'smog', 'smoke', 'gas', 'dust', 'powder', 'spore', 'vapor', 'cloud', 'haze', 'sand', 'puff', 'odor'
    ])
    
    if is_gas_related:
        # Check how clouds are drawn
        has_raw_circles = bool(re.search(r'<circle\s+cx=[^>]+r="[1-9]\d"', body)) # circles with radius >= 10 (big clumpy circles)
        has_raw_ellipses = bool(re.search(r'<ellipse\s+cx=[^>]+rx="[1-9]\d"', body))
        has_blur = 'blur' in body
        has_organic_path = bool(re.search(r'<path\s+d="[^"]*[CcQq]', body))
        
        crude_score = 0
        reasons = []
        if has_raw_circles:
            reasons.append("Raw large SVG circles (clumpy balls)")
            crude_score += 2
        if has_raw_ellipses and not has_blur:
            reasons.append("Raw SVG ellipses without blur")
            crude_score += 1
        if not has_blur and not has_organic_path:
            reasons.append("No blur and no organic path curves")
            crude_score += 1
            
        if crude_score > 0:
            crude_fx.append((fx_name, reasons, body[:300]))

print(f"\nIdentified {len(crude_fx)} animations with crude/unnatural particle/cloud primitives:")
for name, reasons, preview in crude_fx:
    print(f"\n[FX: {name}]")
    for r in reasons:
        print(f"  - {r}")
