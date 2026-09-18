import os
import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_fx = 'UNKNOWN'
img_refs = []

for idx, line in enumerate(lines):
    fx_match = re.search(r"fx\.type === ['\"]([^'\"]+)['\"]", line)
    if fx_match:
        current_fx = fx_match.group(1)
    
    img_match = re.search(r"src=['\"](/assets/[^'\"]+)['\"]", line)
    if img_match:
        img_refs.append((idx + 1, current_fx, img_match.group(1)))

print(f"Total img refs in BattleFXOverlay: {len(img_refs)}")
by_asset = {}
for line_no, fx, asset in img_refs:
    by_asset.setdefault(asset, []).append((line_no, fx))

for asset in sorted(by_asset.keys()):
    locs = by_asset[asset]
    line_str = ', '.join(str(l[0]) for l in locs[:3])
    if len(locs) > 3:
        line_str += f", ... (+{len(locs)-3} more)"
    print(f"{asset} ({len(locs)} times): lines {line_str} (fx: {locs[0][1]})")
