import json
import re

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    bfx_text = f.read()

# All Pokemon in cards.json (Base, Jungle, Fossil, TR, BS2)
all_pokemon = set()
for c in cards:
    if c.get('supertype') == 'Pokemon':
        # strip 'Dark ' if present to get species base
        base_name = c.get('name').replace('Dark ', '')
        all_pokemon.add(base_name)

# Find which ones have stock image
# From our previous list:
stock_species = {
    'Alakazam', 'Arbok', 'Arcanine', 'Beedrill', 'Caterpie', 'Chansey',
    'Charmander', 'Clefairy', 'Cloyster', 'Cubone', 'Drowzee', 'Dugtrio',
    'Eevee', 'Ekans', 'Exeggutor', 'Farfetchd', 'Fearow', 'Gengar',
    'Golbat', 'Golem', 'Growlithe', 'Gyarados', 'Haunter', 'Hitmonchan',
    'Hitmonlee', 'Horsea', 'Jigglypuff', 'Jynx', 'Kingler', 'Koffing',
    'Krabby', 'Lapras', 'Lickitung', 'Machamp', 'Magikarp', 'Mankey',
    'Meowth', 'Nidoran ♂', 'NidoranM', 'Pikachu', 'Pinsir', 'Poliwhirl',
    'Psyduck', 'Raticate', 'Rattata', 'Rhydon', 'Sandshrew', 'Scyther',
    'Shellder', 'Slowpoke', 'Snorlax', 'Squirtle', 'Starmie', 'Staryu',
    'Tauros', 'Tentacool', 'Victreebel', 'Vulpix', 'Wartortle', 'Weedle',
    'Weezing'
}

without_stock = sorted([p for p in all_pokemon if p not in stock_species and p.replace("'", "") not in stock_species])

print(f"Total species in cards: {len(all_pokemon)}")
print(f"Species without stock image actor: {len(without_stock)}")

# Check which ones have dedicated custom SVG moves in BattleFXOverlay.tsx
print("\n--- Non-Stock Species Status in BattleFXOverlay.tsx ---")
for p in without_stock:
    p_lower = p.lower().replace(' ', '_').replace('♂', 'm').replace('♀', 'f')
    has_custom = p.lower() in bfx_text.lower()
    print(f"{p:20s}: {'HAS CUSTOM SVG' if has_custom else 'GENERIC/FALLBACK'}")
