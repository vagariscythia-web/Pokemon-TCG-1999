import json

path = r"C:\Users\KaanS\.gemini\antigravity-ide\brain\1e42f570-45b8-41a4-97c7-966a155cceda\.system_generated\logs\transcript.jsonl"

with open(path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f):
        try:
            data = json.loads(line)
            content = str(data.get("content", ""))
            # Check for user input or planner response containing "Aşama" or "aşama" or "Seçenek A" or "Seçenek B" or "Phase 1"
            if any(k in content for k in ["Aşama", "aşama", "Seçenek A", "Seçenek B", "Phase 1", "Phase 2", "İkinci Aşama", "ikinci aşama"]):
                src = data.get("source", "")
                t = data.get("type", "")
                print(f"Line {line_num} | {src} | {t}: {content[:150]}...")
        except Exception:
            pass
