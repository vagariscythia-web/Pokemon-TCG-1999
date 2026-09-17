import re

def test_vulpix_and_oddish():
    with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
        overlay = f.read()

    with open('src/index.css', 'r', encoding='utf-8') as f:
        css = f.read()

    print("=== TESTING VULPIX KITSUNEBI VERTIGO SPIRAL ===")
    assert 'gbaVulpixVertigoWisp1' in overlay, "Missing gbaVulpixVertigoWisp1 in JSX"
    assert 'gbaVulpixVertigoWisp2' in overlay, "Missing gbaVulpixVertigoWisp2 in JSX"
    assert 'gbaVulpixVertigoWisp3' in overlay, "Missing gbaVulpixVertigoWisp3 in JSX"
    assert '@keyframes gbaVulpixVertigoWisp1' in css, "Missing keyframe gbaVulpixVertigoWisp1"
    assert '@keyframes gbaVulpixVertigoWisp2' in css, "Missing keyframe gbaVulpixVertigoWisp2"
    assert '@keyframes gbaVulpixVertigoWisp3' in css, "Missing keyframe gbaVulpixVertigoWisp3"

    # Verify progressive blur and initial clarity
    wisp1_kf = css[css.find('@keyframes gbaVulpixVertigoWisp1'):css.find('@keyframes gbaVulpixVertigoWisp2')]
    assert 'filter: blur(0px)' in wisp1_kf, "Wisp 1 doesn't start with blur(0px) clarity"
    assert 'opacity: 1' in wisp1_kf, "Wisp 1 doesn't start with opacity 1"
    assert 'filter: blur(4.0px)' in wisp1_kf, "Wisp 1 missing peak vertigo blur (4.0px)"
    print("Vulpix Vertigo Spiral checks passed!")

    print("\n=== TESTING ODDISH STUN SPORE CONTINUOUS MOMENTUM ===")
    assert 'oddish_stun_spore' in overlay, "Missing oddish_stun_spore in JSX"
    assert 'gbaOddishBulbShake' in overlay, "Missing gbaOddishBulbShake in JSX"
    assert 'gbaOddishParalysisAura' in overlay, "Missing gbaOddishParalysisAura in JSX"
    assert 'gbaOddishBulbShake' in css, "Missing gbaOddishBulbShake in CSS"
    assert 'gbaOddishParalysisAura' in css, "Missing gbaOddishParalysisAura in CSS"

    # Check spore count is 26
    oddish_block = overlay[overlay.find("fx.type === 'oddish_stun_spore'"):overlay.find("fx.type === 'oddish_sprout'")]
    spore_matches = re.findall(r'delay:\s*[\d\.]+', oddish_block)
    print(f"Oddish spore count: {len(spore_matches)}")
    assert len(spore_matches) == 26, f"Expected 26 spores, found {len(spore_matches)}"

    # Check that bulb shake has no idle pause at 75-100%
    bulb_kf = css[css.find('@keyframes gbaOddishBulbShake'):css.find('@keyframes gbaOddishSporeFall')]
    assert 'opacity: 0;\n    transform: translateY(-12px) scale(0.8);' in bulb_kf, "Missing smooth upward exit in bulb shake"
    assert 'transform: rotate(0deg) scale(1);' not in bulb_kf, "Bulb shake still has frozen static frame!"
    print("Oddish Stun Spore checks passed!")

    print("\nALL VULPIX & ODDISH CHECKS PASSED PERFECTLY!")

if __name__ == '__main__':
    test_vulpix_and_oddish()
