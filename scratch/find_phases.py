import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\KaanS\.gemini\antigravity-ide\brain\1e42f570-45b8-41a4-97c7-966a155cceda\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        data = json.loads(line)
        content = data.get('content', '')
        if any(w in content for w in ['Phase 5', 'Phase 6', 'Faz 5', 'Faz 6', 'Phase 4']):
            matches = re.findall(r'(Phase \d[^\n\.\,\;]{0,80})', content)
            if matches:
                print(f"Step {data.get('step_index')}, Type: {data.get('type')}, Source: {data.get('source')}")
                for m in matches[:5]:
                    print(f"   {m}")
