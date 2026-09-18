import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.findall(r"case\s+'([^']+)':\s*(?:return\s+(\d+);)?", text)
dur_dict = {}
current_keys = []
for line in text.splitlines():
    case_m = re.search(r"case\s+'([^']+)':", line)
    if case_m:
        current_keys.append(case_m.group(1))
    ret_m = re.search(r"return\s+(\d+);", line)
    if ret_m and current_keys:
        for k in current_keys:
            dur_dict[k] = int(ret_m.group(1))
        current_keys = []

print("vine_whip_lash duration:", dur_dict.get('vine_whip_lash', 'NOT SET (falls back to default 1200ms)'))
