import json, re

cards = json.load(open('src/data/cards.json', encoding='utf-8'))
tsx = open('src/components/BattleFXOverlay.tsx', encoding='utf-8').read()

# Let's see what each card's attacks resolve to.
# Let's parse getSpecificAttackFX in python to simulate the routing accurately.
start = tsx.find('export function getSpecificAttackFX(')
end = tsx.find('export function isSelfTargetingMove(')
router_code = tsx[start:end]

# Let's inspect which moves in BattleFXOverlay are actually minimal / crude or generic
generic_types = [
    'tackle', 'scratch', 'punch', 'slash', 'bite', 'kick_strike', 
    'water_gun', 'ember_spark', 'flamethrower', 'thunder_shock',
    'psychic_distortion', 'poison_powder', 'sleep_powder', 'stun_spore'
]

# Let's find which cards use these
generics_by_card = {}
for c in cards:
    pkm = c.get('name', '')
    for a in c.get('attacks', []):
        atk = a.get('name', '')
        # let's find if pkm has a specific rule in router_code
        # search for pkm.includes('...') in router_code
        # This gives us a strong picture of what moves don't have custom logic
        pass

print("Done inspecting.")
