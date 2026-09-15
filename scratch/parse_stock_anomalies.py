import re

with open('scratch/stock_audit_results.txt', 'r', encoding='utf-8') as f:
    text = f.read()

entries = text.split('[Move: ')
print(f"Total Stock Moves Analyzed: {len(entries) - 1}")

anomalies = []
for entry in entries[1:]:
    lines = entry.strip().splitlines()
    move_name = lines[0].replace(']', '')
    body = "\n".join(lines[1:])
    
    # Extract asset
    assets = re.findall(r'Asset:\s*(\S+)', body)
    
    # Check dimensions
    dimensions = re.findall(r'(?:w|max-w)-\[(\d+)px\]\s+(?:h|max-h)-\[(\d+)px\]', body)
    has_whiff = 'fx.whiffed' in body
    
    anomalies.append({
        'move': move_name,
        'assets': assets,
        'dims': dimensions,
        'has_whiff': has_whiff,
        'body': body
    })

print("\n--- DETAILED BREAKDOWN OF ALL STOCK ASSETS ---")
for a in anomalies:
    dim_str = str(a['dims']) if a['dims'] else "Tailwind class"
    whiff_str = "YES" if a['has_whiff'] else "NO"
    print(f"Move: {a['move']:<28} | Assets: {', '.join(a['assets']):<30} | Dims: {dim_str:<22} | Whiff: {whiff_str}")
