import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

quick_attack_cards = []
for c in cards:
    for a in c.get('attacks', []):
        if a.get('name', '').lower() == 'quick attack':
            quick_attack_cards.append({
                'name': c.get('name'),
                'set': c.get('set'),
                'number': c.get('number'),
                'damage': a.get('damage'),
                'text': a.get('text')
            })

print(f"Total cards with Quick Attack: {len(quick_attack_cards)}")
for card in quick_attack_cards:
    print(f"- {card['name']} (Set: {card['set']}, #{card['number']}) | Dmg: {card['damage']} | Text: {card['text']}")
