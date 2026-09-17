import re
import os

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

moves = [
    'psyduck_headache',
    'psyduck_dizziness',
    'lapras_glacial_surge',
    'slowpoke_spacing_out',
    'slowpoke_afternoon_nap',
    'mankey_anger'
]

assets = [
    'public/assets/Psyduck_Migraine_Headache.png',
    'public/assets/Slowpoke_Spacing_Out.png',
    'public/assets/Mankey_Anger_Leap.png',
    'public/assets/Lapras_Glacial_Surge.png'
]

print("=== ASSET CHECK ===")
for a in assets:
    exists = os.path.exists(a)
    sz = os.path.getsize(a) if exists else 0
    print(f"  {a}: exists={exists}, size={sz} bytes")
    assert exists and sz > 0, f"Missing asset {a}"

print("\n=== MOVE AND KEYFRAME VALIDATION ===")
for m in moves:
    print(f"=== MOVE: {m} ===")
    assert f"fx.type === '{m}'" in tsx, f"Missing {m} in tsx"
    
    dur_match = re.search(rf"case '{m}':\s*return\s*(\d+);", tsx)
    assert dur_match, f"Missing duration for {m}"
    duration = int(dur_match.group(1))
    print(f"  getFXDuration: {duration}ms")
    
    start_pos = tsx.find(f"fx.type === '{m}'")
    end_pos = tsx.find('fx.type ===', start_pos + 20)
    block = tsx[start_pos:end_pos if end_pos != -1 else start_pos + 4000]
    
    # Check that image asset is present in the block
    if 'psyduck' in m:
        assert 'Psyduck_Migraine_Headache.png' in block, f"Missing Psyduck asset in {m}"
    elif 'lapras' in m:
        assert 'Lapras_Glacial_Surge.png' in block, f"Missing Lapras asset in {m}"
    elif 'slowpoke' in m:
        assert 'Slowpoke_Spacing_Out.png' in block, f"Missing Slowpoke asset in {m}"
    elif 'mankey' in m:
        assert 'Mankey_Anger_Leap.png' in block, f"Missing Mankey asset in {m}"
        
    anims = re.findall(r"animation:\s*['`\"]?([a-zA-Z0-9_\-]+)\s+([\d\.]+s)", block)
    print(f"  Animations found ({len(anims)}):")
    for anim_name, anim_dur in anims:
        kf_found = f"@keyframes {anim_name}" in css
        print(f"    - {anim_name} ({anim_dur}) -> in CSS: {kf_found}")
        assert kf_found, f"Missing keyframe @keyframes {anim_name} in index.css"

print("\nALL 4 POKEMON AND 6 MOVES VALIDATED SUCCESSFULLY!")
