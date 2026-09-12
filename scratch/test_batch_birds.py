print("Testing Batch 20: Legendary Birds Trio (Articuno, Zapdos, Moltres)...")

bfx = open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8').read()
css = open('src/index.css', 'r', encoding='utf-8').read()

# 1. Types
types = [
    'articuno_freeze_dry',
    'articuno_blizzard',
    'zapdos_thunderbolt',
    'zapdos_thunderstorm',
    'moltres_wildfire',
    'moltres_dive_bomb'
]

for t in types:
    assert f"'{t}'" in bfx, f"Type '{t}' missing in BattleFXOverlay.tsx"
    assert f"case '{t}':" in bfx, f"Duration for '{t}' missing in getFXDuration"
    assert f"fx.type === '{t}'" in bfx, f"JSX block for '{t}' missing"
    print(f"[OK] FX type verified: {t}")

# 2. Keyframes
keyframes = [
    'gbaArticunoIceEncase',
    'gbaArticunoFrostPulse',
    'gbaArticunoBlizzardVortex',
    'gbaArticunoSnowflakeSpin',
    'gbaZapdosLightningPillar',
    'gbaZapdosElectricDischarge',
    'gbaZapdosMultiForkStrike',
    'gbaZapdosBenchSparkTravel',
    'gbaMoltresInfernoRise',
    'gbaMoltresAshDrift',
    'gbaMoltresMeteorPlunge',
    'gbaMoltresEruptionBlast'
]

for kf in keyframes:
    assert kf in css, f"Keyframe '{kf}' missing in index.css"
    print(f"[OK] Keyframe verified: {kf}")

print("\nALL LEGENDARY BIRDS TESTS PASSED (100% SUCCESS)!")
