import os

preview_content = """<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blastoise — Hydro Pump (Hidro Pompa) 5-Katmanlı Akışkan Görsel Şölen</title>
  <style>
    /* CSS Root Reset & Background */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #050b14;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 30px 16px;
      overflow-x: hidden;
    }

    .badge-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .badge {
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 9999px;
      text-transform: uppercase;
    }

    h1 {
      font-size: 20px;
      font-weight: 800;
      color: #f0f9ff;
      margin-bottom: 6px;
      text-align: center;
      letter-spacing: 0.2px;
    }
    p.subtitle {
      font-size: 13px;
      color: #94a3b8;
      text-align: center;
      max-width: 680px;
      line-height: 1.5;
      margin-bottom: 24px;
    }

    /* Controls Panel */
    .controls-panel {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(51, 65, 85, 0.8);
      border-radius: 14px;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 28px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      width: 100%;
      max-width: 620px;
    }
    .btn-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .btn {
      background: #1e293b;
      color: #e2e8f0;
      border: 1px solid #475569;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn:hover {
      background: #334155;
      border-color: #38bdf8;
      color: #ffffff;
    }
    .btn.active {
      background: #0284c7;
      border-color: #38bdf8;
      color: #ffffff;
      box-shadow: 0 0 14px rgba(56, 189, 248, 0.5);
    }

    /* CARD STAGE: GameBoard 184px x 253px Parity */
    .stage-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .stage-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stage-card {
      position: relative;
      width: 184px;
      height: 253px;
      aspect-ratio: 600 / 825;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(0,0,0,0.9), 0 0 24px rgba(14,165,233,0.35);
      border: 1.5px solid rgba(56,189,248,0.4);
      background: #090d16;
    }

    /* Target Real Card Underlay */
    .target-underlay {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.9;
      z-index: 1;
      display: block;
    }
    .stage-card.dark-canvas-mode .target-underlay {
      display: none;
    }

    /* Card Status Strip */
    .status-strip {
      position: absolute;
      top: 6px;
      left: 8px;
      right: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 5;
      font-size: 10px;
      font-weight: 800;
      color: #ffffff;
      text-shadow: 0 1px 4px rgba(0,0,0,0.9);
      pointer-events: none;
    }
    .hp-pips {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .pip {
      width: 6px;
      height: 6px;
      border-radius: 1px;
      background: #22c55e;
      box-shadow: 0 0 4px #22c55e;
    }

    /* Target card hydraulic tremor */
    .card-tremor {
      animation: gbaDefendingCardHydraulicTremor 0.85s cubic-bezier(0.25, 1, 0.5, 1) 0.50s forwards;
    }

    /* ROOT-LEVEL KEYFRAMES */
    @keyframes gbaDefendingCardHydraulicTremor {
      0%   { transform: translate(0, 0); }
      15%  { transform: translate(-2px, 3px) scale(0.985); }
      30%  { transform: translate(2.5px, -2px) scale(1.015); }
      45%  { transform: translate(-2px, 2px) scale(0.99); }
      60%  { transform: translate(1.5px, -1px) scale(1.008); }
      75%  { transform: translate(-1px, 1px) scale(0.995); }
      90%  { transform: translate(0.5px, -0.5px) scale(1.0); }
      100% { transform: translate(0, 0); }
    }

    /* Layer 1: Ambient Hydro Floor Surge */
    @keyframes gbaHydroFloorSurge {
      0%   { opacity: 0; transform: scale(0.65); }
      18%  { opacity: 0.90; transform: scale(0.98); }
      35%  { opacity: 1; transform: scale(1.12); filter: drop-shadow(0 0 20px rgba(14,165,233,0.85)); }
      60%  { opacity: 0.85; transform: scale(1.05); }
      80%  { opacity: 0.45; transform: scale(1.0); }
      100% { opacity: 0; transform: scale(0.95); }
    }

    /* Layer 2: Blastoise Sumo Kinematics & Recoil */
    @keyframes gbaBlastoiseFullBodyMotion {
      0%   { opacity: 0; transform: translateX(-50%) scale(0.85) translateY(18px); filter: blur(6px); }
      12%  { opacity: 0.70; transform: translateX(-50%) scale(0.96) translateY(8px); filter: blur(2px); }
      18%  { opacity: 1; transform: translateX(-50%) scale(1.02) translateY(0px); filter: blur(0px); }
      22%  { opacity: 1; transform: translateX(-50%) scale(1.04, 0.96) translateY(3px); }
      28%  { opacity: 1; transform: translateX(-50%) scale(0.95, 1.05) translateY(-5px); filter: drop-shadow(0 0 22px #38bdf8) brightness(1.25); }
      35%  { opacity: 1; transform: translateX(-50%) scale(1.04, 0.96) translateY(3px); filter: drop-shadow(0 0 14px rgba(56,189,248,0.75)); }
      42%  { opacity: 1; transform: translateX(-50%) scale(0.98, 1.02) translateY(-2px); }
      50%  { opacity: 1; transform: translateX(-50%) scale(1.03, 0.97) translateY(2px); }
      58%  { opacity: 1; transform: translateX(-50%) scale(0.99, 1.01) translateY(-1px); }
      66%  { opacity: 1; transform: translateX(-50%) scale(1.02, 0.98) translateY(2px); }
      74%  { opacity: 1; transform: translateX(-50%) scale(1.0) translateY(0px); }
      84%  { opacity: 0.75; transform: translateX(-50%) scale(1.02) translateY(2px); filter: blur(1.5px); }
      92%  { opacity: 0.35; transform: translateX(-50%) scale(1.04) translateY(5px); filter: blur(4px); }
      100% { opacity: 0; transform: translateX(-50%) scale(1.07) translateY(8px); filter: blur(7px); }
    }

    /* Layer 2 Whiff */
    @keyframes gbaBlastoiseWhiffRecede {
      0%   { opacity: 0; transform: translateX(-50%) scale(0.70) translateY(14px); }
      22%  { opacity: 0.85; transform: translateX(-50%) scale(0.95) translateY(0px); }
      45%  { opacity: 0.65; transform: translateX(-50%) scale(0.90) translateY(2px); }
      70%  { opacity: 0.35; transform: translateX(-50%) scale(0.80) translateY(6px); }
      100% { opacity: 0; transform: translateX(-50%) scale(0.70) translateY(12px); filter: blur(4px); }
    }

    /* Layer 3: Left Muzzle Collar & Spray Burst (oriented -28 deg along left barrel) */
    @keyframes gbaHydroMuzzleCollarL {
      0%   { transform: translate(-50%, -50%) rotate(-28deg) scale(0.2); opacity: 0; }
      15%  { transform: translate(-50%, -50%) rotate(-28deg) scale(1.45); opacity: 1; filter: drop-shadow(0 0 16px #ffffff); }
      30%  { transform: translate(-50%, -50%) rotate(-28deg) scale(1.2); opacity: 0.9; }
      55%  { transform: translate(-50%, -50%) rotate(-28deg) scale(0.95); opacity: 0.6; }
      80%  { transform: translate(-50%, -50%) rotate(-28deg) scale(0.75); opacity: 0.25; filter: blur(2px); }
      100% { transform: translate(-50%, -50%) rotate(-28deg) scale(0.4); opacity: 0; filter: blur(4px); }
    }

    /* Layer 3: Right Muzzle Collar & Spray Burst (oriented +40 deg along right barrel) */
    @keyframes gbaHydroMuzzleCollarR {
      0%   { transform: translate(-50%, -50%) rotate(40deg) scale(0.2); opacity: 0; }
      15%  { transform: translate(-50%, -50%) rotate(40deg) scale(1.45); opacity: 1; filter: drop-shadow(0 0 16px #ffffff); }
      30%  { transform: translate(-50%, -50%) rotate(40deg) scale(1.2); opacity: 0.9; }
      55%  { transform: translate(-50%, -50%) rotate(40deg) scale(0.95); opacity: 0.6; }
      80%  { transform: translate(-50%, -50%) rotate(40deg) scale(0.75); opacity: 0.25; filter: blur(2px); }
      100% { transform: translate(-50%, -50%) rotate(40deg) scale(0.4); opacity: 0; filter: blur(4px); }
    }

    /* Layer 4: Left Cannon Curved Hydro Torrent (Erupts from nozzle at 62px, 151px) */
    @keyframes gbaHydroTorrentL {
      0%   { transform: scale(0.2, 0.05); opacity: 0; filter: blur(4px); }
      12%  { transform: scale(0.75, 0.55); opacity: 0.9; filter: blur(1.5px); }
      22%  { transform: scale(1.05, 1.03); opacity: 1; filter: drop-shadow(0 0 12px #38bdf8); }
      34%  { transform: scale(0.97, 0.99); opacity: 1; }
      48%  { transform: scale(1.03, 1.02); opacity: 1; filter: drop-shadow(0 0 14px #38bdf8); }
      62%  { transform: scale(0.98, 1.0); opacity: 0.95; }
      76%  { transform: scale(0.94, 0.95); opacity: 0.8; filter: blur(1.5px); }
      88%  { transform: scale(0.85, 0.85); opacity: 0.35; filter: blur(3px); }
      100% { transform: scale(0.70, 0.70); opacity: 0; filter: blur(6px); }
    }

    /* Layer 4: Right Cannon Curved Hydro Torrent (Erupts from nozzle at 143px, 153px) */
    @keyframes gbaHydroTorrentR {
      0%   { transform: scale(0.2, 0.05); opacity: 0; filter: blur(4px); }
      12%  { transform: scale(0.75, 0.55); opacity: 0.9; filter: blur(1.5px); }
      22%  { transform: scale(1.05, 1.03); opacity: 1; filter: drop-shadow(0 0 12px #38bdf8); }
      34%  { transform: scale(1.02, 1.01); opacity: 1; }
      48%  { transform: scale(0.97, 0.98); opacity: 1; filter: drop-shadow(0 0 14px #38bdf8); }
      62%  { transform: scale(1.03, 1.01); opacity: 0.95; }
      76%  { transform: scale(0.94, 0.95); opacity: 0.8; filter: blur(1.5px); }
      88%  { transform: scale(0.85, 0.85); opacity: 0.35; filter: blur(3px); }
      100% { transform: scale(0.70, 0.70); opacity: 0; filter: blur(6px); }
    }

    /* Layer 3: Central Concussive Hydro Dome (Impact Explosion) */
    @keyframes gbaHydroConcussionDome {
      0%   { transform: translate(-50%, -50%) scale(0.15); opacity: 0; filter: blur(2px); }
      18%  { transform: translate(-50%, -50%) scale(1.35); opacity: 1; filter: drop-shadow(0 0 24px #38bdf8); }
      38%  { transform: translate(-50%, -50%) scale(1.15); opacity: 0.85; }
      65%  { transform: translate(-50%, -50%) scale(1.45); opacity: 0.50; filter: blur(2px); }
      100% { transform: translate(-50%, -50%) scale(1.85); opacity: 0; filter: blur(6px); }
    }

    /* Layer 3: Expanding Fluid Shockwave Ring */
    @keyframes gbaHydroShockRing {
      0%   { transform: translate(-50%, -50%) scale(0.15); opacity: 0; }
      20%  { opacity: 0.95; }
      55%  { transform: translate(-50%, -50%) scale(1.6); opacity: 0.6; filter: blur(2px); }
      100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; filter: blur(7px); }
    }

    /* Layer 4: Multi-Lobed Tsunami Splash Crown */
    @keyframes gbaHydroTsunamiCrown {
      0%   { transform: translate(-50%, -50%) scale(0.18); opacity: 0; filter: blur(4px); }
      18%  { transform: translate(-50%, -50%) scale(1.22); opacity: 1; filter: drop-shadow(0 0 14px rgba(56,189,248,0.9)); }
      35%  { transform: translate(-50%, -50%) scale(1.08); opacity: 0.95; }
      60%  { transform: translate(-50%, -50%) scale(1.18); opacity: 0.75; }
      82%  { transform: translate(-50%, -50%) scale(1.25); opacity: 0.35; filter: blur(2px); }
      100% { transform: translate(-50%, -50%) scale(1.32); opacity: 0; filter: blur(5px); }
    }

    /* Layer 4: Cascading Water Deluge Sheet */
    @keyframes gbaHydroDelugeCascade {
      0%   { opacity: 0; transform: translateX(-50%) translateY(-14px) scaleY(0.4); filter: blur(4px); }
      18%  { opacity: 0.95; transform: translateX(-50%) translateY(0px) scaleY(1.0); filter: blur(0px); }
      45%  { opacity: 0.90; transform: translateX(-50%) translateY(10px) scaleY(1.12); }
      72%  { opacity: 0.75; transform: translateX(-50%) translateY(22px) scaleY(1.20); filter: blur(1px); }
      90%  { opacity: 0.35; transform: translateX(-50%) translateY(32px) scaleY(1.25); filter: blur(3px); }
      100% { opacity: 0; transform: translateX(-50%) translateY(40px) scaleY(1.28); filter: blur(6px); }
    }

    /* Layer 5: Ballistic Droplets */
    @keyframes gbaHydroDropletL {
      0%   { transform: translate(0, 0) scale(0.3); opacity: 0; }
      25%  { opacity: 1; }
      60%  { transform: translate(-28px, -24px) scale(1.1); opacity: 0.85; }
      100% { transform: translate(-42px, 12px) scale(0.4); opacity: 0; }
    }
    @keyframes gbaHydroDropletR {
      0%   { transform: translate(0, 0) scale(0.3); opacity: 0; }
      25%  { opacity: 1; }
      60%  { transform: translate(28px, -24px) scale(1.1); opacity: 0.85; }
      100% { transform: translate(42px, 12px) scale(0.4); opacity: 0; }
    }
    @keyframes gbaHydroDropletUp {
      0%   { transform: translate(0, 0) scale(0.3); opacity: 0; }
      25%  { opacity: 1; }
      60%  { transform: translate(0, -36px) scale(1.2); opacity: 0.9; }
      100% { transform: translate(0, -10px) scale(0.35); opacity: 0; }
    }
  </style>
</head>
<body>
  <div class="badge-bar">
    <span class="badge">5-Layer Fluid Architecture</span>
    <span class="badge">Sugimori Watercolor</span>
    <span class="badge">GameBoard 184×253 Parity</span>
  </div>

  <h1>BLASTOISE — HYDRO PUMP (HİDRO POMPA)</h1>
  <p class="subtitle">
    Namlularla anatomik kilitli (+40° / -28°) çift kavisli akışkan hortumu, merkezde devasa hidrolik çarpma kubbesi, 14 loblu organik tsunami taç sıçraması ve savunan kartı yıkayan şelale tufanı.
  </p>

  <div class="controls-panel">
    <div class="btn-group">
      <button class="btn active" id="btnNormal" onclick="playAnimation(false)">▶ Normal Saldırı (Hydro Pump)</button>
      <button class="btn" id="btnWhiff" onclick="playAnimation(true)">⊘ Whiff (Iskalama / Engellenme)</button>
      <button class="btn" id="btnLoop" onclick="toggleLoop()">⟳ Sürekli Döngü: KAPALI</button>
    </div>
    <div class="btn-group">
      <button class="btn" id="btnMode" onclick="toggleMode()">🎴 Mod: Otantik Kart (AÇIK)</button>
      <button class="btn btn-speed active" onclick="setSpeed(1.0, this)">1.0x (Orijinal)</button>
      <button class="btn btn-speed" onclick="setSpeed(0.5, this)">0.5x (Ağır Çekim)</button>
      <button class="btn btn-speed" onclick="setSpeed(0.25, this)">0.25x (Mikro Detay)</button>
    </div>
  </div>

  <div class="stage-wrapper">
    <span class="stage-label">Hedef Kart (Active Arena) · 184px × 253px</span>
    <div class="stage-card" id="arenaCard">
      <img id="cardUnderlay" class="target-underlay" alt="Base Set Blastoise #2" />
      <div class="status-strip">
        <span>BLASTOISE</span>
        <div class="hp-pips">
          <span style="margin-right: 4px;">100 HP</span>
          <div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div>
        </div>
      </div>

      <!-- FX Overlay Root (184px x 253px) -->
      <div id="fxOverlay" style="position: absolute; inset: 0; pointer-events: none; overflow: visible; z-index: 20;"></div>
    </div>
  </div>

  <script>
    // RULE 14: Resilient Local/Static Asset Protocol
    const ASSET_CANDIDATE_PATHS = [
      'assets/blastoise_full_body.png',
      './assets/blastoise_full_body.png',
      '/assets/blastoise_full_body.png',
      '../public/assets/blastoise_full_body.png'
    ];
    let resolvedBlastoiseAsset = 'assets/blastoise_full_body.png';

    function resolveBlastoiseAsset() {
      let idx = 0;
      function testNext() {
        if (idx >= ASSET_CANDIDATE_PATHS.length) return;
        const testImg = new Image();
        const candidate = ASSET_CANDIDATE_PATHS[idx];
        testImg.onload = () => {
          resolvedBlastoiseAsset = candidate;
        };
        testImg.onerror = () => {
          idx++;
          testNext();
        };
        testImg.src = candidate;
      }
      testNext();
    }
    resolveBlastoiseAsset();

    const CARD_CANDIDATE_PATHS = [
      'cards/2.jpg',
      './cards/2.jpg',
      '/cards/2.jpg',
      '../public/cards/2.jpg',
      '../public/cards/base_set_blastoise_2.jpg'
    ];

    function resolveCardUnderlay() {
      let idx = 0;
      function testNext() {
        if (idx >= CARD_CANDIDATE_PATHS.length) return;
        const testImg = new Image();
        const candidate = CARD_CANDIDATE_PATHS[idx];
        testImg.onload = () => {
          const el = document.getElementById('cardUnderlay');
          if (el) el.src = candidate;
        };
        testImg.onerror = () => {
          idx++;
          testNext();
        };
        testImg.src = candidate;
      }
      testNext();
    }
    resolveCardUnderlay();

    let isRealCardMode = true;
    function toggleMode() {
      isRealCardMode = !isRealCardMode;
      const stage = document.getElementById('arenaCard');
      const btn = document.getElementById('btnMode');
      if (isRealCardMode) {
        stage.classList.remove('dark-canvas-mode');
        btn.innerText = '🎴 Mod: Otantik Kart (AÇIK)';
      } else {
        stage.classList.add('dark-canvas-mode');
        btn.innerText = '🎴 Mod: Dark Canvas (AÇIK)';
      }
    }

    let speedMult = 1.0;
    function setSpeed(speed, btn) {
      speedMult = speed;
      document.querySelectorAll('.btn-speed').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playAnimation(currentWhiff);
    }

    let isLooping = false;
    let loopTimer = null;
    function toggleLoop() {
      isLooping = !isLooping;
      const btn = document.getElementById('btnLoop');
      if (isLooping) {
        btn.classList.add('active');
        btn.innerText = '⟳ Sürekli Döngü: AÇIK';
        playAnimation(currentWhiff);
      } else {
        btn.classList.remove('active');
        btn.innerText = '⟳ Sürekli Döngü: KAPALI';
        clearTimeout(loopTimer);
      }
    }

    let currentWhiff = false;
    function playAnimation(isWhiffed = false) {
      currentWhiff = isWhiffed;
      clearTimeout(loopTimer);
      const fxOverlay = document.getElementById('fxOverlay');
      const arenaCard = document.getElementById('arenaCard');

      fxOverlay.innerHTML = '';
      arenaCard.classList.remove('card-tremor');

      document.getElementById('btnNormal').classList.toggle('active', !isWhiffed);
      document.getElementById('btnWhiff').classList.toggle('active', isWhiffed);

      if (!isWhiffed) {
        void arenaCard.offsetWidth; // reflow
        arenaCard.classList.add('card-tremor');
      }

      const durSec = (1.9 / speedMult).toFixed(2);
      const actorWidth = isWhiffed ? '82px' : '114px';
      const actorAnim = isWhiffed
        ? `gbaBlastoiseWhiffRecede ${durSec}s ease-out forwards`
        : `gbaBlastoiseFullBodyMotion ${durSec}s cubic-bezier(0.22, 0.9, 0.36, 1) forwards`;

      let html = `
        <!-- Layer 1: Ambient Hydro Floor Surge -->
        <div style="position: absolute; width: 154px; height: 50px; bottom: 0px; left: 50%; transform: translateX(-50%); z-index: 2;
                    background: radial-gradient(ellipse at 50% 50%, rgba(14,165,233,0.55) 0%, rgba(2,132,199,0.35) 55%, transparent 80%);
                    animation: gbaHydroFloorSurge ${durSec}s ease-out forwards; opacity: 0;"></div>

        <!-- Layer 2: Ken Sugimori Full-Body Blastoise -->
        <div style="position: absolute; width: ${actorWidth}; aspect-ratio: 1023 / 974; bottom: 4px; left: 50%; z-index: 10;
                    animation: ${actorAnim}; opacity: 0;">
          <img src="${resolvedBlastoiseAsset}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.7));" />
        </div>
      `;

      if (!isWhiffed) {
        html += `
          <!-- Layer 3: Left Muzzle Collar & Spray Burst (Anchor: X=62px, Y=151px -> bottom: 102px, left: calc(50% - 30px)) -->
          <div style="position: absolute; left: calc(50% - 30px); bottom: 102px; z-index: 22; pointer-events: none;">
            <div style="width: 60px; height: 60px; animation: gbaHydroMuzzleCollarL ${(0.75 / speedMult).toFixed(2)}s ease-out ${(0.28 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <defs>
                  <radialGradient id="muzzleGradL_prv" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
                    <stop offset="35%" stop-color="#bae6fd" stop-opacity="0.95" />
                    <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="30" cy="30" r="26" fill="url(#muzzleGradL_prv)" />
                <circle cx="30" cy="30" r="14" fill="#ffffff" opacity="0.9" style="filter: blur(1px);" />
                <circle cx="30" cy="30" r="7" fill="#ffffff" />
                <path d="M30 30 L12 8 L22 16 Z" fill="#ffffff" opacity="0.95" />
                <path d="M30 30 L6 20 L16 24 Z" fill="#bae6fd" opacity="0.85" />
                <path d="M30 30 L22 4 L30 14 Z" fill="#ffffff" opacity="0.9" />
                <circle cx="12" cy="14" r="2.2" fill="#ffffff" />
                <circle cx="46" cy="44" r="1.8" fill="#7dd3fc" />
                <circle cx="16" cy="46" r="1.6" fill="#38bdf8" />
              </svg>
            </div>
          </div>

          <!-- Layer 3: Right Muzzle Collar & Spray Burst (Anchor: X=143px, Y=153px -> bottom: 100px, left: calc(50% + 51px)) -->
          <div style="position: absolute; left: calc(50% + 51px); bottom: 100px; z-index: 22; pointer-events: none;">
            <div style="width: 60px; height: 60px; animation: gbaHydroMuzzleCollarR ${(0.75 / speedMult).toFixed(2)}s ease-out ${(0.28 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <defs>
                  <radialGradient id="muzzleGradR_prv" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
                    <stop offset="35%" stop-color="#bae6fd" stop-opacity="0.95" />
                    <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="30" cy="30" r="26" fill="url(#muzzleGradR_prv)" />
                <circle cx="30" cy="30" r="14" fill="#ffffff" opacity="0.9" style="filter: blur(1px);" />
                <circle cx="30" cy="30" r="7" fill="#ffffff" />
                <path d="M30 30 L48 8 L38 16 Z" fill="#ffffff" opacity="0.95" />
                <path d="M30 30 L54 20 L44 24 Z" fill="#bae6fd" opacity="0.85" />
                <path d="M30 30 L38 4 L30 14 Z" fill="#ffffff" opacity="0.9" />
                <circle cx="48" cy="14" r="2.2" fill="#ffffff" />
                <circle cx="14" cy="44" r="1.8" fill="#7dd3fc" />
                <circle cx="44" cy="46" r="1.6" fill="#38bdf8" />
              </svg>
            </div>
          </div>

          <!-- Layer 4: Left Curved Hydrodynamic Torrent (Anchor: X=62px, Y=151px -> curves along -28 deg barrel) -->
          <div style="position: absolute; left: calc(50% - 30px); bottom: 102px; z-index: 18; pointer-events: none;">
            <div style="position: absolute; left: -56px; top: -126px; width: 80px; height: 130px; transform-origin: 56px 126px;
                        animation: gbaHydroTorrentL ${(1.15 / speedMult).toFixed(2)}s cubic-bezier(0.18, 0.85, 0.35, 1) ${(0.30 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="80" height="130" viewBox="0 0 80 130" style="overflow: visible;">
                <defs>
                  <linearGradient id="hydroFlowGradL_prv" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#0369a1" stop-opacity="0.98" />
                    <stop offset="30%" stop-color="#0284c7" stop-opacity="0.95" />
                    <stop offset="65%" stop-color="#0ea5e9" stop-opacity="0.92" />
                    <stop offset="90%" stop-color="#38bdf8" stop-opacity="0.96" />
                    <stop offset="100%" stop-color="#bae6fd" stop-opacity="1.0" />
                  </linearGradient>
                  <linearGradient id="hydroFlowCoreL_prv" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.95" />
                    <stop offset="45%" stop-color="#7dd3fc" stop-opacity="0.96" />
                    <stop offset="80%" stop-color="#e0f2fe" stop-opacity="0.98" />
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="1.0" />
                  </linearGradient>
                </defs>
                <path d="M50 126 C46 112, 34 94, 24 76 C14 58, 12 38, 22 22 C28 14, 40 8, 56 6 C64 5, 72 8, 76 14 C78 20, 72 26, 64 24 C52 22, 42 26, 36 34 C30 46, 32 62, 42 78 C52 94, 60 110, 62 126 Z"
                      fill="url(#hydroFlowGradL_prv)" filter="drop-shadow(0 0 8px rgba(14,165,233,0.85))" />
                <path d="M48 124 C42 108, 30 90, 20 72 C12 54, 10 34, 26 18 C36 8, 50 6, 68 8 C72 12, 68 18, 58 18 C44 18, 32 24, 28 38 C24 52, 30 70, 40 86 C50 102, 58 116, 58 124 Z"
                      fill="#0ea5e9" opacity="0.85" />
                <path d="M52 122 C48 106, 38 88, 28 72 C20 56, 18 38, 30 24 C38 14, 52 12, 66 12 C64 16, 56 18, 48 18 C38 18, 30 26, 28 38 C26 50, 34 68, 44 84 C52 100, 56 114, 56 122 Z"
                      fill="url(#hydroFlowCoreL_prv)" />
                <path d="M54 120 C50 106, 40 88, 32 72 C24 56, 22 40, 34 26 C40 18, 50 14, 62 14"
                      fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.95" />
                <path d="M48 116 Q32 98, 42 82 Q54 66, 30 48 Q18 34, 38 20"
                      fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.85" />
                <path d="M58 110 Q42 92, 28 76 Q18 58, 38 42 Q52 28, 62 16"
                      fill="none" stroke="#bae6fd" stroke-width="1.5" stroke-linecap="round" opacity="0.75" />
                <circle cx="16" cy="62" r="3.0" fill="#7dd3fc" opacity="0.95" />
                <circle cx="12" cy="44" r="2.6" fill="#bae6fd" opacity="0.9" />
                <circle cx="18" cy="28" r="3.2" fill="#ffffff" opacity="0.95" />
                <circle cx="26" cy="14" r="2.4" fill="#e0f2fe" opacity="0.9" />
                <circle cx="48" cy="6" r="2.8" fill="#ffffff" opacity="0.95" />
              </svg>
            </div>
          </div>

          <!-- Layer 4: Right Curved Hydrodynamic Torrent (Anchor: X=143px, Y=153px -> curves along +40 deg barrel) -->
          <div style="position: absolute; left: calc(50% + 51px); bottom: 100px; z-index: 18; pointer-events: none;">
            <div style="position: absolute; left: -24px; top: -126px; width: 80px; height: 130px; transform-origin: 24px 126px;
                        animation: gbaHydroTorrentR ${(1.15 / speedMult).toFixed(2)}s cubic-bezier(0.18, 0.85, 0.35, 1) ${(0.30 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="80" height="130" viewBox="0 0 80 130" style="overflow: visible;">
                <defs>
                  <linearGradient id="hydroFlowGradR_prv" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#0369a1" stop-opacity="0.98" />
                    <stop offset="30%" stop-color="#0284c7" stop-opacity="0.95" />
                    <stop offset="65%" stop-color="#0ea5e9" stop-opacity="0.92" />
                    <stop offset="90%" stop-color="#38bdf8" stop-opacity="0.96" />
                    <stop offset="100%" stop-color="#bae6fd" stop-opacity="1.0" />
                  </linearGradient>
                  <linearGradient id="hydroFlowCoreR_prv" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.95" />
                    <stop offset="45%" stop-color="#7dd3fc" stop-opacity="0.96" />
                    <stop offset="80%" stop-color="#e0f2fe" stop-opacity="0.98" />
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="1.0" />
                  </linearGradient>
                </defs>
                <path d="M30 126 C34 112, 46 94, 56 76 C66 58, 68 38, 58 22 C52 14, 40 8, 24 6 C16 5, 8 8, 4 14 C2 20, 8 26, 16 24 C28 22, 38 26, 44 34 C50 46, 48 62, 38 78 C28 94, 20 110, 18 126 Z"
                      fill="url(#hydroFlowGradR_prv)" filter="drop-shadow(0 0 8px rgba(14,165,233,0.85))" />
                <path d="M32 124 C38 108, 50 90, 60 72 C68 54, 70 34, 54 18 C44 8, 30 6, 12 8 C8 12, 12 18, 22 18 C36 18, 48 24, 52 38 C56 52, 50 70, 40 86 C30 102, 22 116, 22 124 Z"
                      fill="#0ea5e9" opacity="0.85" />
                <path d="M28 122 C32 106, 42 88, 52 72 C60 56, 62 38, 50 24 C42 14, 28 12, 14 12 C16 16, 24 18, 32 18 C42 18, 50 26, 52 38 C54 50, 46 68, 36 84 C28 100, 24 114, 24 122 Z"
                      fill="url(#hydroFlowCoreR_prv)" />
                <path d="M26 120 C30 106, 40 88, 48 72 C56 56, 58 40, 46 26 C40 18, 30 14, 18 14"
                      fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.95" />
                <path d="M32 116 Q48 98, 38 82 Q26 66, 50 48 Q62 34, 42 20"
                      fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.85" />
                <path d="M22 110 Q38 92, 52 76 Q62 58, 42 42 Q28 28, 18 16"
                      fill="none" stroke="#bae6fd" stroke-width="1.5" stroke-linecap="round" opacity="0.75" />
                <circle cx="64" cy="62" r="3.0" fill="#7dd3fc" opacity="0.95" />
                <circle cx="68" cy="44" r="2.6" fill="#bae6fd" opacity="0.9" />
                <circle cx="62" cy="28" r="3.2" fill="#ffffff" opacity="0.95" />
                <circle cx="54" cy="14" r="2.4" fill="#e0f2fe" opacity="0.9" />
                <circle cx="32" cy="6" r="2.8" fill="#ffffff" opacity="0.95" />
              </svg>
            </div>
          </div>

          <!-- Layer 3: Expanding Fluid Shockwave Ring on Target Impact -->
          <div style="position: absolute; top: 48px; left: 50%; transform: translate(-50%, -50%); z-index: 25; pointer-events: none;">
            <div style="width: 140px; height: 100px; animation: gbaHydroShockRing ${(0.9 / speedMult).toFixed(2)}s ease-out ${(0.50 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="140" height="100" viewBox="0 0 140 100">
                <ellipse cx="70" cy="50" rx="64" ry="44" fill="none" stroke="#7dd3fc" stroke-width="3" opacity="0.8" style="filter: blur(1px);" />
                <ellipse cx="70" cy="50" rx="46" ry="30" fill="none" stroke="#bae6fd" stroke-width="2.5" opacity="0.85" />
                <ellipse cx="70" cy="50" rx="28" ry="18" fill="none" stroke="#ffffff" stroke-width="2.0" opacity="0.95" />
              </svg>
            </div>
          </div>

          <!-- Layer 3: Central Concussive Hydro Dome (Massive hydraulic burst, NO DIAMOND STARS!) -->
          <div style="position: absolute; top: 48px; left: 50%; transform: translate(-50%, -50%); z-index: 32; pointer-events: none;">
            <div style="width: 110px; height: 110px; animation: gbaHydroConcussionDome ${(0.85 / speedMult).toFixed(2)}s ease-out ${(0.50 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <defs>
                  <radialGradient id="hydroDomeGrad_prv" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
                    <stop offset="30%" stop-color="#bae6fd" stop-opacity="0.95" />
                    <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.85" />
                    <stop offset="85%" stop-color="#0284c7" stop-opacity="0.5" />
                    <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="55" cy="55" r="50" fill="url(#hydroDomeGrad_prv)" />
                <circle cx="55" cy="55" r="28" fill="#ffffff" opacity="0.9" style="filter: blur(2px);" />
                <circle cx="55" cy="55" r="14" fill="#ffffff" />
                <ellipse cx="55" cy="55" rx="52" ry="24" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.9" transform="rotate(-15 55 55)" />
                <ellipse cx="55" cy="55" rx="52" ry="24" fill="none" stroke="#bae6fd" stroke-width="2.2" opacity="0.85" transform="rotate(35 55 55)" />
              </svg>
            </div>
          </div>

          <!-- Layer 4: Multi-Lobed Tsunami Splash Crown (Exploding organic curved water tendrils) -->
          <div style="position: absolute; top: 42px; left: 50%; transform: translate(-50%, -50%); z-index: 28; pointer-events: none;">
            <div style="width: 150px; height: 110px; animation: gbaHydroTsunamiCrown ${(0.95 / speedMult).toFixed(2)}s cubic-bezier(0.18, 0.85, 0.35, 1) ${(0.50 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="150" height="110" viewBox="0 0 150 110" style="overflow: visible;">
                <defs>
                  <radialGradient id="tsunamiCrownGrad_prv" cx="50%" cy="80%" r="70%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
                    <stop offset="35%" stop-color="#bae6fd" stop-opacity="0.95" />
                    <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.88" />
                    <stop offset="100%" stop-color="#0284c7" stop-opacity="0.8" />
                  </radialGradient>
                </defs>
                <path d="M75 95 C62 95, 45 92, 28 85 C22 78, 16 66, 10 52 C15 56, 22 62, 28 66 C28 50, 30 32, 34 16 C38 28, 42 40, 46 52 C50 36, 56 20, 62 6 C66 22, 70 40, 75 54 C80 40, 84 22, 88 6 C94 20, 100 36, 104 52 C108 40, 112 28, 116 16 C120 32, 122 50, 122 66 C128 62, 135 56, 140 52 C134 66, 128 78, 122 85 C105 92, 88 95, 75 95 Z"
                      fill="url(#tsunamiCrownGrad_prv)" filter="drop-shadow(0 0 12px rgba(56,189,248,0.9))" />
                <path d="M75 90 C60 90, 44 82, 34 72 C40 58, 48 44, 58 28 C64 46, 70 60, 75 66 C80 60, 86 46, 92 28 C102 44, 110 58, 116 72 C106 82, 90 90, 75 90 Z"
                      fill="#ffffff" opacity="0.85" />
                <circle cx="62" cy="4" r="3.2" fill="#ffffff" />
                <circle cx="88" cy="4" r="3.2" fill="#ffffff" />
                <circle cx="34" cy="14" r="2.8" fill="#e0f2fe" />
                <circle cx="116" cy="14" r="2.8" fill="#e0f2fe" />
                <circle cx="8" cy="48" r="2.4" fill="#bae6fd" />
                <circle cx="142" cy="48" r="2.4" fill="#bae6fd" />
              </svg>
            </div>
          </div>

          <!-- Layer 4: Cascading Water Deluge Sheet (Washes down over the card, NO STRAIGHT COMB TEETH!) -->
          <div style="position: absolute; top: 40px; left: 50%; transform: translateX(-50%); z-index: 26; pointer-events: none;">
            <div style="width: 156px; height: 110px; animation: gbaHydroDelugeCascade ${(1.15 / speedMult).toFixed(2)}s ease-out ${(0.54 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="156" height="110" viewBox="0 0 156 110">
                <defs>
                  <linearGradient id="delugeSheetGrad_prv" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
                    <stop offset="25%" stop-color="#bae6fd" stop-opacity="0.85" />
                    <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.55" />
                    <stop offset="100%" stop-color="#0284c7" stop-opacity="0.10" />
                  </linearGradient>
                </defs>
                <path d="M14 6 C40 18, 116 18, 142 6 C148 32, 148 68, 144 96 C128 102, 108 92, 92 100 C74 94, 54 102, 36 96 C24 100, 16 94, 12 96 C8 68, 8 32, 14 6 Z"
                      fill="url(#delugeSheetGrad_prv)" style="filter: blur(0.8px);" />
                <path d="M30 10 C36 34, 26 62, 34 94" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.85" />
                <path d="M54 14 C62 38, 48 68, 56 98" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.9" />
                <path d="M78 16 C84 44, 74 72, 78 102" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.95" />
                <path d="M102 14 C94 38, 108 68, 100 98" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.9" />
                <path d="M126 10 C120 34, 130 62, 122 94" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.85" />
                <ellipse cx="78" cy="100" rx="64" ry="7" fill="#ffffff" opacity="0.45" style="filter: blur(1.5px);" />
                <circle cx="44" cy="98" r="2.8" fill="#ffffff" opacity="0.9" />
                <circle cx="68" cy="102" r="3.2" fill="#ffffff" opacity="0.95" />
                <circle cx="88" cy="100" r="3.0" fill="#ffffff" opacity="0.9" />
                <circle cx="112" cy="97" r="2.5" fill="#ffffff" opacity="0.85" />
              </svg>
            </div>
          </div>

          <!-- Layer 5: Ballistic Droplets Hurling Outward -->
          <div style="position: absolute; top: 48px; left: 50%; z-index: 34; pointer-events: none;">
            <div style="animation: gbaHydroDropletL ${(0.85 / speedMult).toFixed(2)}s ease-out ${(0.52 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="14" height="18" viewBox="0 0 14 18">
                <path d="M7 1 Q11 6, 11 10 Q11 15, 7 17 Q3 15, 3 10 Q3 6, 7 1 Z" fill="#38bdf8" />
                <ellipse cx="5" cy="9" rx="2" ry="2.5" fill="#ffffff" opacity="0.85" />
              </svg>
            </div>
          </div>
          <div style="position: absolute; top: 48px; left: 50%; z-index: 34; pointer-events: none;">
            <div style="animation: gbaHydroDropletR ${(0.85 / speedMult).toFixed(2)}s ease-out ${(0.52 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="14" height="18" viewBox="0 0 14 18">
                <path d="M7 1 Q11 6, 11 10 Q11 15, 7 17 Q3 15, 3 10 Q3 6, 7 1 Z" fill="#38bdf8" />
                <ellipse cx="5" cy="9" rx="2" ry="2.5" fill="#ffffff" opacity="0.85" />
              </svg>
            </div>
          </div>
          <div style="position: absolute; top: 48px; left: 50%; z-index: 34; pointer-events: none;">
            <div style="animation: gbaHydroDropletUp ${(0.85 / speedMult).toFixed(2)}s ease-out ${(0.52 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="14" height="18" viewBox="0 0 14 18">
                <path d="M7 1 Q11 6, 11 10 Q11 15, 7 17 Q3 15, 3 10 Q3 6, 7 1 Z" fill="#ffffff" />
              </svg>
            </div>
          </div>
        `;
      }

      fxOverlay.innerHTML = html;

      if (isLooping) {
        loopTimer = setTimeout(() => {
          playAnimation(currentWhiff);
        }, (2200 / speedMult));
      }
    }

    // Auto-trigger on page load
    window.addEventListener('load', () => {
      setTimeout(() => playAnimation(false), 200);
    });
  </script>
</body>
</html>
"""

target_path = r"c:\Users\KaanS\.gemini\antigravity\scratch\pokemon-tcg-1999_demo\public\preview_blastoise.html"
with open(target_path, "w", encoding="utf-8") as f:
    f.write(preview_content)

print("Generated compliant preview_blastoise.html with Rule 14 resilient paths and exact GameBoard parity.")
