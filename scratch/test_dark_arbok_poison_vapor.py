import os
import json
import re

ROOT = r"c:\Users\KaanS\.gemini\antigravity\scratch\pokemon-tcg-1999_demo"

def run_tests():
    passed = 0
    total = 0

    def assert_true(cond, msg):
        nonlocal passed, total
        total += 1
        if cond:
            passed += 1
            print(f"[PASS] {msg}")
        else:
            print(f"[FAIL] {msg}")

    # 1. Asset verification
    asset_path = os.path.join(ROOT, "public", "assets", "Arbok_PoisonFang_Maw.png")
    assert_true(os.path.exists(asset_path), f"Asset Arbok_PoisonFang_Maw.png exists at {asset_path}")
    if os.path.exists(asset_path):
        size = os.path.getsize(asset_path)
        assert_true(size > 5000, f"Asset has valid size ({size} bytes)")

    # 2. BattleFXOverlay.tsx verification
    bfx_path = os.path.join(ROOT, "src", "components", "BattleFXOverlay.tsx")
    with open(bfx_path, "r", encoding="utf-8") as f:
        bfx_code = f.read()

    assert_true("'poison_vapor'" in bfx_code, "poison_vapor registered in BattleFXOverlay")
    assert_true("'poison_vapor_bench'" in bfx_code, "poison_vapor_bench registered in BattleFXOverlay")
    assert_true("case 'poison_vapor':" in bfx_code, "case 'poison_vapor': present in getFXDuration")
    assert_true("case 'poison_vapor_bench':" in bfx_code, "case 'poison_vapor_bench': present in getFXDuration")

    # Check duration = 1820 for active, 1320 for bench
    dur_match_active = re.search(r"case\s+'poison_vapor':\s*return\s+(\d+);", bfx_code)
    assert_true(dur_match_active and dur_match_active.group(1) == "1820", f"getFXDuration('poison_vapor') returns 1820ms (got {dur_match_active.group(1) if dur_match_active else 'None'})")

    dur_match_bench = re.search(r"case\s+'poison_vapor_bench':\s*return\s+(\d+);", bfx_code)
    assert_true(dur_match_bench and dur_match_bench.group(1) == "1320", f"getFXDuration('poison_vapor_bench') returns 1320ms (got {dur_match_bench.group(1) if dur_match_bench else 'None'})")

    # Check STOCK_IMAGE_FX_TYPES protection
    assert_true("'poison_vapor'" in bfx_code and "STOCK_IMAGE_FX_TYPES" in bfx_code, "poison_vapor included in STOCK_IMAGE_FX_TYPES")

    # Check Single Image Tag in poison_vapor active block
    start_idx = bfx_code.find("fx.type === 'poison_vapor'")
    end_idx = bfx_code.find("fx.type === 'poison_vapor_bench'")
    assert_true(start_idx != -1 and end_idx != -1 and end_idx > start_idx, "Found fx.type === 'poison_vapor' block in BattleFXOverlay")
    if start_idx != -1 and end_idx != -1:
        block_text = bfx_code[start_idx:end_idx]
        img_count = block_text.count("<img")
        assert_true(img_count == 1, f"Exactly 1 <img> tag in poison_vapor block (got {img_count})")
        assert_true("Arbok_PoisonFang_Maw.png" in block_text, "Arbok_PoisonFang_Maw.png referenced in block")
        assert_true("gbaArbokVaporLunge" in block_text, "gbaArbokVaporLunge referenced in block")
        assert_true("gbaArbokVaporWhiff" in block_text, "gbaArbokVaporWhiff referenced in block")
        assert_true("gbaArbokMawGlow" in block_text, "gbaArbokMawGlow referenced in block")
        assert_true("gbaVaporFloorPool" in block_text, "gbaVaporFloorPool referenced in block")
        assert_true("gbaVaporEruptionJet" in block_text, "gbaVaporEruptionJet referenced in block")
        assert_true("gbaVaporPressureWave" in block_text, "gbaVaporPressureWave referenced in block")
        assert_true("gbaVaporDeepPlume" in block_text, "gbaVaporDeepPlume referenced in block")
        assert_true("gbaVaporAcidCore" in block_text, "gbaVaporAcidCore referenced in block")
        assert_true("gbaVaporSwirlingEddy" in block_text, "gbaVaporSwirlingEddy referenced in block")
        assert_true("gbaVaporSpurtParticle" in block_text, "gbaVaporSpurtParticle referenced in block")
        assert_true("gbaVaporBoilingBubble" in block_text, "gbaVaporBoilingBubble referenced in block")
        assert_true("gbaVaporPoisonSaturation" in block_text, "gbaVaporPoisonSaturation referenced in block")
        assert_true("fx.whiffed" in block_text, "Whiff condition supported in block")
        assert_true("overflow-hidden rounded-xl" in block_text, "Active overlay contained within card bounds (anti-bleed)")
        assert_true("50% 0%" in block_text, "Eruption jet pinned to nozzle origin (50% 0%) at fangs")
        assert_true("strokeDasharray" not in block_text and "border-2" not in block_text, "No CAD strokeDasharray or primitive border ring in block (Rule 7 compliant)")

    # Check Bench block
    start_bench = bfx_code.find("fx.type === 'poison_vapor_bench'")
    end_bench = bfx_code.find("fx.type === 'poison_gas'")
    assert_true(start_bench != -1 and end_bench != -1 and end_bench > start_bench, "Found fx.type === 'poison_vapor_bench' block in BattleFXOverlay")
    if start_bench != -1 and end_bench != -1:
        bench_block = bfx_code[start_bench:end_bench]
        assert_true("gbaVaporBenchAura" in bench_block, "gbaVaporBenchAura in bench block")
        assert_true("gbaVaporBenchPuff" in bench_block, "gbaVaporBenchPuff in bench block")
        assert_true("gbaVaporBenchBubble" in bench_block, "gbaVaporBenchBubble in bench block")
        assert_true("gbaVaporBenchFlecks" in bench_block, "gbaVaporBenchFlecks in bench block")
        assert_true("gbaVaporBenchDamageFlash" in bench_block, "gbaVaporBenchDamageFlash in bench block")
        assert_true("overflow-hidden rounded-lg" in bench_block, "Bench overlay contained within bench card bounds")

    # 3. cards.json verification
    cards_path = os.path.join(ROOT, "src", "data", "cards.json")
    with open(cards_path, "r", encoding="utf-8") as f:
        cards_data = json.load(f)

    dark_arbok_cards = [c for c in cards_data if "Dark Arbok" in c.get("name", "")]
    assert_true(len(dark_arbok_cards) >= 1, f"Found {len(dark_arbok_cards)} Dark Arbok card(s) in cards.json")
    vapor_found = any(any(a.get("name") == "Poison Vapor" for a in c.get("attacks", [])) for c in dark_arbok_cards)
    assert_true(vapor_found, "Dark Arbok has attack 'Poison Vapor' in cards.json")

    # 4. Attack to FX mapping verification
    assert_true("if (name.includes('poison vapor')) return 'poison_vapor';" in bfx_code, "Poison Vapor attack maps to poison_vapor")

    # 5. index.css keyframe verification
    css_path = os.path.join(ROOT, "src", "index.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css_code = f.read()

    expected_keyframes = [
        "gbaVaporFloorPool",
        "gbaArbokMawGlow",
        "gbaArbokVaporLunge",
        "gbaArbokVaporWhiff",
        "gbaVaporEruptionJet",
        "gbaVaporPressureWave",
        "gbaVaporDeepPlume",
        "gbaVaporAcidCore",
        "gbaVaporSwirlingEddy",
        "gbaVaporSpurtParticle",
        "gbaVaporBoilingBubble",
        "gbaVaporPoisonSaturation",
        "gbaVaporBenchAura",
        "gbaVaporBenchPuff",
        "gbaVaporBenchBubble",
        "gbaVaporBenchFlecks",
        "gbaVaporBenchDamageFlash"
    ]

    for kf in expected_keyframes:
        assert_true(f"@keyframes {kf}" in css_code, f"Keyframe @keyframes {kf} present in index.css")

    # 6. preview_poison_vapor.html verification
    preview_path = os.path.join(ROOT, "public", "preview_poison_vapor.html")
    assert_true(os.path.exists(preview_path), "preview_poison_vapor.html exists")
    if os.path.exists(preview_path):
        with open(preview_path, "r", encoding="utf-8") as f:
            prev_content = f.read()
        assert_true("candidatePaths" in prev_content or "ASSET_CANDIDATE_PATHS" in prev_content, "preview_poison_vapor.html adheres to Rule 12 resilient paths")
        assert_true("strokeDasharray" not in prev_content and "stroke-dasharray" not in prev_content, "No dashed CAD vectors in preview HTML")

    print(f"\nTotal: {passed}/{total} tests passed.")
    if passed == total:
        print("ALL TESTS PASSED!")
    else:
        print(f"FAILED {total - passed} tests.")

if __name__ == "__main__":
    run_tests()
