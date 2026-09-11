import json

content = open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8').read()
cards = json.load(open('src/data/cards.json', 'r', encoding='utf-8'))
basic_cards = [c for c in cards if c.get('subtype') == 'Basic' and c.get('supertype') == 'Pokemon']
pkm_names = sorted(list(set(c['name'] for c in basic_cards)))

missing = []
has_check = []
for name in pkm_names:
    t1 = "pkm.includes('" + name.lower() + "')"
    t2 = 'pkm.includes("' + name.lower() + '")'
    if t1 in content or t2 in content:
        has_check.append(name)
    else:
        missing.append(name)

print(f"Basic with custom checks: {len(has_check)}")
print(f"Basic without custom checks: {len(missing)}")
print("\nCandidates for Basic move animations (without custom checks):")
for m in missing:
    attacks = sorted(list(set(a['name'] for c in basic_cards if c['name'] == m for a in c.get('attacks', []))))
    print(f"- {m}: {attacks}")
