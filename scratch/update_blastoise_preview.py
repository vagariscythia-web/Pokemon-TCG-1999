import re

content = '''<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blastoise — Hydro Pump (Doğal Namlu Ekseni & Kusursuz Blast Hizalaması)</title>
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
      padding: 24px 16px 60px;
      overflow-x: hidden;
    }

    .badge-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
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
      font-size: 22px;
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
      max-width: 860px;
      line-height: 1.5;
      margin-bottom: 22px;
    }

    /* Controls Panel */
    .controls-panel {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(51, 65, 85, 0.8);
      border-radius: 14px;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 26px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      width: 100%;
      max-width: 720px;
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
      padding: 7px 15px;
      border-radius: 8px;
      font-size: 12px;
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
    .stages-grid {
      display: flex;
      gap: 26px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 28px;
      max-width: 1240px;
      width: 100%;
    }
    .stage-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 220px;
      max-width: 260px;
    }
    .stage-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      margin-bottom: 4px;
      text-align: center;
      width: 100%;
    }
    .stage-label {
      font-size: 12.5px;
      font-weight: 700;
      color: #f1f5f9;
      letter-spacing: 0.3px;
    }
    .stage-tag {
      font-size: 9.5px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      line-height: 1.3;
    }
    .stage-tag.tag-aligned {
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid #4ade80;
      color: #4ade80;
      box-shadow: 0 0 10px rgba(74, 222, 128, 0.35);
    }
    .stage-tag.tag-natural {
      background: rgba(56, 189, 248, 0.2);
      border: 1px solid #38bdf8;
      color: #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.35);
    }
    .stage-tag.tag-misaligned {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid #f87171;
      color: #f87171;
      box-shadow: 0 0 10px rgba(248, 113, 113, 0.35);
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
    .stage-desc {
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
      margin-top: 6px;
      line-height: 1.4;
      padding: 0 4px;
    }

    .micro-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 35;
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
      animation: gbaDefendingCardHydraulicTremor 0.85s cubic-bezier(0.25, 1, 0.5, 1) 0.48s forwards;
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
      0%   { opacity: 0; transform: translateX(-50%) scale(0.65); }
      18%  { opacity: 0.85; transform: translateX(-50%) scale(0.96); }
      35%  { opacity: 1; transform: translateX(-50%) scale(1.10); filter: drop-shadow(0 0 18px rgba(14,165,233,0.8)); }
      60%  { opacity: 0.85; transform: translateX(-50%) scale(1.04); }
      80%  { opacity: 0.45; transform: translateX(-50%) scale(1.0); }
      100% { opacity: 0; transform: translateX(-50%) scale(0.95); }
    }

    /* Layer 2: Blastoise Sumo Kinematics & Recoil */
    @keyframes gbaBlastoiseFullBodyMotion {
      0%   { opacity: 0; transform: translateX(-50%) scale(0.85) translateY(18px); filter: blur(6px); }
      12%  { opacity: 0.70; transform: translateX(-50%) scale(0.96) translateY(8px); filter: blur(2px); }
      18%  { opacity: 1; transform: translateX(-50%) scale(1.02) translateY(0px); filter: blur(0px); }
      22%  { opacity: 1; transform: translateX(-50%) scale(1.03, 0.97) translateY(3px); filter: blur(0px); }
      28%  { opacity: 1; transform: translateX(-50%) scale(0.96, 1.04) translateY(-5px); filter: drop-shadow(0 0 22px #38bdf8) brightness(1.25); }
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

    /* Layer 4: Left Cannon Torrent (Natural 28° Barrel Angle, Zero Destructive translateY) */
    @keyframes gbaHydroTorrentL {
      0%   { transform: rotate(28deg) scale(0.15, 0.05); opacity: 0; filter: blur(3px); }
      14%  { transform: rotate(28deg) scale(0.85, 0.75); opacity: 0.95; filter: blur(0.5px); }
      22%  { transform: rotate(28deg) scale(1.04, 1.02); opacity: 1; filter: drop-shadow(0 0 14px #38bdf8); }
      35%  { transform: rotate(28deg) scale(0.98, 1.01); opacity: 1; }
      48%  { transform: rotate(28deg) scale(1.03, 0.99); opacity: 1; filter: drop-shadow(0 0 16px #38bdf8); }
      62%  { transform: rotate(28deg) scale(0.99, 1.01); opacity: 0.95; }
      76%  { transform: rotate(28deg) scale(1.00, 0.98); opacity: 0.85; filter: blur(0.5px); }
      88%  { transform: rotate(28deg) scale(0.94, 0.92); opacity: 0.40; filter: blur(2px); }
      100% { transform: rotate(28deg) scale(0.88, 0.85); opacity: 0; filter: blur(5px); }
    }

    /* Layer 4: Right Cannon Torrent — NATURAL (30° Barrel Alignment, Pure Nozzle Pinning) */
    @keyframes gbaHydroTorrentR_Natural {
      0%   { transform: rotate(30deg) scale(0.15, 0.05); opacity: 0; filter: blur(3px); }
      14%  { transform: rotate(30deg) scale(0.85, 0.75); opacity: 0.95; filter: blur(0.5px); }
      22%  { transform: rotate(30deg) scale(1.04, 1.02); opacity: 1; filter: drop-shadow(0 0 14px #38bdf8); }
      35%  { transform: rotate(30deg) scale(0.98, 1.01); opacity: 1; }
      48%  { transform: rotate(30deg) scale(1.03, 0.99); opacity: 1; filter: drop-shadow(0 0 16px #38bdf8); }
      62%  { transform: rotate(30deg) scale(0.99, 1.01); opacity: 0.95; }
      76%  { transform: rotate(30deg) scale(1.00, 0.98); opacity: 0.85; filter: blur(0.5px); }
      88%  { transform: rotate(30deg) scale(0.94, 0.92); opacity: 0.40; filter: blur(2px); }
      100% { transform: rotate(30deg) scale(0.88, 0.85); opacity: 0; filter: blur(5px); }
    }

    /* Layer 4: Right Cannon Torrent — OLD (30° with Rotational Angular Wobble) */
    @keyframes gbaHydroTorrentR_Old {
      0%   { transform: rotate(30deg) scale(0.15, 0.05); opacity: 0; filter: blur(3px); }
      14%  { transform: rotate(30deg) scale(0.85, 0.75); opacity: 0.95; filter: blur(0.5px); }
      22%  { transform: rotate(29.5deg) scale(1.05, 1.02); opacity: 1; filter: drop-shadow(0 0 14px #38bdf8); }
      35%  { transform: rotate(30.5deg) scale(0.97, 1.01); opacity: 1; }
      48%  { transform: rotate(29.8deg) scale(1.03, 0.98); opacity: 1; filter: drop-shadow(0 0 16px #38bdf8); }
      62%  { transform: rotate(30.2deg) scale(0.98, 1.02); opacity: 0.95; }
      76%  { transform: rotate(30deg) scale(1.00, 0.98); opacity: 0.85; filter: blur(0.5px); }
      88%  { transform: rotate(30deg) scale(0.94, 0.92); opacity: 0.40; filter: blur(2px); }
      100% { transform: rotate(30deg) scale(0.88, 0.85); opacity: 0; filter: blur(5px); }
    }

    /* Impact Splash Flash Pop (Left Jet Arrival: x=87, y=56) */
    @keyframes gbaImpactSplashPopL {
      0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
      18%  { transform: translate(-50%, -50%) scale(1.35); opacity: 1; filter: drop-shadow(0 0 14px #ffffff); }
      45%  { transform: translate(-50%, -50%) scale(1.10); opacity: 0.9; }
      75%  { transform: translate(-50%, -50%) scale(0.95); opacity: 0.4; filter: blur(1.5px); }
      100% { transform: translate(-50%, -50%) scale(0.60); opacity: 0; filter: blur(4px); }
    }

    /* Impact Splash Flash Pop (Right Jet Arrival: x=165, y=43) */
    @keyframes gbaImpactSplashPopR {
      0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
      18%  { transform: translate(-50%, -50%) scale(1.35); opacity: 1; filter: drop-shadow(0 0 14px #ffffff); }
      45%  { transform: translate(-50%, -50%) scale(1.10); opacity: 0.9; }
      75%  { transform: translate(-50%, -50%) scale(0.95); opacity: 0.4; filter: blur(1.5px); }
      100% { transform: translate(-50%, -50%) scale(0.60); opacity: 0; filter: blur(4px); }
    }
  </style>
</head>
<body>
  <div class="badge-bar">
    <span class="badge">Doğal Namlu Açısı Restorasyonu (~30°)</span>
    <span class="badge">Yıkıcı Dikey Öteleme Kaldırıldı</span>
    <span class="badge">Eşmerkezli Çift Blast (x=165px, y=43px)</span>
  </div>

  <h1>BLASTOISE — HYDRO PUMP DOĞAL EKSEN & EŞMERKEZLİ BLAST HİZALAMASI</h1>
  <p class="subtitle">
    Kullanıcı geri bildirimi doğrultusunda doğal namlu açısı (sağda 30°, solda 28°) ve anatomik eksen tamamen geri getirildi. Nozul bağlantısını koparan yıkıcı <code>translateY</code> kaldırıldı; sağ darbe küresi ve parçacıklar doğrudan jetin gerçek varış noktasına (x=165px, y=43px) kilitlendi.
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

  <!-- Global Hidden SVG Filter Defs for Fluid Turbulence & Shockwave -->
  <svg width="0" height="0" style="position: absolute; pointer-events: none;">
    <defs>
      <!-- Cannon Water Jet Turbulence -->
      <filter id="blastoiseJetTurbulence" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence id="blastoiseTurbElem" type="turbulence" baseFrequency="0.02 0.08" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      <!-- Shockwave Displacement on Defending Card Underlay -->
      <filter id="blastoiseShockDisplacement" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence id="blastoiseShockTurb" type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
        <feDisplacementMap id="blastoiseShockDisp" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>

  <div class="stages-grid">
    <!-- STAGE 1: SEÇENEK C V3 - DOĞAL 30° EKSEN & MÜKEMMEL JET KAFASI HİZALAMASI (ÖNERİLEN) -->
    <div class="stage-wrapper">
      <div class="stage-header">
        <span class="stage-label">1. Seçenek C v3 (Doğal Eksen & Hizalı)</span>
        <span class="stage-tag tag-aligned">Doğal 30° Eksen + 100% Eşmerkezli Blast</span>
      </div>
      <div class="stage-card" id="arenaCardStage1">
        <img id="cardUnderlayStage1" class="target-underlay" alt="Base Set Blastoise #2" style="filter: url(#blastoiseShockDisplacement);" />
        <div class="status-strip">
          <span>BLASTOISE</span>
          <div class="hp-pips"><span style="margin-right: 4px;">100 HP</span><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>
        </div>
        <div id="fxOverlayStage1" style="position: absolute; inset: 0; pointer-events: none; overflow: visible; z-index: 20;"></div>
      </div>
      <p class="stage-desc">Doğal 30° namlu açısı korundu. Sağ jet kökü 1.5px içe (calc(50% + 8.5px)) alınarak nozul ağzına kilitlendi; blast küresi ve parçacıklar doğrudan jetin kafasına (x=165px, y=43px) odaklandı.</p>
    </div>

    <!-- STAGE 2: SEÇENEK C V3 - DOĞAL 30° EKSEN & ORİJİNAL KÖK (+10px) -->
    <div class="stage-wrapper">
      <div class="stage-header">
        <span class="stage-label">2. Seçenek C v3 (Orijinal Kök +10px)</span>
        <span class="stage-tag tag-natural">Doğal 30° + Orijinal Kök (+10px)</span>
      </div>
      <div class="stage-card" id="arenaCardStage2">
        <img id="cardUnderlayStage2" class="target-underlay" alt="Base Set Blastoise #2" style="filter: url(#blastoiseShockDisplacement);" />
        <div class="status-strip">
          <span>BLASTOISE</span>
          <div class="hp-pips"><span style="margin-right: 4px;">100 HP</span><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>
        </div>
        <div id="fxOverlayStage2" style="position: absolute; inset: 0; pointer-events: none; overflow: visible; z-index: 20;"></div>
      </div>
      <p class="stage-desc">Orijinal +10px kök pozisyonu ve doğal 30° açı. Blast küresi ve parçacıklar tam jet kafasına (x=167px, y=43px) kilitlendi.</p>
    </div>

    <!-- STAGE 3: ESKİ REFERANS (KULLANICININ BELİRTTİĞİ DOĞAL HALİ - KIYASLAMA) -->
    <div class="stage-wrapper">
      <div class="stage-header">
        <span class="stage-label">3. Önceki Durum (Referans)</span>
        <span class="stage-tag tag-misaligned">Doğal Jetler & Solda Kalan Blast</span>
      </div>
      <div class="stage-card" id="arenaCardStage3">
        <img id="cardUnderlayStage3" class="target-underlay" alt="Base Set Blastoise #2" style="filter: url(#blastoiseShockDisplacement);" />
        <div class="status-strip">
          <span>BLASTOISE</span>
          <div class="hp-pips"><span style="margin-right: 4px;">100 HP</span><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>
        </div>
        <div id="fxOverlayStage3" style="position: absolute; inset: 0; pointer-events: none; overflow: visible; z-index: 20;"></div>
      </div>
      <p class="stage-desc">Kullanıcının daha doğal bulduğu önceki orijinal referans: Jetler doğal akışında; kıyaslama için blast küresi eski solda kalan halinde (x=114px) tutuluyor.</p>
    </div>
  </div>

  <script>
    // RULE 14: Resilient Local/Static Asset Protocol
    const ASSET_CANDIDATE_PATHS = [
      'assets/blastoise_full_body.png',
      'assets/blastoise_hydro_pump_actor.png',
      './assets/blastoise_full_body.png',
      './assets/blastoise_hydro_pump_actor.png',
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
        testImg.onload = () => { resolvedBlastoiseAsset = candidate; };
        testImg.onerror = () => { idx++; testNext(); };
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

    function resolveCardUnderlays() {
      let idx = 0;
      function testNext() {
        if (idx >= CARD_CANDIDATE_PATHS.length) return;
        const testImg = new Image();
        const candidate = CARD_CANDIDATE_PATHS[idx];
        testImg.onload = () => {
          const el1 = document.getElementById('cardUnderlayStage1');
          const el2 = document.getElementById('cardUnderlayStage2');
          const el3 = document.getElementById('cardUnderlayStage3');
          if (el1) el1.src = candidate;
          if (el2) el2.src = candidate;
          if (el3) el3.src = candidate;
        };
        testImg.onerror = () => { idx++; testNext(); };
        testImg.src = candidate;
      }
      testNext();
    }
    resolveCardUnderlays();

    let isRealCardMode = true;
    function toggleMode() {
      isRealCardMode = !isRealCardMode;
      const c1 = document.getElementById('arenaCardStage1');
      const c2 = document.getElementById('arenaCardStage2');
      const c3 = document.getElementById('arenaCardStage3');
      const btn = document.getElementById('btnMode');
      const list = [c1, c2, c3];
      if (isRealCardMode) {
        list.forEach(c => c && c.classList.remove('dark-canvas-mode'));
        btn.innerText = '🎴 Mod: Otantik Kart (AÇIK)';
      } else {
        list.forEach(c => c && c.classList.add('dark-canvas-mode'));
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

    // =========================================================================
    // Fine-Grained Atomizing Fluid Particle Class
    // =========================================================================
    class FineFluidParticle {
      constructor(ox, oy, type, angleSpread, speedMultVal = 1.0) {
        this.x = ox + (Math.random() - 0.5) * 8;
        this.y = oy + (Math.random() - 0.5) * 6;
        this.type = type; // 'foam' | 'water' | 'mist'

        let angle, speed;
        if (angleSpread) {
          angle = angleSpread.min + Math.random() * (angleSpread.max - angleSpread.min);
        } else {
          angle = -Math.PI * (0.10 + Math.random() * 0.80);
        }

        if (type === 'foam') {
          speed = (2.2 + Math.random() * 4.2) * speedMultVal;
          this.initRadius = 1.6 + Math.random() * 1.4; // 1.6 - 3.0px initially
          this.radius = this.initRadius;
          this.minRadius = 0.6;
          this.color = Math.random() > 0.4 ? '#ffffff' : '#e0f2fe';
          this.alpha = 0.96;
          this.decay = 0.010 + Math.random() * 0.008;
          this.gravity = 0.13 + Math.random() * 0.04;
        } else if (type === 'water') {
          speed = (3.0 + Math.random() * 5.5) * speedMultVal;
          this.initRadius = 1.2 + Math.random() * 1.6; // 1.2 - 2.8px initially
          this.radius = this.initRadius;
          this.minRadius = 0.5;
          this.color = Math.random() > 0.45 ? '#0ea5e9' : (Math.random() > 0.5 ? '#38bdf8' : '#0284c7');
          this.alpha = 0.88;
          this.decay = 0.009 + Math.random() * 0.007;
          this.gravity = 0.16 + Math.random() * 0.05;
        } else { // 'mist'
          speed = (3.8 + Math.random() * 6.8) * speedMultVal;
          this.initRadius = 0.7 + Math.random() * 0.9; // 0.7 - 1.6px
          this.radius = this.initRadius;
          this.minRadius = 0.4;
          this.color = Math.random() > 0.5 ? '#bae6fd' : '#ffffff';
          this.alpha = 0.92;
          this.decay = 0.014 + Math.random() * 0.010;
          this.gravity = 0.15 + Math.random() * 0.06;
        }

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.drag = 0.966;
      }

      update() {
        this.vx *= this.drag;
        this.vy = (this.vy * this.drag) + this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        // Kademeli atomizasyon: Aşağı doğru süzülürken hava sürtünmesiyle incelme
        if (this.vy > 0.2) {
          this.radius = Math.max(this.minRadius, this.radius * 0.984);
        }

        if (this.y >= 246) {
          this.vy = 0;
          this.vx *= 1.25;
          this.alpha = Math.max(0, this.alpha - 0.09);
        } else {
          this.alpha = Math.max(0, this.alpha - this.decay);
        }
      }

      draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;

        if (this.type === 'foam' || this.radius < 1.0) {
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 3;
        } else {
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 2;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Parıltılı mikro-speküler ışıltı
        if (this.vy > 1.2 && this.alpha > 0.45 && Math.random() > 0.8) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(this.x - 0.3, this.y - 0.3, Math.max(0.3, this.radius * 0.4), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Simulation states
    let particlesStage1 = [];
    let particlesStage2 = [];
    let particlesStage3 = [];
    let canvasAnimId = null;
    const blastoiseTurbElem = document.getElementById('blastoiseTurbElem');
    const blastoiseShockDisp = document.getElementById('blastoiseShockDisp');
    let shockStartTime = 0;

    function runSimulations(canvas1, canvas2, canvas3) {
      if (canvasAnimId) cancelAnimationFrame(canvasAnimId);
      particlesStage1 = [];
      particlesStage2 = [];
      particlesStage3 = [];

      let simTime = 0;
      let particlesSpawned = false;

      function step() {
        simTime += (16.6 * speedMult);

        // Anisotropic Turbulence Jitter
        const t = simTime * 0.0035;
        if (blastoiseTurbElem) {
          const fy = 0.08 + Math.sin(t * 8) * 0.03;
          blastoiseTurbElem.setAttribute('baseFrequency', `0.02 ${fy.toFixed(4)}`);
        }

        // Concussive Shockwave Pulse at 0.48s
        if (simTime >= 480 && shockStartTime === 0) {
          shockStartTime = simTime;
        }
        if (shockStartTime > 0 && blastoiseShockDisp) {
          const elapsed = (simTime - shockStartTime);
          if (elapsed < 300) {
            const shockScale = Math.sin((elapsed / 300) * Math.PI) * 10;
            blastoiseShockDisp.setAttribute('scale', shockScale.toFixed(2));
          } else {
            blastoiseShockDisp.setAttribute('scale', '0');
          }
        }

        // Spawn Particles at 0.48s impact
        if (simTime >= 480 && !particlesSpawned) {
          particlesSpawned = true;

          // Left Jet Tip Arrival: (oxL = 87px, oyL = 56px)
          const oxL = 87, oyL = 56;
          // Stage 1 Right Jet Tip (30° natural, base +8.5px): (oxR1 = 165px, oyR1 = 43px)
          const oxR1 = 165, oyR1 = 43;
          // Stage 2 Right Jet Tip (30° natural, base +10px): (oxR2 = 167px, oyR2 = 43px)
          const oxR2 = 167, oyR2 = 43;

          // Helper to populate dual impact burst
          function populateParticles(arr, oxR, oyR) {
            // 1. Left Jet Burst (130 particles)
            for (let i = 0; i < 60; i++) arr.push(new FineFluidParticle(oxL, oyL, 'water', { min: -Math.PI * 0.95, max: -Math.PI * 0.25 }));
            for (let i = 0; i < 40; i++) arr.push(new FineFluidParticle(oxL, oyL, 'foam', { min: -Math.PI * 0.85, max: -Math.PI * 0.35 }));
            for (let i = 0; i < 30; i++) arr.push(new FineFluidParticle(oxL, oyL, 'mist', { min: -Math.PI * 1.0, max: -Math.PI * 0.15 }));

            // 2. Right Jet Burst (130 particles) — Concentric on actual tip!
            for (let i = 0; i < 60; i++) arr.push(new FineFluidParticle(oxR, oyR, 'water', { min: -Math.PI * 0.75, max: -Math.PI * 0.05 }));
            for (let i = 0; i < 40; i++) arr.push(new FineFluidParticle(oxR, oyR, 'foam', { min: -Math.PI * 0.65, max: -Math.PI * 0.15 }));
            for (let i = 0; i < 30; i++) arr.push(new FineFluidParticle(oxR, oyR, 'mist', { min: -Math.PI * 0.85, max: 0.0 }));

            // 3. Convergence Spray & Downward Cascade (160 particles)
            for (let i = 0; i < 160; i++) {
              const u = Math.random();
              const bx = oxL + (oxR - oxL) * u;
              const by = oyL + (oyR - oyL) * u + (Math.random() - 0.5) * 8;
              const pType = Math.random() > 0.4 ? 'water' : (Math.random() > 0.5 ? 'foam' : 'mist');
              arr.push(new FineFluidParticle(bx, by, pType, { min: -Math.PI * 0.75, max: -Math.PI * 0.25 }, 0.9));
            }
          }

          populateParticles(particlesStage1, oxR1, oyR1);
          populateParticles(particlesStage2, oxR2, oyR2);

          // Stage 3 (Old Reference): Flash was misaligned to the left (ox=114 instead of 165)
          if (canvas3) {
            for (let i = 0; i < 160; i++) particlesStage3.push(new FineFluidParticle(oxL, oyL, 'water'));
            for (let i = 0; i < 120; i++) particlesStage3.push(new FineFluidParticle(114, 52, 'foam'));
          }
        }

        // Render Stage 1 (Recommended: 30° natural + calc(50% + 8.5px) + concentric blast at 165, 43)
        if (canvas1) {
          const ctx1 = canvas1.getContext('2d');
          ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
          renderParticleGroup(ctx1, particlesStage1, true);
          renderDualCausticShockRings(ctx1, simTime, 87, 56, 165, 43);
        }

        // Render Stage 2 (Natural: 30° natural + calc(50% + 10px) + concentric blast at 167, 43)
        if (canvas2) {
          const ctx2 = canvas2.getContext('2d');
          ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
          renderParticleGroup(ctx2, particlesStage2, true);
          renderDualCausticShockRings(ctx2, simTime, 87, 56, 167, 43);
        }

        // Render Stage 3 (Old Reference)
        if (canvas3) {
          const ctx3 = canvas3.getContext('2d');
          ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
          renderParticleGroup(ctx3, particlesStage3, false);
          renderDualCausticShockRings(ctx3, simTime, 87, 56, 114, 52);
        }

        if (simTime < 2400) {
          canvasAnimId = requestAnimationFrame(step);
        }
      }
      canvasAnimId = requestAnimationFrame(step);
    }

    function renderParticleGroup(ctx, particles, connectLigaments) {
      if (particles.length === 0) return;

      if (connectLigaments) {
        ctx.save();
        ctx.lineWidth = 1.6;
        for (let i = 0; i < particles.length; i += 2) {
          const p1 = particles[i];
          if (p1.alpha <= 0.2) continue;
          for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
            const p2 = particles[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 95) {
              const alpha = Math.min(p1.alpha, p2.alpha) * 0.45;
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
    }

    function renderDualCausticShockRings(ctx, simTime, ox1, oy1, ox2, oy2) {
      if (simTime >= 480 && simTime <= 1250) {
        const shockProgress = (simTime - 480) / 770;
        const shockAlpha = Math.sin(shockProgress * Math.PI) * 0.82;
        const shockRadius = 10 + shockProgress * 42;

        ctx.save();
        ctx.strokeStyle = `rgba(186, 230, 253, ${shockAlpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(0.8, 2.2 * (1 - shockProgress));
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 5;

        const centers = [{ x: ox1, y: oy1 }, { x: ox2, y: oy2 }];
        const wavePhase = simTime * 0.015;

        centers.forEach(c => {
          ctx.beginPath();
          for (let a = 0; a <= Math.PI * 2 + 0.15; a += 0.25) {
            const rOffset = Math.sin(a * 5 + wavePhase) * 3.2 + Math.cos(a * 4 - wavePhase) * 1.6;
            const r = shockRadius + rOffset;
            const px = c.x + Math.cos(a) * r;
            const py = c.y + Math.sin(a) * r * 0.72;
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        });

        ctx.restore();
      }
    }

    // ==========================================
    // Unified Markup Generator for Stages
    // mode: 'aligned' | 'natural' | 'reference'
    // ==========================================
    function buildHydroPumpMarkup({ isWhiffed, durSec, actorWidth, actorAnim, mode, speedMult }) {
      const pfx = mode;
      let html = `
        <!-- Layer 1: Ambient Hydro Ground Foam & Surge -->
        <div style="position: absolute; width: 112px; height: 26px; bottom: 0px; left: calc(50% - 38px); transform: translateX(-50%); z-index: 2;
                    background: radial-gradient(ellipse at 50% 100%, rgba(56,189,248,0.32) 0%, rgba(2,132,199,0.12) 50%, transparent 75%);
                    filter: blur(2px);
                    animation: gbaHydroFloorSurge ${durSec}s ease-out forwards; opacity: 0;"></div>

        <!-- Layer 2: Ken Sugimori Full-Body Blastoise -->
        <div style="position: absolute; width: ${actorWidth}; aspect-ratio: 1381 / 1346; bottom: 2px; left: calc(50% - 34px); z-index: 10;
                    animation: ${actorAnim}; opacity: 0;">
          <img src="${resolvedBlastoiseAsset}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 4px 14px rgba(0,0,0,0.75));" />
        </div>
      `;

      if (!isWhiffed) {
        let rightContainerLeft, rightAnim, rightFlashX, rightFlashY;
        if (mode === 'aligned') {
          rightContainerLeft = 'calc(50% + 8.5px)';
          rightAnim = 'gbaHydroTorrentR_Natural';
          rightFlashX = 165;
          rightFlashY = 43;
        } else if (mode === 'natural') {
          rightContainerLeft = 'calc(50% + 10px)';
          rightAnim = 'gbaHydroTorrentR_Natural';
          rightFlashX = 167;
          rightFlashY = 43;
        } else { // 'reference'
          rightContainerLeft = 'calc(50% + 10px)';
          rightAnim = 'gbaHydroTorrentR_Old';
          rightFlashX = 114;
          rightFlashY = 52;
        }

        html += `
          <!-- Layer 4: Left Cannon Torrent (Anchored at calc(50% - 54px), bottom: 105px, rotate 28deg) -->
          <div style="position: absolute; left: calc(50% - 54px); bottom: 105px; z-index: 18; pointer-events: none; filter: url(#blastoiseJetTurbulence);">
            <div style="position: absolute; left: -32px; bottom: 0px; width: 64px; height: 112px; transform-origin: 32px 112px;
                        animation: gbaHydroTorrentL ${(1.25 / speedMult).toFixed(2)}s cubic-bezier(0.18, 0.85, 0.35, 1) ${(0.30 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="64" height="112" viewBox="0 0 64 112" style="overflow: visible;">
                <defs>
                  <linearGradient id="flowGradL_${pfx}" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#0369a1" stop-opacity="0.95" />
                    <stop offset="25%" stop-color="#0284c7" stop-opacity="0.90" />
                    <stop offset="60%" stop-color="#0ea5e9" stop-opacity="0.88" />
                    <stop offset="85%" stop-color="#38bdf8" stop-opacity="0.92" />
                    <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.98" />
                  </linearGradient>
                  <linearGradient id="flowCoreL_${pfx}" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.92" />
                    <stop offset="40%" stop-color="#7dd3fc" stop-opacity="0.95" />
                    <stop offset="75%" stop-color="#e0f2fe" stop-opacity="0.98" />
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="1.0" />
                  </linearGradient>
                </defs>
                <path d="M24 112 C24 102, 22 90, 20 78 C18 64, 12 50, 10 36 C8 24, 6 12, 10 4 C16 0, 26 2, 32 3 C38 2, 48 0, 54 4 C58 12, 56 24, 54 36 C52 50, 46 64, 44 78 C42 90, 40 102, 40 112 Z"
                      fill="url(#flowGradL_${pfx})" filter="drop-shadow(0 0 10px rgba(14,165,233,0.85))" />
                <path d="M26 110 C26 98, 24 86, 22 74 C19 60, 15 48, 14 36 C13 26, 12 16, 16 8 C22 4, 28 6, 32 7 C36 6, 42 4, 48 8 C52 16, 51 26, 50 36 C49 48, 45 60, 42 74 C40 86, 38 98, 38 110 Z"
                      fill="#0ea5e9" opacity="0.85" />
                <path d="M28 108 C28 96, 27 82, 25 70 C23 56, 20 46, 20 34 C20 24, 22 14, 26 10 C29 8, 31 9, 32 9 C33 9, 35 8, 38 10 C42 14, 44 24, 44 34 C44 46, 41 56, 39 70 C37 82, 36 96, 36 108 Z"
                      fill="url(#flowCoreL_${pfx})" />
                <path d="M32 108 C32 88, 30 68, 29 48 C28 32, 30 18, 32 8"
                      fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.95" />
                <path d="M26 104 Q36 86, 28 68 Q20 50, 34 32 Q42 18, 32 8"
                      fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.85" />
                <path d="M12 10 Q22 4, 32 7 Q42 4, 52 10"
                      fill="none" stroke="#ffffff" stroke-width="2.0" stroke-linecap="round" opacity="0.9" />
              </svg>
            </div>
          </div>

          <!-- Layer 4: Right Cannon Torrent (Anchored at ${rightContainerLeft}, bottom: 98px, rotate 30deg) -->
          <div style="position: absolute; left: ${rightContainerLeft}; bottom: 98px; z-index: 18; pointer-events: none; filter: url(#blastoiseJetTurbulence);">
            <div style="position: absolute; left: -36px; bottom: 0px; width: 72px; height: 136px; transform-origin: 36px 136px;
                        animation: ${rightAnim} ${(1.25 / speedMult).toFixed(2)}s cubic-bezier(0.18, 0.85, 0.35, 1) ${(0.30 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="72" height="136" viewBox="0 0 72 136" style="overflow: visible;">
                <defs>
                  <linearGradient id="flowGradR_${pfx}" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#0369a1" stop-opacity="0.95" />
                    <stop offset="25%" stop-color="#0284c7" stop-opacity="0.90" />
                    <stop offset="60%" stop-color="#0ea5e9" stop-opacity="0.88" />
                    <stop offset="85%" stop-color="#38bdf8" stop-opacity="0.92" />
                    <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.98" />
                  </linearGradient>
                  <linearGradient id="flowCoreR_${pfx}" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.92" />
                    <stop offset="40%" stop-color="#7dd3fc" stop-opacity="0.95" />
                    <stop offset="75%" stop-color="#e0f2fe" stop-opacity="0.98" />
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="1.0" />
                  </linearGradient>
                </defs>
                <path d="M28 136 C28 124, 25 108, 22 92 C19 76, 14 58, 12 40 C10 26, 8 14, 12 4 C18 0, 30 2, 36 3 C42 2, 54 0, 60 4 C64 14, 62 26, 60 40 C58 58, 53 76, 50 92 C47 108, 44 124, 44 136 Z"
                      fill="url(#flowGradR_${pfx})" filter="drop-shadow(0 0 10px rgba(14,165,233,0.85))" />
                <path d="M30 132 C30 118, 27 104, 24 88 C21 72, 17 56, 16 40 C15 28, 14 18, 18 8 C24 4, 31 6, 36 7 C41 6, 48 4, 54 8 C58 18, 57 28, 56 40 C55 56, 51 72, 48 88 C45 104, 42 118, 42 132 Z"
                      fill="#0ea5e9" opacity="0.85" />
                <path d="M32 130 C32 114, 30 98, 27 82 C24 66, 22 52, 22 38 C22 26, 24 16, 28 10 C32 8, 34 9, 36 9 C38 9, 40 8, 44 10 C48 16, 50 26, 50 38 C50 52, 48 66, 45 82 C42 98, 40 114, 40 130 Z"
                      fill="url(#flowCoreR_${pfx})" />
                <path d="M36 130 C36 104, 34 78, 33 54 C32 36, 34 20, 36 8"
                      fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.95" />
                <path d="M30 126 Q42 102, 32 80 Q22 58, 38 36 Q48 20, 36 8"
                      fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.85" />
                <path d="M14 10 Q26 4, 36 7 Q46 4, 58 10"
                      fill="none" stroke="#ffffff" stroke-width="2.0" stroke-linecap="round" opacity="0.9" />
              </svg>
            </div>
          </div>

          <!-- Left Jet Arrival Impact Flash (x=87, y=56) -->
          <div style="position: absolute; left: 87px; top: 56px; z-index: 30; pointer-events: none;">
            <div style="animation: gbaImpactSplashPopL ${(0.85 / speedMult).toFixed(2)}s ease-out ${(0.48 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="48" height="48" viewBox="0 0 48 48" style="overflow: visible;">
                <circle cx="24" cy="24" r="16" fill="rgba(56,189,248,0.35)" filter="blur(3px)" />
                <circle cx="24" cy="24" r="9" fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff)" />
                <path d="M 24 6 Q 24 18, 12 24 Q 24 24, 24 36 Q 24 24, 36 24 Q 24 18, 24 6" fill="#ffffff" />
              </svg>
            </div>
          </div>

          <!-- Right Jet Arrival Impact Flash (x=${rightFlashX}, y=${rightFlashY}) -->
          <div style="position: absolute; left: ${rightFlashX}px; top: ${rightFlashY}px; z-index: 30; pointer-events: none;">
            <div style="animation: gbaImpactSplashPopR ${(0.85 / speedMult).toFixed(2)}s ease-out ${(0.48 / speedMult).toFixed(2)}s forwards; opacity: 0;">
              <svg width="48" height="48" viewBox="0 0 48 48" style="overflow: visible;">
                <circle cx="24" cy="24" r="16" fill="rgba(56,189,248,0.35)" filter="blur(3px)" />
                <circle cx="24" cy="24" r="9" fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff)" />
                <path d="M 24 6 Q 24 18, 12 24 Q 24 24, 24 36 Q 24 24, 36 24 Q 24 18, 24 6" fill="#ffffff" />
              </svg>
            </div>
          </div>
        `;

        const canvasId = mode === 'aligned' ? 'canvasStage1' : (mode === 'natural' ? 'canvasStage2' : 'canvasStage3');
        html += `<canvas id="${canvasId}" width="184" height="253" class="micro-canvas"></canvas>`;
      }

      return html;
    }

    let currentWhiff = false;
    function playAnimation(isWhiffed = false) {
      currentWhiff = isWhiffed;
      clearTimeout(loopTimer);

      const overlayStage1 = document.getElementById('fxOverlayStage1');
      const overlayStage2 = document.getElementById('fxOverlayStage2');
      const overlayStage3 = document.getElementById('fxOverlayStage3');
      const cardStage1 = document.getElementById('arenaCardStage1');
      const cardStage2 = document.getElementById('arenaCardStage2');
      const cardStage3 = document.getElementById('arenaCardStage3');

      overlayStage1.innerHTML = '';
      overlayStage2.innerHTML = '';
      overlayStage3.innerHTML = '';
      cardStage1.classList.remove('card-tremor');
      cardStage2.classList.remove('card-tremor');
      cardStage3.classList.remove('card-tremor');

      document.getElementById('btnNormal').classList.toggle('active', !isWhiffed);
      document.getElementById('btnWhiff').classList.toggle('active', isWhiffed);

      if (!isWhiffed) {
        void cardStage1.offsetWidth;
        void cardStage2.offsetWidth;
        void cardStage3.offsetWidth;
        cardStage1.classList.add('card-tremor');
        cardStage2.classList.add('card-tremor');
        cardStage3.classList.add('card-tremor');
      }

      const durSec = (2.10 / speedMult).toFixed(2);
      const actorWidth = isWhiffed ? '82px' : '118px';
      const actorAnim = isWhiffed
        ? `gbaBlastoiseWhiffRecede ${durSec}s ease-out forwards`
        : `gbaBlastoiseFullBodyMotion ${durSec}s cubic-bezier(0.22, 0.9, 0.36, 1) forwards`;

      // Render Stage 1: Recommended Natural 30° + Sealed Base + Aligned Blast
      overlayStage1.innerHTML = buildHydroPumpMarkup({
        isWhiffed, durSec, actorWidth, actorAnim,
        mode: 'aligned',
        speedMult
      });

      // Render Stage 2: Natural 30° + Original +10px Base + Aligned Blast
      overlayStage2.innerHTML = buildHydroPumpMarkup({
        isWhiffed, durSec, actorWidth, actorAnim,
        mode: 'natural',
        speedMult
      });

      // Render Stage 3: Old Reference (Un-aligned blast flash)
      overlayStage3.innerHTML = buildHydroPumpMarkup({
        isWhiffed, durSec, actorWidth, actorAnim,
        mode: 'reference',
        speedMult
      });

      shockStartTime = 0;
      if (!isWhiffed) {
        const c1 = document.getElementById('canvasStage1');
        const c2 = document.getElementById('canvasStage2');
        const c3 = document.getElementById('canvasStage3');
        runSimulations(c1, c2, c3);
      } else {
        if (blastoiseShockDisp) blastoiseShockDisp.setAttribute('scale', '0');
        if (canvasAnimId) cancelAnimationFrame(canvasAnimId);
      }

      if (isLooping) {
        loopTimer = setTimeout(() => {
          playAnimation(currentWhiff);
        }, 2400 / speedMult);
      }
    }

    // Auto play on load
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        playAnimation(false);
      }, 250);
    });
  </script>
</body>
</html>
'''

with open('public/preview_blastoise.html', 'w', encoding='utf-8') as f:
    f.write(content.strip() + '\\n')

print('preview_blastoise.html updated successfully!')
