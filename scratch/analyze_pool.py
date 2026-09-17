import json
import re

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    bfx_text = f.read()

# Find all stock images referenced
stock_imgs = set(re.findall(r'/assets/([A-Za-z0-9_\-]+\.png)', bfx_text))

# Collect all pokemon and attacks
pokemon_dict = {}
for c in cards:
    if c.get('supertype') == 'Pokemon':
        name = c.get('name')
        sub = c.get('subtype', '')
        attacks = [a.get('name') for a in c.get('attacks', [])]
        if name not in pokemon_dict:
            pokemon_dict[name] = {'subtype': sub, 'attacks': set(), 'sets': set()}
        pokemon_dict[name]['attacks'].update(attacks)
        pokemon_dict[name]['sets'].add(c.get('set', ''))

print(f"Total unique Pokemon in game: {len(pokemon_dict)}")
print(f"Total unique stock image files referenced: {len(stock_imgs)}")

# Let's see which Pokemon have dedicated fx vs stock images
print("\n--- Stock image list ---")
for s in sorted(stock_imgs):
    print(f"  {s}")
