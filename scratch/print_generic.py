import json

with open('scratch/audit_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for g in sorted(data['genericStats'], key=lambda x: len(x['attacks']), reverse=True):
    print(f"=== {g['fxType']} ({len(g['attacks'])} attacks) ===")
    for a in g['attacks']:
        print(f"  - {a}")
