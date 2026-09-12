import re, sys
sys.stdout.reconfigure(encoding='utf-8')

# Read audit_results.txt to get the list of moves flagged under Criteria 3
with open('scratch/audit_results.txt', 'r', encoding='utf-8') as f:
    audit_text = f.read()

crit3_section = audit_text.split('=== CRITERIA 3: CRUDE UNBLURRED SVG CIRCLES/ELLIPSES ===')[1]
flagged_moves = re.findall(r'FX:\s+([^\s\-]+)', crit3_section)
print(f"Total flagged in Criteria 3: {len(flagged_moves)}")
print("Flagged moves:", flagged_moves)

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx_content = f.read()

# Analyze each flagged move in BattleFXOverlay
results = []
for fx_name in flagged_moves:
    # Find fx.type block
    pattern = rf"fx\.type === '{fx_name}'\s*&& \(([\s\S]*?)(?=\n\s*(?:\{{fx\.type|\{{\/\* ===|\{{\/\* \d+|<div className=\"relative\"))"
    match = re.search(pattern, tsx_content)
    if not match:
        # try search without strict end
        pattern2 = rf"fx\.type === '{fx_name}'\s*&& \(([\s\S]*?)(?=\n\s*\{{fx\.type)"
        match = re.search(pattern2, tsx_content)
    
    if match:
        body = match.group(1)
        lines_count = len(body.strip().split('\n'))
        svg_count = body.count('<svg')
        anims = re.findall(r"animation:\s*['\"`]?([a-zA-Z0-9_\-]+)", body)
        gradients = body.count('<radialGradient') + body.count('<linearGradient')
        paths = body.count('<path')
        polygons = body.count('<polygon')
        imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', body)
        
        # Determine if it is a False Positive or Actually Simple
        # Indicators of high fidelity: > 25 lines, multiple SVGs/layers, gradients, custom keyframes, paths
        is_high_fidelity = (lines_count > 35 or len(set(anims)) >= 3 or gradients > 0 or len(imgs) > 0)
        
        results.append({
            'fx': fx_name,
            'lines': lines_count,
            'svgs': svg_count,
            'anims': list(set(anims)),
            'gradients': gradients,
            'paths': paths,
            'polygons': polygons,
            'imgs': imgs,
            'high_fidelity': is_high_fidelity
        })
    else:
        results.append({
            'fx': fx_name,
            'lines': 0,
            'not_found': True
        })

print("\n=== HIGH FIDELITY / FALSE POSITIVES (Actually rich & complete) ===")
for r in results:
    if r.get('high_fidelity'):
        print(f"✅ {r['fx']} ({r['lines']} lines, {len(r['anims'])} anims, {r['gradients']} grads, {r['paths']} paths, imgs: {r['imgs']})")

print("\n=== GENUINELY SIMPLE / MINIMALIST (Actually raw/plain primitives) ===")
for r in results:
    if not r.get('high_fidelity') and not r.get('not_found'):
        print(f"⚠️ {r['fx']} ({r['lines']} lines, {len(r['anims'])} anims, {r['gradients']} grads, {r['paths']} paths)")
