import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all img tags and look back 300 chars for their parent div class
img_tags = list(re.finditer(r'<img[^>]+src=[\'"]([^\'"]+)[\'"]', text))
print(f"Total img tags in BattleFXOverlay: {len(img_tags)}")
for m in img_tags:
    src = m.group(1)
    if 'assets/' in src:
        # look backward up to 300 characters
        start = max(0, m.start() - 300)
        snippet = text[start:m.end()]
        div_match = re.findall(r'<div[^>]*className=([^\n>]+)', snippet)
        parent_class = div_match[-1] if div_match else 'none'
        print(f"\nAsset: {src.split('/')[-1]}")
        print(f"  Parent class: {parent_class}")
