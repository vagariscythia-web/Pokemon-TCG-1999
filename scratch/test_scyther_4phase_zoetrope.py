import os

ROOT = r"c:\Users\KaanS\.gemini\antigravity\scratch\pokemon-tcg-1999_demo"

def main():
    # 1. Check all 4 assets
    for letter in ['A', 'B', 'C', 'D']:
        p = os.path.join(ROOT, "public", "assets", f"Scyther_SwordsDance_Actor_{letter}.png")
        assert os.path.exists(p), f"Missing {p}"
        print(f"[OK] Asset {letter}: {p} exists, size={os.path.getsize(p)}")

    # 2. Check BattleFXOverlay.tsx
    bfx_path = os.path.join(ROOT, "src", "components", "BattleFXOverlay.tsx")
    with open(bfx_path, "r", encoding="utf-8") as f:
        bfx = f.read()

    start_idx = bfx.find("fx.type === 'scyther_blade_dance'")
    end_idx = bfx.find("fx.type === 'supersonic_waves'")
    assert start_idx != -1 and end_idx != -1, "Could not find Scyther section in BattleFXOverlay"
    scyther_section = bfx[start_idx:end_idx]

    assert "Scyther_SwordsDance_Actor_A.png" in scyther_section, "Actor A in JSX"
    assert "Scyther_SwordsDance_Actor_B.png" in scyther_section, "Actor B in JSX"
    assert "Scyther_SwordsDance_Actor_C.png" in scyther_section, "Actor C in JSX"
    assert "Scyther_SwordsDance_Actor_D.png" in scyther_section, "Actor D in JSX"
    assert "gbaScytherBladeGlint" in scyther_section, "Blade Glint in JSX"
    assert "gbaScytherVacuumCross" not in scyther_section, "Vacuum Cross removed from JSX"
    assert "gbaScytherDanceActorWhiff1" in scyther_section, "Whiff 1 in JSX"
    assert "gbaScytherDanceActorWhiff2" in scyther_section, "Whiff 2 in JSX"
    print("[OK] BattleFXOverlay.tsx Scyther section fully verified!")

    # 3. Check preview_scyther_mewtwo.html
    prev_path = os.path.join(ROOT, "public", "preview_scyther_mewtwo.html")
    with open(prev_path, "r", encoding="utf-8") as f:
        prev = f.read()

    assert "Scyther_SwordsDance_Actor_A.png" in prev, "Actor A in preview"
    assert "Scyther_SwordsDance_Actor_B.png" in prev, "Actor B in preview"
    assert "Scyther_SwordsDance_Actor_C.png" in prev, "Actor C in preview"
    assert "Scyther_SwordsDance_Actor_D.png" in prev, "Actor D in preview"
    assert "gbaScytherBladeGlint" in prev, "Blade Glint in preview"
    assert "gbaScytherDanceActorC" in prev, "Keyframe Actor C in preview"
    assert "gbaScytherDanceActorD" in prev, "Keyframe Actor D in preview"
    assert "gbaScytherDanceActorWhiff1" in prev, "Keyframe Whiff 1 in preview"
    assert "gbaScytherDanceActorWhiff2" in prev, "Keyframe Whiff 2 in preview"
    assert "gbaScytherVacuumCross" not in prev, "Vacuum Cross removed from preview HTML"
    print("[OK] preview_scyther_mewtwo.html fully verified!")

    # 4. Check index.css
    css_path = os.path.join(ROOT, "src", "index.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()

    assert "@keyframes gbaScytherDanceActorA" in css
    assert "@keyframes gbaScytherDanceActorB" in css
    assert "@keyframes gbaScytherDanceActorC" in css
    assert "@keyframes gbaScytherDanceActorD" in css
    assert "@keyframes gbaScytherDanceActorWhiff1" in css
    assert "@keyframes gbaScytherDanceActorWhiff2" in css
    assert "@keyframes gbaScytherBladeGlint" in css
    assert "@keyframes gbaScytherOrbitBlades" in css
    print("[OK] src/index.css keyframes verified!")

    print("\n>>> ALL TESTS AND RIGOROUS CHECKS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    main()
