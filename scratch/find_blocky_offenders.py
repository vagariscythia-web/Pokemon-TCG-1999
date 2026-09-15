import re

with open('scratch/atmospheric_audit_details.txt', 'r', encoding='utf-8') as f:
    text = f.read()

sections = text.split('======================================================\nATMOSPHERIC MOVE: ')

print(f"Total Atmospheric Sections: {len(sections) - 1}")

blocky_offenders = []

for sec in sections[1:]:
    lines = sec.strip().splitlines()
    move_name = lines[0].replace('======================================================', '').strip()
    
    # Check if there is rotate() in keyframes
    has_rotate = 'rotate(' in sec
    # Check if it uses rounded-full
    has_rounded_full = 'rounded-full' in sec
    # Check if it has SVG path
    has_svg_path = '<path' in sec
    # Extract animations
    anims = re.findall(r"Animations: (\[[^\]]+\])", sec)
    
    # Look for rotating cloud keyframes
    rotating_kfs = []
    for kf in re.finditer(r'Keyframe @keyframes (\w+):\s*@keyframes \w+\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}', sec):
        kf_name = kf.group(1)
        kf_body = kf.group(2)
        if 'rotate(' in kf_body and any(w in kf_name.lower() for w in ['cloud', 'gas', 'smog', 'mist', 'smoke', 'vapor', 'puff', 'swirl', 'erupt']):
            rotating_kfs.append(kf_name)
    
    blocky_offenders.append({
        'move': move_name,
        'has_rotate': has_rotate,
        'rotating_kfs': rotating_kfs,
        'has_rounded_full': has_rounded_full,
        'has_svg_path': has_svg_path,
        'anims': anims[0] if anims else '[]'
    })

print("\n--- DETAILED AUDIT OF ATMOSPHERIC / GAS / SMOKE MOVES ---")
for b in blocky_offenders:
    print(f"\nMove: [{b['move']}]")
    print(f"  Has SVG Bézier: {b['has_svg_path']} | Uses Rounded Divs: {b['has_rounded_full']}")
    print(f"  Rotating Cloud Keyframes: {b['rotating_kfs']}")
    if b['rotating_kfs'] and not b['has_svg_path']:
        print(f"  ===> CRITICAL OFFENDER: Rigid Rotating Div Cluster! Exactly like old Horsea!")
    elif b['rotating_kfs']:
        print(f"  ===> SUSPICIOUS: Contains rotational cloud keyframes.")
    elif not b['has_svg_path'] and b['has_rounded_full']:
        print(f"  ===> WARNING: Uses div circles without organic SVG Bézier curves.")
    else:
        print(f"  STATUS: Organic SVG or modern particle system.")
