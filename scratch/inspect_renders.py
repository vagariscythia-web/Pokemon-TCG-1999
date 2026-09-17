import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for fx_t in ['wing_slash', 'kabutops_sickle_slash']:
    found = False
    for i, line in enumerate(lines):
        if f"'{fx_t}'" in line and 'fx.type' in line:
            print(f"=== {fx_t} at line {i+1} ===")
            print(''.join(lines[i:i+35]))
            found = True
            break
    if not found:
        print(f"=== {fx_t} NOT FOUND ===")
