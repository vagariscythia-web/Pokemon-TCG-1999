import os

def test_blastoise_option_c_v3():
    # 1. Check index.css
    with open('src/index.css', 'r', encoding='utf-8') as f:
        css = f.read()

    assert '@keyframes gbaHydroTorrentL' in css
    assert '@keyframes gbaHydroTorrentR' in css
    assert '@keyframes gbaImpactSplashPopL' in css
    assert '@keyframes gbaImpactSplashPopR' in css
    
    # Assert no translateY in gbaHydroTorrentR
    torrent_r_block = css[css.find('@keyframes gbaHydroTorrentR'):]
    torrent_r_block = torrent_r_block[:torrent_r_block.find('}') + 1]
    # Check that translateY(- is not in the block
    assert 'translateY(-' not in torrent_r_block, "No translateY allowed in gbaHydroTorrentR"

    # 2. Check BattleFXOverlay.tsx
    with open('src/components/BattleFXOverlay.tsx', 'r', encoding='utf-8') as f:
        tsx = f.read()

    assert 'BlastoiseHydroCavitationCanvas' in tsx
    assert 'this.radius * 0.984' in tsx  # Progressive atomization
    assert 'Math.round(87 * wi)' in tsx
    assert 'Math.round(165 * wi)' in tsx
    assert "fx.type === 'hydro_pump_cannons'" in tsx
    assert 'gbaImpactSplashPopL' in tsx
    assert 'gbaImpactSplashPopR' in tsx
    assert '8.5 * wi' in tsx  # Micro-offset sealing 8.5px

    # 3. Check ANIMATION_DESIGN_SYSTEM.md
    with open('ANIMATION_DESIGN_SYSTEM.md', 'r', encoding='utf-8') as f:
        doc = f.read()

    assert '### O. Nozzle Transform Isolation' in doc
    assert '### P. Target-Driven Barrel Warping' in doc
    assert '### Q. Micro-Offset Sealing' in doc
    assert '### L. Progressive Fluid Atomization' in doc
    assert 'Seçenek C v3' in doc
    assert '36. **Hedefe Göre Namlu Açısını Bükme' in doc
    assert '37. **Nozuldan Translation' in doc
    assert '38. **Katı Plastik Yelpaze' in doc
    assert '39. **Aktör Geri Tepmesi Sırasında' in doc
    assert '27. **Doğal Eksen, Nozul Kök İzolasyonu' in doc
    assert '| 28 | 2026-10-02 |' in doc

    print("ALL OPTION C v3 VERIFICATIONS PASSED!")

if __name__ == '__main__':
    test_blastoise_option_c_v3()
