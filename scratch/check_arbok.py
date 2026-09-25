with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if any(k in line.lower() for k in ['arbok', 'stare']):
        print(f"{i+1}: {line.strip()[:100]}")
