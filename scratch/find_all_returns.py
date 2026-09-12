import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()[329:840]

all_ret = []
for i, line in enumerate(lines):
    m = re.findall(r"return\s+'([^']+)'", line)
    for r in m:
        all_ret.append((330 + i + 1, r, line.strip()))

print(f"Total return statements: {len(all_ret)}")
with open('scratch/all_returns.txt', 'w', encoding='utf-8') as out:
    for line_no, r, l in all_ret:
        out.write(f"{line_no}: {r}  |  {l}\n")
