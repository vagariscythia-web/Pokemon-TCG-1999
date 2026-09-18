import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    overlay_content = f.read()
    lines = overlay_content.splitlines()

# Extract all fx.type blocks in JSX
# Each block starts with fx.type === '...'
blocks = []
pattern = re.compile(r"fx\.type === ['\"]([^'\"]+)['\"]")

current_block = None
for idx, line in enumerate(lines):
    m = pattern.search(line)
    if m:
        fx_name = m.group(1)
        if current_block:
            current_block['end_line'] = idx
            blocks.append(current_block)
        current_block = {
            'name': fx_name,
            'start_line': idx + 1,
            'end_line': len(lines),
            'has_img': False,
            'has_svg': False,
            'img_sources': [],
            'comments': []
        }
    if current_block:
        if '<img' in line:
            current_block['has_img'] = True
            src_m = re.search(r"src=[\'\"]([^\'\"]+)[\'\"]", line)
            if src_m:
                current_block['img_sources'].append(src_m.group(1))
            var_src_m = re.search(r"src=\{([^\}]+)\}", line)
            if var_src_m:
                current_block['img_sources'].append(f"{{{var_src_m.group(1)}}}")
        if '<svg' in line:
            current_block['has_svg'] = True
        comment_m = re.search(r"\{/\*\s*(.*?)\s*\*/\}", line)
        if comment_m:
            current_block['comments'].append(comment_m.group(1))

if current_block:
    blocks.append(current_block)

print(f"Total unique JSX FX blocks: {len(blocks)}")

# Let's categorize them
pure_svg = []
with_img = []
both = []
neither = []

for b in blocks:
    if b['has_img'] and b['has_svg']:
        both.append(b)
    elif b['has_img']:
        with_img.append(b)
    elif b['has_svg']:
        pure_svg.append(b)
    else:
        neither.append(b)

print(f"Blocks with Stock Img + SVG: {len(both)}")
print(f"Blocks with Stock Img only: {len(with_img)}")
print(f"Blocks with Pure SVG: {len(pure_svg)}")
print(f"Blocks with Neither (CSS/Div only): {len(neither)}")

print("\n--- SAMPLE PURE SVG ATTACKS ---")
for b in pure_svg[:25]:
    comment_title = b['comments'][0] if b['comments'] else ""
    print(f"- {b['name']} (L{b['start_line']}): {comment_title}")

print("\n--- SAMPLE STOCK IMG ATTACKS ---")
for b in (both + with_img)[:25]:
    srcs = ', '.join(b['img_sources'])
    comment_title = b['comments'][0] if b['comments'] else ""
    print(f"- {b['name']} (L{b['start_line']}): imgs=[{srcs}] {comment_title}")
