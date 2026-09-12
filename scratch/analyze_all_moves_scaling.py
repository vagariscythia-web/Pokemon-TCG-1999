import os
import re
from PIL import Image

CARD_WIDTH = 158.0

# Parse BattleFXOverlay.tsx for move definitions
with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find fx.type blocks
# We can find sections: fx.type === '...'
blocks = re.findall(r"fx\.type === ['\"]([^'\"]+)['\"][\s\S]*?(?=(?:fx\.type === ['\"]|\Z))", content)

data = []

for fx_type in sorted(list(set(re.findall(r"fx\.type === ['\"]([^'\"]+)['\"]", content)))):
    # find block for fx_type
    m = re.search(r"fx\.type === ['\"]" + re.escape(fx_type) + r"['\"][\s\S]*?(?=(?:fx\.type === ['\"]|\Z))", content)
    if not m:
        continue
    block = m.group(0)
    
    # check if has img
    img_matches = re.findall(r"<img[\s\S]*?>", block)
    if not img_matches:
        continue
    
    for img in img_matches:
        src_m = re.search(r"src=['\"]([^'\"]+)['\"]", img)
        if not src_m:
            continue
        src = src_m.group(1)
        src_file = os.path.join('public', src.lstrip('/'))
        if not os.path.exists(src_file):
            continue
        
        # Sizing in img or parent
        # Find classes
        class_m = re.search(r"className=\{?`?(['\"a-zA-Z0-9_\-\s\$\{\}\:\.\[\]\(\)\<\>\?\/\#\,\@]+)`?\}?", img)
        classes = class_m.group(1) if class_m else ""
        
        # Check parent div classes if img is w-full
        parent_w = ""
        parent_m = re.search(r"<div[^>]*className=\{?`?(['\"a-zA-Z0-9_\-\s\$\{\}\:\.\[\]\(\)\<\>\?\/\#\,\@]+)`?\}?[\s\S]*?" + re.escape(img), block)
        if parent_m:
            parent_w = parent_m.group(1)
        
        # Parse pixel or tailwind width
        combined = classes + " " + parent_w
        
        # Detect container sizes
        # e.g., w-[108px], w-20, w-16, w-14, width: '100px'
        w_matches = re.findall(r"w-\[(\d+)px\]|w-(\d+)|width:\s*['\"](\d+)px['\"]|width:\s*['\"](\d+)%['\"]", combined)
        
        im = Image.open(src_file)
        bbox = im.getbbox() if im.mode in ('RGBA', 'LA') or 'transparency' in im.info else (0, 0, im.width, im.height)
        cw = (bbox[2] - bbox[0]) if bbox else im.width
        ch = (bbox[3] - bbox[1]) if bbox else im.height
        content_w_ratio = cw / im.width
        
        has_whiff = "whiffed" in combined or "fx.whiffed" in block
        
        data.append({
            'fx': fx_type,
            'src': os.path.basename(src),
            'img_size': im.size,
            'bbox': (cw, ch),
            'content_ratio': content_w_ratio,
            'classes': classes[:60],
            'w_matches': w_matches,
            'has_whiff': has_whiff
        })

print(f"{'FX TYPE':26} | {'IMAGE':26} | {'CANVAS':9} | {'BBOX':9} | {'RATIO':5} | {'WHIFF':5} | {'SIZES'}")
print("-" * 110)
for d in data:
    ratio_str = f"{d['content_ratio']:.1%}"
    print(f"{d['fx']:26} | {d['src']:26} | {d['img_size'][0]:4}x{d['img_size'][1]:<4} | {d['bbox'][0]:4}x{d['bbox'][1]:<4} | {ratio_str:5} | {str(d['has_whiff']):5} | {d['w_matches']}")
