with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

queries = ['bind', 'minimize', 'leech life', 'supersonic', 'hypnosis', 'spore', 'stun spore', 'nasty goo', 'sticky hands']
for q in queries:
    print(f'=== Query: {q} ===')
    for idx, line in enumerate(lines[:800]):
        if q in line.lower():
            print(f'Line {idx+1}: {line.strip()}')
