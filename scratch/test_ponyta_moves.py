import re

def test_ponyta_moves():
    with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
        overlay_code = f.read()

    with open('src/index.css', 'r', encoding='utf-8') as f:
        css_code = f.read()

    with open('ANIMATION_DESIGN_SYSTEM.md', 'r', encoding='utf-8') as f:
        doc_code = f.read()

    # 1. Assert getFXDuration mappings
    assert "case 'flame_tail_whip':\n      return 1350;" in overlay_code, "Missing or wrong duration for flame_tail_whip"
    assert "case 'kick_smash':\n      return 1250;" in overlay_code, "Missing or wrong duration for kick_smash"
    print("[OK] getFXDuration entries verified: flame_tail_whip=1350ms, kick_smash=1250ms")

    # 2. Assert Flame Tail calibrated feathered hair architecture
    assert "fx.type === 'flame_tail_whip'" in overlay_code
    assert 'width="112"' in overlay_code
    assert 'height="52"' in overlay_code
    assert "viewBox=\"0 0 160 75\"" in overlay_code
    assert "pnyFireGrad" in overlay_code
    assert "pnyHairGoldGrad" in overlay_code
    assert "pnySpineGrad" in overlay_code
    assert "gbaFlameTailArc" in overlay_code
    assert "gbaFlameLickWave1" in overlay_code
    assert "gbaFlameLickWave2" in overlay_code
    print("[OK] Flame Tail feathered hair JSX architecture, calibrated dimensions (112x52) and gradients verified")

    # 3. Assert Smash Kick calibrated Plantar Sole View & authentic palette
    assert "fx.type === 'kick_smash'" in overlay_code
    assert 'width="78"' in overlay_code
    assert 'height="78"' in overlay_code
    assert "viewBox=\"0 0 120 120\"" in overlay_code
    assert "ironShoeGrad" in overlay_code
    assert "soleHornGrad" in overlay_code
    assert "legDepthGrad" in overlay_code
    assert "#fed7aa" in overlay_code  # Authentic Ponyta vanilla-peach shading
    assert "#fef3c7" in overlay_code  # Authentic Ponyta cream base
    assert "#b45309" in overlay_code  # Authentic Ponyta warm contour
    print("[OK] Smash Kick calibrated Plantar Sole View (78x78) and canonical card palette verified")

    # 4. Assert Starmie Star Freeze calibrated dimensions
    assert "src=\"/assets/Starmie_Star_Freeze.png\"" in overlay_code
    assert "w-[88px] h-[88px]" in overlay_code
    assert "w-[64px] h-[64px]" in overlay_code
    print("[OK] Starmie Star Freeze calibrated dimensions (88x88 / whiff 64x64) verified")

    # 5. Assert Tempered CSS keyframes in src/index.css
    required_keyframes = [
        "gbaFlameTailFloor",
        "gbaFlameTailArc",
        "gbaFlameTailWhiff",
        "gbaFlameTailImpactStar",
        "gbaFlameTailTrail",
        "gbaFlameTailSpark",
        "gbaFlameLickWave1",
        "gbaFlameLickWave2",
        "gbaKickSmashGroundShock",
        "gbaKickSmashHoof",
        "gbaKickSmashWhiff",
        "gbaKickSmashImpactStar",
        "gbaKickSmashSpeedlines",
        "gbaKickSmashSparks",
        "gbaStarmieCelestialSpin"
    ]
    for kf in required_keyframes:
        assert f"@keyframes {kf}" in css_code, f"Missing keyframe in index.css: {kf}"
    
    # Assert peak scale tempering in keyframes
    assert "scaleX(1.08) scaleY(1.06)" in css_code, "gbaFlameTailArc peak scale not tempered"
    assert "scale(1.15) translateY(-2px)" in css_code, "gbaKickSmashHoof peak scale not tempered"
    assert "scale(1.15, 1.08) rotate(720deg)" in css_code, "gbaStarmieCelestialSpin peak scale not tempered"
    print(f"[OK] All {len(required_keyframes)} keyframes and tempered peak scales verified in index.css")

    # 6. Assert ANIMATION_DESIGN_SYSTEM.md additions
    assert "### G. Feathered Equine Hair & Fur Texture" in doc_code
    assert "### H. Card Illustration Color Fidelity" in doc_code
    assert "### G. Perspective Purity & Unambiguous Strike Plane Rule" in doc_code
    assert "### F. Dynamic Scaling Multiplication Trap & Anti-Bleed Containment" in doc_code
    print("[OK] All 4 formal rule precedents verified in ANIMATION_DESIGN_SYSTEM.md")

    print("\nALL CALIBRATION AND QUALITY ASSURANCE TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_ponyta_moves()
