import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx_content = f.read()

with open('src/index.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

def extract_keyframes(css_text):
    kfs = {}
    pattern = re.compile(r'@keyframes\s+([a-zA-Z0-9_\-]+)\s*\{')
    pos = 0
    while True:
        match = pattern.search(css_text, pos)
        if not match:
            break
        name = match.group(1)
        start = match.end()
        brace_count = 1
        i = start
        while i < len(css_text) and brace_count > 0:
            if css_text[i] == '{':
                brace_count += 1
            elif css_text[i] == '}':
                brace_count -= 1
            i += 1
        body = css_text[start:i-1]
        kfs[name] = body
        pos = i
    return kfs

kfs = extract_keyframes(css_content)

# Extract all FX render blocks
pattern = r"\{fx\.type === '([^']+)'\s*&& \((.*?)(?=\n\s*\{fx\.type ===|\n\s*\{\(fx\.type ===|\n\s*export |\n\s*const |\n\s*function )"
blocks = re.findall(pattern, tsx_content, re.DOTALL)

# Also check compound blocks like {(fx.type === 'a' || fx.type === 'b') && ...}
compound_pattern = r"\{\(([^)]+)\)\s*&& \((.*?)(?=\n\s*\{fx\.type ===|\n\s*\{\(fx\.type ===|\n\s*export |\n\s*const |\n\s*function )"
compound_blocks = re.findall(compound_pattern, tsx_content, re.DOTALL)

all_blocks = []
for fx_name, body in blocks:
    all_blocks.append((fx_name, body))

for condition, body in compound_blocks:
    types = re.findall(r"fx\.type === '([^']+)'", condition)
    name = " / ".join(types) if types else condition[:30]
    all_blocks.append((name, body))

out_lines = []
out_lines.append(f"Total FX blocks found: {len(all_blocks)}")

out_lines.append("\n=== CRITERIA 1: CONTAINS EMOJIS / ICONS ===")
emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]|[\u2300-\u23ff]')
for name, body in all_blocks:
    emojis = [c for c in body if ord(c) > 0x2300 and c not in ['✦', '•', '—', '–', '’', '‘', '“', '”']]
    if emojis:
        out_lines.append(f"FX: {name} -> Emojis: {[f'{c} (U+{ord(c):04X})' for c in set(emojis)]}")

out_lines.append("\n=== CRITERIA 2: USES IMAGES (<img) ===")
for name, body in all_blocks:
    imgs = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*>', body)
    if imgs:
        anims = re.findall(r"animation:\s*['\"`]?([a-zA-Z0-9_\-]+)", body)
        out_lines.append(f"\nFX: {name}")
        out_lines.append(f"  Images: {imgs}")
        out_lines.append(f"  Anims: {set(anims)}")
        for anim in set(anims):
            if anim in kfs:
                stops = re.findall(r'(\d+%)', kfs[anim])
                body_kf = kfs[anim]
                has_blur = 'blur' in body_kf
                out_lines.append(f"    - {anim}: {len(stops)} stops ({', '.join(stops[:7])}...) | blur: {has_blur}")
            else:
                out_lines.append(f"    - {anim}: NOT in index.css!")

out_lines.append("\n=== CRITERIA 3: CRUDE UNBLURRED SVG CIRCLES/ELLIPSES ===")
for name, body in all_blocks:
    circles = re.findall(r'<circle[^>]+r=[\'"]?(\d+)[\'"]?[^>]*>', body)
    ellipses = re.findall(r'<ellipse[^>]+rx=[\'"]?(\d+)[\'"]?[^>]*>', body)
    large_c = [int(r) for r in circles if int(r) > 12]
    large_e = [int(r) for r in ellipses if int(r) > 15]
    if (large_c or large_e) and 'blur' not in body:
        out_lines.append(f"FX: {name} -> large circles: {large_c}, large ellipses: {large_e}")

with open('scratch/audit_results.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out_lines))

print("Audit written to scratch/audit_results.txt successfully.")

