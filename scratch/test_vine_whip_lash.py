import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=== VERIFYING VINE WHIP LASH OVERHAUL ===")

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    overlay = f.read()

# Extract vine_whip_lash block
vw_match = re.search(r"fx\.type === 'vine_whip_lash' && \((.*?)\n\s*\{/\* 18c\.", overlay, re.DOTALL)
assert vw_match, "vine_whip_lash block not found!"
vw_code = vw_match.group(1)

# Check all 5 layers in vine_whip_lash
assert "gbaVineGroundAura" in vw_code, "Missing Layer 1: gbaVineGroundAura"
assert "gbaVineWhipLashLeft" in vw_code, "Missing Layer 2 Left: gbaVineWhipLashLeft"
assert "gbaVineWhipLashRight" in vw_code, "Missing Layer 2 Right: gbaVineWhipLashRight"
assert "gbaVineWhipWhiffLeft" in vw_code, "Missing Layer 2 Whiff Left: gbaVineWhipWhiffLeft"
assert "gbaVineWhipWhiffRight" in vw_code, "Missing Layer 2 Whiff Right: gbaVineWhipWhiffRight"
assert "gbaVineSnapFlash" in vw_code, "Missing Layer 3: gbaVineSnapFlash"
assert "gbaVineCutBladeLeft" in vw_code, "Missing Layer 4: gbaVineCutBladeLeft"
assert "gbaVineCutBladeRight" in vw_code, "Missing Layer 4: gbaVineCutBladeRight"
assert "gbaVineLeafFlutter" in vw_code, "Missing Layer 5: gbaVineLeafFlutter"
print("✔ All 5 layers present in vine_whip_lash")

# Check Himeno features
assert "vineGradLeft" in vw_code and "vineGradRight" in vw_code, "Missing vine gradients"
assert "vineCoreGrad" in vw_code, "Missing spine core gradient"
assert "vineLeafGrad" in vw_code, "Missing leaf gradient"
assert "vineChlorophyllGlow" in vw_code, "Missing chlorophyll glow filter"
print("✔ Kagemaru Himeno organic gradients and leaf buds verified")

# Check whiff scaling
assert "85px" in vw_code and "125px" in vw_code, "Missing whiff vs normal scaling (85px / 125px)"
print("✔ Whiff scale (85px) vs normal scale (125px) verified")

# Check routing
routing_match = re.search(r"if \(name\.includes\('vine whip'\)\) \{\s*return 'vine_whip_lash';", overlay)
assert routing_match, "Vine Whip attack routing to vine_whip_lash missing!"
print("✔ All Vine Whip attacks routed to vine_whip_lash")

# Check getFXDuration
dur_match = re.search(r"case 'vine_whip_lash':\s*return (\d+);", overlay)
assert dur_match and dur_match.group(1) == "1350", f"Unexpected duration: {dur_match.group(1) if dur_match else 'None'}"
print("✔ getFXDuration('vine_whip_lash') is 1350ms")

# Check index.css keyframes
with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

assert "@keyframes gbaVineWhipLashLeft" in css, "Missing keyframe gbaVineWhipLashLeft"
assert "@keyframes gbaVineWhipLashRight" in css, "Missing keyframe gbaVineWhipLashRight"
assert "@keyframes gbaVineWhipWhiffLeft" in css, "Missing keyframe gbaVineWhipWhiffLeft"
assert "@keyframes gbaVineWhipWhiffRight" in css, "Missing keyframe gbaVineWhipWhiffRight"
assert "@keyframes gbaVineGroundAura" in css, "Missing keyframe gbaVineGroundAura"
assert "@keyframes gbaVineSnapFlash" in css, "Missing keyframe gbaVineSnapFlash"
assert "@keyframes gbaVineCutBladeLeft" in css, "Missing keyframe gbaVineCutBladeLeft"
assert "@keyframes gbaVineCutBladeRight" in css, "Missing keyframe gbaVineCutBladeRight"
assert "@keyframes gbaVineLeafFlutter" in css, "Missing keyframe gbaVineLeafFlutter"
print("✔ All Vine Whip keyframes exist in index.css")

print("\nALL VINE WHIP LASH CHECKS PASSED PERFECTLY!")
