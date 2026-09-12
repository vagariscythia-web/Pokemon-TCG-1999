import os
import re
from PIL import Image

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

img_blocks = []
current_fx = "unknown"

for i, line in enumerate(lines):
    fx_match = re.search(r"fx\.type === ['\"]([^'\"]+)['\"]", line)
    if fx_match:
        current_fx = fx_match.group(1)
    
    if "<img" in line:
        start = max(0, i - 3)
        end = min(len(lines), i + 9)
        block = "".join(lines[start:end])
        src_match = re.search(r"src=['\"]([^'\"]+)['\"]", block)
        class_match = re.search(r"className=\{?`?(['\"a-zA-Z0-9_\-\s\$\{\}\:\.\[\]\(\)\<\>\?\/\#\,\@]+)`?\}?", block)
        img_blocks.append({
            'line': i + 1,
            'fx': current_fx,
            'src': src_match.group(1) if src_match else 'unknown',
            'block': block
        })

out_lines = []
out_lines.append(f"Total img tags: {len(img_blocks)}\n")

for item in img_blocks:
    block = item['block']
    sizes = re.findall(r"(w-\d+|h-\d+|w-\[[^\]]+\]|h-\[[^\]]+\]|width:\s*['\"][^'\"]+['\"]|height:\s*['\"][^'\"]+['\"])", block)
    whiffed = "whiffed" in block or "isWhiffed" in block or "fx.whiffed" in block
    src_base = os.path.basename(item['src'])
    
    # Check physical asset
    clean_path = os.path.join('public', item['src'].lstrip('/'))
    asset_info = ""
    if os.path.exists(clean_path):
        try:
            im = Image.open(clean_path)
            bbox = im.getbbox() if im.mode in ('RGBA', 'LA') or 'transparency' in im.info else (0, 0, im.width, im.height)
            if bbox:
                cw = bbox[2] - bbox[0]
                ch = bbox[3] - bbox[1]
            else:
                cw, ch = im.width, im.height
            ratio = (cw * ch) / (im.width * im.height)
            asset_info = f"Canvas:{im.size[0]}x{im.size[1]} BBox:{cw}x{ch} Fill:{ratio:.1%}"
        except Exception as e:
            asset_info = f"ERR:{e}"
    else:
        asset_info = "FILE NOT FOUND"

    out_lines.append(f"L{item['line']:5} | FX:{item['fx']:24} | Img:{src_base:28} | Whiff:{str(whiffed):5} | Sizes:{str(sizes):35} | {asset_info}")

with open('scratch/all_img_audit.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out_lines))

print("Saved to scratch/all_img_audit.txt")
