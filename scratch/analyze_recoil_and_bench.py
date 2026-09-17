import json
import re

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

# Categories:
# 1. Selfdestruct
# 2. Attacks that do damage to itself
# 3. Attacks that do damage to bench (all bench or each bench or opponent bench)

selfdestruct_cards = []
self_damage_attacks = []
bench_damage_attacks = []

seen = set()

for card in cards:
    for atk in card.get('attacks', []):
        name = atk.get('name', '')
        text = atk.get('text', '')
        t_low = text.lower()
        n_low = name.lower()
        key = (card.get('name'), name, card.get('set'))
        if key in seen:
            continue
        seen.add(key)
        
        if 'selfdestruct' in n_low or 'explosion' in n_low:
            selfdestruct_cards.append((card.get('name'), card.get('set'), name, atk.get('damage'), text))
        elif 'damage to itself' in t_low:
            self_damage_attacks.append((card.get('name'), card.get('set'), name, atk.get('damage'), text))
        elif 'benched' in t_low or 'bench' in t_low:
            # check if it does damage to bench
            if any(w in t_low for w in ['damage to each', 'damage to 1', 'damage to that', 'damage to it', 'damage to all']):
                bench_damage_attacks.append((card.get('name'), card.get('set'), name, atk.get('damage'), text))

print("=== 1. SELFDESTRUCT / EXPLOSION ===")
for c, s, n, d, t in selfdestruct_cards:
    print(f"[{s}] {c} -> {n} ({d} dmg): {t}")

print("\n=== 2. SELF-DAMAGE ATTACKS ===")
for c, s, n, d, t in self_damage_attacks:
    print(f"[{s}] {c} -> {n} ({d} dmg): {t}")

print("\n=== 3. BENCH-DAMAGE ATTACKS ===")
for c, s, n, d, t in bench_damage_attacks:
    print(f"[{s}] {c} -> {n} ({d} dmg): {t}")
