with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

start = code.find("fx.type === 'mewtwo_psychic'")
end = code.find("fx.type === 'mewtwo_barrier'", start)
print(code[start:end])
