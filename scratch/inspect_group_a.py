import json

cards = json.load(open('src/data/cards.json', 'r', encoding='utf-8'))
targets = ['Mewtwo', 'Articuno', 'Zapdos', 'Moltres', 'Ditto', 'Mr. Mime']

found_cards = [c for c in cards if c.get('name') in targets]

print(f"Found {len(found_cards)} cards for Group A:")
for c in found_cards:
    print(f"\n--- {c['name']} ({c.get('set')} #{c.get('number')}, Subtype: {c.get('subtype')}) ---")
    if 'pokemonPower' in c:
        print(f"  Power: {c['pokemonPower']['name']} -> {c['pokemonPower']['text']}")
    for a in c.get('attacks', []):
        print(f"  Attack: {a['name']} (Dmg: {a.get('damage', '-')}) -> {a.get('text', '')}")
