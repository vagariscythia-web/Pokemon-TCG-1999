with open('public/preview_advanced_moves_showcase.html', 'r', encoding='utf-8') as f:
    html = f.read()

checks = {
    'Old 5-blob Gooey splash removed': 'hcGooSplashBlob' not in html,
    'Canvas FluidDroplet system present': 'class FluidDroplet' in html,
    '90 droplets simulated': 'droplets.push(new FluidDroplet' in html,
    'Turbulent boil core present': 'hcHydraulicBoilCore' in html,
    'Boil core uses waterJetTurbulenceFilter': 'filter:url(#waterJetTurbulenceFilter)' in html,
    'Braces balanced': html.count('{') == html.count('}')
}

all_ok = True
for k, v in checks.items():
    print(f'{k}: {v}')
    if not v:
        all_ok = False

print("\nFINAL AUDIT STATUS:", "PASS" if all_ok else "FAIL")
