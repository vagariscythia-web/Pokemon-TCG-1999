import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

kfs = re.findall(r'@keyframes\s+([a-zA-Z0-9_\-]+)\s*\{([^}]+)\}', css)
keywords = ['gas', 'smoke', 'cloud', 'dust', 'spore', 'powder', 'fog', 'vapor', 'sand', 'ember', 'wind', 'sludge', 'wisp', 'haze']

matching_kfs = []
for name, body in kfs:
    if any(k in name.lower() for k in keywords):
        stops = re.findall(r'(\d+%)', body)
        matching_kfs.append((name, len(stops), stops, body.strip()))

print(f"Found {len(matching_kfs)} matching gas/dust/smoke/ember keyframes:")
# sort by number of stops ascending to find the most simplistic/crude ones
matching_kfs.sort(key=lambda x: x[1])
for name, count, stops, body in matching_kfs:
    print(f"- {name}: {count} stops -> {stops}")
