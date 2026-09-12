import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

print("=== Agility / Quick / Speed moves ===")
for c in cards:
    for a in c.get('attacks', []):
        name = a.get('name', '').lower()
        if any(w in name for w in ['agility', 'quick', 'speed', 'rush', 'dash', 'tackle', 'slam']):
            print(f"{c.get('name')} ({c.get('id')} - {c.get('set')}): {a.get('name')}")
