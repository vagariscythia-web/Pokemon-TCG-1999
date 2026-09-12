import json

with open('C:/Users/KaanS/.gemini/antigravity-ide/brain/1e42f570-45b8-41a4-97c7-966a155cceda/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8') as f, open('scratch/view_group_origin.txt', 'w', encoding='utf-8') as out:
    for line in f:
        d = json.loads(line)
        idx = d.get('step_index')
        if idx in range(5800, 6090):
            t = d.get('type')
            if t in ['USER_INPUT', 'PLANNER_RESPONSE']:
                content = str(d.get('content', ''))
                if any(k in content for k in ['Grup A', 'Grup B', 'Kalan', 'kalan', 'stok görsel', 'stok']):
                    out.write(f"=== STEP {idx} ({t}) ===\n")
                    out.write(content + "\n\n")

print("Finished searching group origin")
