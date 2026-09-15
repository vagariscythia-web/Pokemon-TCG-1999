import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx_text = f.read()

block_iter = list(re.finditer(r"\{fx\.type === ['\"]([^'\"]+)['\"]", tsx_text))

print("=== DETAILED STOCK IMAGE AUDIT ===")
for i, match in enumerate(block_iter):
    fx_name = match.group(1)
    start_pos = match.start()
    end_pos = block_iter[i+1].start() if i+1 < len(block_iter) else len(tsx_text)
    block_code = tsx_text[start_pos:end_pos]
    
    img_matches = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*>', block_code)
    if img_matches:
        print(f"\n--- Move: {fx_name} ---")
        for img in img_matches:
            src = img.split('/')[-1]
            print(f"  Asset: {src}")
        # Look for position styles or classes
        pos_info = []
        for line in block_code.splitlines():
            if 'left:' in line or 'right:' in line or 'top:' in line or 'bottom:' in line or '-top-' in line or '-left-' in line or 'bottom-' in line:
                pos_info.append(line.strip())
            if 'w-[' in line or 'h-[' in line or 'w-16' in line or 'w-24' in line or 'w-28' in line or 'w-32' in line or 'w-36' in line or 'w-44' in line:
                pos_info.append(line.strip())
        for p in pos_info[:6]:
            print(f"    {p}")
