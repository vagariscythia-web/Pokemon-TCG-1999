with open("src/components/BattleFXOverlay.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

with open("scratch/bubble_gentle_lines.txt", "w", encoding="utf-8") as out:
    for i, line in enumerate(lines):
        if "bubble_gentle" in line:
            out.write(f"Line {i+1}: {line}\n")
            if "fx.type ===" in line:
                for j in range(i, min(i+80, len(lines))):
                    out.write(lines[j])
                break
print("Done writing scratch/bubble_gentle_lines.txt")
