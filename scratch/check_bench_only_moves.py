import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

for card in cards:
    for atk in card.get('attacks', []):
        name = atk.get('name', '')
        text = atk.get('text', '')
        dmg = atk.get('damage', '')
        t_low = text.lower()
        if 'benched' in t_low or 'bench' in t_low:
            # Check if attack damage is 0 or empty and it does damage to bench
            if (dmg == 0 or dmg == '0' or dmg == '') and ('damage to' in t_low or 'damage it' in t_low):
                print(f"Card: {card.get('name')} | Set: {card.get('set')} | Attack: {name} (Damage: '{dmg}')")
                print(f"  Text: {text}")
