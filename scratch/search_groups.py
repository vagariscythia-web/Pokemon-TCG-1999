import glob, json

log_files = ['C:/Users/KaanS/.gemini/antigravity-ide/brain/1e42f570-45b8-41a4-97c7-966a155cceda/.system_generated/logs/transcript.jsonl']

for f in log_files:
    print('Searching in', f)
    with open(f, 'r', encoding='utf-8', errors='ignore') as infile:
        for line in infile:
            try:
                data = json.loads(line)
                t = data.get('type')
                if t == 'USER_INPUT':
                    content = str(data.get('content', ''))
                    if any(k in content.lower() for k in ['grup', 'paket', 'stok', 'stock', 'basic', 'temel']):
                        print(f"[Step {data.get('step_index')}] USER_INPUT:")
                        print(content)
                        print('='*50)
            except Exception as e:
                pass
