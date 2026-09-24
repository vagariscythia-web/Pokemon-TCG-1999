import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

targets = ['scyther_blade_dance', 'muk_sludge_deluge', 'articuno_blizzard', 'cloyster_clamp', 'cloyster_spike_cannon', 'mewtwo_psychic', 'drowzee_nightmare']

for t in targets:
    pos = code.find(f"'{t}'")
    if pos != -1:
        # find the render block
        block_pos = code.find(f"fx.type === '{t}'")
        if block_pos != -1:
            snippet = code[block_pos:block_pos+1600]
            print(f"=== {t} ===")
            for line in snippet.split('\n'):
                if any(k in line for k in ['width:', 'height:', 'top:', 'left:', 'w-[', 'h-[', 'scale', 'transform:']):
                    print("  ", line.strip())
