import os
import re
from PIL import Image

def test_hitmonchan_special_punch():
    # 1. Asset check
    asset_path = 'public/assets/Hitmonchan_SpecialPunch.png'
    assert os.path.exists(asset_path), f"Asset {asset_path} does not exist!"
    img = Image.open(asset_path)
    assert img.size == (870, 620), f"Unexpected image size: {img.size}"
    assert img.mode == 'RGBA', f"Unexpected mode: {img.mode}"
    bbox = img.getbbox()
    assert bbox == (13, 9, 856, 611), f"Unexpected bbox: {bbox}"
    print(f"[PASS] Asset verified: {img.size}, mode={img.mode}, bbox={bbox}")

    # 2. BattleFXOverlay.tsx check
    with open(r'src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
        overlay = f.read()

    assert 'src="/assets/Hitmonchan_SpecialPunch.png"' in overlay, "Asset path missing in BattleFXOverlay!"
    assert 'w-[140px] h-[100px]' in overlay, "Tier-1 140x100px scaling missing!"
    assert 'w-[98px] h-[70px]' in overlay, "Whiff 98x70px scaling missing!"
    assert "translate(-38px, 15px)" in overlay, "Impact knuckle alignment (-38px, 15px) missing!"
    
    match_dur = re.search(r"case 'hitmonchan_special_punch':\s*return (\d+);", overlay)
    assert match_dur and match_dur.group(1) == '1320', f"Duration mismatch: {match_dur}"
    print("[PASS] BattleFXOverlay JSX & Duration (1320ms) verified")

    # 3. index.css keyframe check
    with open(r'src/index.css', 'r', encoding='utf-8') as f:
        css = f.read()

    assert '@keyframes gbaHitmonchanSpecialPunchLunge' in css, "gbaHitmonchanSpecialPunchLunge missing!"
    assert '@keyframes gbaHitmonchanSpecialPunchWhiff' in css, "gbaHitmonchanSpecialPunchWhiff missing!"
    assert 'translate(-18px, 10px)' in css, "Apex impact lunge coordinates missing in CSS!"
    print("[PASS] index.css keyframes verified")

    print("\nALL HITMONCHAN SPECIAL PUNCH VERIFICATION CHECKS PASSED!")

if __name__ == '__main__':
    test_hitmonchan_special_punch()
