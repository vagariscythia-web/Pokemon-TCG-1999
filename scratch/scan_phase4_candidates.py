import json, re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

m = re.search(r'export function getAttackFXType.*?\n\}', code, re.DOTALL)
if m:
    mapping_code = m.group(0)
    generics = ['tackle', 'punch', 'scratch', 'slam', 'bite', 'tail_whip', 'growl', 'sing', 'pound', 'barrier', 'confuse_ray', 'hypnosis']
    found = []
    for line in mapping_code.split('\n'):
        line_clean = line.strip()
        for g in generics:
            if f"return '{g}'" in line_clean or f'return "{g}"' in line_clean:
                found.append(line_clean)
                break
    print(f"Total generic return lines: {len(found)}")
    with open('scratch/candidates_output.txt', 'w', encoding='utf-8') as out:
        for item in found:
            out.write(item + '\n')
    print("Wrote scratch/candidates_output.txt")
