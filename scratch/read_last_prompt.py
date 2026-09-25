import json

transcript_path = r'C:\Users\KaanS\.gemini\antigravity-ide\brain\0abfbea1-565f-415a-8288-beb19e5e63f7\.system_generated\logs\transcript.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

user_inputs = []
for line in lines:
    data = json.loads(line)
    if data.get('type') == 'USER_INPUT':
        user_inputs.append((data.get('step_index'), data.get('content')))

with open('scratch/all_user_prompts.txt', 'w', encoding='utf-8') as out:
    for step, content in user_inputs:
        out.write(f"=== USER_INPUT STEP {step} ===\n")
        out.write(content + "\n\n" + "="*50 + "\n\n")

print(f"Wrote {len(user_inputs)} user inputs to scratch/all_user_prompts.txt")
