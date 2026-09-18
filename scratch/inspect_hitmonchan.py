import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

for c in cards:
    if 'hitmonchan' in c.get('name', '').lower():
        print(f"{c.get('id')}: {c.get('name')} (Set: {c.get('set')})")
        for atk in c.get('attacks', []):
            print(f"  - {atk.get('name')} ({atk.get('damage')} damage)")
