with open('public/preview_advanced_vfx.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'<svg width="0" height="0"[^>]*>[\s\S]*?</svg>', text)
if m:
    print("Found SVG filter block:")
    print(m.group(0))
else:
    print("Not found")
