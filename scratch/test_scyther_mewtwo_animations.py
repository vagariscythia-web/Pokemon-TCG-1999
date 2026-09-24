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

    # 1. Check Scyther & Mewtwo stock image assets
    mewtwo_asset = os.path.join(ROOT, "public", "assets", "Mewtwo_Psychic_Actor.png")
    assert_true(os.path.exists(mewtwo_asset), f"Mewtwo asset exists at {mewtwo_asset}")
    if os.path.exists(mewtwo_asset):
        size = os.path.getsize(mewtwo_asset)
        assert_true(size > 50000, f"Mewtwo asset has reasonable size ({size} bytes)")

    scyther_a = os.path.join(ROOT, "public", "assets", "Scyther_SwordsDance_Actor_A.png")
    assert_true(os.path.exists(scyther_a), f"Scyther Pose A exists at {scyther_a}")
    if os.path.exists(scyther_a):
        size = os.path.getsize(scyther_a)
        assert_true(size > 50000, f"Scyther Pose A has reasonable size ({size} bytes)")

    scyther_b = os.path.join(ROOT, "public", "assets", "Scyther_SwordsDance_Actor_B.png")
    assert_true(os.path.exists(scyther_b), f"Scyther Pose B exists at {scyther_b}")
    if os.path.exists(scyther_b):
        size = os.path.getsize(scyther_b)
        assert_true(size > 50000, f"Scyther Pose B has reasonable size ({size} bytes)")

    # 2. Check BattleFXOverlay.tsx
    bfx_path = os.path.join(ROOT, "src", "components", "BattleFXOverlay.tsx")
    with open(bfx_path, "r", encoding="utf-8") as f:
        bfx_code = f.read()

    assert_true("'scyther_blade_dance'" in bfx_code, "scyther_blade_dance registered in BattleFXOverlay")
    assert_true("'mewtwo_psychic'" in bfx_code, "mewtwo_psychic registered in BattleFXOverlay")
    assert_true("Mewtwo_Psychic_Actor.png" in bfx_code, "Mewtwo_Psychic_Actor.png referenced in JSX")
    assert_true("Scyther_SwordsDance_Actor" in bfx_code, "Scyther_SwordsDance_Actor referenced in JSX")
    assert_true("gbaScytherDanceActorA" in bfx_code, "gbaScytherDanceActorA referenced in JSX")
    assert_true("gbaScytherDanceActorB" in bfx_code, "gbaScytherDanceActorB referenced in JSX")
    assert_true("gbaMewtwoPsychicActor" in bfx_code, "gbaMewtwoPsychicActor referenced in JSX")
    assert_true("gbaMewtwoMistPlume" in bfx_code, "gbaMewtwoMistPlume referenced in JSX")
    assert_true("gbaScytherOrbitBlades" in bfx_code, "gbaScytherOrbitBlades referenced in JSX")

    # Rule 7 checks: no emojis, no strokeDasharray in Mewtwo Psychic or Scyther Blade Dance
    assert_true("strokeDasharray" not in bfx_code[bfx_code.find("fx.type === 'mewtwo_psychic'"):bfx_code.find("fx.type === 'mewtwo_psychic'") + 2500], "No strokeDasharray in mewtwo_psychic (Rule 7)")
    assert_true("strokeDasharray" not in bfx_code[bfx_code.find("fx.type === 'scyther_blade_dance'"):bfx_code.find("fx.type === 'scyther_blade_dance'") + 2500], "No strokeDasharray in scyther_blade_dance (Rule 7)")
    assert_true("✦" not in bfx_code[bfx_code.find("fx.type === 'scyther_blade_dance'"):bfx_code.find("fx.type === 'scyther_blade_dance'") + 2500], "No unicode star symbols in scyther_blade_dance (Rule 7)")

    # 3. Check cards.json attack names
    cards_path = os.path.join(ROOT, "src", "data", "cards.json")
    with open(cards_path, "r", encoding="utf-8") as f:
        cards_data = json.load(f)

    scyther_cards = [c for c in cards_data if "scyther" in c.get("name", "").lower()]
    mewtwo_cards = [c for c in cards_data if "mewtwo" in c.get("name", "").lower()]

    assert_true(len(scyther_cards) >= 2, f"Found {len(scyther_cards)} Scyther cards in cards.json")
    assert_true(len(mewtwo_cards) >= 2, f"Found {len(mewtwo_cards)} Mewtwo cards in cards.json")

    # 4. Check index.css keyframes
    css_path = os.path.join(ROOT, "src", "index.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css_code = f.read()

    assert_true("@keyframes gbaScytherDanceActorA" in css_code, "Keyframe @keyframes gbaScytherDanceActorA present in index.css")
    assert_true("@keyframes gbaScytherDanceActorB" in css_code, "Keyframe @keyframes gbaScytherDanceActorB present in index.css")
    assert_true("@keyframes gbaScytherDanceAura" in css_code, "Keyframe @keyframes gbaScytherDanceAura present in index.css")
    assert_true("@keyframes gbaScytherOrbitBlades" in css_code, "Keyframe @keyframes gbaScytherOrbitBlades present in index.css")
    assert_true("@keyframes gbaScytherVacuumCross" in css_code, "Keyframe @keyframes gbaScytherVacuumCross present in index.css")
    assert_true("@keyframes gbaScytherKiGlints" in css_code, "Keyframe @keyframes gbaScytherKiGlints present in index.css")

    assert_true("@keyframes gbaMewtwoPsychicActor" in css_code, "Keyframe @keyframes gbaMewtwoPsychicActor present in index.css")
    assert_true("@keyframes gbaMewtwoVoidFloor" in css_code, "Keyframe @keyframes gbaMewtwoVoidFloor present in index.css")
    assert_true("@keyframes gbaMewtwoMistPlumeL" in css_code, "Keyframe @keyframes gbaMewtwoMistPlumeL present in index.css")
    assert_true("@keyframes gbaMewtwoMistPlumeR" in css_code, "Keyframe @keyframes gbaMewtwoMistPlumeR present in index.css")
    assert_true("@keyframes gbaMewtwoSingularityCore" in css_code, "Keyframe @keyframes gbaMewtwoSingularityCore present in index.css")
    assert_true("@keyframes gbaMewtwoPsychicShock" in css_code, "Keyframe @keyframes gbaMewtwoPsychicShock present in index.css")
    assert_true("@keyframes gbaMewtwoNeuralArcs" in css_code, "Keyframe @keyframes gbaMewtwoNeuralArcs present in index.css")

    print(f"\nSummary: {passed}/{total} tests passed.")
    if passed == total:
        print("ALL TESTS PASSED!")
    else:
        print(f"{total - passed} TESTS FAILED!")

if __name__ == "__main__":
    run_tests()
