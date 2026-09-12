from collections import Counter

with open('scratch/all_returns.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

fx_types = []
for line in lines:
    parts = line.split('|')[0].strip().split(':')
    if len(parts) >= 2:
        fx_types.append(parts[1].strip())

counts = Counter(fx_types)
with open('scratch/return_counts.txt', 'w', encoding='utf-8') as out:
    for fx, count in counts.most_common():
        out.write(f"{fx}: {count}\n")

print("Wrote scratch/return_counts.txt")
