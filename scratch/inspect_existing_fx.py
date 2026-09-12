with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for fx in ['zubat_supersonic', 'nasty_goo', 'sticky_hands_grab', 'golbat_leech_life']:
    m = re.search(r"fx\.type === '" + fx + r"'\s*&& \(([\s\S]*?)(?=\n\s*(?:\{fx\.type|\{\/\* ===|\{\/\* \d+|<div className=\"relative\"))", text)
    if m:
        print(f'=== {fx} ===')
        print(m.group(0)[:500])
        print('...\n')
    else:
        print(f'=== {fx} NOT FOUND in JSX ===\n')
