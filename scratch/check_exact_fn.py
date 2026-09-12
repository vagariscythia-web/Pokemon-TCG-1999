import re

content = open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8').read()
start = content.find('export function getSpecificAttackFX(')
end = content.find('\nexport function isSelfTargetingMove', start)
fn_body = content[start:end]

queries = ['mewtwo', 'zapdos', 'articuno', 'moltres', 'ditto', 'mr. mime', 'barrier', 'wildfire', 'dive bomb', 'freeze dry', 'blizzard', 'thunderstorm', 'thunderbolt', 'meditate']

for q in queries:
    matches = [line.strip() for line in fn_body.splitlines() if q in line.lower()]
    print(f"Query '{q}': {len(matches)} matches")
    for m in matches[:3]:
        print(f"   {m}")
