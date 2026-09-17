import re
import os
from PIL import Image

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Find all blocks with <img src="/assets/...
pattern = re.compile(r'fx\.type === [\'"]([^\'"]+)[\'"][\s\S]*?<img\s+[^>]*src=["\']/assets/([^"\']+)["\']', re.MULTILINE)

# Let's search by section in BattleFXOverlay
sections = re.findall(r'(\{[^}]*fx\.type === [\'"]([^\'"]+)[\'"][\s\S]*?\{/\* End|\n\s*\{/\* \d+|\n\s*\{fx\.type ===)', code)

# Let's find every unique asset in /assets/ used by an fx.type
matches = re.findall(r'fx\.type === [\'"]([^\'"]+)[\'"][\s\S]{1,1200}?<img[^>]*src=[\'"]/assets/([^\'"]+)[\'"]', code)

print(f"Found {len(matches)} matches:")
seen = set()
for fx_type, asset in matches:
    if asset in seen or 'icon_' in asset or 'coin_' in asset or 'energy_' in asset or 'card_back' in asset:
        continue
    seen.add(asset)
    
    # find width & height around this asset
    idx = code.find(asset)
    sub = code[max(0, idx-600):idx+400]
    w = re.findall(r'width:\s*([^,\n}]+)', sub)
    h = re.findall(r'height:\s*([^,\n}]+)', sub)
    
    img_path = os.path.join('public/assets', asset)
    im_size = "N/A"
    if os.path.exists(img_path):
        im = Image.open(img_path)
        im_size = f"{im.size[0]}x{im.size[1]}"
        
    width_str = w[-1].strip() if w else "N/A"
    height_str = h[-1].strip() if h else "N/A"
    print(f"FX: {fx_type:<24} | Asset: {asset:<30} | Img: {im_size:<10} | CSS W: {width_str:<25} | CSS H: {height_str:<25}")
