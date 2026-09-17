import os
import re

overlay_path = 'src/components/BattleFXOverlay.tsx'
with open(overlay_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

img_regex = re.compile(r'<img\s+[^>]*src=[\'"](/assets/[^\'"]+)[\'"]')
type_regex = re.compile(r"fx\.type\s*===\s*['\"]([^'\"]+)['\"]")

current_type = "unknown"
found_actors = []

for idx, line in enumerate(lines):
    line_no = idx + 1
    m_type = type_regex.search(line)
    if m_type:
        current_type = m_type.group(1)
    m_img = img_regex.search(line)
    if m_img:
        found_actors.append((line_no, current_type, m_img.group(1)))

print(f"Total active stock actors in BattleFXOverlay.tsx: {len(found_actors)}")
seen_assets = set()
for line_no, fx_t, src in found_actors:
    print(f"Line {line_no:5d} | Move: {fx_t:30s} | Asset: {src}")
    seen_assets.add(src)

print(f"\nUnique image assets referenced: {len(seen_assets)}")
