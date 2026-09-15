import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx_text = f.read()

with open('src/index.css', 'r', encoding='utf-8') as f:
    css_text = f.read()

print("=" * 70)
print("SECTION 1: AUDIT OF ALL STOCK IMAGE USES & SCALING")
print("=" * 70)

block_iter = list(re.finditer(r"\{fx\.type === ['\"]([^'\"]+)['\"]", tsx_text))

stock_fx_list = []
for i, match in enumerate(block_iter):
    fx_name = match.group(1)
    start_pos = match.start()
    end_pos = block_iter[i+1].start() if i+1 < len(block_iter) else len(tsx_text)
    block_code = tsx_text[start_pos:end_pos]
    
    img_matches = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*>', block_code)
    if img_matches:
        # Find sizing in this block
        sizing_matches = re.findall(r'w-\[(\d+)px\]\s+h-\[(\d+)px\]', block_code)
        whiff_sizing = re.findall(r'fx\.whiffed\s*\?\s*[\'\"`]w-\[(\d+)px\]\s+h-\[(\d+)px\][\'\"`]\s*:\s*[\'\"`]w-\[(\d+)px\]\s+h-\[(\d+)px\][\'\"`]', block_code)
        tw_sizes = re.findall(r'\b(w-\d+|h-\d+)\b', block_code)
        stock_fx_list.append({
            'fx': fx_name,
            'images': img_matches,
            'sizing': sizing_matches,
            'whiff_sizing': whiff_sizing,
            'tw_sizes': tw_sizes,
            'code': block_code
        })

print(f"Total FX using stock images: {len(stock_fx_list)}")
for item in stock_fx_list:
    imgs = [img.split('/')[-1] for img in item['images']]
    print(f"\n[Move: {item['fx']}]")
    print(f"  Assets: {imgs}")
    if item['whiff_sizing']:
        print(f"  Sizing: Whiffed={item['whiff_sizing'][0][0]}x{item['whiff_sizing'][0][1]}px | Standard={item['whiff_sizing'][0][2]}x{item['whiff_sizing'][0][3]}px")
    elif item['sizing']:
        print(f"  Sizing (explicit px): {item['sizing']}")
    else:
        print(f"  Sizing (tailwind classes): {set(item['tw_sizes'])}")

print("\n" + "=" * 70)
print("SECTION 2: AUDIT OF ALL GAS / SMOKE / CLOUD / MIST / SPORE / DUST FX")
print("=" * 70)

gas_keywords = ['gas', 'smoke', 'smog', 'mist', 'cloud', 'spore', 'powder', 'dust', 'sand', 'haze', 'vapor', 'fog']
matched_fx = []

for i, match in enumerate(block_iter):
    fx_name = match.group(1)
    start_pos = match.start()
    end_pos = block_iter[i+1].start() if i+1 < len(block_iter) else len(tsx_text)
    block_code = tsx_text[start_pos:end_pos]
    
    if any(k in fx_name.lower() for k in gas_keywords):
        # Look for animations used in this block
        anims = re.findall(r"animation:\s*['\"]([^'\"]+)['\"]", block_code)
        # Check if it uses SVG path vs simple divs
        has_svg_path = '<path' in block_code
        has_div_circles = 'rounded-full' in block_code
        
        # Check CSS keyframes for rotation or blocky transforms
        rot_in_css = []
        for anim in anims:
            anim_name = anim.split()[0]
            kf_match = re.search(rf"@keyframes\s+{re.escape(anim_name)}\s*\{{([^}}]+(?:\{{[^}}]*\}}[^}}]*)*)\}}", css_text)
            if kf_match:
                kf_body = kf_match.group(1)
                if 'rotate(' in kf_body:
                    rot_in_css.append(anim_name)
        
        matched_fx.append({
            'fx': fx_name,
            'anims': anims,
            'has_svg_path': has_svg_path,
            'has_div_circles': has_div_circles,
            'rot_in_css': rot_in_css,
            'code_preview': block_code[:300]
        })

print(f"Total Atmospheric FX found: {len(matched_fx)}")
for item in matched_fx:
    print(f"\n[Atmospheric FX: {item['fx']}]")
    print(f"  SVG Path: {item['has_svg_path']} | Rounded Div Circles: {item['has_div_circles']}")
    print(f"  Animations: {[a.split()[0] for a in item['anims']]}")
    if item['rot_in_css']:
        print(f"  --> WARNING: Uses rotate() in cloud keyframes: {item['rot_in_css']}")
