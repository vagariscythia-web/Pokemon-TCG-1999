with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

queries = ['bind', 'minimize', 'leech life', 'supersonic', 'hypnosis', 'spore', 'stun spore', 'nasty goo', 'poisonpowder', 'leech seed']
for q in queries:
    has_q = q in text.lower()
    print(f'{q}: found = {has_q}')
