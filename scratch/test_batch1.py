import json

cards = json.load(open('src/data/cards.json', 'r', encoding='utf-8'))
bfx = open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8').read()

print("Testing Batch 1 Move Implementations:")

# 1. Doduo: Fury Attack
doduo_cards = [c for c in cards if c.get('name') == 'Doduo']
assert len(doduo_cards) > 0, "Doduo cards not found"
assert "pkm.includes('doduo')" in bfx, "Doduo check missing in BattleFXOverlay"
assert "'doduo_fury_attack'" in bfx, "doduo_fury_attack type missing in BattleFXOverlay"
assert "gbaDoduoBeakLeft" in bfx, "gbaDoduoBeakLeft missing in BattleFXOverlay"
assert "gbaDoduoBeakRight" in bfx, "gbaDoduoBeakRight missing in BattleFXOverlay"
print("[OK] Doduo Fury Attack: Verified!")

# 2. Magnemite: Magnetism & Thunder Wave
magnemite_cards = [c for c in cards if c.get('name') == 'Magnemite']
assert len(magnemite_cards) > 0, "Magnemite cards not found"
assert "pkm.includes('magnemite')" in bfx, "Magnemite check missing in BattleFXOverlay"
assert "'magnemite_thunder_wave'" in bfx, "magnemite_thunder_wave type missing"
assert "'magnemite_magnetism'" in bfx, "magnemite_magnetism type missing"
assert "gbaMagnetPulseLeft" in bfx, "gbaMagnetPulseLeft missing"
assert "gbaMagnetPulseRight" in bfx, "gbaMagnetPulseRight missing"
assert "gbaMagneticFluxExpand" in bfx, "gbaMagneticFluxExpand missing"
print("[OK] Magnemite Magnetism & Thunder Wave: Verified!")

# 3. Porygon: Conversion 1 & 2
porygon_cards = [c for c in cards if c.get('name') == 'Porygon']
assert len(porygon_cards) > 0, "Porygon cards not found"
assert "pkm.includes('porygon')" in bfx, "Porygon check missing in BattleFXOverlay"
assert "'porygon_conversion'" in bfx, "porygon_conversion type missing"
assert "gbaPorygonWireframeSpin" in bfx, "gbaPorygonWireframeSpin missing"
assert "gbaPorygonScanLine" in bfx, "gbaPorygonScanLine missing"
assert "gbaPorygonPixelAscend" in bfx, "gbaPorygonPixelAscend missing"
print("[OK] Porygon Conversion 1 & 2: Verified!")

print("\nALL BATCH 1 CHECKS PASSED (100% SUCCESS)!")
