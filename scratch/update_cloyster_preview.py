import base64
import os

with open('public/assets/Cloyster_Clamp_Maw.png', 'rb') as f:
    clamp_maw_b64 = base64.b64encode(f.read()).decode('utf-8')

with open('public/assets/Cloyster_Spike_Cannon.png', 'rb') as f:
    spike_cannon_b64 = base64.b64encode(f.read()).decode('utf-8')

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cloyster: Clamp & Spike Cannon FX Preview</title>
  <style>
    body {{
      margin: 0;
      padding: 24px;
      background: #090d16;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }}
    h1 {{
      font-size: 24px;
      margin-bottom: 8px;
      color: #38bdf8;
      text-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
    }}
    p {{
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 24px;
    }}
    .preview-arena {{
      display: flex;
      gap: 40px;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }}
    .card-slot {{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }}
    .slot-label {{
      font-weight: 600;
      font-size: 15px;
      color: #c4b5fd;
    }}
    .card {{
      position: relative;
      width: 170px;
      height: 240px;
      border-radius: 12px;
      background: linear-gradient(135deg, #1e293b, #0f172a);
      border: 2px solid #334155;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
      overflow: visible;
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .card-art {{
      width: 130px;
      height: 90px;
      background: #0284c7;
      border-radius: 6px;
      opacity: 0.3;
      border: 1px dashed #7dd3fc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: #e0f2fe;
    }}
    .btn-group {{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      margin-top: 30px;
      max-width: 820px;
    }}
    button {{
      padding: 10px 18px;
      background: #0284c7;
      border: none;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.4);
      transition: all 0.2s;
    }}
    button:hover {{
      background: #0ea5e9;
      transform: translateY(-2px);
      box-shadow: 0 0 18px rgba(14, 165, 233, 0.7);
    }}

    /* Keyframes */
    @keyframes gbaCloysterAbyssalFloor {{
      0%   {{ transform: scale(0.65); opacity: 0; }}
      28%  {{ transform: scale(0.95); opacity: 0.7; }}
      46%  {{ transform: scale(1.12); opacity: 0.95; filter: drop-shadow(0 0 20px #0284c7); }}
      70%  {{ transform: scale(1.04); opacity: 0.65; }}
      100% {{ transform: scale(0.9); opacity: 0; filter: blur(3px); }}
    }}

    @keyframes gbaCloysterClampMaw {{
      0% {{
        transform: translate(-50%, -50%) translateY(-22px) scale(0.42) rotate(-5deg);
        filter: blur(4px);
        opacity: 0;
      }}
      18% {{
        transform: translate(-50%, -50%) translateY(-6px) scale(1.02) rotate(2deg);
        filter: blur(0px) drop-shadow(0 0 20px #7c3aed);
        opacity: 0.95;
      }}
      32% {{
        transform: translate(-50%, -50%) translateY(-3px) scale(1.18, 1.12) rotate(-1deg);
        filter: drop-shadow(0 0 28px #8b5cf6) drop-shadow(0 0 16px #38bdf8);
        opacity: 1;
      }}
      46% {{
        transform: translate(-50%, -50%) translateY(2px) scale(1.28, 0.88) rotate(0deg);
        filter: drop-shadow(0 0 38px #c084fc) drop-shadow(0 0 22px #ffffff) brightness(1.4);
        opacity: 1;
      }}
      56% {{
        transform: translate(-50%, -50%) translateY(0px) scale(1.06, 1.18) rotate(1deg);
        filter: drop-shadow(0 0 32px #a855f7);
        opacity: 0.95;
      }}
      68% {{
        transform: translate(-50%, -50%) translateY(1px) scale(1.1, 1.02) rotate(-0.5deg);
        opacity: 0.9;
      }}
      82% {{
        transform: translate(-50%, -50%) translateY(3px) scale(1.02) rotate(0deg);
        opacity: 0.7;
        filter: blur(1px);
      }}
      100% {{
        transform: translate(-50%, -50%) translateY(14px) scale(0.75);
        opacity: 0;
        filter: blur(4px);
      }}
    }}

    @keyframes gbaCloysterClampWhiff {{
      0%   {{ transform: translate(-50%, -50%) translateY(-20px) scale(0.4) rotate(-8deg); opacity: 0; }}
      30%  {{ transform: translate(-50%, -50%) translateY(-8px) scale(0.85) rotate(4deg); opacity: 0.6; }}
      55%  {{ transform: translate(-50%, -50%) translateY(8px) translateX(24px) scale(0.72) rotate(14deg); opacity: 0.4; }}
      100% {{ transform: translate(-50%, -50%) translateY(30px) translateX(45px) scale(0.5) rotate(22deg); opacity: 0; filter: blur(3px); }}
    }}

    @keyframes gbaCloysterHornPulse {{
      0%, 15% {{ transform: translate(-50%, -50%) scale(0.2); opacity: 0; }}
      32%     {{ transform: translate(-50%, -50%) scale(1.1); opacity: 0.85; filter: drop-shadow(0 0 16px #ffffff) drop-shadow(0 0 22px #38bdf8); }}
      46%     {{ transform: translate(-50%, -50%) scale(2.0); opacity: 1; filter: drop-shadow(0 0 32px #ffffff) drop-shadow(0 0 40px #a78bfa) brightness(1.5); }}
      64%     {{ transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }}
      82%     {{ transform: translate(-50%, -50%) scale(0.7); opacity: 0.25; }}
      100%    {{ transform: translate(-50%, -50%) scale(0.2); opacity: 0; }}
    }}

    @keyframes gbaCloysterClampFlash {{
      0%   {{ transform: translate(-50%, -50%) scale(0.2); opacity: 0; }}
      15%  {{ transform: translate(-50%, -50%) scale(1.4); opacity: 1; filter: drop-shadow(0 0 20px #ffffff) drop-shadow(0 0 28px #38bdf8); }}
      50%  {{ transform: translate(-50%, -50%) scale(1.8); opacity: 0.6; filter: blur(1.5px); }}
      100% {{ transform: translate(-50%, -50%) scale(2.4); opacity: 0; filter: blur(4px); }}
    }}

    @keyframes gbaCloysterHydroRingInner {{
      0%   {{ transform: translate(-50%, -50%) scale(0.25); opacity: 0; }}
      25%  {{ transform: translate(-50%, -50%) scale(1.0); opacity: 0.95; }}
      60%  {{ transform: translate(-50%, -50%) scale(1.35); opacity: 0.55; }}
      100% {{ transform: translate(-50%, -50%) scale(1.7); opacity: 0; filter: blur(2px); }}
    }}

    @keyframes gbaCloysterHydroRingOuter {{
      0%   {{ transform: translate(-50%, -50%) scale(0.35); opacity: 0; }}
      30%  {{ transform: translate(-50%, -50%) scale(1.15); opacity: 0.75; }}
      65%  {{ transform: translate(-50%, -50%) scale(1.55); opacity: 0.4; }}
      100% {{ transform: translate(-50%, -50%) scale(1.95); opacity: 0; filter: blur(3px); }}
    }}

    @keyframes gbaCloysterHydroJetLeft {{
      0%   {{ transform: translate(-50%, -50%) translateX(-10px) scaleX(0.2) scaleY(0.5); opacity: 0; }}
      20%  {{ transform: translate(-50%, -50%) translateX(-35px) scaleX(1.15) scaleY(1.1); opacity: 0.95; filter: drop-shadow(0 0 12px #38bdf8); }}
      50%  {{ transform: translate(-50%, -50%) translateX(-55px) scaleX(1.3) scaleY(0.9); opacity: 0.75; }}
      80%  {{ transform: translate(-50%, -50%) translateX(-70px) scaleX(1.4) scaleY(0.7); opacity: 0.35; filter: blur(1.5px); }}
      100% {{ transform: translate(-50%, -50%) translateX(-80px) scaleX(1.45) scaleY(0.5); opacity: 0; filter: blur(3px); }}
    }}

    @keyframes gbaCloysterHydroJetRight {{
      0%   {{ transform: translate(-50%, -50%) translateX(10px) scaleX(0.2) scaleY(0.5); opacity: 0; }}
      20%  {{ transform: translate(-50%, -50%) translateX(35px) scaleX(1.15) scaleY(1.1); opacity: 0.95; filter: drop-shadow(0 0 12px #38bdf8); }}
      50%  {{ transform: translate(-50%, -50%) translateX(55px) scaleX(1.3) scaleY(0.9); opacity: 0.75; }}
      80%  {{ transform: translate(-50%, -50%) translateX(70px) scaleX(1.4) scaleY(0.7); opacity: 0.35; filter: blur(1.5px); }}
      100% {{ transform: translate(-50%, -50%) translateX(80px) scaleX(1.45) scaleY(0.5); opacity: 0; filter: blur(3px); }}
    }}

    @keyframes gbaCloysterBubblePop {{
      0%   {{ transform: scale(0.2); opacity: 0; }}
      25%  {{ transform: scale(1.15) translateY(-4px); opacity: 0.95; }}
      60%  {{ transform: scale(1.0) translateY(-12px); opacity: 0.7; }}
      100% {{ transform: scale(1.35) translateY(-22px); opacity: 0; filter: blur(1.5px); }}
    }}

    @keyframes gbaCloysterSprayDrift {{
      0%   {{ transform: translate(0, 0) scale(0.3); opacity: 0; }}
      20%  {{ transform: translate(calc(var(--spray-x, 10px) * 0.4), calc(var(--spray-y, -10px) * 0.4)) scale(1.1); opacity: 0.9; }}
      65%  {{ transform: translate(var(--spray-x, 20px), var(--spray-y, -25px)) scale(0.9); opacity: 0.55; }}
      100% {{ transform: translate(calc(var(--spray-x, 30px) * 1.4), calc(var(--spray-y, -35px) * 1.4)) scale(0.4); opacity: 0; }}
    }}

    @keyframes gbaCloysterTorpedoWake {{
      0%   {{ transform: scale(0.6); opacity: 0; }}
      25%  {{ transform: scale(0.9); opacity: 0.65; }}
      48%  {{ transform: scale(1.15); opacity: 0.85; filter: drop-shadow(0 0 18px #0284c7); }}
      75%  {{ transform: scale(1.05); opacity: 0.45; }}
      100% {{ transform: scale(0.95); opacity: 0; filter: blur(3px); }}
    }}

    @keyframes gbaCloysterTorpedoSpin {{
      0% {{
        transform: translate(-50%, -50%) translateX(-48px) scale(0.55) rotate(-35deg);
        opacity: 0;
        filter: blur(3px);
      }}
      18% {{
        transform: translate(-50%, -50%) translateX(-40px) scale(0.95) rotate(-15deg);
        opacity: 0.9;
        filter: drop-shadow(0 0 18px #0284c7);
      }}
      32% {{
        transform: translate(-50%, -50%) translateX(-14px) scale(1.12) rotate(360deg);
        opacity: 1;
        filter: drop-shadow(0 0 24px #38bdf8);
      }}
      48% {{
        transform: translate(-50%, -50%) translateX(2px) scale(1.26, 0.88) rotate(740deg);
        opacity: 1;
        filter: drop-shadow(0 0 35px #ffffff) drop-shadow(0 0 25px #38bdf8) brightness(1.35);
      }}
      58% {{
        transform: translate(-50%, -50%) translateX(-2px) scale(1.04, 1.16) rotate(730deg);
        opacity: 0.95;
        filter: drop-shadow(0 0 28px #7c3aed);
      }}
      68% {{
        transform: translate(-50%, -50%) translateX(1px) scale(1.08, 1.02) rotate(736deg);
        opacity: 0.9;
      }}
      82% {{
        transform: translate(-50%, -50%) translateY(4px) scale(1.0) rotate(728deg);
        opacity: 0.65;
        filter: blur(1px);
      }}
      100% {{
        transform: translate(-50%, -50%) translateY(16px) scale(0.72) rotate(720deg);
        opacity: 0;
        filter: blur(4px);
      }}
    }}

    @keyframes gbaCloysterTorpedoWhiff {{
      0%   {{ transform: translate(-50%, -50%) translateX(-50px) scale(0.5) rotate(-30deg); opacity: 0; }}
      25%  {{ transform: translate(-50%, -50%) translateX(-10px) scale(0.85) rotate(180deg); opacity: 0.5; }}
      48%  {{ transform: translate(-50%, -50%) translateX(45px) translateY(-15px) scale(0.9) rotate(380deg); opacity: 0.45; }}
      75%  {{ transform: translate(-50%, -50%) translateX(85px) translateY(-25px) scale(0.75) rotate(520deg); opacity: 0.2; }}
      100% {{ transform: translate(-50%, -50%) translateX(110px) translateY(-32px) scale(0.6) rotate(600deg); opacity: 0; filter: blur(3px); }}
    }}

    @keyframes gbaCloysterSpikeCannonFlash {{
      0%   {{ transform: scale(0.2); opacity: 0; }}
      20%  {{ transform: scale(1.35); opacity: 1; filter: drop-shadow(0 0 22px #ffffff) drop-shadow(0 0 30px #38bdf8); }}
      55%  {{ transform: scale(1.75); opacity: 0.6; filter: blur(1px); }}
      100% {{ transform: scale(2.1); opacity: 0; filter: blur(4px); }}
    }}

    @keyframes gbaCloysterSpikeCannonRing {{
      0%   {{ transform: scale(0.25); opacity: 0.9; border-width: 3.5px; }}
      45%  {{ transform: scale(1.35); opacity: 0.75; border-width: 2px; }}
      100% {{ transform: scale(2.05); opacity: 0; border-width: 0.6px; filter: blur(3px); }}
    }}

    @keyframes gbaCloysterSpikeEmbed {{
      0% {{
        transform: translate(calc(-50% + var(--spike-ox, 0px)), calc(-50% + var(--spike-oy, 0px))) scale(0.2) rotate(var(--spike-rot, 0deg));
        opacity: 0;
      }}
      22% {{
        transform: translate(calc(-50% + var(--spike-tx, 0px) * 0.7), calc(-50% + var(--spike-ty, 0px) * 0.7)) scale(1.18) rotate(var(--spike-rot, 0deg));
        opacity: 1;
        filter: drop-shadow(0 0 16px #38bdf8);
      }}
      38% {{
        transform: translate(calc(-50% + var(--spike-tx, 0px)), calc(-50% + var(--spike-ty, 0px))) scale(0.96) rotate(var(--spike-rot, 0deg));
        opacity: 1;
      }}
      70% {{
        transform: translate(calc(-50% + var(--spike-tx, 0px)), calc(-50% + var(--spike-ty, 0px))) scale(1.0) rotate(var(--spike-rot, 0deg));
        opacity: 0.85;
      }}
      100% {{
        transform: translate(calc(-50% + var(--spike-tx, 0px)), calc(-50% + var(--spike-ty, 0px) + 6px)) scale(0.85) rotate(var(--spike-rot, 0deg));
        opacity: 0;
        filter: blur(2px);
      }}
    }}

    @keyframes gbaCloysterSpikeScatter {{
      0% {{
        transform: translate(calc(-50% + var(--spike-ox, 0px)), calc(-50% + var(--spike-oy, 0px))) scale(0.3) rotate(var(--spike-rot, 0deg));
        opacity: 0;
      }}
      25% {{
        transform: translate(calc(-50% + var(--spike-ox, 0px) * 2.2), calc(-50% + var(--spike-oy, 0px) * 2.2)) scale(1.15) rotate(var(--spike-rot, 0deg));
        opacity: 1;
      }}
      60% {{
        transform: translate(calc(-50% + var(--spike-ox, 0px) * 3.8), calc(-50% + var(--spike-oy, 0px) * 3.8)) scale(0.9) rotate(var(--spike-rot, 0deg));
        opacity: 0.75;
      }}
      100% {{
        transform: translate(calc(-50% + var(--spike-ox, 0px) * 5.2), calc(-50% + var(--spike-oy, 0px) * 5.2)) scale(0.6) rotate(var(--spike-rot, 0deg));
        opacity: 0;
        filter: blur(2px);
      }}
    }}

    @keyframes gbaCloysterSpikeFoam {{
      0%   {{ transform: scale(0.3) rotate(0deg); opacity: 0; }}
      30%  {{ transform: scale(1.1) rotate(15deg); opacity: 0.85; filter: drop-shadow(0 0 8px #7dd3fc); }}
      65%  {{ transform: scale(1.3) rotate(35deg); opacity: 0.5; }}
      100% {{ transform: scale(1.5) rotate(50deg); opacity: 0; filter: blur(2px); }}
    }}
  </style>
</head>
<body>
  <h1>Cloyster: Clamp & Spike Cannon FX Preview</h1>
  <p>5-Layer Modular Aquatic Architecture — Live Multi-Hit Crossfire Engine</p>

  <div class="preview-arena">
    <div class="card-slot">
      <div class="slot-label">Defending Active Card</div>
      <div class="card" id="activeCard">
        <div class="card-art">DEFENDING POKÉMON</div>
        <div id="fxContainer" style="position: absolute; inset: 0; overflow: visible; pointer-events: none;"></div>
      </div>
    </div>
  </div>

  <div class="btn-group">
    <button onclick="playClamp(false)">Play CLAMP (Hit 1.55s)</button>
    <button onclick="playClamp(true)" style="background: #475569;">CLAMP (Whiff)</button>
    <button onclick="playSpikeCannonSingle(false, false)">Spike Cannon (Hit 1: Normal L&rarr;R)</button>
    <button onclick="playSpikeCannonSingle(true, false)" style="background: #0369a1;">Spike Cannon (Hit 2: Mirrored R&rarr;L)</button>
    <button onclick="playSpikeCannonVolley()" style="background: #7c3aed; box-shadow: 0 0 16px rgba(124, 58, 237, 0.6);">&bull; 2-Coin Crossfire Volley (Hit 1 + Hit 2 @ 380ms)</button>
    <button onclick="playSpikeCannonSingle(false, true)" style="background: #475569;">Spike Cannon (Whiff)</button>
  </div>

  <script>
    const clampMawSrc = 'data:image/png;base64,{clamp_maw_b64}';
    const spikeCannonSrc = 'data:image/png;base64,{spike_cannon_b64}';

    function clearFX() {{
      document.getElementById('fxContainer').innerHTML = '';
    }}

    function playClamp(whiffed = false) {{
      clearFX();
      const container = document.getElementById('fxContainer');

      // Layer 1: Abyssal Floor
      const floor = document.createElement('div');
      floor.style.cssText = 'position: absolute; inset: 0; border-radius: 12px; z-index: 20; background: radial-gradient(ellipse at 50% 50%, rgba(2,132,199,0.55) 0%, rgba(15,23,42,0.45) 55%, transparent 85%); animation: gbaCloysterAbyssalFloor 1.55s ease-out forwards;';
      container.appendChild(floor);

      // Layer 2: Maw
      const mawWrap = document.createElement('div');
      mawWrap.style.cssText = 'position: absolute; left: 50%; top: 48%; z-index: 30; animation: ' + (whiffed ? 'gbaCloysterClampWhiff 1.55s ease-out' : 'gbaCloysterClampMaw 1.55s cubic-bezier(0.18, 0.92, 0.28, 1)') + ' forwards;';
      mawWrap.innerHTML = `<img src="${{clampMawSrc}}" style="width: ${{whiffed ? 88 : 110}}px; height: ${{whiffed ? 88 : 110}}px; object-fit: contain; filter: drop-shadow(0 0 20px #8b5cf6) drop-shadow(0 0 10px #38bdf8);" />`;
      container.appendChild(mawWrap);

      if (whiffed) return;

      // Layer 3: Flash & Rings
      const flash = document.createElement('div');
      flash.style.cssText = 'position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%); z-index: 35; animation: gbaCloysterClampFlash 1.05s ease-out 0.46s forwards; opacity: 0;';
      flash.innerHTML = '<div style="width: 110px; height: 110px; border-radius: 50%; background: radial-gradient(circle, white, #38bdf8, transparent); filter: blur(3px);"></div>';
      container.appendChild(flash);

      const rIn = document.createElement('div');
      rIn.style.cssText = 'position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%); z-index: 35; animation: gbaCloysterHydroRingInner 1.0s cubic-bezier(0.12, 0.85, 0.25, 1) 0.46s forwards; opacity: 0;';
      rIn.innerHTML = '<div style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #38bdf8; box-shadow: 0 0 16px #0284c7;"></div>';
      container.appendChild(rIn);

      // Layer 4: Bilateral Hydro Jets
      const jLeft = document.createElement('div');
      jLeft.style.cssText = 'position: absolute; left: 50%; top: 48%; z-index: 38; animation: gbaCloysterHydroJetLeft 1.05s cubic-bezier(0.15, 0.9, 0.25, 1) 0.46s forwards; opacity: 0;';
      jLeft.innerHTML = '<div style="width: 80px; height: 26px; border-radius: 50%; background: linear-gradient(90deg, #38bdf8, #bae6fd, transparent); filter: blur(1.5px);"></div>';
      container.appendChild(jLeft);

      const jRight = document.createElement('div');
      jRight.style.cssText = 'position: absolute; left: 50%; top: 48%; z-index: 38; animation: gbaCloysterHydroJetRight 1.05s cubic-bezier(0.15, 0.9, 0.25, 1) 0.46s forwards; opacity: 0;';
      jRight.innerHTML = '<div style="width: 80px; height: 26px; border-radius: 50%; background: linear-gradient(-90deg, #38bdf8, #bae6fd, transparent); filter: blur(1.5px);"></div>';
      container.appendChild(jRight);

      // Cavitation Bubbles
      const bubbles = [
        {{ x: -28, y: -24, r: 6, d: 0.48 }},
        {{ x: 30, y: -26, r: 7, d: 0.50 }},
        {{ x: -32, y: 22, r: 6.5, d: 0.52 }},
        {{ x: 34, y: 24, r: 8, d: 0.49 }},
        {{ x: -16, y: -32, r: 4.5, d: 0.56 }},
        {{ x: 20, y: 34, r: 5, d: 0.55 }}
      ];
      bubbles.forEach(b => {{
        const bub = document.createElement('div');
        bub.style.cssText = `position: absolute; left: 50%; top: 48%; transform: translate(calc(-50% + ${{b.x}}px), calc(-50% + ${{b.y}}px)); z-index: 39; animation: gbaCloysterBubblePop 0.85s ease-out ${{b.d}}s forwards; opacity: 0;`;
        bub.innerHTML = `<svg width="${{b.r * 2 + 6}}" height="${{b.r * 2 + 6}}" viewBox="0 0 ${{b.r * 2 + 6}} ${{b.r * 2 + 6}}">
          <circle cx="${{b.r + 3}}" cy="${{b.r + 3}}" r="${{b.r}}" fill="rgba(56,189,248,0.35)" stroke="#bae6fd" stroke-width="1.2" />
          <circle cx="${{b.r + 1.5}}" cy="${{b.r + 1}}" r="${{b.r * 0.35}}" fill="#ffffff" opacity="0.9" />
        </svg>`;
        container.appendChild(bub);
      }});

      // Layer 5: Spray Motes
      const sprays = [
        {{ x: -38, y: -36, d: 0.52 }},
        {{ x: 42, y: -38, d: 0.54 }},
        {{ x: -46, y: 32, d: 0.56 }},
        {{ x: 40, y: 36, d: 0.53 }}
      ];
      sprays.forEach(s => {{
        const sp = document.createElement('div');
        sp.style.cssText = `position: absolute; left: 50%; top: 48%; transform: translate(calc(-50% + ${{s.x}}px), calc(-50% + ${{s.y}}px)); z-index: 40; width: 6px; height: 6px; border-radius: 50%; background: radial-gradient(circle, #ffffff 30%, #7dd3fc 70%, transparent); box-shadow: 0 0 8px #38bdf8; animation: gbaCloysterSprayDrift 0.95s ease-out ${{s.d}}s forwards; opacity: 0;`;
        container.appendChild(sp);
      }});
    }}

    function renderSpikeCannonElements(targetWrapper, whiffed = false) {{
      // Layer 1: Torpedo Wake
      const wake = document.createElement('div');
      wake.style.cssText = 'position: absolute; inset: 0; border-radius: 12px; z-index: 20; background: radial-gradient(ellipse at 40% 50%, rgba(2,132,199,0.55) 0%, rgba(15,23,42,0.4) 50%, transparent 85%); animation: gbaCloysterTorpedoWake 1.65s ease-out forwards;';
      targetWrapper.appendChild(wake);

      // Layer 2: Cloyster Spiked Torpedo Drill Spin
      const torp = document.createElement('div');
      torp.style.cssText = 'position: absolute; left: 50%; top: 48%; z-index: 30; animation: ' + (whiffed ? 'gbaCloysterTorpedoWhiff 1.65s cubic-bezier(0.2, 0.8, 0.4, 1)' : 'gbaCloysterTorpedoSpin 1.65s cubic-bezier(0.16, 0.9, 0.28, 1)') + ' forwards;';
      torp.innerHTML = `<img src="${{spikeCannonSrc}}" style="width: ${{whiffed ? 88 : 114}}px; height: ${{whiffed ? 81 : 105}}px; object-fit: contain; filter: drop-shadow(0 0 22px #38bdf8) drop-shadow(0 0 12px #0284c7);" />`;
      targetWrapper.appendChild(torp);

      if (whiffed) return;

      // Layer 3: Impact Flash & Ring
      const flash = document.createElement('div');
      flash.style.cssText = 'position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%); z-index: 35; animation: gbaCloysterSpikeCannonFlash 1.1s ease-out 0.48s forwards; opacity: 0;';
      flash.innerHTML = '<div style="width: 96px; height: 96px; border-radius: 50%; background: radial-gradient(circle, white, #67e8f9, transparent); filter: blur(3px);"></div>';
      targetWrapper.appendChild(flash);

      const ring = document.createElement('div');
      ring.style.cssText = 'position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%); z-index: 35; animation: gbaCloysterSpikeCannonRing 1.1s cubic-bezier(0.1, 0.85, 0.25, 1) 0.48s forwards; opacity: 0;';
      ring.innerHTML = '<div style="width: 128px; height: 128px; border-radius: 50%; border: 2px solid #38bdf8; box-shadow: 0 0 20px #0284c7;"></div>';
      targetWrapper.appendChild(ring);

      // Layer 4: Ballistic Calcified Spikes
      const embedSpikes = [
        {{ ox: '-30px', oy: '-25px', tx: '-38px', ty: '-32px', delay: '0.48s', rot: '215deg' }},
        {{ ox: '25px', oy: '-30px', tx: '36px', ty: '-26px', delay: '0.51s', rot: '35deg' }},
        {{ ox: '-25px', oy: '20px', tx: '-32px', ty: '34px', delay: '0.54s', rot: '145deg' }},
        {{ ox: '30px', oy: '25px', tx: '40px', ty: '30px', delay: '0.56s', rot: '-40deg' }}
      ];
      embedSpikes.forEach(sp => {{
        const s = document.createElement('div');
        s.style.cssText = `position: absolute; left: 50%; top: 48%; z-index: 38; animation: gbaCloysterSpikeEmbed 1.1s cubic-bezier(0.18, 0.88, 0.32, 1) ${{sp.delay}} forwards; opacity: 0; --spike-ox: ${{sp.ox}}; --spike-oy: ${{sp.oy}}; --spike-tx: ${{sp.tx}}; --spike-ty: ${{sp.ty}}; --spike-rot: ${{sp.rot}};`;
        s.innerHTML = `<svg width="10" height="24" viewBox="0 0 10 24" style="filter: drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 14px #38bdf8);">
          <polygon points="5,0 9,7 7,24 3,24 1,7" fill="#f8fafc" stroke="#334155" stroke-width="1.1" />
          <polygon points="5,1 8.5,7 6.5,22 5,23 5,1" fill="#ffffff" opacity="0.95" />
          <polygon points="5,1 5,23 3.5,22 1.5,7 5,1" fill="#7dd3fc" opacity="0.85" />
        </svg>`;
        targetWrapper.appendChild(s);
      }});

      // Scatter Spikes
      const scatterSpikes = [
        {{ ox: '-10px', oy: '-15px', delay: '0.49s', rot: '-70deg' }},
        {{ ox: '12px', oy: '10px', delay: '0.52s', rot: '110deg' }}
      ];
      scatterSpikes.forEach(sp => {{
        const s = document.createElement('div');
        s.style.cssText = `position: absolute; left: 50%; top: 48%; z-index: 38; animation: gbaCloysterSpikeScatter 1.05s cubic-bezier(0.15, 0.85, 0.35, 1) ${{sp.delay}} forwards; opacity: 0; --spike-ox: ${{sp.ox}}; --spike-oy: ${{sp.oy}}; --spike-rot: ${{sp.rot}};`;
        s.innerHTML = `<svg width="8" height="18" viewBox="0 0 8 18" style="filter: drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 10px #38bdf8);">
          <polygon points="4,0 7,5 6,18 2,18 1,5" fill="#f1f5f9" stroke="#475569" stroke-width="1.0" />
          <polygon points="4,1 6.5,5 5,17 4,1" fill="#ffffff" opacity="0.95" />
          <polygon points="4,1 4,17 3,17 1.5,5 4,1" fill="#38bdf8" opacity="0.8" />
        </svg>`;
        targetWrapper.appendChild(s);
      }});

      // Foam
      const foam = document.createElement('div');
      foam.style.cssText = 'position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%); z-index: 40; animation: gbaCloysterSpikeFoam 1.2s ease-out 0.48s forwards; opacity: 0;';
      foam.innerHTML = '<div style="width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(125,211,252,0.4) 40%, transparent 70%); filter: blur(2px);"></div>';
      targetWrapper.appendChild(foam);
    }}

    function playSpikeCannonSingle(mirrored = false, whiffed = false) {{
      clearFX();
      const container = document.getElementById('fxContainer');
      const beatWrap = document.createElement('div');
      beatWrap.style.cssText = `position: absolute; inset: 0; pointer-events: none; overflow: visible; transform: ${{mirrored ? 'scaleX(-1)' : 'none'}};`;
      container.appendChild(beatWrap);
      renderSpikeCannonElements(beatWrap, whiffed);
    }}

    let volleyTimeout = null;
    function playSpikeCannonVolley() {{
      clearFX();
      if (volleyTimeout) clearTimeout(volleyTimeout);
      const container = document.getElementById('fxContainer');

      // Beat 1: Normal (Left to Right) @ 0ms
      const beat1Wrap = document.createElement('div');
      beat1Wrap.style.cssText = 'position: absolute; inset: 0; pointer-events: none; overflow: visible;';
      container.appendChild(beat1Wrap);
      renderSpikeCannonElements(beat1Wrap, false);

      // Beat 2: Mirrored (Right to Left crossfire) @ 380ms stagger
      volleyTimeout = setTimeout(() => {{
        const beat2Wrap = document.createElement('div');
        beat2Wrap.style.cssText = 'position: absolute; inset: 0; pointer-events: none; overflow: visible; transform: scaleX(-1);';
        container.appendChild(beat2Wrap);
        renderSpikeCannonElements(beat2Wrap, false);
      }}, 380);
    }}

    window.onload = () => {{ playClamp(); }};
  </script>
</body>
</html>
"""

with open('public/preview_cloyster.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Successfully regenerated public/preview_cloyster.html")
