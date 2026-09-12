import json, re

cards = json.load(open('src/data/cards.json', encoding='utf-8'))
tsx = open('src/components/BattleFXOverlay.tsx', encoding='utf-8').read()

start = tsx.find('export function getSpecificAttackFX(')
end = tsx.find('export function isSelfTargetingMove(')
router_code = tsx[start:end]

# Let's check:
# 1. Kadabra Super Psy:
# 2. Alakazam Confuse Ray:
# 3. Electrode Chain Lightning:
# 4. Machoke Karate Chop:
# 5. Machoke Submission:
# 6. Machamp Seismic Toss:
# 7. Haunter Dream Eater:
# 8. Gengar Dark Mind:
# 9. Ninetales Lure:

checks = [
    ('Kadabra', 'Super Psy'),
    ('Kadabra', 'Recover'),
    ('Alakazam', 'Confuse Ray'),
    ('Electrode', 'Chain Lightning'),
    ('Machoke', 'Karate Chop'),
    ('Machoke', 'Submission'),
    ('Machamp', 'Seismic Toss'),
    ('Haunter', 'Dream Eater'),
    ('Gengar', 'Dark Mind'),
    ('Ninetales', 'Lure'),
]

for p, a in checks:
    # search router_code for mentions
    p_lower = p.lower()
    a_lower = a.lower()
    matches = [line.strip() for line in router_code.split('\n') if (p_lower in line.lower() or a_lower in line.lower()) and 'return' in line]
    print(f"{p} - {a}:")
    for m in matches[:3]:
        print(f"   {m}")
    if not matches:
        print("   -> NO specific rule, falls back to generic!")
