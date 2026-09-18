import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

symbols = ['✦', '★', '⚡', '💥', '🍃', '💨', '🔥', '💧', '✨']
violations = []

current_fx = 'UNKNOWN'
for idx, l in enumerate(lines):
    fx_m = re.search(r"fx\.type === ['\"]([^'\"]+)['\"]", l)
    if fx_m:
        current_fx = fx_m.group(1)
    for s in symbols:
        if s in l:
            violations.append((idx + 1, current_fx, s, l.strip()[:70]))

print(f"Total symbol violations: {len(violations)}")
for v in violations:
    print(f"L{v[0]} ({v[1]}): symbol '{v[2]}' -> {v[3]}")
