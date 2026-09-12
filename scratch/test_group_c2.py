import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

tests = [
    ('psyduck', 'headache', 'psyduck_headache'),
    ('psyduck', 'fury swipes', 'psyduck_fury_swipes'),
    ('psyduck', 'dizziness', 'psyduck_dizziness'),
    ('lapras', 'water gun', 'lapras_glacial_surge'),
    ('lapras', 'confuse ray', 'lapras_aurora_ray'),
    ('seel', 'headbutt', 'seel_horn_headbutt')
]

# Check dispatch blocks
for pkm, attack, expected_fx in tests:
    pattern = rf"pkm\.includes\('{pkm}'\)[\s\S]*?name\.includes\('{attack}'\)[\s\S]*?return '{expected_fx}'"
    match = re.search(pattern, code)
    print(f"[{'PASS' if match else 'FAIL'}] Dispatch: {pkm} + {attack} -> {expected_fx}")

# Check durations
durations = ['psyduck_headache', 'psyduck_fury_swipes', 'psyduck_dizziness', 'lapras_glacial_surge', 'lapras_aurora_ray', 'seel_horn_headbutt']
for fx in durations:
    dur_match = re.search(rf"case '{fx}':\s*return (\d+);", code)
    print(f"[{'PASS' if dur_match else 'FAIL'}] Duration: {fx} -> {dur_match.group(1) if dur_match else 'None'}ms")

# Check JSX rendering blocks
for fx in durations:
    has_jsx = f"fx.type === '{fx}'" in code
    print(f"[{'PASS' if has_jsx else 'FAIL'}] JSX rendering block: {fx}")

# Check keyframe definitions in index.css
with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

keyframes = [
    'gbaPsyduckMigrainePulse',
    'gbaPsyduckStressBolt',
    'gbaPsyduckHeadacheEMP',
    'gbaPsyduckClawSwipe',
    'gbaPsyduckDizzyOrbit',
    'gbaLaprasGlacialWave',
    'gbaLaprasIceFloeDrift',
    'gbaLaprasAuroraSweep',
    'gbaSeelHornDive',
    'gbaSeelIceShatter'
]
for kf in keyframes:
    has_kf = f'@keyframes {kf}' in css
    print(f"[{'PASS' if has_kf else 'FAIL'}] CSS Keyframe: {kf}")
