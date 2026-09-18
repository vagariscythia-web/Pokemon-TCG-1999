import re

with open("src/engine/GameEngine.ts", "r", encoding="utf-8") as f:
    engine_lines = f.readlines()

with open("src/components/GameBoard.tsx", "r", encoding="utf-8") as f:
    board_lines = f.readlines()

targets = ["pokedex", "here comes team rocket", "goop gas", "rocket's sneak attack", "nightly garbage run", "imposter oak", "devolution spray", "scoop up"]

with open("scratch/trainer_line_report.txt", "w", encoding="utf-8") as out:
    out.write("=== ENGINE MATCHES ===\n")
    for i, line in enumerate(engine_lines):
        for t in targets:
            if t in line.lower():
                out.write(f"L{i+1}: {line.strip()[:120]}\n")

    out.write("\n=== BOARD MATCHES ===\n")
    for i, line in enumerate(board_lines):
        for t in targets:
            if t in line.lower():
                out.write(f"L{i+1}: {line.strip()[:120]}\n")

print("Report saved to scratch/trainer_line_report.txt")
