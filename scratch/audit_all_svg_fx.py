import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

fx_blocks = []
current_fx = None
current_code = []

for i, line in enumerate(lines, 1):
    m = re.search(r"\{\s*fx\.type === '([^']+)'\s*&&", line)
    if m:
        if current_fx:
            fx_blocks.append((current_fx, "".join(current_code)))
        current_fx = (m.group(1), i)
        current_code = [line]
    elif current_fx:
        current_code.append(line)

if current_fx:
    fx_blocks.append((current_fx, "".join(current_code)))

print(f"Total FX render blocks: {len(fx_blocks)}")

# Let's inspect procedural/SVG ones specifically (those NOT using <img src=...)
# and see which ones use raw <line>, raw <path> without gradients, simple borders, or basic symbols
suspicious = []
for (name, line_no), code in fx_blocks:
    has_img = '<img' in code
    has_raw_line = '<line' in code
    has_emojis = any(c in code for c in ['💢', '⚡', '🚫', '💤', '💥', '✨', '💫', '❓', '❗', '💨'])
    has_basic_border = 'border-2' in code or 'border-4' in code or 'border-dashed' in code
    has_polyline = '<polyline' in code
    
    # Check for quality markers:
    has_gradient = 'linearGradient' in code or 'radialGradient' in code or 'linear-gradient' in code or 'radial-gradient' in code
    has_glow = 'drop-shadow' in code or 'boxShadow' in code or 'box-shadow' in code
    
    # Let's record details
    suspicious.append({
        'name': name,
        'line': line_no,
        'has_img': has_img,
        'has_raw_line': has_raw_line,
        'has_emojis': has_emojis,
        'has_polyline': has_polyline,
        'has_basic_border': has_basic_border,
        'code_len': len(code),
        'code': code
    })

# Let's inspect Vaporeon quick attack specifically first:
for item in suspicious:
    if 'quick_attack' in item['name'] or 'vaporeon' in item['name']:
        print(f"\n=== FOUND: {item['name']} at line {item['line']} ===")
        print(item['code'][:1000])
