import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Match each fx.type block
pattern = r"fx\.type === '([^']+)'(.*?)(?=\n\s*(?:\{fx\.type ===|\{\(fx\.type ===|export |const |function ))"
blocks = re.findall(pattern, content, re.DOTALL)

keywords = ['gas', 'smog', 'smoke', 'dust', 'powder', 'spore', 'fog', 'cloud', 'haze', 'vapor', 'sand', 'sludge', 'poison']
found = []

for fx_type, body in blocks:
    if any(k in fx_type for k in keywords):
        circles = re.findall(r'<circle[^>]+>', body)
        ellipses = re.findall(r'<ellipse[^>]+>', body)
        if circles or ellipses:
            found.append((fx_type, len(circles), len(ellipses), circles[:2], ellipses[:2]))

for fx_type, c_cnt, e_cnt, c_sample, e_sample in found:
    print(f"FX: {fx_type} -> circles: {c_cnt}, ellipses: {e_cnt}")
    for c in c_sample:
        print(f"   circle: {c.strip()}")
    for e in e_sample:
        print(f"   ellipse: {e.strip()}")
