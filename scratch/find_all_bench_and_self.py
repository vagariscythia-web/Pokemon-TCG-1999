import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

for card in cards:
    for atk in card.get('attacks', []):
        text = atk.get('text', '')
        t_low = text.lower()
        # check for self damage
        if 'damage to itself' in t_low:
            print(f"[SELF] {card.get('name')} ({card.get('id')}): {atk.get('name')} -> {text}")
        # check for bench damage
        if 'benched' in t_low or 'bench' in t_low:
            if 'damage to' in t_low or 'damage each' in t_low or 'damage times' in t_low:
                print(f"[BENCH] {card.get('name')} ({card.get('id')}): {atk.get('name')} -> {text}")
