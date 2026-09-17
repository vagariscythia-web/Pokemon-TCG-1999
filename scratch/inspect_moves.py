import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

for card in cards:
    attacks = card.get('attacks', [])
    for atk in attacks:
        name = atk.get('name', '')
        text = atk.get('text', '')
        t_low = text.lower()
        n_low = name.lower()
        if 'selfdestruct' in n_low or 'explosion' in n_low or 'damage to itself' in t_low or 'damage to each pokémon' in t_low or 'bench' in t_low or 'benched' in t_low:
            print(f"=== {card.get('name')} ({card.get('id')}) ===")
            print(f"Attack: {name} (Damage: {atk.get('damage')})")
            print(f"Text: {text}")
            print()
