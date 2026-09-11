import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\{/\*\s*(\d+[a-z]?\..*?)\s*\*/\}([\s\S]*?)(?=\{/\*\s*\d+[a-z]?\.|\n\s*return\b|\n\s*</div\s*>\s*\n\s*\)\s*;\s*\n\})'
matches = re.findall(pattern, content)

lines = []
lines.append(f"Total numbered moves matched: {len(matches)}\n")
lines.append(f"{'Header':55} | {'FX Types':35} | {'Visual Type':20}")
lines.append("=" * 115)

for header, block in matches:
    types = re.findall(r"fx\.type\s*===\s*'([^']+)'", block)
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', block)
    svgs = re.findall(r'<svg', block)
    
    t_str = ", ".join(types) if types else "none"
    vis = "IMG: " + imgs[0].split('/')[-1] if len(imgs) > 0 else f"SVG ({len(svgs)})"
    lines.append(f"{header.strip()[:55]:55} | {t_str[:35]:35} | {vis}")

with open('scratch/all_moves_report.txt', 'w', encoding='utf-8') as out:
    out.write("\n".join(lines))

print("Report written to scratch/all_moves_report.txt")
