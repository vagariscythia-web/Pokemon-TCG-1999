import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

out = []
for card in cards:
    attacks = card.get('attacks', [])
    for atk in attacks:
        name = atk.get('name', '')
        text = atk.get('text', '')
        t_low = text.lower()
        if 'damage to itself' in t_low or 'does damage to itself' in t_low or 'damage to each' in t_low or 'damage to all' in t_low or 'damage to each pokémon' in t_low or 'bench' in t_low:
            out.append(f"[{card.get('set')}] {card.get('name')} - Attack: '{name}' ({atk.get('damage')} dmg)\n  Text: {text}\n")

with open('scratch/all_recoil_moves.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(out))

print(f"Total attacks found: {len(out)}")
