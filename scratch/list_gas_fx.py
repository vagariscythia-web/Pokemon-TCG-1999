import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

matches = re.findall(r"fx\.type\s*===?\s*['\"]([^'\"]+)['\"]", content)
print(f"Total fx.type conditions: {len(matches)}")
unique_types = sorted(set(matches))

keywords = ['gas', 'smog', 'smoke', 'cloud', 'dust', 'powder', 'spore', 'mist', 'haze', 'vapor', 'sand', 'acid', 'poison', 'toxic', 'wind', 'puff', 'ash']
relevant = [t for t in unique_types if any(k in t for k in keywords)]
print(f"Relevant particle/gas/dust/cloud fx types ({len(relevant)}):")
for r in relevant:
    print(' -', r)
