import json
cards = json.load(open('src/data/cards.json', 'r', encoding='utf-8'))
for p in ['Doduo', 'Magnemite', 'Porygon']:
    matched = [c for c in cards if c.get('name') == p]
    for c in matched:
        print(f"{c['name']} ({c.get('set')}) - HP: {c.get('hp')} - Type: {c.get('types')}")
        for a in c.get('attacks', []):
            print(f"  - Attack: {a.get('name')} | Dmg: {a.get('damage')} | Cost: {a.get('cost')}")
            print(f"    Text: {a.get('text')}")
