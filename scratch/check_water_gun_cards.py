import json

with open("src/data/cards.json", "r", encoding="utf-8") as f:
    cards = json.load(f)

wg_cards = []
for c in cards:
    attacks = c.get("attacks", [])
    for a in attacks:
        if "water gun" in a.get("name", "").lower():
            wg_cards.append((c.get("name"), c.get("set"), a.get("name"), a.get("damage")))

print(f"Total Water Gun cards: {len(wg_cards)}")
for name, s, aname, dmg in wg_cards:
    print(f"- {name} ({s}): {aname} [{dmg}]")

print("\n--- Check Squirtle, Wartortle, Golduck attacks ---")
for c in cards:
    if c.get("name") in ["Squirtle", "Wartortle", "Golduck"]:
        atks = [a.get("name") for a in c.get("attacks", [])]
        print(f"* {c.get('name')} ({c.get('set')}): {atks}")
