import json
import re

with open('src/engine/GameEngine.ts', 'r', encoding='utf-8') as f:
    engine_code = f.read()

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

# Collect all distinct moves that do self-damage or bench-damage
moves_to_check = set()
for card in cards:
    for atk in card.get('attacks', []):
        name = atk.get('name', '')
        text = atk.get('text', '')
        t_low = text.lower()
        n_low = name.lower()
        if 'damage to itself' in t_low or 'does damage to itself' in t_low or 'damage to each' in t_low or 'damage to all' in t_low or 'damage to each pokémon' in t_low or 'benched' in t_low:
            if any(k in t_low for k in ['damage to each', 'damage to 1', 'damage to that', 'damage to it', 'damage to all', 'damage to itself']):
                moves_to_check.add((name.lower(), card.get('name'), card.get('set'), atk.get('damage'), text))

print(f"Total candidate moves: {len(moves_to_check)}")
for name, cname, sname, dmg, text in sorted(moves_to_check):
    # Check if name is in engine_code
    in_engine = f"'{name}'" in engine_code or f'"{name}"' in engine_code
    print(f"[{'FOUND' if in_engine else 'MISSING'}] {cname} ({sname}) - '{name}' ({dmg} dmg)")
    print(f"    Text: {text}")
