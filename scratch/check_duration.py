with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "case 'flare_burst':" in line:
        print(f"Line {i+1}: {line.strip()}")
        print(f"Line {i+2}: {lines[i+1].strip()}")
