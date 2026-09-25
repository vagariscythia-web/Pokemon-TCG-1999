import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def test_advanced_vfx_preview():
    path = os.path.join(ROOT, "public", "preview_advanced_vfx.html")
    assert os.path.exists(path), f"Missing {path}"

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. CSS Brace Balance
    styles = re.findall(r'<style>(.*?)</style>', content, re.DOTALL)
    for s in styles:
        open_b = s.count('{')
        close_b = s.count('}')
        assert open_b == close_b, f"CSS braces not balanced: {open_b} open vs {close_b} close"
        assert len(re.findall(r'\{[^{}]*@keyframes', s)) == 0, "Nested keyframes found in preview style"

    # 2. GameBoard Parity
    assert "184px" in content, "Missing 184px card width parity"
    assert "253px" in content, "Missing 253px card height parity"
    assert "status-strip" in content, "Missing status strip parity"
    assert "status-hp" in content, "Missing status HP parity"
    assert "status-pips" in content, "Missing status pips parity"

    # 3. SVG Filter Defs (Methods 1, 2, 3)
    assert "id=\"liquidGooFilter\"" in content, "Missing liquidGooFilter"
    assert "id=\"gasTurbulenceFilter\"" in content, "Missing gasTurbulenceFilter"
    assert "id=\"waterJetTurbulenceFilter\"" in content, "Missing waterJetTurbulenceFilter"
    assert "feGaussianBlur" in content, "Missing feGaussianBlur"
    assert "feColorMatrix" in content, "Missing feColorMatrix"
    assert "feTurbulence" in content, "Missing feTurbulence"
    assert "feDisplacementMap" in content, "Missing feDisplacementMap"

    # 4. Canvas Emitter (Method 4)
    assert "id=\"sprayCanvas\"" in content, "Missing sprayCanvas"
    assert "WaterParticle" in content, "Missing WaterParticle class"

    # 5. Navier-Stokes Eulerian Grid Fluid Solver (Method 5)
    assert "id=\"fluidCanvas\"" in content, "Missing fluidCanvas"
    assert "function diffuse" in content, "Missing Navier-Stokes diffuse"
    assert "function advect" in content, "Missing Navier-Stokes advect"
    assert "function project" in content, "Missing Navier-Stokes project"

    # 6. Spring-Mass Wave Mesh Solver (Method 6)
    assert "id=\"waveCanvas\"" in content, "Missing waveCanvas"
    assert "waveNodes" in content, "Missing waveNodes"
    assert "splashWave" in content, "Missing splashWave"
    assert "quadraticCurveTo" in content or "bezierCurveTo" in content, "Missing wave spline curve"

    # 7. WebGL Caustics Shader (Method 7)
    assert "id=\"shaderCanvas\"" in content, "Missing shaderCanvas"
    assert "getContext('webgl'" in content, "Missing WebGL context"
    assert "gl_FragColor" in content, "Missing WebGL fragment shader"

    # 8. GSAP Library Integration & Resilient Paths
    assert "gsap.min.js" in content, "Missing GSAP CDN script"
    assert "candidatePaths" in content, "Missing candidatePaths for resilient asset loading"

    print("ALL 7 ADVANCED VFX PREVIEW CHECKS PASSED!")

if __name__ == "__main__":
    test_advanced_vfx_preview()
