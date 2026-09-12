import os, re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

tests = [
    ('shellder', 'hide in shell', 'shellder_hide_in_shell'),
    ('shellder', 'supersonic', 'shellder_supersonic'),
    ('horsea', 'smokescreen', 'horsea_smokescreen'),
    ('tentacool', 'acid', 'tentacool_acid')
]

# Check dispatch blocks
for pkm, attack, expected_fx in tests:
    pattern = rf"pkm\.includes\('{pkm}'\)[\s\S]*?name\.includes\('{attack}'\)[\s\S]*?return '{expected_fx}'"
    match = re.search(pattern, code)
    print(f"[{'PASS' if match else 'FAIL'}] Dispatch: {pkm} + {attack} -> {expected_fx}")

# Check durations
durations = ['shellder_hide_in_shell', 'shellder_supersonic', 'horsea_smokescreen', 'tentacool_acid']
for fx in durations:
    dur_match = re.search(rf"case '{fx}':\s*return (\d+);", code)
    print(f"[{'PASS' if dur_match else 'FAIL'}] Duration: {fx} -> {dur_match.group(1) if dur_match else 'None'}ms")

# Check JSX rendering blocks
for fx in durations:
    has_jsx = f"fx.type === '{fx}'" in code
    print(f"[{'PASS' if has_jsx else 'FAIL'}] JSX rendering block: {fx}")

# Check assets existence
assets = ['Shellder_Shell.png', 'Horsea_Snout.png', 'Tentacool_Acid.png']
for a in assets:
    exists = os.path.exists(os.path.join('public/assets', a))
    print(f"[{'PASS' if exists else 'FAIL'}] Asset exists: {a}")

# Check keyframe definitions in index.css
with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

keyframes = [
    'gbaShellderShellPeek',
    'gbaShellderShieldGlint',
    'gbaShellderWhiffSlip',
    'gbaShellderSonicBeam',
    'gbaHorseaSnoutRecoil',
    'gbaHorseaInkStream',
    'gbaHorseaSmokescreenErupt',
    'gbaTentacoolDescendFloat',
    'gbaTentacoolGemsGlow',
    'gbaTentacoolAcidJet',
    'gbaTentacoolAcidSplat'
]
for kf in keyframes:
    has_kf = f'@keyframes {kf}' in css
    print(f"[{'PASS' if has_kf else 'FAIL'}] CSS Keyframe: {kf}")
