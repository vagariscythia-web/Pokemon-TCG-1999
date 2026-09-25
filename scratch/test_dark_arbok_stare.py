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
    asset_path = os.path.join(ROOT, "public", "assets", "dark_arbok_stare.png")
    assert_true(os.path.exists(asset_path), f"Asset dark_arbok_stare.png exists at {asset_path}")
    if os.path.exists(asset_path):
        size = os.path.getsize(asset_path)
        assert_true(size > 10000, f"Asset has valid size ({size} bytes)")

    # 2. BattleFXOverlay.tsx verification
    bfx_path = os.path.join(ROOT, "src", "components", "BattleFXOverlay.tsx")
    with open(bfx_path, "r", encoding="utf-8") as f:
        bfx_code = f.read()

    assert_true("'cobra_stare'" in bfx_code, "cobra_stare registered in BattleFXOverlay")
    assert_true("'cobra_stare'" in bfx_code and "case 'cobra_stare':" in bfx_code, "case 'cobra_stare': present in getFXDuration")
    
    # Check duration = 1750
    dur_match = re.search(r"case\s+'cobra_stare':\s*return\s+(\d+);", bfx_code)
    assert_true(dur_match and dur_match.group(1) == "1750", f"getFXDuration('cobra_stare') returns 1750ms (got {dur_match.group(1) if dur_match else 'None'})")

    # Check Single Image Tag (no duplicate Beat 1 / Beat 3)
    start_idx = bfx_code.find("fx.type === 'cobra_stare'")
    end_idx = bfx_code.find("fx.type === 'horn_thrust'")
    assert_true(start_idx != -1 and end_idx != -1 and end_idx > start_idx, "Found fx.type === 'cobra_stare' block in BattleFXOverlay")
    if start_idx != -1 and end_idx != -1:
        block_text = bfx_code[start_idx:end_idx]
        img_count = block_text.count("<img")
        assert_true(img_count == 1, f"Exactly 1 <img> tag in cobra_stare block (got {img_count})")
        assert_true("dark_arbok_stare.png" in block_text, "dark_arbok_stare.png referenced in block")
        assert_true("gbaArbokCobraMotion" in block_text, "gbaArbokCobraMotion referenced in block")
        assert_true("gbaArbokChestPulse" in block_text, "gbaArbokChestPulse referenced in block")
        assert_true("gbaArbokDreadFloor" in block_text, "gbaArbokDreadFloor referenced in block")
        assert_true("gbaArbokHypnoRing1" in block_text, "gbaArbokHypnoRing1 referenced in block")
        assert_true("gbaArbokHypnoRing2" in block_text, "gbaArbokHypnoRing2 referenced in block")
        assert_true("gbaArbokGazeBeams" in block_text, "gbaArbokGazeBeams referenced in block")
        assert_true("gbaArbokSilenceSeal" in block_text, "gbaArbokSilenceSeal referenced in block")
        assert_true("gbaArbokGazeMote" in block_text, "gbaArbokGazeMote referenced in block")
        assert_true("gbaArbokSilenceAfterimage" in block_text, "gbaArbokSilenceAfterimage referenced in block")
        assert_true("fx.whiffed" in block_text, "Whiff condition supported in block")

    # 3. cards.json verification
    cards_path = os.path.join(ROOT, "src", "data", "cards.json")
    with open(cards_path, "r", encoding="utf-8") as f:
        cards_data = json.load(f)

    dark_arbok_cards = [c for c in cards_data if "Dark Arbok" in c.get("name", "")]
    assert_true(len(dark_arbok_cards) >= 1, f"Found {len(dark_arbok_cards)} Dark Arbok card(s) in cards.json")
    stare_found = any(any(a.get("name") == "Stare" for a in c.get("attacks", [])) for c in dark_arbok_cards)
    assert_true(stare_found, "Dark Arbok has attack 'Stare' in cards.json")

    # 4. Attack to FX mapping verification
    assert_true("if (name.includes('stare'))" in bfx_code, "Stare attack handled in getSpecificAttackFX")
    assert_true("if (pkm.includes('arbok')) return 'cobra_stare';" in bfx_code, "Arbok's Stare maps to cobra_stare")

    # 5. index.css keyframe verification
    css_path = os.path.join(ROOT, "src", "index.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css_code = f.read()

    expected_keyframes = [
        "gbaArbokDreadFloor",
        "gbaArbokCobraMotion",
        "gbaArbokChestPulse",
        "gbaArbokWhiffRecede",
        "gbaArbokHypnoRing1",
        "gbaArbokHypnoRing2",
        "gbaArbokGazeBeams",
        "gbaArbokSilenceSeal",
        "gbaArbokGazeMote",
        "gbaArbokSilenceAfterimage"
    ]

    for kf in expected_keyframes:
        assert_true(f"@keyframes {kf}" in css_code, f"Keyframe @keyframes {kf} present in index.css")

    # 6. preview_dark_arbok.html verification
    preview_path = os.path.join(ROOT, "public", "preview_dark_arbok.html")
    assert_true(os.path.exists(preview_path), "preview_dark_arbok.html exists")
    if os.path.exists(preview_path):
        with open(preview_path, "r", encoding="utf-8") as f:
            prev_content = f.read()
        assert_true("ASSET_CANDIDATE_PATHS" in prev_content, "preview_dark_arbok.html adheres to Rule 12 resilient paths")
        assert_true("gbaArbokCobraMotion" in prev_content, "preview has 100% keyframe parity with index.css")

    print(f"\nSummary: {passed}/{total} tests passed.")
    if passed == total:
        print("ALL TESTS PASSED!")
    else:
        print("SOME TESTS FAILED!")

if __name__ == "__main__":
    run_tests()
