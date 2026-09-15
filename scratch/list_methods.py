import re
with open('src/engine/GameEngine.ts', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        stripped = line.strip()
        if stripped.startswith('static ') and '(' in stripped:
            print(f'{i}: {stripped[:120]}')
