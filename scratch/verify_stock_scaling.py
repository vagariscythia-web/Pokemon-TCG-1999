with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
    overlay = f.read()

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

checks = {
    'Vulpix 112px': "width: fx.whiffed ? '82px' : '112px'" in overlay,
    'Vulpix overflow-visible': "vulpix_confuse_ray' && (\n        <div className=\"absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible\"" in overlay,
    'Vulpix no blur in float': 'filter: blur' not in css[css.find('@keyframes gbaVulpixMysticFloat'):css.find('@keyframes gbaVulpixConfuseCardBlur')],
    'Vulpix vertigo wisp': 'gbaVulpixVertigoWisp1' in css,
    'Growlithe 106px': "width: fx.whiffed ? '78px' : '106px'" in overlay,
    'Snorlax 112px': "w-[112px] h-[112px]" in overlay,
    'Magikarp 98px': "width: '98px'" in overlay,
    'Psyduck 104px': "width: fx.whiffed ? '78px' : '104px'" in overlay,
    'Slowpoke 98px': "width: fx.whiffed ? '74px' : '98px'" in overlay,
    'Mankey 106px': "width: fx.whiffed ? '78px' : '106px'" in overlay,
}

for k, v in checks.items():
    print(f'[{ "PASS" if v else "FAIL" }] {k}')

assert all(checks.values()), 'Some checks failed!'
print('ALL CHECKS PASSED!')
