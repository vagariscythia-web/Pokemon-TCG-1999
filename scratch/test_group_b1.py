import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

tests = [
    ('grimer', 'nasty goo', 'grimer_nasty_goo'),
    ('grimer', 'sticky hands', 'grimer_nasty_goo'),
    ('grimer', 'minimize', 'grimer_minimize'),
    ('zubat', 'leech life', 'zubat_leech_life'),
    ('zubat', 'supersonic', 'zubat_supersonic'),
    ('tangela', 'bind', 'tangela_bind')
]

# Check dispatch blocks
for pkm, attack, expected_fx in tests:
    pattern = rf"pkm\.includes\('{pkm}'\)[\s\S]*?name\.includes\('{attack}'\)[\s\S]*?return '{expected_fx}'"
    match = re.search(pattern, code)
    print(f"[{'PASS' if match else 'FAIL'}] Dispatch: {pkm} + {attack} -> {expected_fx}")

# Check durations
durations = ['grimer_nasty_goo', 'grimer_minimize', 'zubat_leech_life', 'zubat_leech_replenish', 'tangela_bind']
for fx in durations:
    dur_match = re.search(rf"case '{fx}':\s*return (\d+);", code)
    print(f"[{'PASS' if dur_match else 'FAIL'}] Duration: {fx} -> {dur_match.group(1) if dur_match else 'None'}ms")

# Check JSX rendering blocks
jsx_types = ['grimer_nasty_goo', 'grimer_minimize', 'zubat_leech_life', 'zubat_leech_replenish', 'tangela_bind']
for fx in jsx_types:
    has_jsx = f"fx.type === '{fx}'" in code
    print(f"[{'PASS' if has_jsx else 'FAIL'}] JSX rendering block: {fx}")

# Check keyframe definitions in index.css
with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

keyframes = [
    'gbaGrimerGooSplat',
    'gbaGrimerGooDrip',
    'gbaGrimerBubblePop',
    'gbaGrimerPuddleMelt',
    'gbaGrimerMeltRipple',
    'gbaZubatFangTop',
    'gbaZubatFangBottom',
    'gbaZubatLeechFloor',
    'gbaZubatLeechOrbTravel',
    'gbaZubatHealBloom',
    'gbaZubatHealSparkle',
    'gbaZubatReplenishOrbArrive',
    'gbaZubatSonarPing',
    'gbaZubatSonicRing',
    'gbaZubatSonicDepthRing',
    'gbaZubatWaveLine',
    'gbaZubatConfusionDistort',
    'gbaZubatConfuseOrbit1',
    'gbaZubatConfuseOrbit2',
    'gbaZubatConfuseOrbit3',
    'fxVitalityCardShudder',
    'gbaTangelaVineConstrict',
    'gbaTangelaSporeErupt'
]
for kf in keyframes:
    has_kf = f'@keyframes {kf}' in css
    print(f"[{'PASS' if has_kf else 'FAIL'}] CSS Keyframe: {kf}")
