import json
import re

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    bfx = f.read()

# Let's inspect the cards of interest
targets = ['Aerodactyl', 'Kabutops', 'Omastar', 'Dodrio', 'Tentacruel']
found_cards = [c for c in cards if c.get('name') in targets]

print(f"Total cards found for targets: {len(found_cards)}")
for c in found_cards:
    name = c.get('name')
    card_id = c.get('id')
    attacks = [a.get('name') for a in c.get('attacks', [])]
    print(f"Card: {name} (ID: {card_id}) -> Attacks: {attacks}")

# Check dispatch in BattleFXOverlay.tsx
print("\n=== VERIFYING DISPATCH PATTERNS IN BattleFXOverlay.tsx ===")
patterns = {
    'Aerodactyl': r"if \(pkm\.includes\('aerodactyl'\)\) \{\s*if \(name\.includes\('wing attack'\)",
    'Kabutops': r"if \(pkm\.includes\('kabutops'\)\) \{\s*if \(name\.includes\('sharp sickle'\)",
    'Omastar': r"if \(pkm\.includes\('omastar'\)\) \{\s*if \(name\.includes\('spike cannon'\)",
    'Dodrio': r"if \(pkm\.includes\('dodrio'\)\) \{\s*if \(name\.includes\('rage'\)",
    'Tentacruel': r"if \(pkm\.includes\('tentacruel'\)\) \{\s*if \(name\.includes\('jellyfish sting'\)"
}

for poke, pat in patterns.items():
    match = re.search(pat, bfx)
    print(f"{poke} dispatch regex: {'PASSED' if match else 'FAILED'}")

# Check JSX rendering blocks
print("\n=== VERIFYING JSX BLOCKS IN BattleFXOverlay.tsx ===")
jsx_cases = [
    "fx.type === 'kabutops_sickle_slash'",
    "fx.type === 'aerodactyl_wing_attack'",
    "fx.type === 'omastar_spike_cannon'",
    "fx.type === 'dodrio_tri_fury'",
    "fx.type === 'tentacruel_crimson_lash'"
]
for jc in jsx_cases:
    print(f"{jc}: {'FOUND' if jc in bfx else 'MISSING'}")

# Check durations in getFXDuration
print("\n=== VERIFYING getFXDuration IN BattleFXOverlay.tsx ===")
duration_cases = [
    "case 'kabutops_sickle_slash':",
    "case 'aerodactyl_wing_attack':",
    "case 'omastar_spike_cannon':",
    "case 'dodrio_tri_fury':",
    "case 'tentacruel_crimson_lash':"
]
for dc in duration_cases:
    print(f"{dc}: {'FOUND' if dc in bfx else 'MISSING'}")
