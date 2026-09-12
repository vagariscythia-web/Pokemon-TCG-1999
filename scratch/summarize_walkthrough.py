path = r'C:\Users\KaanS\.gemini\antigravity-ide\brain\1e42f570-45b8-41a4-97c7-966a155cceda\walkthrough.md'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    if line.startswith('# ') or line.startswith('## '):
        print(line.strip())
