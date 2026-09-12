import json, re

cards = json.load(open('src/data/cards.json', 'r', encoding='utf-8'))
basic_cards = [c for c in cards if c.get('subtype') == 'Basic' and c.get('supertype') == 'Pokemon']

content = open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8').read()

start = content.find('export function getSpecificAttackFX(')
end = content.find('\nexport function isSelfTargetingMove', start)
fn_body = content[start:end]

checked_pkms = set(re.findall(r"pkm\.includes\(['\"]([^'\"]+)['\"]\)", fn_body))

print("Total checked Pokemon in getSpecificAttackFX:", len(checked_pkms))
print("Checked PKM list:", sorted(list(checked_pkms)))

all_basics = {}
for c in basic_cards:
    pname = c['name']
    if pname not in all_basics:
        all_basics[pname] = set()
    for a in c.get('attacks', []):
        all_basics[pname].add(a['name'])

unhandled = {}
partially_handled = {}
for pname, atks in sorted(all_basics.items()):
    plower = pname.lower()
    # check if any substring matches
    is_checked = any(cp in plower for cp in checked_pkms)
    if not is_checked:
        unhandled[pname] = sorted(list(atks))
    else:
        partially_handled[pname] = sorted(list(atks))

print(f"\n--- UNHANDLED BASIC POKEMON ({len(unhandled)}) ---")
for p, atks in unhandled.items():
    print(f"{p:18} | {', '.join(atks)}")

print(f"\n--- ALREADY CHECKED / HANDLED BASIC POKEMON ({len(partially_handled)}) ---")
for p, atks in partially_handled.items():
    print(f"{p:18} | {', '.join(atks)}")
