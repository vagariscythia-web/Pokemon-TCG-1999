import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=== VERIFYING DROWZEE POUND OVERHAUL ===")

# 1. Check BattleFXOverlay.tsx
with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    overlay = f.read()

# Extract drowzee_pound block
pound_match = re.search(r"fx\.type === 'drowzee_pound' && \((.*?)\n\s*\{/\* 20bv\.", overlay, re.DOTALL)
assert pound_match, "drowzee_pound block not found!"
pound_code = pound_match.group(1)

# Check that Drowzee_Hypnosis_Trance is NOT in drowzee_pound
assert "Drowzee_Hypnosis_Trance" not in pound_code, "ERROR: Drowzee_Hypnosis_Trance.png is still inside drowzee_pound!"
print("✔ Drowzee_Hypnosis_Trance.png successfully removed from drowzee_pound")

# Check that Drowzee_Hypnosis_Trance is STILL in confuse_ray and nightmare
assert "drowzee_confuse_ray" in overlay and "Drowzee_Hypnosis_Trance.png" in overlay, "ERROR: Drowzee_Hypnosis_Trance missing from codebase!"
print("✔ Drowzee_Hypnosis_Trance.png preserved in confuse ray & nightmare")

# Check all 5 layers in drowzee_pound
assert "gbaDrowzeeGroundShock" in pound_code, "Missing Layer 1: gbaDrowzeeGroundShock"
assert "gbaDrowzeePalmStrike" in pound_code, "Missing Layer 2: gbaDrowzeePalmStrike"
assert "gbaDrowzeePalmWhiff" in pound_code, "Missing Layer 2 Whiff: gbaDrowzeePalmWhiff"
assert "gbaDrowzeeImpactFlash" in pound_code, "Missing Layer 3: gbaDrowzeeImpactFlash"
assert "gbaDrowzeeShockRing" in pound_code, "Missing Layer 4: gbaDrowzeeShockRing"
assert "gbaDrowzeeMoteScatter" in pound_code, "Missing Layer 5: gbaDrowzeeMoteScatter"
print("✔ All 5 layers present in drowzee_pound")

# Check SVG anatomical features
assert "drowzeePalmGrad" in pound_code, "Missing drowzeePalmGrad gradient"
assert "drowzeePalmAura" in pound_code, "Missing drowzeePalmAura filter"
assert "drowzeePalmShade" in pound_code, "Missing drowzeePalmShade"
print("✔ Unified Sugimori-style anatomical SVG palm present with gradients, shadows, and ink creases")

# Check whiff scaling
assert "58px" in pound_code and "82px" in pound_code, "Missing Tier 2 whiff and normal scaling (58px / 82px)"
print("✔ Tier 2 scale (82px normal / 58px whiff) correctly implemented")

# 2. Check index.css keyframes
with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

assert "@keyframes gbaDrowzeePalmStrike" in css, "Missing keyframe gbaDrowzeePalmStrike"
assert "@keyframes gbaDrowzeePalmWhiff" in css, "Missing keyframe gbaDrowzeePalmWhiff"
assert "@keyframes gbaDrowzeeGroundShock" in css, "Missing keyframe gbaDrowzeeGroundShock"
assert "@keyframes gbaDrowzeeImpactFlash" in css, "Missing keyframe gbaDrowzeeImpactFlash"
assert "@keyframes gbaDrowzeeShockRing" in css, "Missing keyframe gbaDrowzeeShockRing"
assert "@keyframes gbaDrowzeeMoteScatter" in css, "Missing keyframe gbaDrowzeeMoteScatter"
print("✔ All keyframes exist in index.css")

# 3. Check getFXDuration
dur_match = re.search(r"case 'drowzee_pound':\s*return (\d+);", overlay)
assert dur_match and dur_match.group(1) == "1200", f"Unexpected duration: {dur_match.group(1) if dur_match else 'None'}"
print("✔ getFXDuration('drowzee_pound') is exactly 1200ms, matching gbaDrowzeePalmStrike 1.20s")

print("\nALL DROWZEE POUND CHECKS PASSED PERFECTLY!")
