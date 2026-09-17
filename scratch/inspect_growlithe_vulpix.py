with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    bfx = f.read()

import re
matches = [m.start() for m in re.finditer(r"flare_burst", bfx)]
print(f"flare_burst occurrences: {len(matches)}")
for idx in matches:
    start = max(0, idx - 100)
    end = min(len(bfx), idx + 100)
    print("--- SNIPPET ---")
    print(bfx[start:end])
