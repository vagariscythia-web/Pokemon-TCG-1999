import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

mapping_lines = lines[329:840]
print(f"Total lines in getSpecificAttackFX: {len(mapping_lines)}")

returns = []
for i, line in enumerate(mapping_lines):
    line_clean = line.strip()
    if line_clean.startswith('return ') and line_clean.endswith(';'):
        ret_val = line_clean.replace('return ', '').replace(';', '').strip("'\"")
        returns.append((330 + i + 1, ret_val, line_clean))

print(f"Total returns: {len(returns)}")

# Check which return values are common generic types
generics = {'tackle', 'punch', 'scratch', 'slam', 'bite', 'tail_whip', 'growl', 'sing', 'pound', 'barrier', 'confuse_ray', 'hypnosis', 'whirlwind', 'leer', 'sand_attack', 'poison_powder', 'sleep_powder', 'stun_spore', 'string_shot'}
generic_hits = [r for r in returns if r[1] in generics]
print(f"Generic hits: {len(generic_hits)}")
with open('scratch/generic_hits.txt', 'w', encoding='utf-8') as out:
    for g in generic_hits:
        out.write(f"Line {g[0]}: {g[1]} -> {g[2]}\n")
