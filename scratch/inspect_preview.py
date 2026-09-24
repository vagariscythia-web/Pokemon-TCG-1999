with open('public/preview_grimer_muk.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
stages = re.findall(r'id=["\'](stage-[^"\']*)["\']', text)
print('Stages in HTML:', stages)

onclicks = re.findall(r'onclick=["\']([^"\']*)["\']', text)
print('Onclicks:', onclicks)
