"""Assertion bench for Team Rocket Charmander (tr-50) charmander_fire_tail_whip FX.

Verifies: deployed asset + aspect, identity-safe routing order, getFXDuration sync,
STOCK_IMAGE_FX_TYPES registration, JSX block integrity (no sentinel leftovers),
keyframe presence and the burst centering invariant (anti-bleed).
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def rd(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return f.read().replace('\r\n', '\n')


# 1. Deployed asset exists and aspect is within the expected band (measured 1.261)
ap = os.path.join(ROOT, 'public', 'assets', 'Charmander_Fire_Tail_Whip.png')
assert os.path.exists(ap), 'missing deployed asset Charmander_Fire_Tail_Whip.png'
w, h = Image.open(ap).size
asp = w / h
assert 1.10 <= asp <= 1.45, 'aspect out of range: %.3f' % asp
print('[OK] asset %dx%d aspect %.3f' % (w, h, asp))

code = rd(os.path.join('src', 'components', 'BattleFXOverlay.tsx'))
css = rd(os.path.join('src', 'index.css'))

# 2. Union member + identity-safe guard precedes the generic charmander dispatch (§7.C)
assert "| 'charmander_fire_tail_whip'" in code, 'union type member missing'
g = code.find("if (name.includes('fire tail') && pokemonCard.id === 'tr-50') return 'charmander_fire_tail_whip';")
e = code.find("if ((name.includes('ember') || name.includes('fire tail')) && pkm.includes('charmander')) return 'charmander_ember_flame';")
assert 0 < g < e, 'tr-50 guard must precede generic charmander dispatch'
print('[OK] routing guard ordered before generic dispatch')

# 3. Duration sync: longest keyframe 1.75s -> getFXDuration 1850ms (§6.1)
assert "case 'charmander_fire_tail_whip':\n      return 1850;" in code, 'getFXDuration case missing'
assert '1.75s' in css, '1.75s keyframe envelope missing in css'
print('[OK] getFXDuration 1850ms >= 1750ms envelope')

# 4. Raster actor registration prevents double-scaling (§7.D)
assert "'charmander_ember_flame', 'charmander_fire_tail_whip'," in code, 'STOCK_IMAGE_FX_TYPES registration missing'
print('[OK] STOCK_IMAGE_FX_TYPES registration present')

# 5. JSX block integrity
assert "fx.type === 'charmander_fire_tail_whip'" in code, 'JSX block missing'
assert '/assets/Charmander_Fire_Tail_Whip.png' in code, 'actor img src missing'
assert 'CFT_PART' not in code, 'sentinel leftover in BattleFXOverlay.tsx'
assert 'gbaCharmanderWhiffPuff 1.75s ease-out forwards' in code, 'whiff puff layer missing'
print('[OK] JSX block complete, no sentinel leftovers')

# 6. All keyframes present in index.css
for k in ['gbaCharmanderTailSpinActor', 'gbaCharmanderTailWhiffStumble', 'gbaCharmanderCrescentTrace',
          'gbaCharmanderCrescentWhiff', 'gbaCharmanderTailBurst', 'gbaCharmanderTailScorchRing',
          'gbaCharmanderCinderArc1', 'gbaCharmanderCinderArc2', 'gbaCharmanderCinderArc3',
          'gbaCharmanderTailMote', 'gbaCharmanderWhiffPuff']:
    assert ('@keyframes %s {' % k) in css, 'missing keyframes ' + k
print('[OK] all 11 keyframe families present')

# 7. Burst centering invariant: translate(-50%, -50%) kept inside every keyframe stop
b = css[css.find('@keyframes gbaCharmanderTailBurst'):]
b = b[:b.find('}', b.find('100%'))]
assert b.count('translate(-50%, -50%)') >= 4, 'burst keyframes must keep centering translate'
print('[OK] burst centering invariant holds (anti-bleed)')

# 8. Preview bench exists and is sentinel-free
prev = rd(os.path.join('scratch', 'preview_charmander_fire_tail.html'))
assert 'CFT_PREVIEW_BODY' not in prev, 'preview sentinel leftover'
assert 'hitStage' in prev and 'whiffStage' in prev, 'preview panels missing'
print('[OK] preview bench complete (hit + whiff panels)')

print('[ALL OK] charmander_fire_tail_whip implementation verified')
