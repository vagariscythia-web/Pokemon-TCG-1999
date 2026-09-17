import os
import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

used_images = re.findall(r'/assets/([^"\'\s>]+)', tsx)
used_set = set(used_images)

all_assets = [f for f in os.listdir('public/assets') if f.endswith(('.png', '.webp', '.jpg', '.jpeg', '.svg')) and not f.startswith(('energy_', 'coin_', 'counter_', 'bg_'))]

print(f"TOTAL CUSTOM ASSETS IN public/assets: {len(all_assets)}")
print(f"USED IN BattleFXOverlay: {len(used_set)}")

print("\n--- UNUSED ASSETS IN public/assets ---")
for a in sorted(all_assets):
    if a not in used_set:
        print(f"  Unused: {a}")

print("\n--- CURRENTLY USED IN BattleFXOverlay ---")
for a in sorted(used_set):
    print(f"  Used: {a}")
