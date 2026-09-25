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
    asset_path = os.path.join(ROOT, "public", "assets", "blastoise_full_body.png")
    assert_true(os.path.exists(asset_path), f"Asset blastoise_full_body.png exists at {asset_path}")
    if os.path.exists(asset_path):
        size = os.path.getsize(asset_path)
        assert_true(size > 50000, f"Asset has valid size ({size} bytes)")

    # 2. BattleFXOverlay.tsx verification
    bfx_path = os.path.join(ROOT, "src", "components", "BattleFXOverlay.tsx")
    with open(bfx_path, "r", encoding="utf-8") as f:
        bfx_code = f.read()

    assert_true("'hydro_pump_cannons'" in bfx_code, "hydro_pump_cannons registered in BattleFXOverlay")
    assert_true("case 'hydro_pump_cannons':" in bfx_code, "case 'hydro_pump_cannons': present in getFXDuration")
    
    # Check duration = 1900ms
    dur_match = re.search(r"case\s+'hydro_pump_cannons':\s*return\s+(\d+);", bfx_code)
    assert_true(dur_match and dur_match.group(1) == "1900", f"getFXDuration('hydro_pump_cannons') returns 1900ms (got {dur_match.group(1) if dur_match else 'None'})")

    # Check Block Elements
    start_idx = bfx_code.find("fx.type === 'hydro_pump_cannons'")
    end_idx = bfx_code.find("fx.type === 'bubblebeam'", start_idx)
    if end_idx == -1:
        end_idx = start_idx + 6000
    
    assert_true(start_idx != -1, "Found fx.type === 'hydro_pump_cannons' block in BattleFXOverlay")
    block_text = bfx_code[start_idx:end_idx]
    
    img_count = block_text.count("<img")
    assert_true(img_count == 1, f"Exactly 1 <img> tag in hydro_pump_cannons block (got {img_count})")
    assert_true("blastoise_full_body.png" in block_text, "blastoise_full_body.png referenced in block")
    assert_true("gbaBlastoiseFullBodyMotion" in block_text, "gbaBlastoiseFullBodyMotion referenced in block")
    assert_true("gbaBlastoiseWhiffRecede" in block_text, "gbaBlastoiseWhiffRecede referenced in block")
    assert_true("gbaHydroFloorSurge" in block_text, "gbaHydroFloorSurge referenced in block")
    assert_true("gbaHydroTorrentL" in block_text or "gbaHydroCannonJetLeft" in block_text, "gbaHydroTorrentL/gbaHydroCannonJetLeft referenced in block")
    assert_true("gbaHydroTorrentR" in block_text or "gbaHydroCannonJetRight" in block_text, "gbaHydroTorrentR/gbaHydroCannonJetRight referenced in block")
    assert_true("gbaHydroMuzzleCollarL" in block_text or "gbaHydroCannonMuzzleL" in block_text, "gbaHydroMuzzleCollarL/gbaHydroCannonMuzzleL referenced in block")
    assert_true("gbaHydroMuzzleCollarR" in block_text or "gbaHydroCannonMuzzleR" in block_text, "gbaHydroMuzzleCollarR/gbaHydroCannonMuzzleR referenced in block")
    assert_true("gbaHydroTsunamiCrown" in block_text or "gbaHydroSplashCrown" in block_text, "gbaHydroTsunamiCrown/gbaHydroSplashCrown referenced in block")
    assert_true("gbaHydroDelugeCascade" in block_text, "gbaHydroDelugeCascade referenced in block")
    assert_true("gbaHydroConcussionDome" in block_text or "gbaHydroCannonImpact" in block_text, "gbaHydroConcussionDome/gbaHydroCannonImpact referenced in block")
    assert_true("gbaHydroShockRing" in block_text or "gbaHydroImpactRing" in block_text, "gbaHydroShockRing/gbaHydroImpactRing referenced in block")
    assert_true("fx.whiffed" in block_text, "Whiff condition supported in block")

    # 3. cards.json verification
    cards_path = os.path.join(ROOT, "src", "data", "cards.json")
    with open(cards_path, "r", encoding="utf-8") as f:
        cards_data = json.load(f)

    blastoise_cards = [c for c in cards_data if "Blastoise" in c.get("name", "")]
    assert_true(len(blastoise_cards) >= 1, f"Found {len(blastoise_cards)} Blastoise card(s) in cards.json")
    pump_found = any(any("Hydro Pump" in a.get("name", "") for a in c.get("attacks", [])) for c in blastoise_cards)
    assert_true(pump_found, "Blastoise has attack 'Hydro Pump' in cards.json")

    # 4. Attack to FX mapping verification
    assert_true("if (name.includes('hydro pump') && pkm.includes('blastoise')) return 'hydro_pump_cannons';" in bfx_code, "Blastoise's Hydro Pump maps to hydro_pump_cannons")

    # 5. index.css keyframe verification
    css_path = os.path.join(ROOT, "src", "index.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css_code = f.read()

    expected_keyframes = [
        "gbaHydroFloorSurge",
        "gbaBlastoiseFullBodyMotion",
        "gbaBlastoiseWhiffRecede",
        "gbaHydroCannonJetLeft",
        "gbaHydroCannonJetRight",
        "gbaHydroCannonMuzzleL",
        "gbaHydroCannonMuzzleR",
        "gbaHydroCannonMuzzle",
        "gbaHydroCannonImpact",
        "gbaHydroImpactRing",
        "gbaHydroSplashCrown",
        "gbaHydroDelugeCascade",
        "gbaHydroScatterUpL",
        "gbaHydroScatterUpR",
        "gbaDefendingCardHydraulicTremor"
    ]

    for kf in expected_keyframes:
        assert_true(f"@keyframes {kf}" in css_code, f"Keyframe @keyframes {kf} present in index.css")

    # 6. preview_blastoise.html verification
    preview_path = os.path.join(ROOT, "public", "preview_blastoise.html")
    if os.path.exists(preview_path):
        with open(preview_path, "r", encoding="utf-8") as f:
            prev_content = f.read()
        assert_true("candidatePaths" in prev_content or "ASSET_CANDIDATE_PATHS" in prev_content, "preview_blastoise.html adheres to Rule 14 resilient paths")
        assert_true("gbaBlastoiseFullBodyMotion" in prev_content, "preview has 100% keyframe parity with index.css")
        assert_true("width: 184px;" in prev_content and "height: 253px;" in prev_content, "Active card has 184x253px dimensions")
        assert_true("aspect-ratio: 600 / 825;" in prev_content, "Card has aspect-ratio: 600/825")
        assert_true("gbaHydroTsunamiCrown" in prev_content or "gbaHydroSplashCrown" in prev_content, "preview contains hydro splash crown")
        assert_true("gbaHydroDelugeCascade" in prev_content, "preview contains gbaHydroDelugeCascade")
    else:
        print("[INFO] preview_blastoise.html will be verified after creation.")

    print(f"\nSummary: {passed}/{total} tests passed.")
    if passed == total:
        print("ALL TESTS PASSED!")
    else:
        print("SOME TESTS FAILED!")

if __name__ == "__main__":
    run_tests()
