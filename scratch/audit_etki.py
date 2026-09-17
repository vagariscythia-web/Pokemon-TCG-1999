import json

with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

# Replicate GameEngine.calculatePreviewAttackDamage base logic
def get_preview(c, a):
    attack_name = a.get('name', '').lower()
    base_damage = a.get('damage', 0)
    bonus_damage = 0
    multiplier_text = None
    is_variable = False

    # Current GameEngine logic:
    if attack_name == 'slash':
        pass # scyther swords dance
    
    if attack_name in ['water gun', 'hydro pump']:
        pass
    
    # 4b in GameEngine:
    if attack_name == 'flitter':
        base_damage = 20
    elif attack_name == 'dig under':
        base_damage = 10
    elif attack_name == 'coin hurl':
        base_damage = 20
        
    text = (a.get('text') or '').lower()
    if attack_name == 'stone barrage' or 'until you get tails' in text:
        multiplier_text = '0-∞×'
        is_variable = True
    elif attack_name in ['twineedle', 'double kick', 'doubleslap', 'slam', 'bonemerang'] or 'flip 2 coins' in text:
        multiplier_text = '0-2×'
    elif attack_name in ['fury swipes', 'triple kick', 'petal dance'] or 'flip 3 coins' in text:
        multiplier_text = '0-3×'
    elif attack_name in ['spike cannon', 'fury attack', 'comet punch'] or 'flip 4 coins' in text:
        multiplier_text = '0-4×'
    elif a.get('damageMultiplier') == '×':
        multiplier_text = '0-N×'
        is_variable = True

    total_damage = max(0, base_damage + bonus_damage)
    return {
        'base_damage': base_damage,
        'bonus_damage': bonus_damage,
        'total_damage': total_damage,
        'multiplier_text': multiplier_text,
        'is_variable': is_variable,
        'shows_damage': (a.get('damage', 0) > 0 or total_damage > 0)
    }

shows_effect_attacks = []
for c in cards:
    for a in c.get('attacks', []):
        prev = get_preview(c, a)
        if not prev['shows_damage']:
            shows_effect_attacks.append({
                'card_name': c.get('name'),
                'card_set': c.get('set'),
                'attack_name': a.get('name'),
                'damage': a.get('damage', 0),
                'damageMultiplier': a.get('damageMultiplier'),
                'text': a.get('text', '')
            })

# De-duplicate by attack name & text
seen = set()
unique_effect_attacks = []
for item in shows_effect_attacks:
    key = (item['attack_name'], item['text'])
    if key not in seen:
        seen.add(key)
        unique_effect_attacks.append(item)

print(f'Total unique attacks showing ETKI: {len(unique_effect_attacks)}')
for item in sorted(unique_effect_attacks, key=lambda x: x['attack_name']):
    print(f"[{item['card_name']} - {item['card_set']}] {item['attack_name']}: {item['text']}")
