import json
import os
from PIL import Image

print("Testing Batch 2 Move Implementations (Chansey & Hitmonlee):")

# 1. Asset existence & dimensions
assets = [
    ('public/assets/Chansey_Scrunch.png', (966, 836)),
    ('public/assets/Hitmonlee_High_Jump_Kick.png', (820, 768)),
    ('public/assets/Hitmonlee_Stretch_Kick.png', (1092, 974))
]

for path, expected_size in assets:
    assert os.path.exists(path), f"Asset {path} does not exist"
    im = Image.open(path)
    assert im.size == expected_size, f"{path} size {im.size} != {expected_size}"
    print(f"[OK] Asset verified: {path} ({im.size})")

# 2. BattleFXOverlay checks
bfx = open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8').read()
assert "'chansey_scrunch'" in bfx, "chansey_scrunch missing in BattleFXOverlay"
assert "'hitmonlee_stretch_kick'" in bfx, "hitmonlee_stretch_kick missing in BattleFXOverlay"
assert "'hitmonlee_high_jump_kick'" in bfx, "hitmonlee_high_jump_kick missing in BattleFXOverlay"

# Check dispatches
assert "pkm.includes('chansey')" in bfx, "Chansey check missing in getSpecificAttackFX"
assert "pkm.includes('hitmonlee')" in bfx, "Hitmonlee check missing in getSpecificAttackFX"

# Check self-targeting for scrunch
assert "name.includes('scrunch')" in bfx, "scrunch self-targeting check missing"

# 3. CSS Keyframes check
css = open('src/index.css', 'r', encoding='utf-8').read()
assert "gbaChanseyScrunchSquish" in css, "gbaChanseyScrunchSquish missing in index.css"
assert "gbaChanseyScrunchWobble" in css, "gbaChanseyScrunchWobble missing in index.css"
assert "gbaChanseyShieldRing" in css, "gbaChanseyShieldRing missing in index.css"
assert "gbaHitmonleeStretchThrust" in css, "gbaHitmonleeStretchThrust missing in index.css"
assert "gbaHitmonleeHighJumpPlunge" in css, "gbaHitmonleeHighJumpPlunge missing in index.css"
assert "gbaHitmonleeDropShock" in css, "gbaHitmonleeDropShock missing in index.css"

print("[OK] All code & keyframe assertions passed!")
print("\nALL BATCH 2 CHECKS PASSED (100% SUCCESS)!")
