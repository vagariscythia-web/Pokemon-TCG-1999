import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

moves = ['venonat_stun_spore', 'venonat_leech_life', 'paras_spore', 'exeggcute_hypnosis']

for m in moves:
    print(f"=== MOVE: {m} ===")
    assert f"fx.type === '{m}'" in tsx, f"Missing {m} in tsx"
    
    dur_match = re.search(rf"case '{m}':\s*return\s*(\d+);", tsx)
    assert dur_match, f"Missing duration for {m}"
    duration = int(dur_match.group(1))
    print(f"  getFXDuration: {duration}ms")
    
    start_pos = tsx.find(f"fx.type === '{m}'")
    end_pos = tsx.find('fx.type ===', start_pos + 20)
    block = tsx[start_pos:end_pos if end_pos != -1 else start_pos + 3000]
    
    anims = re.findall(r"animation:\s*['`\"]?([a-zA-Z0-9_\-]+)\s+([\d\.]+s)", block)
    print(f"  Animations in block ({len(anims)}):")
    for anim_name, anim_dur in anims:
        kf_found = f"@keyframes {anim_name}" in css
        print(f"    - {anim_name} ({anim_dur}) -> in CSS: {kf_found}")
        assert kf_found, f"Missing keyframe @keyframes {anim_name} in index.css"

print("\nALL BATCH B2 MOVES SUCCESSFULLY VALIDATED!")
