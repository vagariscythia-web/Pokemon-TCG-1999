import json, re

cards = json.load(open('src/data/cards.json', encoding='utf-8'))
tsx = open('src/components/BattleFXOverlay.tsx', encoding='utf-8').read()

start = tsx.find('export function getSpecificAttackFX(')
end = tsx.find('export function isSelfTargetingMove(')
router_code = tsx[start:end]

# Extract all pokemon checks in router_code
pkm_checks = re.findall(r"pkm\.includes\(['\"]([^'\"]+)['\"]\)", router_code)
print("Unique pkm names checked in getSpecificAttackFX:", sorted(list(set(pkm_checks))))

basic_cards = [c for c in cards if c.get('subtype') == 'Basic' and c.get('supertype') == 'Pokemon']
all_basic_names = sorted(list(set(c['name'] for c in basic_cards)))

unhandled_basic = []
for name in all_basic_names:
    clean_name = name.lower().replace("'", "").replace(".", "").replace(" female", "").replace(" male", "")
    found = any(clean_name in p or p in clean_name for p in pkm_checks)
    if not found:
        unhandled_basic.append(name)

print("\nBasic Pokemon with NO specific check in router:")
for b in unhandled_basic:
    atks = [a['name'] for c in basic_cards if c['name'] == b for a in c.get('attacks', [])]
    print(f"- {b}: {list(set(atks))}")
