with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

moves_to_inspect = ['weezing_toxic_smog', 'koffing_foul_gas', 'gastly_sleeping_gas', 'magmar_smog', 'paras_spore']

block_iter = list(re.finditer(r"\{fx\.type === ['\"]([^'\"]+)['\"]", text))

for i, match in enumerate(block_iter):
    fx_name = match.group(1)
    if fx_name in moves_to_inspect:
        start_pos = match.start()
        end_pos = block_iter[i+1].start() if i+1 < len(block_iter) else len(text)
        code = text[start_pos:end_pos]
        print(f"\n==========================================")
        print(f"JSX FOR {fx_name}")
        print(f"==========================================")
        for line in code.splitlines()[:35]:
            print(line)
