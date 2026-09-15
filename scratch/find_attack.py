with open('src/engine/GameEngine.ts', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'executeAttack' in line:
            print(f'{i}: {line.rstrip()[:140]}')
