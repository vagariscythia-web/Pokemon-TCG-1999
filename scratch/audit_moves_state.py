import json, re

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    overlay = f.read()

# Collect all unique attacks
all_attacks = set()
card_attacks = []
for c in cards:
    for a in c.get('attacks', []):
        atk_name = a['name']
        all_attacks.add(atk_name)
        card_attacks.append((c['name'], atk_name, a.get('damage', 0)))

print(f"Total cards: {len(cards)}, Total unique attack names: {len(all_attacks)}")

# Check getSpecificAttackFX mappings
start_idx = overlay.find('export function getSpecificAttackFX')
end_idx = overlay.find('export function isSelfTargetingMove')
fn_text = overlay[start_idx:end_idx].lower()

handled = []
unhandled = []

for c_name, atk, dmg in card_attacks:
    lower_atk = atk.lower()
    # Check if exact or substring
    found = False
    for line in fn_text.split('\n'):
        if lower_atk in line and ('return' in line or 'if' in line):
            found = True
            break
    if found:
        handled.append((c_name, atk, dmg))
    else:
        unhandled.append((c_name, atk, dmg))

print(f"Handled card attacks: {len(handled)}")
print(f"Unhandled card attacks: {len(unhandled)}")

# Unique unhandled
unique_unhandled = sorted(list(set((c, a) for c, a, d in unhandled)))
print("\n=== SAMPLE UNHANDLED POKEMON ATTACKS ===")
for c, a in unique_unhandled[:30]:
    print(f"  {c:20} -> {a}")
