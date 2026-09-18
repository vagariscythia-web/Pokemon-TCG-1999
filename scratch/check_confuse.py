with open("src/components/BattleFXOverlay.tsx", "r", encoding="utf-8") as f:
    text = f.read()

print("Length of BattleFXOverlay.tsx:", len(text))
print("confuse_ray_spiral in text:", 'confuse_ray_spiral' in text)
print("CONFUSE_RAY_ARM_A in text:", 'CONFUSE_RAY_ARM_A' in text)
print("CONFUSE_RAY in text:", 'CONFUSE_RAY' in text)
print("backdrop-blur-[1px] in text:", 'backdrop-blur-[1px]' in text)

lines = text.splitlines()
for i, l in enumerate(lines):
    if 'confuse' in l.lower():
        print(f"L{i+1}: {l[:100]}")
