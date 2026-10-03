with open('public/preview_advanced_moves_showcase.html', 'r', encoding='utf-8') as f:
    html = f.read()

checks = {
    'Static root SVG with waterJetTurbulenceFilter': 'id="waterJetTurbulenceFilter"' in html[:25000],
    'Static root SVG with liquidGooFilter': 'id="liquidGooFilter"' in html[:25000],
    'GSAP loaded in head': 'cdnjs.cloudflare.com/ajax/libs/gsap' in html[:3000],
    'hcHydroStreamL keyframe': '@keyframes hcHydroStreamL' in html,
    'Streams use waterJetTurbulenceFilter': 'filter:url(#waterJetTurbulenceFilter)' in html,
    'Splash uses liquidGooFilter': 'filter:url(#liquidGooFilter)' in html,
    'hcGooSplashCenter keyframe': '@keyframes hcGooSplashCenter' in html,
    'Pinwheel path removed': 'M 38 6 C 42 18' not in html,
    'Old white ellipse removed': 'rx="18" ry="18" fill="#ffffff"' not in html,
    'Page load turbulence loop': "waterTurbElem.setAttribute('baseFrequency'" in html,
    'Braces balanced': html.count('{') == html.count('}')
}

all_ok = True
for k, v in checks.items():
    print(f'{k}: {v}')
    if not v:
        all_ok = False

print("\nOVERALL STATUS:", "PASS" if all_ok else "FAIL")
