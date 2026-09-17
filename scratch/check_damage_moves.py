import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

for c in cards:
    for a in c.get('attacks', []):
        dmg = a.get('damage', 0)
        txt = (a.get('text') or '').lower()
        if dmg == 0 and ('damage' in txt or 'hp' in txt or 'knock out' in txt):
            print(f"{c.get('name'):15} ({c.get('set'):12}) -> {a.get('name'):20} | text: {a.get('text')}")
