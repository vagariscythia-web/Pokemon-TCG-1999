import json
import re
import sys

# 1. Parse BattleFXOverlay.tsx to find all fx blocks and their img tags
with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    bfx_text = f.read()

lines = bfx_text.splitlines()

# Find all blocks of fx.type === '...'
fx_blocks = []
pattern = re.compile(r"fx\.type === ['\"]([a-zA-Z0-9_]+)['\"]")

# Let's find every occurrence of fx.type === 'something'
for i, line in enumerate(lines, start=1):
    m = pattern.search(line)
    if m:
        fx_blocks.append((i, m.group(1), line.strip()))

print(f"Total fx.type occurrences in JSX: {len(fx_blocks)}")

# Let's map lines to fx types
# We can find all <img tags and associate them with the nearest enclosing fx.type
img_pattern = re.compile(r'<img\s+[^>]*?src=(?:["\']([^"\']+)["\']|\{`([^`]+)`\}|\{([^}]+)\})[^>]*?>', re.DOTALL)

img_details = []
for m in img_pattern.finditer(bfx_text):
    start_pos = m.start()
    line_no = bfx_text[:start_pos].count('\n') + 1
    src = m.group(1) or m.group(2) or m.group(3)
    img_tag = m.group(0).replace('\n', ' ')
    
    # find which fx.type this line is inside
    current_fx = None
    for fx_line, fx_name, _ in fx_blocks:
        if fx_line <= line_no:
            current_fx = (fx_line, fx_name)
        else:
            break
    
    img_details.append({
        'line': line_no,
        'src': src,
        'fx_type': current_fx[1] if current_fx else 'unknown',
        'fx_start_line': current_fx[0] if current_fx else 0,
        'tag_snippet': img_tag[:80]
    })

print(f"Total img tags found: {len(img_details)}")

# Distinct fx_types using stock images:
stock_fx_types = {}
for item in img_details:
    t = item['fx_type']
    if t not in stock_fx_types:
        stock_fx_types[t] = []
    stock_fx_types[t].append((item['line'], item['src']))

print(f"Number of fx.types with stock images: {len(stock_fx_types)}")
for t, usages in sorted(stock_fx_types.items()):
    srcs = ', '.join(f"{u[1]} (L{u[0]})" for u in usages)
    print(f"  {t}: {srcs}")

