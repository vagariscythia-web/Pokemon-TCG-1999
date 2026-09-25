import os
import re
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def test_assets():
    print("Testing assets...")
    actor_path = os.path.join(ROOT, "public", "assets", "blastoise_hydro_pump_actor.png")
    full_body_path = os.path.join(ROOT, "public", "assets", "blastoise_full_body.png")
    assert os.path.exists(actor_path), f"Missing {actor_path}"
    assert os.path.exists(full_body_path), f"Missing {full_body_path}"

    img = Image.open(full_body_path)
    assert img.size == (1381, 1346), f"Unexpected size {img.size}"
    print(f"Asset size {img.size} verified.")

def test_battle_fx_overlay():
    print("Testing BattleFXOverlay.tsx...")
    path = os.path.join(ROOT, "src", "components", "BattleFXOverlay.tsx")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "case 'hydro_pump_cannons':" in content
    assert "return 2100;" in content
    assert "fx.type === 'hydro_pump_cannons'" in content
    assert "blastoise_full_body.png" in content
    assert "34 * wi" in content  # Blastoise actor shifted 34px left (tail tangent to left border)
    assert "38 * wi" in content  # Ground glow centered under feet
    assert "54 * wi" in content  # Left cannon nozzle
    assert "10 * wi" in content  # Right cannon nozzle (shifted 18px left in tandem with Blastoise)
    assert "gbaHydroTorrentL" in content
    assert "gbaHydroTorrentR" in content
    assert "gbaHydroConcussionDome" in content
    assert "gbaHydroTsunamiCrown" in content
    assert "gbaHydroSpray1" in content
    assert "gbaHydroSpray10" in content
    assert "gbaHydroSpray14" in content
    print("BattleFXOverlay.tsx verified.")

def test_index_css():
    print("Testing index.css...")
    path = os.path.join(ROOT, "src", "index.css")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "@keyframes gbaHydroTorrentL" in content
    assert "@keyframes gbaHydroTorrentR" in content
    assert "@keyframes gbaHydroFloorSurge" in content
    assert "@keyframes gbaBlastoiseFullBodyMotion" in content
    assert "@keyframes gbaBlastoiseWhiffRecede" in content
    assert "@keyframes gbaHydroConcussionDome" in content
    assert "@keyframes gbaHydroTsunamiCrown" in content
    assert "@keyframes gbaHydroSpray1" in content
    assert "@keyframes gbaHydroSpray10" in content
    assert "@keyframes gbaHydroSpray14" in content
    assert content.count('{') == content.count('}'), "Braces not balanced in index.css"
    print("index.css verified.")

def test_preview_blastoise():
    print("Testing preview_blastoise.html...")
    path = os.path.join(ROOT, "public", "preview_blastoise.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Check style braces
    styles = re.findall(r'<style>(.*?)</style>', content, re.DOTALL)
    for s in styles:
        assert s.count('{') == s.count('}'), "Style braces not balanced"
        assert len(re.findall(r'\{[^{}]*@keyframes', s)) == 0, "Nested keyframes found in preview"

    assert "184px" in content
    assert "253px" in content
    assert "blastoise_full_body.png" in content
    assert "gbaHydroTorrentL" in content
    assert "gbaHydroTorrentR" in content
    assert "left: calc(50% + 10px)" in content  # Right cannon container aligned with right cannon nozzle
    assert "rotate(30deg)" in content  # Right cannon stream angle restored from Image 2
    assert "left: calc(50% - 1px)" in content  # Impact dome centered on jet arrival point
    assert "gbaHydroConcussionDome" in content
    assert "gbaHydroSpray1" in content
    assert "gbaHydroSpray10" in content
    assert "gbaHydroSpray14" in content
    print("preview_blastoise.html verified.")

if __name__ == "__main__":
    test_assets()
    test_battle_fx_overlay()
    test_index_css()
    test_preview_blastoise()
    print("ALL BLASTOISE HYDRO PUMP TESTS PASSED!")
