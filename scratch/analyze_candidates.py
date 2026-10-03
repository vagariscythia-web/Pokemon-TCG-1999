import json

with open('scratch/audit_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== TOP GENERIC / FALLBACK FX TYPES ===')
for g in sorted(data['genericStats'], key=lambda x: len(x['attacks']), reverse=True):
    count = len(g['attacks'])
    sample = ', '.join(g['attacks'][:6])
    more = f' (+{count-6} more)' if count > 6 else ''
    print(f"* {g['fxType']} [{count} attacks]: {sample}{more}")

print('\n=== CUSTOM SIGNATURE SVG / CANVAS FX TYPES ===')
for c in sorted(data['customSvgStats'], key=lambda x: len(x['attacks']), reverse=True):
    count = len(c['attacks'])
    sample = ', '.join(c['attacks'][:5])
    more = f' (+{count-5} more)' if count > 5 else ''
    print(f"* {c['fxType']} [{count} attacks]: {sample}{more}")

