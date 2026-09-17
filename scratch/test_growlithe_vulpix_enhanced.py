import os

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    bfx = f.read()

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Check assets exist
assets = [
    'public/assets/Growlithe_Flare_Pounce.png',
    'public/assets/Vulpix_Kitsunebi_Stance.png'
]

print("=== CHECKING ASSETS ===")
for a in assets:
    exists = os.path.exists(a)
    print(f"{a}: {'EXISTS' if exists else 'MISSING'}")

# Check keyframes in CSS
print("\n=== CHECKING GROWLITHE KEYFRAMES IN CSS ===")
growlithe_kfs = [
    'gbaGrowlitheActorPounce',
    'gbaGrowlitheMouthTorrent',
    'gbaGrowlitheFlameWav1',
    'gbaGrowlitheFlameWav2',
    'gbaGrowlitheDiagonalBeam',
    'gbaGrowlitheDiagonalBlastRing',
    'gbaGrowlitheTurfScorch',
    'gbaGrowlitheTrailingCinder',
    'gbaGrowlitheFlareWhiff'
]
for kf in growlithe_kfs:
    print(f"{kf}: {'FOUND' if kf in css else 'MISSING'}")

print("\n=== CHECKING VULPIX KEYFRAMES IN CSS ===")
vulpix_kfs = [
    'gbaVulpixMysticFloat',
    'gbaVulpixSpiritMist',
    'gbaVulpixKitsunebiHelix',
    'gbaVulpixPsyWave1',
    'gbaVulpixPsyWave2',
    'gbaVulpixPsyWave3',
    'gbaVulpixSpiritMote',
    'gbaVulpixWhiff'
]
for kf in vulpix_kfs:
    print(f"{kf}: {'FOUND' if kf in css else 'MISSING'}")

# Check getFXDuration
print("\n=== CHECKING getFXDuration ===")
print("flare_burst 1400ms:", "case 'flare_burst':\n      return 1400;" in bfx or "case 'flare_burst':\r\n      return 1400;" in bfx)
print("vulpix_confuse_ray 1700ms:", "case 'vulpix_confuse_ray':\n      return 1700;" in bfx or "case 'vulpix_confuse_ray':\r\n      return 1700;" in bfx)
