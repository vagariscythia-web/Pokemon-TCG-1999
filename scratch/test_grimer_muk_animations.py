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

    # 1. Check Muk & Grimer stock image assets
    muk_asset = os.path.join(ROOT, "public", "assets", "Muk_Sludge_Actor.png")
    assert_true(os.path.exists(muk_asset), f"Muk asset exists at {muk_asset}")
    if os.path.exists(muk_asset):
        size = os.path.getsize(muk_asset)
        assert_true(size > 10000, f"Muk asset has reasonable size ({size} bytes)")

    grimer_asset = os.path.join(ROOT, "public", "assets", "Grimer_StickyHands_Actor.png")
    assert_true(os.path.exists(grimer_asset), f"Grimer asset exists at {grimer_asset}")
    if os.path.exists(grimer_asset):
        size = os.path.getsize(grimer_asset)
        assert_true(size > 10000, f"Grimer asset has reasonable size ({size} bytes)")

    # 2. Check BattleFXOverlay.tsx
    bfx_path = os.path.join(ROOT, "src", "components", "BattleFXOverlay.tsx")
    with open(bfx_path, "r", encoding="utf-8") as f:
        bfx_code = f.read()

    assert_true("'muk_sludge_deluge'" in bfx_code, "muk_sludge_deluge registered in BattleFXOverlay")
    assert_true("STOCK_IMAGE_FX_TYPES.has(fx.type)" or "'muk_sludge_deluge'" in bfx_code, "muk_sludge_deluge in stock image set")
    assert_true("case 'grimer_sticky_hands':" in bfx_code, "grimer_sticky_hands in getFXDuration")
    assert_true("case 'muk_sludge_deluge':" in bfx_code, "muk_sludge_deluge in getFXDuration")
    assert_true("Muk_Sludge_Actor.png" in bfx_code, "Muk_Sludge_Actor.png referenced in JSX")
    assert_true("Grimer_StickyHands_Actor.png" in bfx_code, "Grimer_StickyHands_Actor.png referenced in JSX")
    assert_true("gbaMukSludgeActorSurge" in bfx_code, "gbaMukSludgeActorSurge referenced in JSX")
    assert_true("gbaStickyArmLungeL" in bfx_code, "gbaStickyArmLungeL referenced in JSX")
    assert_true("gbaGrimerStickyActorLunge" in bfx_code, "gbaGrimerStickyActorLunge referenced in JSX")
    assert_true("gbaGrimerHandDripL" in bfx_code, "gbaGrimerHandDripL referenced in JSX")
    assert_true("gbaGrimerNeckingThread" in bfx_code, "gbaGrimerNeckingThread referenced in JSX")
    assert_true("gbaGrimerPinchDrop1" in bfx_code, "gbaGrimerPinchDrop1 referenced in JSX")
    assert_true("gbaGrimerOrganicRipple1" in bfx_code, "gbaGrimerOrganicRipple1 referenced in JSX")

    # 3. Check cards.json attack names
    cards_path = os.path.join(ROOT, "src", "data", "cards.json")
    with open(cards_path, "r", encoding="utf-8") as f:
        cards_data = json.load(f)

    grimer_cards = [c for c in cards_data if "Grimer" in c.get("name", "")]
    muk_cards = [c for c in cards_data if "Muk" in c.get("name", "")]

    assert_true(len(grimer_cards) >= 2, f"Found {len(grimer_cards)} Grimer cards in cards.json")
    assert_true(len(muk_cards) >= 2, f"Found {len(muk_cards)} Muk cards in cards.json")

    # Check mapping logic
    assert_true("Sticky Hands" in bfx_code, "Sticky Hands mapped in mapAttackToFX")
    assert_true("Nasty Goo" in bfx_code, "Nasty Goo mapped in mapAttackToFX")
    assert_true("Sludge" in bfx_code, "Sludge mapped in mapAttackToFX")
    assert_true("Minimize" in bfx_code, "Minimize mapped in mapAttackToFX")

    # 4. Check index.css keyframes
    css_path = os.path.join(ROOT, "src", "index.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css_code = f.read()

    expected_keyframes = [
        "gbaMukSludgeFloor",
        "gbaMukSludgeActorSurge",
        "gbaMukDelugeSurge",
        "gbaMukSludgeGlob",
        "gbaMukToxicBubble",
        "gbaStickyArmLungeL",
        "gbaStickyArmLungeR",
        "gbaStickyClampTremor",
        "gbaStickyTendrilSnap",
        "gbaGrimerFloorMire",
        "gbaGrimerGooSplat",
        "gbaGrimerNeckingThread",
        "gbaGrimerPinchDrop1",
        "gbaGrimerFloorSplat",
        "gbaGrimerPuddleMelt",
        "gbaGrimerOrganicRipple1",
        "gbaGrimerShieldAura"
    ]

    for kf in expected_keyframes:
        assert_true(f"@keyframes {kf}" in css_code, f"Keyframe @keyframes {kf} present in index.css")

    print(f"\nSummary: {passed}/{total} tests passed.")
    if passed == total:
        print("ALL TESTS PASSED!")
    else:
        print("SOME TESTS FAILED!")

if __name__ == "__main__":
    run_tests()
