with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    bfx = f.read()

import re

for name in ['meowth_pay_day', 'meowth_coin_hurl', 'Drowzee']:
    matches = [m.start() for m in re.finditer(name, bfx, re.IGNORECASE)]
    print(f"=== {name} occurrences: {len(matches)} ===")
    for idx in matches[:3]:
        print(bfx[max(0, idx-60):min(len(bfx), idx+120)])
