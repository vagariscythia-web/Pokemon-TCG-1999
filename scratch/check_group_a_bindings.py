import json

# Let's inspect what getSpecificAttackFX returns for these
bfx = open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8').read()

moves_to_check = [
    ('Mewtwo', 'Psychic'),
    ('Mewtwo', 'Barrier'),
    ('Zapdos', 'Thunder'),
    ('Zapdos', 'Thunderbolt'),
    ('Zapdos', 'Thunderstorm'),
    ('Articuno', 'Freeze Dry'),
    ('Articuno', 'Blizzard'),
    ('Moltres', 'Wildfire'),
    ('Moltres', 'Dive Bomb'),
    ('Ditto', 'Transform Attack'),
    ('Mr. Mime', 'Meditate'),
    ('Mr. Mime', 'Invisible Wall')
]

for pkm, move in moves_to_check:
    # search how bfx treats it
    print(f"Checking {pkm} - {move}...")
