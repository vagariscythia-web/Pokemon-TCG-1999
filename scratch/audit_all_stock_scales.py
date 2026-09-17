import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

lines = code.splitlines()

# find all img tags with /assets/
pattern = re.compile(r'<img\s+[^>]*src=["\']/assets/([^"\']+)["\'][^>]*>', re.MULTILINE | re.DOTALL)

for m in pattern.finditer(code):
    asset_name = m.group(1)
    if 'card_back' in asset_name or 'coin_' in asset_name or 'energy_' in asset_name or 'icon_' in asset_name:
        continue
    start_pos = m.start()
    line_no = code[:start_pos].count('\n') + 1
    # look backwards ~2000 chars
    prev_chunk = code[max(0, start_pos - 2000):start_pos]
    
    fx_match = re.findall(r'fx\.type === [\'"]([^\'"]+)[\'"]', prev_chunk)
    fx_type = fx_match[-1] if fx_match else "unknown"
    
    # look backwards for the immediate parent div with width/height
    w_match = re.findall(r'width:\s*([^,\n}]+)', prev_chunk)
    h_match = re.findall(r'height:\s*([^,\n}]+)', prev_chunk)
    width = w_match[-1].strip() if w_match else "N/A"
    height = h_match[-1].strip() if h_match else "N/A"
    
    print(f"Line {line_no:5d} | FX: {fx_type:24s} | Asset: {asset_name:32s} | Width: {width:25s} | Height: {height:25s}")
