import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

for c in cards:
    for a in c.get('attacks', []):
        if a.get('name') in ['Stretch Kick', 'Flitter', 'Dig Under', 'Coin Hurl', 'Super Fang']:
            print(f"{c.get('name')} [{c.get('set')}]: {a.get('name')} -> damage = {a.get('damage')}, damageMultiplier = {a.get('damageMultiplier')}")
