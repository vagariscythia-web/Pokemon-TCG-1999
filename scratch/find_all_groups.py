import json

log_path = r'C:\Users\KaanS\.gemini\antigravity-ide\brain\1e42f570-45b8-41a4-97c7-966a155cceda\.system_generated\logs\transcript_full.jsonl'

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        content = data.get('content', '')
        if 'Grup C' in content and ('Grup D' in content or 'Grup E' in content):
            with open('scratch/all_groups_full.txt', 'w', encoding='utf-8') as out:
                out.write(content)
            print("Found and wrote scratch/all_groups_full.txt")
            break
