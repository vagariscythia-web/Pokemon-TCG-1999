import json

with open('C:/Users/KaanS/.gemini/antigravity-ide/brain/1e42f570-45b8-41a4-97c7-966a155cceda/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8') as f, open('scratch/stock_candidates_history.txt', 'w', encoding='utf-8') as out:
    for line in f:
        d = json.loads(line)
        content = str(d.get('content', ''))
        idx = d.get('step_index')
        if any(term in content.lower() for term in ['stok görsele uygun', 'stok görsel adayı', 'stok görsel aday', 'stok görseli adayı']):
            out.write(f"=== STEP {idx} ===\n")
            for p in content.split('\n'):
                if any(w in p.lower() for w in ['stok', 'görsel', 'uygunluk', 'aday', 'grup a', 'grup b', 'grup c', 'grup d']):
                    out.write(p + '\n')
            out.write('\n')

print("Wrote stock candidates history")
