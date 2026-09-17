with open('scratch/audit_results.txt', 'r', encoding='utf-8') as f:
    text = f.read()

sections = text.split("=== MOVE: ")
out = []
for sec in sections:
    if not sec.strip(): continue
    lines = sec.split('\n')
    move_name = lines[0].strip()
    out.append(f"\n==================== {move_name} ====================")
    for l in lines[1:25]:
        out.append(l)

with open('scratch/audit_summary.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print("Done summary")
