import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')


with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

targets = [
    'weezing_toxic_smog', 'smog_haze', 'poison_gas', 'foul_gas', 'stun_gas',
    'gastly_sleeping_gas', 'sleeping_gas', 'poison_vapor', 'poison_vapor_bench',
    'poisonpowder_shower', 'sleep_powder_drift', 'stun_spore', 'oddish_stun_spore',
    'venomoth_venom_powder', 'sand_attack_dust', 'sand_attack_throw',
    'sandshrew_sand_attack', 'toxic_corrosion', 'smokescreen_cloud'
]

print("=== FX IMPLEMENTATION AUDIT ===")
current_type = None
capture = []

for idx, line in enumerate(lines):
    for t in targets:
        if f"fx.type === '{t}'" in line or f'fx.type === "{t}"' in line:
            print(f"\n--- [{t}] around line {idx+1} ---")
            # print next 25 lines
            snippet = "".join(lines[idx:idx+30])
            # extract key elements: svg vs divs, circles vs blurred gradients
            has_circle = '<circle' in snippet
            has_gradient = 'bg-gradient' in snippet
            has_blur = 'blur-' in snippet or 'filter:' in snippet
            anim_matches = re.findall(r"animation:\s*['\"]([^'\"]+)['\"]", snippet)
            print(f"  Circles: {has_circle}, Gradient: {has_gradient}, Blur: {has_blur}")
            print(f"  Animations: {anim_matches}")
            print("  Snippet preview:")
            for s_line in snippet.splitlines()[:12]:
                print("    " + s_line)
            break
