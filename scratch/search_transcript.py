import json
import os

path = r'C:\Users\KaanS\.gemini\antigravity-ide\brain\98f3aaf0-2ef4-4f84-800a-0bd8dc1b283e\.system_generated\logs\transcript.jsonl'
if not os.path.exists(path):
    print("Transcript not found at", path)
else:
    print("Scanning transcript:", path)
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        for idx, line in enumerate(f):
            if 'pokedex' in line.lower() or 'trainer' in line.lower():
                try:
                    data = json.loads(line)
                    typ = data.get('type')
                    content = str(data.get('content', ''))
                    if typ == 'USER_INPUT' or '8' in content or 'pokedex' in content.lower():
                        print(f"--- Line {idx} | Type: {typ} ---")
                        print(content[:500])
                        print()
                except Exception as e:
                    pass
