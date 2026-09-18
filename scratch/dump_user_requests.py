import json
import sys

path = r'C:\Users\KaanS\.gemini\antigravity-ide\brain\98f3aaf0-2ef4-4f84-800a-0bd8dc1b283e\.system_generated\logs\transcript.jsonl'
out_path = r'scratch\user_requests_dump.txt'

with open(path, 'r', encoding='utf-8', errors='ignore') as f, open(out_path, 'w', encoding='utf-8') as out:
    for idx, line in enumerate(f):
        try:
            data = json.loads(line)
            typ = data.get('type')
            if typ == 'USER_INPUT':
                out.write(f"=== Line {idx} | USER_INPUT ===\n")
                out.write(str(data.get('content')) + "\n\n")
            elif typ == 'PLANNER_RESPONSE' and ('trainer' in str(data.get('content')).lower() or 'pokedex' in str(data.get('content')).lower()):
                out.write(f"=== Line {idx} | PLANNER_RESPONSE (excerpt) ===\n")
                out.write(str(data.get('content'))[:500] + "\n\n")
        except Exception as e:
            pass

print("Wrote user requests to", out_path)
