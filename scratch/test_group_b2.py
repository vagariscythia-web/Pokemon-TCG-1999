import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

tests = [
    ('venonat', 'stun spore', 'venonat_stun_spore'),
    ('venonat', 'leech life', 'venonat_leech_life'),
    ('paras', 'spore', 'paras_spore'),
    ('parasect', 'spore', 'paras_spore'),
    ('exeggcute', 'hypnosis', 'exeggcute_hypnosis')
]

# Check dispatch blocks
for pkm, attack, expected_fx in tests:
    pattern = rf"pkm\.includes\('paras'\)[\s\S]*?name\.includes\('{attack}'\)[\s\S]*?return '{expected_fx}'" if pkm in ['paras', 'parasect'] else rf"pkm\.includes\('{pkm}'\)[\s\S]*?name\.includes\('{attack}'\)[\s\S]*?return '{expected_fx}'"
    match = re.search(pattern, code)
    print(f"[{'PASS' if match else 'FAIL'}] Dispatch: {pkm} + {attack} -> {expected_fx}")

# Check durations
durations = ['venonat_stun_spore', 'venonat_leech_life', 'paras_spore', 'exeggcute_hypnosis']
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
    'gbaVenonatRubyEyesGlow',
    'gbaVenonatStunDust',
    'gbaVenonatParalysisSpark',
    'gbaVenonatMandibleLatch',
    'gbaVenonatBioDrainStream',
    'gbaParasTochukasoErupt',
    'gbaParasSporeCloud',
    'gbaParasSleepZzzFloat',
    'gbaExeggcuteHypnoRing',
    'gbaExeggcuteSpiralRotate',
    'gbaExeggcutePsychicPulse'
]
for kf in keyframes:
    has_kf = f'@keyframes {kf}' in css
    print(f"[{'PASS' if has_kf else 'FAIL'}] CSS Keyframe: {kf}")
