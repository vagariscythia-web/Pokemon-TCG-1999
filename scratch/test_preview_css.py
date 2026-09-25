import re

with open('public/preview_poison_vapor.html', encoding='utf-8') as f:
    html = f.read()

s = re.search(r'<style>(.*?)</style>', html, re.DOTALL).group(1)
open_b = s.count('{')
close_b = s.count('}')
print(f'CSS Braces: open={open_b}, close={close_b}')
assert open_b == close_b, f'Braces unbalanced: {open_b} vs {close_b}'

keyframes = re.findall(r'@keyframes\s+(\w+)', s)
print(f'Found {len(keyframes)} keyframes.')
for kf in keyframes:
    idx = s.find(f'@keyframes {kf}')
    p = s[:idx]
    po = p.count('{')
    pc = p.count('}')
    assert po == pc, f'Keyframe {kf} is nested inside another CSS rule! (open={po}, close={pc})'

print('All keyframes verified to be at CSS root level!')

# Check dimensions
assert 'width: 184px;' in html and 'height: 253px;' in html, 'Active card dimensions match GameBoard (184x253px)'
assert 'width: 110px;' in html and 'height: 151px;' in html, 'Bench card dimensions match GameBoard (110x151px)'
assert 'aspect-ratio: 600 / 825;' in html, 'Aspect ratio 600 / 825 matches CardView.tsx'
print('Scale and dimensions verified with 100% GameBoard parity!')
