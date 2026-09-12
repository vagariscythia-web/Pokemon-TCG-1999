import json, re

cards = json.load(open('src/data/cards.json', encoding='utf-8'))
tsx = open('src/components/BattleFXOverlay.tsx', encoding='utf-8').read()

# Let's see what Basic Pokémon cards have attacks that fall back to generic moves
# We can extract all `if (...) return '...'` from getSpecificAttackFX

basic_cards = [c for c in cards if c.get('subtype') == 'Basic' and c.get('supertype') == 'Pokemon']

# Group by basic pokemon name
pokemon_dict = {}
for c in basic_cards:
    name = c['name']
    if name not in pokemon_dict:
        pokemon_dict[name] = []
    for a in c.get('attacks', []):
        if a['name'] not in pokemon_dict[name]:
            pokemon_dict[name].append(a['name'])

print(f"Total distinct Basic Pokemon: {len(pokemon_dict)}")

# Now let's check Stage 1 and Stage 2 as well!
stage1_cards = [c for c in cards if c.get('subtype') == 'Stage 1' and c.get('supertype') == 'Pokemon']
stage1_dict = {}
for c in stage1_cards:
    name = c['name']
    if name not in stage1_dict:
        stage1_dict[name] = []
    for a in c.get('attacks', []):
        if a['name'] not in stage1_dict[name]:
            stage1_dict[name].append(a['name'])

print(f"Total distinct Stage 1 Pokemon: {len(stage1_dict)}")

stage2_cards = [c for c in cards if c.get('subtype') == 'Stage 2' and c.get('supertype') == 'Pokemon']
stage2_dict = {}
for c in stage2_cards:
    name = c['name']
    if name not in stage2_dict:
        stage2_dict[name] = []
    for a in c.get('attacks', []):
        if a['name'] not in stage2_dict[name]:
            stage2_dict[name].append(a['name'])

print(f"Total distinct Stage 2 Pokemon: {len(stage2_dict)}")
