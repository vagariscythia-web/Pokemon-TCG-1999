import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Find all @keyframes blocks
kf_pattern = r'@keyframes\s+([a-zA-Z0-9_\-]+)\s*\{([\s\S]*?)\n\}'
kfs = re.findall(kf_pattern, css)

print(f"Total @keyframes found in src/index.css: {len(kfs)}")

suspicious_kfs = []

for name, body in kfs:
    # Extract stops
    stops = re.findall(r'(\d+)%\s*\{([^}]*)\}', body)
    if not stops:
        # Check from / to
        continue
    
    # Check intervals
    stop_percs = [int(s[0]) for s in stops]
    max_gap = 0
    max_gap_pair = None
    for j in range(len(stop_percs) - 1):
        gap = stop_percs[j+1] - stop_percs[j]
        if gap > max_gap:
            max_gap = gap
            max_gap_pair = (stop_percs[j], stop_percs[j+1])
    
    # Check if there are identical consecutive stops
    identical_holds = []
    for j in range(len(stops) - 1):
        p1, b1 = stops[j]
        p2, b2 = stops[j+1]
        gap = int(p2) - int(p1)
        # Normalize whitespace in blocks
        nb1 = re.sub(r'\s+', ' ', b1).strip()
        nb2 = re.sub(r'\s+', ' ', b2).strip()
        if nb1 == nb2 and gap >= 15:
            identical_holds.append((int(p1), int(p2), gap, nb1))
    
    # Check if keyframe has very few stops (e.g. only 2 or 3 stops across a long duration)
    if identical_holds or max_gap > 35:
        suspicious_kfs.append({
            'name': name,
            'stop_count': len(stops),
            'max_gap': max_gap,
            'max_gap_pair': max_gap_pair,
            'identical_holds': identical_holds
        })

print(f"\nKeyframes with large gaps (>35%) or identical holds (>=15%): {len(suspicious_kfs)}")

lines = []
for k in suspicious_kfs:
    holds_str = f"HOLD: {k['identical_holds']}" if k['identical_holds'] else f"Gap: {k['max_gap']}% {k['max_gap_pair']}"
    lines.append(f"{k['name']:40} | Stops: {k['stop_count']:2} | {holds_str}")

with open('scratch/kf_audit.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(lines))

print("Wrote scratch/kf_audit.txt")
