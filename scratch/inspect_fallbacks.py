import json, re

cards = json.load(open('src/data/cards.json', encoding='utf-8'))
tsx = open('src/components/BattleFXOverlay.tsx', encoding='utf-8').read()

# Let's inspect getSpecificAttackFX router logic
# We can look at the default fallbacks at the end of getSpecificAttackFX:
start = tsx.find('export function getSpecificAttackFX(')
end = tsx.find('export function isSelfTargetingMove(')
router_code = tsx[start:end]

# What are the fallback return values at the end of router_code?
lines = router_code.split('\n')
print("End of getSpecificAttackFX (fallback section):")
for l in lines[-40:]:
    print("  ", l)
