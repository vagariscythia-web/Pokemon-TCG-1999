import json

cards = json.load(open('src/data/cards.json', encoding='utf-8'))
tsx = open('src/components/BattleFXOverlay.tsx', encoding='utf-8').read()

target_pkm = ['Kadabra', 'Alakazam', 'Electrode', 'Machoke', 'Machamp', 'Haunter', 'Gengar', 'Ninetales']
for name in target_pkm:
    matched = [c for c in cards if c.get('name') == name]
    print(f"\n=== {name} ===")
    for c in matched:
        atks = [a['name'] for a in c.get('attacks', [])]
        powers = [c.get('pokemonPower', {}).get('name')] if c.get('pokemonPower') else []
        print(f"  [{c['id']}] ({c.get('set')}): Attacks: {atks} | Powers: {powers}")
