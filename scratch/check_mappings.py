import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

moves = ['wing attack', 'sharp sickle', 'absorb', 'spike cannon', 'jellyfish sting', 'rage', 'sickle']
for m in moves:
    matches = re.findall(rf'.*name\.includes\(.{m}.*\n.*', text, re.IGNORECASE)
    print(f"Move '{m}':")
    for match in matches:
        print("   ", match.strip())
