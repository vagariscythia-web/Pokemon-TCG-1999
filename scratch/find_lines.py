with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    lines = f.readlines()

targets = ['"id": "fo-7"', '"id": "fo-22"', '"id": "tr-7"', '"id": "tr-24"', '"id": "tr-52"', '"id": "tr-62"']

for i, line in enumerate(lines):
    for t in targets:
        if t in line:
            print(f'Card at line {i+1}: {line.strip()}')
            for j in range(i, min(len(lines), i+30)):
                if '"name": "Stretch Kick"' in lines[j] or '"name": "Flitter"' in lines[j] or '"name": "Dig Under"' in lines[j] or '"name": "Coin Hurl"' in lines[j]:
                    print(f'  Attack at line {j+1}: {lines[j].strip()}')
                    for k in range(j, min(len(lines), j+10)):
                        if '"damage": 0' in lines[k]:
                            print(f'    damage at line {k+1}: {lines[k].strip()}')
                            break
