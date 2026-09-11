import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

fx_targets = [
    'sleeping_gas', 'gastly_sleeping_gas', 'poison_gas', 'foul_gas',
    'sludge_bomb', 'muk_sludge_deluge', 'venomoth_venom_powder',
    'oddish_stun_spore', 'stun_spore', 'sleep_powder_drift',
    'sandshrew_sand_attack', 'cubone_bone_strike', 'snorlax_body_slam'
]

for fx_name in fx_targets:
    pattern = r"\{fx\.type === '" + fx_name + r"'\s*&& \((.*?)\)\}"
    m = re.search(pattern, content, re.DOTALL)
    if m:
        body = m.group(1)
        anims = re.findall(r"animation:\s*['\"`]?([a-zA-Z0-9_\-]+)", body)
        svgs = re.findall(r'<(circle|ellipse|path|polygon)', body)
        print(f"FX: {fx_name}")
        print(f"   anims: {list(set(anims))}")
        print(f"   svg tags: {svgs[:6]}")
    else:
        print(f"FX: {fx_name} NOT MATCHED (might be compound)")
