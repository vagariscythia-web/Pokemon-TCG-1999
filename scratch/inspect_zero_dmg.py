import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

unique_attacks = {}
for c in cards:
    for a in c.get('attacks', []):
        dmg = a.get('damage', 0)
        if not dmg:
            aname = a.get('name')
            if aname not in unique_attacks:
                unique_attacks[aname] = {
                    'card': c.get('name'),
                    'set': c.get('set'),
                    'damage': dmg,
                    'text': a.get('text', '')
                }

print(f'Unique attacks with 0 or falsy damage: {len(unique_attacks)}')
for name, data in sorted(unique_attacks.items()):
    print(f"{name:25} [{data['card']:15}]: {data['text']}")
