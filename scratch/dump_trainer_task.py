import json

path = r'C:\Users\KaanS\.gemini\antigravity-ide\brain\98f3aaf0-2ef4-4f84-800a-0bd8dc1b283e\.system_generated\logs\transcript.jsonl'
out_path = r'scratch\trainer_task_dump.txt'

with open(path, 'r', encoding='utf-8', errors='ignore') as f, open(out_path, 'w', encoding='utf-8') as out:
    for idx, line in enumerate(f):
        if 2840 <= idx <= 3020:
            try:
                data = json.loads(line)
                typ = data.get('type')
                if typ in ('USER_INPUT', 'PLANNER_RESPONSE', 'RUN_COMMAND', 'SYSTEM_MESSAGE'):
                    out.write(f"=== Line {idx} | {typ} ===\n")
                    content = str(data.get('content', ''))
                    out.write(content + "\n\n")
            except Exception as e:
                pass

print("Wrote lines 2840-3020 to", out_path)
