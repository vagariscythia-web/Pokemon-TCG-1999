with open("src/components/BattleFXOverlay.tsx", "r", encoding="utf-8") as f:
    c = f.read()

with open("scratch/kabutops_scyther_inspect.txt", "w", encoding="utf-8") as out:
    idx_k = c.find("fx.type === 'kabutops_sickle_slash'")
    if idx_k != -1:
        out.write("=== KABUTOPS BLOCK ===\n")
        out.write(c[idx_k:idx_k+2500] + "\n\n")

    idx_s = c.find("fx.type === 'scyther_blade_dance'")
    if idx_s != -1:
        out.write("=== SCYTHER BLOCK ===\n")
        out.write(c[idx_s:idx_s+2500] + "\n\n")

print("Done writing scratch/kabutops_scyther_inspect.txt")
