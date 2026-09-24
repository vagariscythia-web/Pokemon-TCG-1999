import re
import sys

def test_cloyster():
    print("Testing Cloyster Clamp & Spike Cannon animations...")

    with open("src/components/BattleFXOverlay.tsx", "r", encoding="utf-8") as f:
        tsx = f.read()

    with open("src/index.css", "r", encoding="utf-8") as f:
        css = f.read()

    # 1. Check getFXDuration
    assert "case 'cloyster_clamp':\n      return 1550;" in tsx, "getFXDuration for cloyster_clamp missing or wrong"
    assert "case 'cloyster_spike_cannon':\n      return 1650;" in tsx, "getFXDuration for cloyster_spike_cannon missing or wrong"
    print("[OK] getFXDuration durations verified (1550ms, 1650ms).")

    # 2. Check clamp layers in tsx
    assert "gbaCloysterAbyssalFloor" in tsx, "gbaCloysterAbyssalFloor missing in tsx"
    assert "gbaCloysterClampMaw" in tsx, "gbaCloysterClampMaw missing in tsx"
    assert "gbaCloysterClampWhiff" in tsx, "gbaCloysterClampWhiff missing in tsx"
    assert "gbaCloysterClampFlash" in tsx, "gbaCloysterClampFlash missing in tsx"
    assert "gbaCloysterHydroRingInner" in tsx, "gbaCloysterHydroRingInner missing in tsx"
    assert "gbaCloysterHydroRingOuter" in tsx, "gbaCloysterHydroRingOuter missing in tsx"
    assert "gbaCloysterHydroJetLeft" in tsx, "gbaCloysterHydroJetLeft missing in tsx"
    assert "gbaCloysterHydroJetRight" in tsx, "gbaCloysterHydroJetRight missing in tsx"
    assert "gbaCloysterBubblePop" in tsx, "gbaCloysterBubblePop missing in tsx"
    assert "gbaCloysterSprayDrift" in tsx, "gbaCloysterSprayDrift missing in tsx"
    print("[OK] Cloyster Clamp 5-layer components verified in JSX.")

    # 3. Check spike cannon layers in tsx
    assert "Cloyster_Spike_Cannon.png" in tsx, "Cloyster_Spike_Cannon.png missing in tsx"
    assert "gbaCloysterTorpedoWake" in tsx, "gbaCloysterTorpedoWake missing in tsx"
    assert "gbaCloysterTorpedoSpin" in tsx, "gbaCloysterTorpedoSpin missing in tsx"
    assert "gbaCloysterTorpedoWhiff" in tsx, "gbaCloysterTorpedoWhiff missing in tsx"
    assert "gbaCloysterSpikeCannonFlash" in tsx, "gbaCloysterSpikeCannonFlash missing in tsx"
    assert "gbaCloysterSpikeCannonRing" in tsx, "gbaCloysterSpikeCannonRing missing in tsx"
    assert "gbaCloysterSpikeEmbed" in tsx, "gbaCloysterSpikeEmbed missing in tsx"
    assert "gbaCloysterSpikeScatter" in tsx, "gbaCloysterSpikeScatter missing in tsx"
    assert "gbaCloysterSpikeFoam" in tsx, "gbaCloysterSpikeFoam missing in tsx"
    print("[OK] Cloyster Spike Cannon 5-layer components verified in JSX.")

    # 4. Check CSS keyframes
    keyframes = [
        "gbaCloysterAbyssalFloor", "gbaCloysterClampMaw", "gbaCloysterClampWhiff",
        "gbaCloysterHornPulse", "gbaCloysterClampFlash", "gbaCloysterHydroRingInner",
        "gbaCloysterHydroRingOuter", "gbaCloysterHydroJetLeft", "gbaCloysterHydroJetRight",
        "gbaCloysterBubblePop", "gbaCloysterSprayDrift", "gbaCloysterTorpedoWake",
        "gbaCloysterTorpedoSpin", "gbaCloysterTorpedoWhiff", "gbaCloysterSpikeCannonFlash",
        "gbaCloysterSpikeCannonRing", "gbaCloysterSpikeEmbed", "gbaCloysterSpikeScatter",
        "gbaCloysterSpikeFoam"
    ]
    for kf in keyframes:
        assert f"@keyframes {kf}" in css, f"@keyframes {kf} missing in index.css"
        print(f"[OK] Keyframe verified: {kf}")

    # 5. Check assets exist on disk
    import os
    assert os.path.exists("public/assets/Cloyster_Clamp_Maw.png"), "Cloyster_Clamp_Maw.png missing"
    assert os.path.exists("public/assets/Cloyster_Spike_Cannon.png"), "Cloyster_Spike_Cannon.png missing"
    assert os.path.exists("public/assets/raw/Cloyster_Spike_Cannon_raw.png"), "Cloyster_Spike_Cannon_raw.png missing"
    print("[OK] All visual assets verified on disk.")

    print("\nALL CLOYSTER TESTS PASSED (100% SUCCESS)!")

if __name__ == "__main__":
    test_cloyster()
