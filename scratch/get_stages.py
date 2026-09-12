import json

path = r"C:\Users\KaanS\.gemini\antigravity-ide\brain\1e42f570-45b8-41a4-97c7-966a155cceda\.system_generated\logs\transcript.jsonl"

with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

out = []
for i, line in enumerate(lines[-300:]):
    data = json.loads(line)
    if data.get("type") == "PLANNER_RESPONSE":
        content = data.get("content", "")
        if "Aşama" in content or "aşama" in content or "Phase" in content or "Plan" in content:
            out.append(f"Index {i} PLANNER RESPONSE:\n{content}\n" + "="*50 + "\n")

with open(r"c:\Users\KaanS\.gemini\antigravity\scratch\pokemon-tcg-1999_demo\scratch\stages_output.txt", "w", encoding="utf-8") as f:
    f.writelines(out)

print(f"Done, written {len(out)} planner responses.")
