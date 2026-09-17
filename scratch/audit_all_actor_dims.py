import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Find all occurrences of src="/assets/*.png"
matches = list(re.finditer(r'<img\s+[^>]*src=["\']/assets/([^"\']+\.png)["\'][^>]*>', code))

print(f"Total img usages: {len(matches)}")

seen = set()
for m in matches:
    asset = m.group(1)
    if 'card_back' in asset or 'coin_' in asset or 'energy_' in asset or 'icon_' in asset:
        continue
    start = m.start()
    line_no = code[:start].count('\n') + 1
    
    # context around the img (backward 30 lines)
    prev_lines = code[:start].splitlines()[-30:]
    prev_text = "\n".join(prev_lines)
    
    # look for fx.type
    fx_types = re.findall(r'fx\.type === [\'"]([^\'"]+)[\'"]', prev_text)
    fx_type = fx_types[-1] if fx_types else "unknown"
    
    # look for width / height in style or className
    w_style = re.findall(r'width:\s*([^,\n}]+)', prev_text)
    h_style = re.findall(r'height:\s*([^,\n}]+)', prev_text)
    
    tw_classes = re.findall(r'className=["\']([^"\']*(?:w-\[?\d+|h-\[?\d+)[^"\']*)["\']', prev_text)
    
    key = (fx_type, asset)
    if key in seen:
        continue
    seen.add(key)
    
    dim = ""
    if w_style and h_style:
        dim = f"style: {w_style[-1].strip()} x {h_style[-1].strip()}"
    elif tw_classes:
        dim = f"class: {tw_classes[-1]}"
    else:
        dim = "unknown"
        
    print(f"Line {line_no:5d} | {fx_type:<25} | {asset:<30} | {dim}")
