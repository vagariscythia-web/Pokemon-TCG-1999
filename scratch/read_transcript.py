import json, sys

log_path = r'C:\Users\KaanS\.gemini\antigravity-ide\brain\1e42f570-45b8-41a4-97c7-966a155cceda\.system_generated\logs\transcript.jsonl'
with open('scratch/transcript_summary.txt', 'w', encoding='utf-8') as out:
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            t = data.get('type')
            if t == 'USER_INPUT':
                content = data.get('content', '').replace('\n', ' ')
                out.write(f"[{data.get('step_index')}] USER: {content}\n\n")
            elif t == 'PLANNER_RESPONSE':
                content = data.get('content', '')
                if content:
                    out.write(f"[{data.get('step_index')}] ASSISTANT: {content[:300]}...\n\n")
print("Done writing transcript_summary.txt")
