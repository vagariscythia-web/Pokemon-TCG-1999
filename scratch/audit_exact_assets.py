import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

imgs = re.findall(r'src=["\'](/assets/[^"\']+)["\']', tsx)
unique_imgs = sorted(set(imgs))

print(f"Total unique images referenced in BattleFXOverlay: {len(unique_imgs)}")
for img in unique_imgs:
    pos = tsx.find(img)
    line_no = tsx[:pos].count('\n') + 1
    print(f"  Line {line_no:5d}: {img}")
