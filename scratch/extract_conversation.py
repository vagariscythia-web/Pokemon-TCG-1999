import json

with open('C:/Users/KaanS/.gemini/antigravity-ide/brain/1e42f570-45b8-41a4-97c7-966a155cceda/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8') as f, open('scratch/view_steps.txt', 'w', encoding='utf-8') as out:
    for line in f:
        d = json.loads(line)
        idx = d.get('step_index')
        if idx in range(6090, 6420):
            t = d.get('type')
            if t in ['USER_INPUT', 'PLANNER_RESPONSE']:
                out.write(f"=== STEP {idx} ({t}) ===\n")
                out.write(str(d.get('content')) + "\n\n")
print("Done writing steps 6090 to 6420")
