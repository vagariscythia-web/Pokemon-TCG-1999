import re

css = open('src/index.css', encoding='utf-8').read()
assert css.count('{') == css.count('}'), f'index.css mismatch: {css.count("{")} vs {css.count("}")}'

html = open('public/preview_blastoise.html', encoding='utf-8').read()
styles = re.findall(r'<style>(.*?)</style>', html, re.DOTALL)
for i, s in enumerate(styles):
    assert s.count('{') == s.count('}'), f'style[{i}] mismatch: {s.count("{")} vs {s.count("}")}'
    nested_kf = re.findall(r'\{[^{}]*@keyframes', s)
    assert len(nested_kf) == 0, f'Nested keyframes in style[{i}]: {nested_kf}'

print('ALL CSS AND PREVIEW CHECKS PASSED!')
