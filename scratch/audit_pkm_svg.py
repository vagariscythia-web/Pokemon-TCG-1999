import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

blocks = re.split(r"fx\.type\s*===\s*'([^']+)'", content)

pokemon_names = [
    'bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard',
    'squirtle', 'wartortle', 'blastoise', 'caterpie', 'metapod', 'butterfree',
    'weedle', 'kakuna', 'beedrill', 'pidgey', 'pidgeotto', 'pidgeot', 'rattata', 'raticate',
    'spearow', 'fearow', 'ekans', 'arbok', 'pikachu', 'raichu', 'sandshrew', 'sandslash',
    'nidoran', 'nidorina', 'nidoqueen', 'nidorino', 'nidoking', 'clefairy', 'clefable',
    'vulpix', 'ninetales', 'jigglypuff', 'wigglytuff', 'zubat', 'golbat', 'oddish', 'gloom', 'vileplume',
    'paras', 'parasect', 'venonat', 'venomoth', 'diglett', 'dugtrio', 'meowth', 'persian',
    'psyduck', 'golduck', 'mankey', 'primeape', 'growlithe', 'arcanine', 'poliwag', 'poliwhirl', 'poliwrath',
    'abra', 'kadabra', 'alakazam', 'machop', 'machoke', 'machamp', 'bellsprout', 'weepinbell', 'victreebel',
    'tentacool', 'tentacruel', 'geodude', 'graveler', 'golem', 'ponyta', 'rapidash', 'slowpoke', 'slowbro',
    'magnemite', 'magneton', 'farfetch', 'doduo', 'dodrio', 'seel', 'dewgong', 'grimer', 'muk',
    'shellder', 'cloyster', 'gastly', 'haunter', 'gengar', 'onix', 'drowzee', 'hypno', 'krabby', 'kingler',
    'voltorb', 'electrode', 'exeggcute', 'exeggutor', 'cubone', 'marowak', 'hitmonlee', 'hitmonchan',
    'lickitung', 'koffing', 'weezing', 'rhyhorn', 'rhydon', 'chansey', 'tangela', 'kangaskhan',
    'horsea', 'seadra', 'goldeen', 'seaking', 'staryu', 'starmie', 'mr. mime', 'scyther', 'jynx',
    'electabuzz', 'magmar', 'pinsir', 'tauros', 'magikarp', 'gyarados', 'lapras', 'ditto', 'eevee',
    'vaporeon', 'jolteon', 'flareon', 'porygon', 'omanyte', 'omastar', 'kabuto', 'kabutops',
    'aerodactyl', 'snorlax', 'articuno', 'zapdos', 'moltres', 'dratini', 'dragonair', 'dragonite', 'mewtwo', 'mew'
]

candidates = []

for i in range(1, len(blocks), 2):
    fx_name = blocks[i]
    body = blocks[i+1][:3500]
    has_img = '<img' in body
    
    prev = blocks[i-1][-400:] if i > 0 else ""
    comment_m = re.findall(r'\{/\*([\s\S]*?)\*/\}', prev)
    last_comment = comment_m[-1].strip() if comment_m else ""
    
    context = (last_comment + " " + fx_name + " " + body[:300]).lower()
    found_pkms = [p for p in pokemon_names if p in context]
    
    if not has_img:
        svg_count = len(re.findall(r'<svg', body))
        candidates.append({
            'fx': fx_name,
            'comment': last_comment[:70],
            'pkms': found_pkms,
            'svg_count': svg_count,
            'body': body
        })

pkm_candidates = [c for c in candidates if len(c['pkms']) > 0 and c['svg_count'] > 0]

lines = []
lines.append(f"Total non-img FX: {len(candidates)}")
lines.append(f"Pokemon-specific SVG moves: {len(pkm_candidates)}\n")
lines.append(f"{'FX Name':30} | {'Pokemon':25} | {'SVGs':5} | {'Comment'}")
lines.append("=" * 110)

for c in pkm_candidates:
    lines.append(f"{c['fx']:30} | {', '.join(c['pkms'])[:25]:25} | {c['svg_count']:<5} | {c['comment']}")

with open('scratch/pkm_candidates.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(lines))

print("Wrote scratch/pkm_candidates.txt successfully")
