import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

dyn_matches = re.findall(r'fx\.whiffed\s*\?\s*[\'\"`]w-\[(\d+)px\]\s+h-\[(\d+)px\][\'\"`]\s*:\s*[\'\"`]w-\[(\d+)px\]\s+h-\[(\d+)px\][\'\"`][^>]*>[\s\S]{0,250}?<img[^>]+src=[\'\"/]+assets/([^\'\"\.]+\.png)', text)
print('Whiff dynamic scaling with img:')
for d in dyn_matches:
    print(f"  {d[4]}: Standard {d[2]}x{d[3]} | Whiffed {d[0]}x{d[1]}")
