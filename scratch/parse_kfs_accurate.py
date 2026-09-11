import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

def extract_keyframes(css_text):
    kfs = {}
    pattern = re.compile(r'@keyframes\s+([a-zA-Z0-9_\-]+)\s*\{')
    pos = 0
    while True:
        match = pattern.search(css_text, pos)
        if not match:
            break
        name = match.group(1)
        start = match.end()
        brace_count = 1
        i = start
        while i < len(css_text) and brace_count > 0:
            if css_text[i] == '{':
                brace_count += 1
            elif css_text[i] == '}':
                brace_count -= 1
            i += 1
        body = css_text[start:i-1]
        kfs[name] = body
        pos = i
    return kfs

kfs = extract_keyframes(css)

# Let's inspect the keyframes of recently added/updated animations:
recent_kfs = [
    'gbaCharmanderTailSweep', 'gbaCharmanderEmber1', 'gbaCharmanderEmber2', 'gbaCharmanderEmber3', 'gbaCharmanderScorchPatch', 'gbaCharmanderCinders',
    'gbaEmberSparkRise', 'gbaEmberImpactGlow', 'gbaEmberSparkP1',
    'gbaCrabhammerPincerCock', 'gbaCrabhammerGeyserSplash',
    'gbaClawGripApproach', 'gbaClawImpactBurst',
    'gbaSandshrewClawSwipe', 'gbaSandshrewSandBlast', 'gbaSandshrewBlindingHaze', 'gbaSandshrewGritPellets',
    'gbaFearowBeakDrill', 'gbaFearowVortexCone', 'gbaFearowDrillSparks',
    'gbaArbokViperFangs', 'gbaArbokVenomSpurtL', 'gbaArbokVenomSpurtR',
    'gbaGolbatVampireDive', 'gbaGolbatVitalityOrbSiphon',
    'gbaFarfetchdLeekSwoop', 'gbaFarfetchdLeekSlashMarks',
    'gbaCuboneBoneSmash', 'gbaCuboneBoneShards', 'gbaCuboneDustRing',
    'gbaSquirtleShellSnap', 'gbaSquirtleShieldRings',
    'gbaPikachuChargePose', 'gbaPikachuThunderBolts',
    'gbaWeedleStingerDive', 'gbaWeedlePoisonSpurt', 'gbaWeedlePoisonVignette',
    'gbaCaterpieHeadPop', 'gbaCaterpieSilkJet', 'gbaCaterpieCocoonWrap'
]

print("=== INSPECTING RECENT KEYFRAMES ===")
for r in recent_kfs:
    if r in kfs:
        stops = re.findall(r'(\d+%)', kfs[r])
        has_blur = 'blur' in kfs[r]
        has_filter = 'filter' in kfs[r]
        print(f"{r:30} | {len(stops)} stops: {', '.join(stops[:6])} | filter:{has_filter} | blur:{has_blur}")
    else:
        print(f"{r:30} | MISSING!")
