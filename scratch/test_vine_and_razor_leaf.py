import re
import sys

def test_battle_fx():
    with open(r'c:\Users\KaanS\.gemini\antigravity\scratch\pokemon-tcg-1999_demo\src\components\BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
        overlay_content = f.read()

    with open(r'c:\Users\KaanS\.gemini\antigravity\scratch\pokemon-tcg-1999_demo\src\index.css', 'r', encoding='utf-8') as f:
        css_content = f.read()

    # 1. Check ActiveFX union
    assert "'razor_leaf'" in overlay_content, "razor_leaf missing from ActiveFX union!"
    print("[PASS] ActiveFX contains razor_leaf")

    # 2. Check getSpecificAttackFX routing
    assert "if (name.includes('razor leaf')) return 'razor_leaf';" in overlay_content, "Razor leaf routing missing!"
    print("[PASS] getSpecificAttackFX routes razor leaf -> razor_leaf")

    # 3. Check getFXDuration
    match_dur = re.search(r"case 'razor_leaf':\s*return (\d+);", overlay_content)
    assert match_dur and match_dur.group(1) == '1350', f"razor_leaf duration mismatch: {match_dur}"
    print("[PASS] getFXDuration('razor_leaf') == 1350")

    # 4. Check sinuous whip paths in BattleFXOverlay
    assert "M 5 38 C 40 18, 75 58, 115 28 C 130 18, 145 22, 158 35" in overlay_content, "Left sinuous whip path missing!"
    assert "M 155 38 C 120 18, 85 58, 45 28 C 30 18, 15 22, 2 35" in overlay_content, "Right sinuous whip path missing!"
    print("[PASS] Sinuous whip paths verified in BattleFXOverlay.tsx")

    # 5. Check no illegal unicode symbols in leech_seed_vines or razor_leaf
    leech_block = re.search(r"fx\.type === 'leech_seed_vines'.*?(\n\s*\{/\*|\n\s*\{fx\.type)", overlay_content, re.DOTALL)
    assert leech_block and "✦" not in leech_block.group(0), "leech_seed_vines contains illegal symbol ✦!"
    razor_block = re.search(r"fx\.type === 'razor_leaf'.*?(\n\s*\{/\*|\n\s*\{fx\.type)", overlay_content, re.DOTALL)
    assert razor_block and "✦" not in razor_block.group(0), "razor_leaf contains illegal symbol ✦!"
    print("[PASS] Zero illegal unicode symbols found")

    # 6. Check Razor Leaf keyframes in CSS
    required_keyframes = [
        'gbaRazorLeafFloorAura',
        'gbaRazorLeafFlight1',
        'gbaRazorLeafFlight2',
        'gbaRazorLeafFlight3',
        'gbaRazorLeafFlight4',
        'gbaRazorLeafFlight5',
        'gbaRazorLeafWhiffFlight1',
        'gbaRazorLeafWhiffFlight2',
        'gbaRazorLeafWhiffFlight3',
        'gbaRazorLeafWhiffFlight4',
        'gbaRazorLeafWhiffFlight5',
        'gbaRazorLeafSlashFlash',
        'gbaRazorLeafAirBlade',
        'gbaRazorLeafDebris',
        'gbaVineWhipLashLeft',
        'gbaVineWhipLashRight'
    ]
    for kf in required_keyframes:
        assert f"@keyframes {kf}" in css_content, f"Keyframe @keyframes {kf} missing from index.css!"
    print("[PASS] All required CSS keyframes verified")

    print("\nALL AUTOMATED VERIFICATION CHECKS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_battle_fx()
