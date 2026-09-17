import re

with open('src/engine/GameEngine.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

moves = [
    'selfdestruct', 'earthquake', 'chain lightning', 'double-edge', 'take down',
    'submission', 'thunder jolt', 'thunder', 'electric shock', 'thrash',
    'thunderpunch', 'energy conversion', 'rocket tackle', 'thunder attack',
    'thunderstorm', 'blizzard', 'gigashock', 'poison vapor', 'flame pillar',
    'surprise thunder', 'mass explosion', 'spark', 'stretch kick', 'dark mind'
]

out = []
for m in moves:
    out.append(f"=== MOVE: {m} ===")
    matches = [i for i, line in enumerate(lines) if f"'{m}'" in line.lower() or f'"{m}"' in line.lower()]
    if not matches:
        out.append("  NOT FOUND!")
    for idx in matches:
        start = max(0, idx - 2)
        end = min(len(lines), idx + 18)
        out.append(f"Match at line {idx+1}:")
        for j in range(start, end):
            out.append(f"  {j+1}: {lines[j].rstrip()}")

with open('scratch/audit_results.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(out))

print("Audit written to scratch/audit_results.txt successfully")
