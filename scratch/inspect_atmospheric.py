import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx_text = f.read()

with open('src/index.css', 'r', encoding='utf-8') as f:
    css_text = f.read()

atmospheric_moves = [
    'weezing_toxic_smog', 'koffing_foul_gas', 'gastly_sleeping_gas', 'magmar_smog',
    'smokescreen_cloud', 'paras_spore', 'oddish_stun_spore', 'venomoth_venom_powder',
    'poison_vapor_bench', 'sandshrew_sand_attack', 'sand_attack_dust', 'sand_attack_throw',
    'sleeping_gas', 'smog_haze', 'stun_gas', 'stun_spore', 'poisonpowder_shower'
]

block_iter = list(re.finditer(r"\{fx\.type === ['\"]([^'\"]+)['\"]", tsx_text))

with open('scratch/atmospheric_audit_details.txt', 'w', encoding='utf-8') as out:
    for i, match in enumerate(block_iter):
        fx_name = match.group(1)
        if fx_name in atmospheric_moves:
            start_pos = match.start()
            end_pos = block_iter[i+1].start() if i+1 < len(block_iter) else len(tsx_text)
            block_code = tsx_text[start_pos:end_pos]
            
            out.write(f"\n======================================================\n")
            out.write(f"ATMOSPHERIC MOVE: {fx_name}\n")
            out.write(f"======================================================\n")
            
            # Find animations used
            anims = re.findall(r"animation:\s*['\"]([^'\"]+)['\"]", block_code)
            out.write(f"Animations: {anims}\n")
            
            # Check keyframes in index.css
            for anim in set(a.split()[0] for a in anims):
                kf_match = re.search(rf"@keyframes\s+{re.escape(anim)}\s*\{{([^}}]+(?:\{{[^}}]*\}}[^}}]*)*)\}}", css_text)
                if kf_match:
                    kf_body = kf_match.group(0)
                    out.write(f"\nKeyframe @keyframes {anim}:\n")
                    out.write(kf_body[:500] + "\n")
            
            out.write("\nTSX Structure Preview:\n")
            for line in block_code.splitlines()[:25]:
                out.write(f"  {line}\n")

print("Atmospheric details saved to scratch/atmospheric_audit_details.txt")
