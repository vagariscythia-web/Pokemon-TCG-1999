with open('public/preview_advanced_vfx.html', 'r', encoding='utf-8') as f:
    vfx_html = f.read()

with open('public/preview_advanced_moves_showcase.html', 'r', encoding='utf-8') as f:
    showcase_html = f.read()

print('vfx_html static svg at body start:', '<svg width="0" height="0"' in vfx_html[:25000])
print('showcase_html static svg at body start:', '<svg width="0" height="0"' in showcase_html[:25000])
