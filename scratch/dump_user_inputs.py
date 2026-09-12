import json

path = r"C:\Users\KaanS\.gemini\antigravity-ide\brain\1e42f570-45b8-41a4-97c7-966a155cceda\.system_generated\logs\transcript.jsonl"

with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

out = []
for i, line in enumerate(lines[-300:]):
    data = json.loads(line)
    if data.get("type") == "USER_INPUT":
        out.append(f"[{i}] USER:\n{data.get('content')}\n---\n")

with open(r"c:\Users\KaanS\.gemini\antigravity\scratch\pokemon-tcg-1999_demo\scratch\user_history.txt", "w", encoding="utf-8") as f:
    f.writelines(out)

print(f"Wrote {len(out)} user messages.")
