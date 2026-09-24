const fs = require('fs');
const path = require('path');

const clampMawB64 = fs.readFileSync('public/assets/Cloyster_Clamp_Maw.png').toString('base64');
const spikeCannonB64 = fs.readFileSync('public/assets/Cloyster_Spike_Cannon.png').toString('base64');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cloyster: Clamp & Spike Cannon FX Preview</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #090d16;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 8px;
      color: #38bdf8;
      text-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .preview-arena {
      display: flex;
      gap: 40px;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
    .card-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .slot-label {
      font-weight: 600;
      font-size: 15px;
      color: #c4b5fd;
    }
    .card {
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
    }
    .card-art {
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
    }
    .btn-group {
      display: flex;
      gap: 12px;
      margin-top: 30px;
    }
    button {
      padding: 10px 20px;
      background: #0284c7;
      border: none;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.4);
      transition: all 0.2s;
    }
    button:hover {
      background: #0ea5e9;
      transform: translateY(-2px);
      box-shadow: 0 0 18px rgba(14, 165, 233, 0.7);
    }
    button.whiff {
      background: #475569;
      box-shadow: none;
    }
    button.whiff:hover {
      background: #64748b;
    }

    /* Embedded Keyframes from index.css */
    @keyframes gbaCloysterAbyssalFloor {
      0%   { transform: scale(0.65); opacity: 0; }
      28%  { transform: scale(0.95); opacity: 0.7; }
      46%  { transform: scale(1.12); opacity: 0.95; filter: drop-shadow(0 0 20px #0284c7); }
      70%  { transform: scale(1.04); opacity: 0.65; }
      100% { transform: scale(0.9); opacity: 0; filter: blur(3px); }
    }

    @keyframes gbaCloysterClampMaw {
      0% {
        transform: translate(-50%, -50%) translateY(-22px) scale(0.42) rotate(-5deg);
        filter: blur(4px);
        opacity: 0;
      }
      18% {
        transform: translate(-50%, -50%) translateY(-6px) scale(1.02) rotate(2deg);
        filter: blur(0px) drop-shadow(0 0 20px #7c3aed);
        opacity: 0.95;
      }
      32% {
        transform: translate(-50%, -50%) translateY(-3px) scale(1.18, 1.12) rotate(-1deg);
        filter: drop-shadow(0 0 28px #8b5cf6) drop-shadow(0 0 16px #38bdf8);
        opacity: 1;
      }
      46% {
        transform: translate(-50%, -50%) translateY(2px) scale(1.28, 0.88) rotate(0deg);
        filter: drop-shadow(0 0 38px #c084fc) drop-shadow(0 0 22px #ffffff) brightness(1.4);
        opacity: 1;
      }
      56% {
        transform: translate(-50%, -50%) translateY(-1px) scale(1.22, 1.25) rotate(-1.5deg);
        filter: drop-shadow(0 0 32px #7c3aed);
        opacity: 0.95;
      }
      68% {
        transform: translate(-50%, -50%) translateY(1px) scale(1.16, 1.18) rotate(1deg);
        filter: drop-shadow(0 0 24px #4c1d95);
        opacity: 0.9;
      }
      84% {
        transform: translate(-50%, -50%) translateY(6px) scale(1.02, 1.04) rotate(-2deg);
        filter: blur(1px) drop-shadow(0 0 14px #38bdf8);
        opacity: 0.6;
      }
      100% {
        transform: translate(-50%, -50%) translateY(18px) scale(0.75) rotate(4deg);
        filter: blur(4px);
        opacity: 0;
      }
    }

    @keyframes gbaCloysterHornPulse {
      0%, 15% { transform: scale(0.2); opacity: 0; }
      32% { transform: scale(1.1); opacity: 0.85; filter: drop-shadow(0 0 16px #ffffff) drop-shadow(0 0 22px #38bdf8); }
      46% { transform: scale(2.0); opacity: 1; filter: drop-shadow(0 0 32px #ffffff) drop-shadow(0 0 40px #a78bfa) brightness(1.5); }
      64% { transform: scale(1.2); opacity: 0.7; }
      82% { transform: scale(0.7); opacity: 0.25; }
      100% { transform: scale(0.2); opacity: 0; }
    }

    @keyframes gbaCloysterClampFlash {
      0%   { transform: scale(0.2); opacity: 0; }
      15%  { transform: scale(1.4); opacity: 1; filter: drop-shadow(0 0 20px #ffffff) drop-shadow(0 0 28px #38bdf8); }
      50%  { transform: scale(1.8); opacity: 0.6; filter: blur(1.5px); }
      100% { transform: scale(2.4); opacity: 0; filter: blur(4px); }
    }

    @keyframes gbaCloysterHydroRingInner {
      0%   { transform: scale(0.25); opacity: 0; }
      25%  { transform: scale(1.0); opacity: 0.95; }
      60%  { transform: scale(1.35); opacity: 0.55; }
      100% { transform: scale(1.7); opacity: 0; filter: blur(2px); }
    }

    @keyframes gbaCloysterHydroRingOuter {
      0%   { transform: scale(0.35); opacity: 0; }
      30%  { transform: scale(1.15); opacity: 0.75; }
      65%  { transform: scale(1.55); opacity: 0.4; }
      100% { transform: scale(1.95); opacity: 0; filter: blur(3px); }
    }

    @keyframes gbaCloysterHydroJetLeft {
      0%   { transform: translate(15px, -50%) scaleX(0.2) scaleY(0.5); opacity: 0; }
      20%  { transform: translate(-10px, -50%) scaleX(1.15) scaleY(1.1); opacity: 0.95; filter: drop-shadow(0 0 12px #38bdf8); }
      50%  { transform: translate(-28px, -50%) scaleX(1.3) scaleY(0.9); opacity: 0.75; }
      80%  { transform: translate(-42px, -50%) scaleX(1.4) scaleY(0.7); opacity: 0.35; filter: blur(1.5px); }
      100% { transform: translate(-50px, -50%) scaleX(1.45) scaleY(0.5); opacity: 0; filter: blur(3px); }
    }

    @keyframes gbaCloysterHydroJetRight {
      0%   { transform: translate(-15px, -50%) scaleX(0.2) scaleY(0.5); opacity: 0; }
      20%  { transform: translate(10px, -50%) scaleX(1.15) scaleY(1.1); opacity: 0.95; filter: drop-shadow(0 0 12px #38bdf8); }
      50%  { transform: translate(28px, -50%) scaleX(1.3) scaleY(0.9); opacity: 0.75; }
      80%  { transform: translate(42px, -50%) scaleX(1.4) scaleY(0.7); opacity: 0.35; filter: blur(1.5px); }
      100% { transform: translate(50px, -50%) scaleX(1.45) scaleY(0.5); opacity: 0; filter: blur(3px); }
    }

    @keyframes gbaCloysterBubblePop {
      0%   { transform: scale(0.2) translateY(0); opacity: 0; }
      25%  { transform: scale(1.15) translateY(-3px); opacity: 0.95; }
      55%  { transform: scale(1.35) translateY(-7px); opacity: 0.85; filter: drop-shadow(0 0 10px #7dd3fc); }
      80%  { transform: scale(1.6) translateY(-12px); opacity: 0.45; }
      100% { transform: scale(1.8) translateY(-15px); opacity: 0; filter: blur(1.5px); }
    }

    @keyframes gbaCloysterSprayDrift {
      0%   { transform: scale(0.3) translate(0, 0); opacity: 0; }
      25%  { transform: scale(1.1) translate(-2px, -4px); opacity: 0.9; }
      60%  { transform: scale(0.9) translate(-5px, -10px); opacity: 0.6; }
      100% { transform: scale(0.5) translate(-8px, -16px); opacity: 0; filter: blur(2px); }
    }

    /* Spike Cannon Keyframes */
    @keyframes gbaCloysterTorpedoWake {
      0%   { transform: scale(0.6); opacity: 0; }
      25%  { transform: scale(0.9); opacity: 0.65; }
      48%  { transform: scale(1.15); opacity: 0.85; filter: drop-shadow(0 0 18px #0284c7); }
      75%  { transform: scale(1.05); opacity: 0.45; }
      100% { transform: scale(0.95); opacity: 0; filter: blur(3px); }
    }

    @keyframes gbaCloysterTorpedoSpin {
      0% {
        transform: translate(-50%, -50%) translateX(-48px) scale(0.55) rotate(-35deg);
        opacity: 0;
        filter: blur(3px);
      }
      18% {
        transform: translate(-50%, -50%) translateX(-40px) scale(0.95) rotate(-15deg);
        opacity: 0.9;
        filter: drop-shadow(0 0 18px #0284c7);
      }
      32% {
        transform: translate(-50%, -50%) translateX(-14px) scale(1.12) rotate(360deg);
        opacity: 1;
        filter: drop-shadow(0 0 24px #38bdf8);
      }
      48% {
        transform: translate(-50%, -50%) translateX(2px) scale(1.26, 0.88) rotate(740deg);
        opacity: 1;
        filter: drop-shadow(0 0 35px #ffffff) drop-shadow(0 0 25px #38bdf8) brightness(1.35);
      }
      58% {
        transform: translate(-50%, -50%) translateX(-2px) scale(1.04, 1.16) rotate(730deg);
        opacity: 0.95;
        filter: drop-shadow(0 0 28px #7c3aed);
      }
      68% {
        transform: translate(-50%, -50%) translateX(1px) scale(1.08, 1.02) rotate(736deg);
        opacity: 0.9;
      }
      82% {
        transform: translate(-50%, -50%) translateY(4px) scale(1.0) rotate(728deg);
        opacity: 0.65;
        filter: blur(1px);
      }
      100% {
        transform: translate(-50%, -50%) translateY(16px) scale(0.72) rotate(720deg);
        opacity: 0;
        filter: blur(4px);
      }
    }

    @keyframes gbaCloysterSpikeCannonFlash {
      0%   { transform: scale(0.2); opacity: 0; }
      20%  { transform: scale(1.35); opacity: 1; filter: drop-shadow(0 0 22px #ffffff) drop-shadow(0 0 30px #38bdf8); }
      55%  { transform: scale(1.75); opacity: 0.6; filter: blur(1px); }
      100% { transform: scale(2.2); opacity: 0; filter: blur(4px); }
    }

    @keyframes gbaCloysterSpikeCannonRing {
      0%   { transform: scale(0.25); opacity: 0; }
      30%  { transform: scale(1.1); opacity: 0.9; }
      65%  { transform: scale(1.45); opacity: 0.5; }
      100% { transform: scale(1.85); opacity: 0; filter: blur(2.5px); }
    }

    @keyframes gbaCloysterSpikeEmbed {
      0% {
        transform: translate(var(--spike-ox, 0px), var(--spike-oy, 0px)) rotate(var(--spike-rot, 0deg)) scale(0.3);
        opacity: 0;
      }
      25% {
        transform: translate(calc(var(--spike-ox, 0px) * 0.4 + var(--spike-tx, 0px) * 0.6), calc(var(--spike-oy, 0px) * 0.4 + var(--spike-ty, 0px) * 0.6)) rotate(var(--spike-rot, 0deg)) scale(1.05);
        opacity: 0.95;
      }
      45% {
        transform: translate(var(--spike-tx, 0px), var(--spike-ty, 0px)) rotate(var(--spike-rot, 0deg)) scale(1.2, 0.9);
        opacity: 1;
        filter: drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 14px #38bdf8);
      }
      58% {
        transform: translate(var(--spike-tx, 0px), var(--spike-ty, 0px)) rotate(calc(var(--spike-rot, 0deg) + 3deg)) scale(0.96, 1.04);
        opacity: 1;
      }
      72% {
        transform: translate(var(--spike-tx, 0px), var(--spike-ty, 0px)) rotate(calc(var(--spike-rot, 0deg) - 1.5deg)) scale(1.0);
        opacity: 0.9;
      }
      88% {
        transform: translate(var(--spike-tx, 0px), var(--spike-ty, 0px)) rotate(var(--spike-rot, 0deg)) scale(0.95);
        opacity: 0.55;
        filter: blur(0.8px);
      }
      100% {
        transform: translate(var(--spike-tx, 0px), var(--spike-ty, 0px)) rotate(var(--spike-rot, 0deg)) scale(0.85);
        opacity: 0;
        filter: blur(2px);
      }
    }

    @keyframes gbaCloysterSpikeScatter {
      0% {
        transform: translate(0, 0) rotate(var(--spike-rot, 0deg)) scale(0.4);
        opacity: 0;
      }
      25% {
        transform: translate(calc(var(--spike-ox, 0px) * 0.5), calc(var(--spike-oy, 0px) * 0.5)) rotate(var(--spike-rot, 0deg)) scale(1.0);
        opacity: 0.95;
      }
      60% {
        transform: translate(calc(var(--spike-ox, 0px) * 1.5), calc(var(--spike-oy, 0px) * 1.5)) rotate(calc(var(--spike-rot, 0deg) + 20deg)) scale(0.9);
        opacity: 0.7;
      }
      100% {
        transform: translate(calc(var(--spike-ox, 0px) * 2.5), calc(var(--spike-oy, 0px) * 2.5)) rotate(calc(var(--spike-rot, 0deg) + 45deg)) scale(0.6);
        opacity: 0;
        filter: blur(2px);
      }
    }

    @keyframes gbaCloysterSpikeFoam {
      0%   { transform: scale(0.3) rotate(0deg); opacity: 0; }
      30%  { transform: scale(1.1) rotate(15deg); opacity: 0.85; filter: drop-shadow(0 0 8px #7dd3fc); }
      65%  { transform: scale(1.3) rotate(35deg); opacity: 0.5; }
      100% { transform: scale(1.5) rotate(50deg); opacity: 0; filter: blur(2px); }
    }
  </style>
</head>
<body>
  <h1>Cloyster: Clamp & Spike Cannon FX Preview</h1>
  <p>5-Layer Modular Aquatic Architecture — Live DOM Keyframe Engine</p>

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
    <button onclick="playClamp()">Play CLAMP (1.55s)</button>
    <button onclick="playSpikeCannon()">Play SPIKE CANNON (1.65s)</button>
  </div>

  <script>
    const clampMawSrc = 'data:image/png;base64,${clampMawB64}';
    const spikeCannonSrc = 'data:image/png;base64,${spikeCannonB64}';

    function clearFX() {
      document.getElementById('fxContainer').innerHTML = '';
    }

    function playClamp() {
      clearFX();
      const container = document.getElementById('fxContainer');

      // Layer 1: Abyssal Floor
      const floor = document.createElement('div');
      floor.style.cssText = 'position: absolute; inset: 0; border-radius: 12px; z-index: 20; background: radial-gradient(ellipse at center, rgba(15,23,42,0.85) 0%, rgba(2,132,199,0.5) 45%, rgba(56,189,248,0.18) 72%, transparent 92%); animation: gbaCloysterAbyssalFloor 1.55s ease-out forwards;';
      container.appendChild(floor);

      // Layer 2: Sugimori Cloyster Clamp Maw
      const maw = document.createElement('div');
      maw.style.cssText = 'position: absolute; left: 50%; top: 48%; z-index: 30; animation: gbaCloysterClampMaw 1.55s cubic-bezier(0.18, 0.92, 0.28, 1) forwards;';
      maw.innerHTML = \`<img src="\${clampMawSrc}" style="width: 110px; height: 110px; object-contain: contain; filter: drop-shadow(0 0 20px #7c3aed) drop-shadow(0 0 12px #38bdf8);" />\`;
      container.appendChild(maw);

      // Pearl Horn Pulse
      const horn = document.createElement('div');
      horn.style.cssText = 'position: absolute; left: 50%; top: 44%; transform: translate(-50%, -50%); z-index: 32; animation: gbaCloysterHornPulse 1.55s ease-out forwards; opacity: 0;';
      horn.innerHTML = '<div style="width: 56px; height: 56px; border-radius: 50%; background: radial-gradient(circle, white, #67e8f9, transparent); filter: blur(2px);"></div>';
      container.appendChild(horn);

      // Layer 3: Impact Flash
      const flash = document.createElement('div');
      flash.style.cssText = 'position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%); z-index: 35; animation: gbaCloysterClampFlash 1.05s ease-out 0.46s forwards; opacity: 0;';
      flash.innerHTML = '<div style="width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle, white, #a5f3fc, transparent); filter: blur(3px);"></div>';
      container.appendChild(flash);

      // Hydro Rings
      const ring1 = document.createElement('div');
      ring1.style.cssText = 'position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%); z-index: 35; animation: gbaCloysterHydroRingInner 1.0s cubic-bezier(0.1, 0.85, 0.25, 1) 0.46s forwards; opacity: 0;';
      ring1.innerHTML = '<div style="width: 96px; height: 96px; border-radius: 50%; border: 2px solid #67e8f9; box-shadow: 0 0 16px #38bdf8;"></div>';
      container.appendChild(ring1);

      const ring2 = document.createElement('div');
      ring2.style.cssText = 'position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%); z-index: 34; animation: gbaCloysterHydroRingOuter 1.05s cubic-bezier(0.12, 0.8, 0.3, 1) 0.50s forwards; opacity: 0;';
      ring2.innerHTML = '<div style="width: 112px; height: 112px; border-radius: 50%; border: 1.5px solid rgba(56,189,248,0.7); box-shadow: 0 0 20px #0284c7;"></div>';
      container.appendChild(ring2);

      // Layer 4: Bilateral Hydro-Jets
      const leftJet = document.createElement('div');
      leftJet.style.cssText = 'position: absolute; left: 50%; top: 48%; z-index: 38; animation: gbaCloysterHydroJetLeft 0.95s cubic-bezier(0.15, 0.9, 0.25, 1) 0.46s forwards; opacity: 0;';
      leftJet.innerHTML = \`<svg width="68" height="34" viewBox="0 0 68 34" style="overflow: visible; filter: drop-shadow(0 0 12px #38bdf8);">
        <path d="M 66 17 Q 35 4, 2 12 Q 35 22, 66 17 Z" fill="#38bdf8" opacity="0.85" />
        <path d="M 66 17 Q 38 9, 12 15 Q 38 20, 66 17 Z" fill="#ffffff" opacity="0.95" />
      </svg>\`;
      container.appendChild(leftJet);

      const rightJet = document.createElement('div');
      rightJet.style.cssText = 'position: absolute; left: 50%; top: 48%; z-index: 38; animation: gbaCloysterHydroJetRight 0.95s cubic-bezier(0.15, 0.9, 0.25, 1) 0.46s forwards; opacity: 0;';
      rightJet.innerHTML = \`<svg width="68" height="34" viewBox="0 0 68 34" style="overflow: visible; filter: drop-shadow(0 0 12px #38bdf8);">
        <path d="M 2 17 Q 33 4, 66 12 Q 33 22, 2 17 Z" fill="#38bdf8" opacity="0.85" />
        <path d="M 2 17 Q 30 9, 56 15 Q 30 20, 2 17 Z" fill="#ffffff" opacity="0.95" />
      </svg>\`;
      container.appendChild(rightJet);

      // Cavitation Bubbles
      const bubbles = [
        { x: -42, y: -22, r: 6, d: 0.48 },
        { x: -28, y: 26, r: 7.5, d: 0.51 },
        { x: 36, y: -24, r: 6.5, d: 0.49 },
        { x: 44, y: 20, r: 8, d: 0.53 },
        { x: -52, y: 4, r: 5, d: 0.54 },
        { x: 50, y: -4, r: 5.5, d: 0.52 }
      ];
      bubbles.forEach(b => {
        const bub = document.createElement('div');
        bub.style.cssText = \`position: absolute; left: 50%; top: 48%; transform: translate(calc(-50% + \${b.x}px), calc(-50% + \${b.y}px)); z-index: 39; animation: gbaCloysterBubblePop 0.85s ease-out \${b.d}s forwards; opacity: 0;\`;
        bub.innerHTML = \`<svg width="\${b.r*2+6}" height="\${b.r*2+6}" style="filter: drop-shadow(0 0 8px #38bdf8);">
          <circle cx="\${b.r+3}" cy="\${b.r+3}" r="\${b.r}" fill="rgba(56,189,248,0.35)" stroke="#bae6fd" stroke-width="1.2" />
          <circle cx="\${b.r+1.5}" cy="\${b.r+1}" r="\${b.r*0.35}" fill="#ffffff" opacity="0.9" />
        </svg>\`;
        container.appendChild(bub);
      });

      // Layer 5: Spray Motes
      const sprays = [
        { x: -38, y: -36, d: 0.52 },
        { x: 42, y: -38, d: 0.54 },
        { x: -46, y: 32, d: 0.56 },
        { x: 40, y: 36, d: 0.53 }
      ];
      sprays.forEach(s => {
        const sp = document.createElement('div');
        sp.style.cssText = \`position: absolute; left: 50%; top: 48%; transform: translate(calc(-50% + \${s.x}px), calc(-50% + \${s.y}px)); z-index: 40; width: 6px; height: 6px; border-radius: 50%; background: radial-gradient(circle, #ffffff 30%, #7dd3fc 70%, transparent); box-shadow: 0 0 8px #38bdf8; animation: gbaCloysterSprayDrift 0.95s ease-out \${s.d}s forwards; opacity: 0;\`;
        container.appendChild(sp);
      });
    }

    function playSpikeCannon() {
      clearFX();
      const container = document.getElementById('fxContainer');

      // Layer 1: Torpedo Wake
      const wake = document.createElement('div');
      wake.style.cssText = 'position: absolute; inset: 0; border-radius: 12px; z-index: 20; background: radial-gradient(ellipse at 40% 50%, rgba(2,132,199,0.55) 0%, rgba(15,23,42,0.4) 50%, transparent 85%); animation: gbaCloysterTorpedoWake 1.65s ease-out forwards;';
      container.appendChild(wake);

      // Layer 2: Cloyster Spiked Torpedo Drill Spin
      const torp = document.createElement('div');
      torp.style.cssText = 'position: absolute; left: 50%; top: 48%; z-index: 30; animation: gbaCloysterTorpedoSpin 1.65s cubic-bezier(0.16, 0.9, 0.28, 1) forwards;';
      torp.innerHTML = \`<img src="\${spikeCannonSrc}" style="width: 114px; height: 105px; object-fit: contain; filter: drop-shadow(0 0 22px #38bdf8) drop-shadow(0 0 12px #0284c7);" />\`;
      container.appendChild(torp);

      // Layer 3: Impact Flash & Ring
      const flash = document.createElement('div');
      flash.style.cssText = 'position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%); z-index: 35; animation: gbaCloysterSpikeCannonFlash 1.1s ease-out 0.48s forwards; opacity: 0;';
      flash.innerHTML = '<div style="width: 96px; height: 96px; border-radius: 50%; background: radial-gradient(circle, white, #67e8f9, transparent); filter: blur(3px);"></div>';
      container.appendChild(flash);

      const ring = document.createElement('div');
      ring.style.cssText = 'position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%); z-index: 35; animation: gbaCloysterSpikeCannonRing 1.1s cubic-bezier(0.1, 0.85, 0.25, 1) 0.48s forwards; opacity: 0;';
      ring.innerHTML = '<div style="width: 128px; height: 128px; border-radius: 50%; border: 2px solid #38bdf8; box-shadow: 0 0 20px #0284c7;"></div>';
      container.appendChild(ring);

      // Layer 4: Ballistic Calcified Spikes
      const embedSpikes = [
        { ox: '-30px', oy: '-25px', tx: '-38px', ty: '-32px', delay: '0.48s', rot: '215deg' },
        { ox: '25px', oy: '-30px', tx: '36px', ty: '-26px', delay: '0.51s', rot: '35deg' },
        { ox: '-25px', oy: '20px', tx: '-32px', ty: '34px', delay: '0.54s', rot: '145deg' },
        { ox: '30px', oy: '25px', tx: '40px', ty: '30px', delay: '0.56s', rot: '-40deg' }
      ];
      embedSpikes.forEach(sp => {
        const s = document.createElement('div');
        s.style.cssText = \`position: absolute; left: 50%; top: 48%; z-index: 38; animation: gbaCloysterSpikeEmbed 1.1s cubic-bezier(0.18, 0.88, 0.32, 1) \${sp.delay} forwards; opacity: 0; --spike-ox: \${sp.ox}; --spike-oy: \${sp.oy}; --spike-tx: \${sp.tx}; --spike-ty: \${sp.ty}; --spike-rot: \${sp.rot};\`;
        s.innerHTML = \`<svg width="10" height="24" viewBox="0 0 10 24" style="filter: drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 14px #38bdf8);">
          <polygon points="5,0 9,7 7,24 3,24 1,7" fill="#f8fafc" stroke="#334155" stroke-width="1.1" />
          <polygon points="5,1 8.5,7 6.5,22 5,23 5,1" fill="#ffffff" opacity="0.95" />
          <polygon points="5,1 5,23 3.5,22 1.5,7 5,1" fill="#7dd3fc" opacity="0.85" />
        </svg>\`;
        container.appendChild(s);
      });

      // Scatter Spikes
      const scatterSpikes = [
        { ox: '-10px', oy: '-15px', delay: '0.49s', rot: '-70deg' },
        { ox: '12px', oy: '10px', delay: '0.52s', rot: '110deg' }
      ];
      scatterSpikes.forEach(sp => {
        const s = document.createElement('div');
        s.style.cssText = \`position: absolute; left: 50%; top: 48%; z-index: 38; animation: gbaCloysterSpikeScatter 1.05s cubic-bezier(0.15, 0.85, 0.35, 1) \${sp.delay} forwards; opacity: 0; --spike-ox: \${sp.ox}; --spike-oy: \${sp.oy}; --spike-rot: \${sp.rot};\`;
        s.innerHTML = \`<svg width="8" height="18" viewBox="0 0 8 18" style="filter: drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 10px #38bdf8);">
          <polygon points="4,0 7,5 6,18 2,18 1,5" fill="#f1f5f9" stroke="#475569" stroke-width="1.0" />
          <polygon points="4,1 6.5,5 5,17 4,1" fill="#ffffff" opacity="0.95" />
          <polygon points="4,1 4,17 3,17 1.5,5 4,1" fill="#38bdf8" opacity="0.8" />
        </svg>\`;
        container.appendChild(s);
      });
    }

    // Auto-play Clamp on load
    window.onload = () => { playClamp(); };
  </script>
</body>
</html>
\`;

fs.writeFileSync('public/preview_cloyster.html', html);
console.log('Successfully generated public/preview_cloyster.html');
