import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

targets = ['Aerodactyl', 'Kabutops', 'Omastar', 'Dodrio', 'Tentacruel']
for c in cards:
    name = c.get('name', '')
    for t in targets:
        if t in name:
            attacks = c.get('attacks', [])
            atk_list = []
            for a in attacks:
                atk_list.append(f"{a.get('name')} ({a.get('damage', 0)} dmg)")
            atk_str = ', '.join(atk_list)
            pwr = c.get('pokemonPower')
            pwr_str = f" | Power: {pwr.get('name')}" if pwr else ""
            print(f"{c.get('id')}: {name} ({c.get('set')}) -> {atk_str}{pwr_str}")
