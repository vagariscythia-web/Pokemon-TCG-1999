import json

log_path = r'C:\Users\KaanS\.gemini\antigravity-ide\brain\1e42f570-45b8-41a4-97c7-966a155cceda\.system_generated\logs\transcript_full.jsonl'
matches = []
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            content = data.get('content', '')
            if any(w in content.lower() for w in ['ölçek', 'boyut', 'ufak', 'küçük', 'büyü', 'scale', '50%']):
                matches.append(f"Step {data.get('step_index')}:\n{content}\n")

with open('scratch/user_scaling_requests.txt', 'w', encoding='utf-8') as out:
    out.write('\n----------------------------------------\n'.join(matches))

print(f"Wrote {len(matches)} matches to scratch/user_scaling_requests.txt")
