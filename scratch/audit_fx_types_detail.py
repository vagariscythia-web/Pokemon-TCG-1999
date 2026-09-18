import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

fx_blocks = []
current_fx = None
start_line = 0
has_img = False
img_src = []
svg_tags = 0

for idx, line in enumerate(lines, 1):
    m = re.search(r"fx\.type === '([^']+)'", line)
    if m:
        if current_fx:
            fx_blocks.append({
                'name': current_fx,
                'start': start_line,
                'end': idx - 1,
                'has_img': has_img,
                'img_src': img_src,
                'svg_count': svg_tags
            })
        current_fx = m.group(1)
        start_line = idx
        has_img = False
        img_src = []
        svg_tags = 0
    elif current_fx:
        if '<img' in line:
            has_img = True
            img_m = re.search(r'src="([^"]+)"', line)
            if img_m:
                img_src.append(img_m.group(1))
        if '<svg' in line:
            svg_tags += 1

if current_fx:
    fx_blocks.append({
        'name': current_fx,
        'start': start_line,
        'end': len(lines),
        'has_img': has_img,
        'img_src': img_src,
        'svg_count': svg_tags
    })

print(f"Total FX type blocks found in JSX: {len(fx_blocks)}")

stock_blocks = [b for b in fx_blocks if b['has_img']]
svg_only_blocks = [b for b in fx_blocks if not b['has_img'] and b['svg_count'] > 0]
other_blocks = [b for b in fx_blocks if not b['has_img'] and b['svg_count'] == 0]

print(f"Stock image based FX: {len(stock_blocks)}")
print(f"Pure SVG based FX: {len(svg_only_blocks)}")
print(f"Other (CSS only / fallbacks): {len(other_blocks)}")

print("\n=== SAMPLE SVG-ONLY BLOCKS (POTENTIAL UPGRADE / SVG POLISH CANDIDATES) ===")
for b in svg_only_blocks[:30]:
    print(f"Line {b['start']:5d}-{b['end']:5d} | {b['name']:30} | svgs: {b['svg_count']}")
