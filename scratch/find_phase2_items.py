import re

with open(r"c:\Users\KaanS\.gemini\antigravity\scratch\pokemon-tcg-1999_demo\src\components\BattleFXOverlay.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u203c-\u2049]')

out = []
out.append("=== Emojis in BattleFXOverlay.tsx ===\n")
for i, line in enumerate(lines):
    matches = emoji_pattern.findall(line)
    if matches:
        out.append(f"Line {i+1}: {matches} -> {line.strip()[:100]}\n")

out.append("\n=== Zapdos, Shellder, Venonat in BattleFXOverlay.tsx ===\n")
for i, line in enumerate(lines):
    low = line.lower()
    if any(k in low for k in ["zapdos", "shellder", "venonat"]):
        out.append(f"Line {i+1}: {line.strip()[:100]}\n")

with open(r"c:\Users\KaanS\.gemini\antigravity\scratch\pokemon-tcg-1999_demo\scratch\phase2_found.txt", "w", encoding="utf-8") as f:
    f.writelines(out)

print("Done.")
