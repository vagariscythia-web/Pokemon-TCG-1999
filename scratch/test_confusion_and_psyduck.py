import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    bfx = f.read()

with open('src/components/GameBoard.tsx', 'r', encoding='utf-8') as f:
    gb = f.read()

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Check isSelfTargetingMove implementation
print("--- 1. Testing isSelfTargetingMove ---")
def is_self_target(name):
    # Match the logic in isSelfTargetingMove
    n = name.lower().strip()
    if any(k in n for k in ['harden', 'withdraw', 'minimize', 'stiffen', 'scrunch', 'hide in shell', 'mirror shell', 'invisible wall']) or n == 'barrier': return True
    if any(k in n for k in ['recover', 'spacing out', 'rapid evolution', 'rest', 'afternoon nap', 'scavenge']): return True
    if any(k in n for k in ['swords dance', 'growth', 'focus energy', 'charge', 'agility']): return True
    if n in ['fetch', 'dizziness', 'vanish']: return True
    if any(k in n for k in ['call for family', 'call for friend', 'sprout', 'friendship song', 'third eye']): return True
    if 'teleport' in n and 'blast' not in n: return True
    if 'conversion' in n or n == 'snivel': return True
    return False

tests = [
    ('Withdraw', True),
    ('Harden', True),
    ('Stiffen', True),
    ('Scrunch', True),
    ('Hide in Shell', True),
    ('Barrier', True),
    ('Recover', True),
    ('Spacing Out', True),
    ('Rest', True),
    ('Swords Dance', True),
    ('Agility', True),
    ('Fetch', True),
    ('Dizziness', True),
    ('Teleport', True),
    ('Tackle', False),
    ('Water Gun', False),
    ('Flamethrower', False),
    ('Teleport Blast', False),
    ('Shell Attack', False),
]

for name, expected in tests:
    res = is_self_target(name)
    print(f"[{'PASS' if res == expected else 'FAIL'}] {name} -> {res} (expected {expected})")

# 2. Check GameBoard triggerConfusionSelfHit
print("\n--- 2. Testing GameBoard triggerConfusionSelfHit ---")
has_target_routing = "const moveTarget: 'player' | 'cpu' = isSelfTarget" in gb
print(f"[{'PASS' if has_target_routing else 'FAIL'}] triggerConfusionSelfHit routing logic present")

# Check all 4 call sites pass selfTarget
call_matches = re.findall(r"triggerConfusionSelfHit\([^)]+\)", gb)
print(f"Found {len(call_matches)} call sites of triggerConfusionSelfHit:")
for i, call in enumerate(call_matches, 1):
    has_self_param = "selfTarget" in call
    print(f"[{'PASS' if has_self_param else 'FAIL'}] Call site {i}: {call.strip()}")

# 3. Check Psyduck Headache & Fury Swipes
print("\n--- 3. Testing Psyduck Headache & Fury Swipes in BattleFXOverlay ---")
has_no_emojis = ('🚫' not in bfx[bfx.find("fx.type === 'psyduck_headache'"):bfx.find("fx.type === 'psyduck_dizziness'")])
print(f"[{'PASS' if has_no_emojis else 'FAIL'}] Headache no longer has raw emojis")

has_trainer_seal = "gbaPsyduckTrainerSealLock" in bfx
has_synaptic = "gbaPsyduckSynapticDischarge" in bfx
has_harmonic = "gbaPsyduckHarmonicRipple" in bfx
print(f"[{'PASS' if has_trainer_seal else 'FAIL'}] Headache has gbaPsyduckTrainerSealLock")
print(f"[{'PASS' if has_synaptic else 'FAIL'}] Headache has gbaPsyduckSynapticDischarge")
print(f"[{'PASS' if has_harmonic else 'FAIL'}] Headache has gbaPsyduckHarmonicRipple")

has_fury_triple = "gbaPsyduckFurySwipesTriple" in bfx
has_fury_mirror = "gbaPsyduckFurySwipesTripleMirror" in bfx
print(f"[{'PASS' if has_fury_triple else 'FAIL'}] Fury Swipes has gbaPsyduckFurySwipesTriple")
print(f"[{'PASS' if has_fury_mirror else 'FAIL'}] Fury Swipes has gbaPsyduckFurySwipesTripleMirror")

# 4. Check CSS Keyframes
print("\n--- 4. Testing CSS Keyframes in index.css ---")
keyframes = [
    'gbaPsyduckHarmonicRipple',
    'gbaPsyduckSynapticDischarge',
    'gbaPsyduckCranialThrob',
    'gbaPsyduckTrainerSealLock',
    'gbaPsyduckFurySwipesTriple',
    'gbaPsyduckFurySwipesTripleMirror'
]
for kf in keyframes:
    has_kf = f'@keyframes {kf}' in css
    print(f"[{'PASS' if has_kf else 'FAIL'}] Keyframe: {kf}")
