import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

for card in cards:
    attacks = card.get('attacks', [])
    for atk in attacks:
        name = atk.get('name', '')
        text = atk.get('text', '')
        if 'selfdestruct' in name.lower() or 'explosion' in name.lower():
            print(f"{card.get('name')} ({card.get('id')} - {card.get('set')}): {name} -> {atk.get('damage')} DMG")
            print(f"  Text: {text}")
