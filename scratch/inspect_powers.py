import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

print('=== CARDS WITH DAMAGE COUNTERS IN ATTACK / POWER ===')
for c in cards:
    for a in c.get('attacks', []):
        text = a.get('text', '').lower()
        if 'damage counter' in text:
            print(f"{c['name']} (Set: {c.get('set')}) -> Attack: {a['name']} | {a.get('text')}")
    p = c.get('pokemonPower')
    if p:
        text = p.get('text', '').lower()
        if 'damage counter' in text:
            print(f"{c['name']} (Set: {c.get('set')}) -> Power: {p['name']} | {p.get('text')}")

print('\n=== CARDS WITH BENCH TARGETING IN ATTACK / POWER ===')
for c in cards:
    for a in c.get('attacks', []):
        text = a.get('text', '').lower()
        if "choose 1 of your opponent's benched" in text or "choose 1 of them" in text or "benched pokémon" in text:
            print(f"{c['name']} (Set: {c.get('set')}) -> Attack: {a['name']} | {a.get('text')}")
