import json

transcript_path = r"C:\Users\KaanS\.gemini\antigravity-ide\brain\98f3aaf0-2ef4-4f84-800a-0bd8dc1b283e\.system_generated\logs\transcript.jsonl"
with open("scratch/last_turn_actions.txt", "w", encoding="utf-8") as out:
    with open(transcript_path, "r", encoding="utf-8") as f:
        for line_idx, line in enumerate(f):
            if line_idx >= 3010:
                d = json.loads(line)
                t = d.get("type")
                tc = d.get("tool_calls")
                if tc:
                    for c in tc:
                        call_name = c.get("name") or (c.get("function") and c["function"].get("name"))
                        args = c.get("args") or (c.get("function") and c["function"].get("arguments"))
                        out.write(f"L{line_idx} | Tool: {call_name}\n")
                        if call_name in ["replace_file_content", "multi_replace_file_content", "write_to_file"]:
                            if isinstance(args, str):
                                try:
                                    args = json.loads(args)
                                except:
                                    pass
                            tf = args.get("TargetFile") if isinstance(args, dict) else str(args)[:50]
                            out.write(f"   >>> FILE MODIFIED: {tf}\n")
                elif t == "USER_INPUT":
                    out.write(f"L{line_idx} | USER_INPUT: {d.get('content', '')[:70]}\n")
print("Done writing to scratch/last_turn_actions.txt")
