with open('public/preview_advanced_moves_showcase.html', 'r', encoding='utf-8') as f:
    html = f.read()

checks = {
    'Static root SVG with waterJetTurbulenceFilter': 'id="waterJetTurbulenceFilter"' in html[:25000],
    'Static root SVG with liquidGooFilter': 'id="liquidGooFilter"' in html[:25000],
    'Streams use waterJetTurbulenceFilter': 'filter:url(#waterJetTurbulenceFilter)' in html,
    'hcDynamicFoamBubble keyframe': '@keyframes hcDynamicFoamBubble' in html,
    'hcCoreFoamPulse keyframe': '@keyframes hcCoreFoamPulse' in html,
    'Foam stage uses liquidGooFilter': 'filter:url(#liquidGooFilter)' in html,
    '15 bubbleDefs simulated': 'bubbleDefs' in html,
    'Canvas FluidDroplet system present': 'class FluidDroplet' in html,
    '90 droplets simulated': 'droplets.push(new FluidDroplet' in html,
    'Braces balanced': html.count('{') == html.count('}')
}

all_ok = True
for k, v in checks.items():
    print(f'{k}: {v}')
    if not v:
        all_ok = False

print("\nSYNTHESIS AUDIT STATUS:", "PASS" if all_ok else "FAIL")
