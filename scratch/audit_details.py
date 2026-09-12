import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find each fx.type block
pattern = r"\{fx\.type === '([^']+)' && \(([\s\S]*?)\n      \)\}"
matches = re.findall(pattern, text)

print(f"Total matched FX blocks: {len(matches)}")

results = []
for name, body in matches:
    issues = []
    lines = re.findall(r'<line\s', body)
    if lines:
        issues.append(f"{len(lines)} raw <line> elements")
    
    emojis = [c for c in ['💢', '⚡', '🚫', '💤', '💥', '✨', '💫', '❓', '❗', '💨', '🌀'] if c in body]
    if emojis:
        issues.append(f"emojis: {' '.join(emojis)}")
    
    dashed_circles = re.findall(r'<circle[^>]*strokeDasharray', body)
    if dashed_circles and '<img' not in body:
        issues.append(f"{len(dashed_circles)} basic dashed circles")
        
    polylines = re.findall(r'<polyline\s', body)
    if polylines:
        issues.append(f"{len(polylines)} raw <polyline> elements")
        
    loc = len(body.strip().split('\n'))
    has_gradient = 'Gradient' in body or 'gradient' in body
    has_img = '<img' in body
    
    if loc < 20 and not has_img and not has_gradient:
        issues.append(f"sparse/rudimentary ({loc} lines, no gradients)")
        
    if issues:
        results.append((name, issues, loc, body))

print(f"\n--- POTENTIALLY CRUDE / OVERSIMPLIFIED FX ({len(results)} found) ---")
for name, issues, loc, body in results:
    print(f"[{name}] ({loc} lines): {', '.join(issues)}".encode('ascii', 'replace').decode('ascii'))
