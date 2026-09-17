import re

with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    bfx = f.read()

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Check keyframes for Growlithe
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

print("=== CHECKING GROWLITHE KEYFRAMES ===")
for kf in growlithe_kfs:
    print(f"{kf}: {'FOUND in CSS' if kf in css else 'MISSING in CSS'} | {'USED in TSX' if kf in bfx else 'NOT IN TSX'}")

# Check keyframes for Vulpix
vulpix_kfs = [
    'gbaVulpixMysticFloat',
    'gbaVulpixSpiritMist',
    'gbaVulpixWispLeft',
    'gbaVulpixWispRight',
    'gbaVulpixWispCrown',
    'gbaVulpixFlameFlicker',
    'gbaVulpixPsyWave1',
    'gbaVulpixPsyWave2',
    'gbaVulpixPsyWave3',
    'gbaVulpixSpiritMote',
    'gbaVulpixWhiff'
]

print("\n=== CHECKING VULPIX KEYFRAMES ===")
for kf in vulpix_kfs:
    print(f"{kf}: {'FOUND in CSS' if kf in css else 'MISSING in CSS'} | {'USED in TSX' if kf in bfx else 'NOT IN TSX'}")

# Verify no rigid wheel animation remains
print("\n=== CHECKING REMOVAL OF RIGID WHEEL ANIMATION ===")
print("gbaVulpixKitsunebiHelix in CSS:", 'gbaVulpixKitsunebiHelix' in css)
print("gbaVulpixKitsunebiHelix in TSX:", 'gbaVulpixKitsunebiHelix' in bfx)
