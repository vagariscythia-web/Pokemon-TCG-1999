import re

def main():
    with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
        overlay_content = f.read()

    with open('src/index.css', 'r', encoding='utf-8') as f:
        css_content = f.read()

    print("=== TESTING GROWLITHE FLARE REFINEMENTS ===")
    assert "case 'flare_burst':\n      return 1750;" in overlay_content, "flare_burst duration not 1750ms"
    assert "left: '7%',\n              bottom: '18%'" in overlay_content, "Growlithe actor not moved up/center"
    assert "left: '29%',\n                bottom: '33%'" in overlay_content, "Mouth torrent not moved up/center"
    assert "left: '38%',\n                top: '22%'" in overlay_content, "Combustion burst not moved up/center"
    
    # Check that dashed ellipse is completely gone from flare_burst
    flare_block = overlay_content[overlay_content.find("fx.type === 'flare_burst'"):overlay_content.find("fx.type === 'flare_burst'") + 10000]
    assert "strokeDasharray" not in flare_block, "Found naive strokeDasharray in flare_burst!"
    assert "growlitheShockwaveGrad" in flare_block, "Missing growlitheShockwaveGrad"
    assert "gbaGrowlitheCombustionBurst" in flare_block, "Missing gbaGrowlitheCombustionBurst in JSX"
    assert "@keyframes gbaGrowlitheCombustionBurst" in css_content, "Missing @keyframes gbaGrowlitheCombustionBurst in CSS"
    print("Growlithe Flare checks passed!")

    print("\n=== TESTING VULPIX CONFUSE RAY REFINEMENTS ===")
    assert "case 'vulpix_confuse_ray':\n      return 1750;" in overlay_content, "vulpix_confuse_ray duration not 1750ms"
    assert "gbaVulpixConfuseCardBlur" in overlay_content, "Missing gbaVulpixConfuseCardBlur in JSX"
    assert "@keyframes gbaVulpixConfuseCardBlur" in css_content, "Missing @keyframes gbaVulpixConfuseCardBlur in CSS"
    assert "backdrop-filter: blur(6.0px)" in css_content, "Missing 6.0px blur in gbaVulpixConfuseCardBlur"
    assert "gbaVulpixVertigoWisp1" in overlay_content, "Missing gbaVulpixVertigoWisp1 in JSX"
    assert "gbaVulpixVertigoWisp2" in overlay_content, "Missing gbaVulpixVertigoWisp2 in JSX"
    assert "gbaVulpixVertigoWisp3" in overlay_content, "Missing gbaVulpixVertigoWisp3 in JSX"
    assert "@keyframes gbaVulpixVertigoWisp1" in css_content, "Missing @keyframes gbaVulpixVertigoWisp1 in CSS"
    assert "@keyframes gbaVulpixVertigoWisp2" in css_content, "Missing @keyframes gbaVulpixVertigoWisp2 in CSS"
    assert "@keyframes gbaVulpixVertigoWisp3" in css_content, "Missing @keyframes gbaVulpixVertigoWisp3 in CSS"
    print("Vulpix Confuse Ray checks passed!")

    print("\nALL REFINEMENT CHECKS PASSED PERFECTLY!")

if __name__ == '__main__':
    main()
