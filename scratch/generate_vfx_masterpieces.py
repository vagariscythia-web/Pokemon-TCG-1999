import sys

# Generate the revamped, cinema-grade preview_advanced_moves_showcase.html
html = """<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pokémon TCG 1999 — İleri Düzey VFX Sanat Yönetmenliği Numune Paneli</title>
  <style>
    :root {
      --bg-dark: #07090e;
      --panel-bg: rgba(15, 21, 34, 0.94);
      --card-w: 184px;
      --card-h: 253px;
      --accent-cyan: #38bdf8;
      --accent-purple: #c084fc;
      --accent-lime: #a3e635;
      --accent-gold: #facc15;
      --accent-emerald: #10b981;
      --accent-sky: #0ea5e9;
      --accent-amber: #f59e0b;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: radial-gradient(circle at 50% 8%, #141c2e 0%, #05070b 100%);
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px 80px;
    }

    header {
      text-align: center;
      max-width: 1000px;
      margin-bottom: 22px;
    }

    .badge-master {
      display: inline-block;
      padding: 5px 16px;
      border-radius: 9999px;
      background: rgba(163, 230, 53, 0.15);
      border: 1px solid rgba(163, 230, 53, 0.45);
      color: var(--accent-lime);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    h1 {
      font-size: 26px;
      font-weight: 800;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }

    p.subtitle {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.55;
    }

    /* Global Control Bar */
    .global-toolbar {
      display: flex;
      gap: 10px;
      margin-bottom: 28px;
      flex-wrap: wrap;
      justify-content: center;
      background: rgba(15, 23, 42, 0.85);
      padding: 10px 18px;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .btn {
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid rgba(148, 163, 184, 0.25);
      color: #cbd5e1;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      user-select: none;
    }

    .btn:hover {
      background: rgba(51, 65, 85, 0.95);
      border-color: rgba(56, 189, 248, 0.5);
      color: #fff;
    }

    .btn.active {
      background: rgba(56, 189, 248, 0.22);
      border-color: var(--accent-cyan);
      color: #38bdf8;
      box-shadow: 0 0 14px rgba(56, 189, 248, 0.35);
    }

    /* Grid of 4 Masterpiece Cards */
    .showcase-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 26px;
      max-width: 1400px;
      width: 100%;
    }

    .showcase-card {
      background: var(--panel-bg);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(14px);
      transition: transform 0.25s ease, border-color 0.25s ease;
      position: relative;
    }

    .showcase-card:hover {
      border-color: rgba(163, 230, 53, 0.4);
      transform: translateY(-3px);
    }

    .showcase-header {
      width: 100%;
      text-align: left;
      margin-bottom: 14px;
    }

    .showcase-badge {
      display: inline-block;
      font-size: 9px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 5px;
      text-transform: uppercase;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }

    .badge-solar {
      background: rgba(163, 230, 53, 0.2);
      color: #bef264;
      border: 1px solid rgba(163, 230, 53, 0.45);
    }

    .badge-hydro {
      background: rgba(14, 165, 233, 0.2);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.45);
    }

    .badge-acid {
      background: rgba(234, 179, 8, 0.2);
      color: #fde047;
      border: 1px solid rgba(234, 179, 8, 0.45);
    }

    .showcase-title {
      font-size: 15px;
      font-weight: 800;
      color: #f8fafc;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .showcase-desc {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
      line-height: 1.4;
    }

    /* Card Slot with Parity (Rule 14: 184px x 253px) */
    .card-slot-wrapper {
      position: relative;
      width: var(--card-w);
      height: var(--card-h);
      border-radius: 12px;
      overflow: hidden;
      background: #090d16;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.75), inset 0 0 0 1px rgba(255, 255, 255, 0.12);
      margin-bottom: 14px;
    }

    .card-bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      pointer-events: none;
      z-index: 1;
      opacity: 0.95;
      transition: opacity 0.3s ease, filter 0.3s ease;
    }

    .dark-board-mode .card-bg-img {
      opacity: 0.08;
      filter: grayscale(100%) brightness(0.25);
    }

    /* Status Strip (CardView.tsx parity) */
    .status-strip {
      position: absolute;
      top: 6px;
      right: 8px;
      z-index: 28;
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(10, 15, 28, 0.88);
      backdrop-filter: blur(5px);
      padding: 2px 7px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .status-hp {
      font-size: 9px;
      font-weight: 800;
      color: #f8fafc;
    }

    .status-pips {
      display: flex;
      gap: 2px;
    }

    .pip {
      width: 4px;
      height: 6px;
      border-radius: 1px;
      background: #22c55e;
    }

    /* FX Overlay Canvas / Stage */
    .fx-stage {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      pointer-events: none;
      overflow: visible;
    }

    /* Controls Panel under Card */
    .card-controls {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .btn-play {
      width: 100%;
      background: linear-gradient(135deg, rgba(163, 230, 53, 0.25) 0%, rgba(30, 41, 59, 0.85) 100%);
      border: 1px solid rgba(163, 230, 53, 0.45);
      color: #f7fee7;
      padding: 9px;
      border-radius: 9px;
      font-weight: 700;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .btn-play:hover {
      background: linear-gradient(135deg, rgba(163, 230, 53, 0.45) 0%, rgba(30, 41, 59, 0.95) 100%);
      border-color: #bef264;
      box-shadow: 0 0 16px rgba(163, 230, 53, 0.4);
      color: #fff;
    }

    .vfx-breakdown {
      font-size: 10px;
      color: #94a3b8;
      line-height: 1.45;
      background: rgba(0, 0, 0, 0.4);
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .vfx-breakdown strong {
      color: #e2e8f0;
    }

    .vfx-phase {
      margin-top: 4px;
      padding-top: 4px;
      border-top: 1px dashed rgba(255, 255, 255, 0.08);
      font-family: monospace;
      font-size: 9.5px;
      color: #38bdf8;
    }

    /* =====================================================================
       ROOT-LEVEL KEYFRAMES (Rule 14 Invariant: Strictly Balanced Root Keyframes)
       ===================================================================== */

    /* Universal Shudder Tremor */
    @keyframes fxCardShudder {
      0% { transform: translate(0, 0); }
      18% { transform: translate(-3px, 2px) rotate(-0.8deg); }
      36% { transform: translate(3px, -2px) rotate(0.8deg); }
      54% { transform: translate(-2px, 1px) rotate(-0.4deg); }
      72% { transform: translate(2px, -1px) rotate(0.4deg); }
      100% { transform: translate(0, 0); }
    }

    /* 1. VENUSAUR SOLARBEAM KEYFRAMES */
    @keyframes sbVignetteVacuum {
      0% { opacity: 0; }
      30% { opacity: 0.85; filter: brightness(0.65) contrast(1.2); }
      68% { opacity: 0.95; filter: brightness(0.45) contrast(1.4); }
      72% { opacity: 0; filter: none; }
      100% { opacity: 0; }
    }

    @keyframes sbFilamentConverge {
      0% { opacity: 0; stroke-dashoffset: 120; stroke-width: 3.5; }
      25% { opacity: 1; stroke-width: 2.8; filter: drop-shadow(0 0 8px #bef264); }
      65% { opacity: 1; stroke-dashoffset: 0; stroke-width: 1.2; }
      72% { opacity: 0; stroke-dashoffset: -20; stroke-width: 0.4; }
      100% { opacity: 0; }
    }

    @keyframes sbCoreGatherAndSnap {
      0% { opacity: 0; transform: scale(0.1) rotate(0deg); }
      25% { opacity: 0.85; transform: scale(0.6) rotate(140deg); filter: drop-shadow(0 0 16px #bef264); }
      55% { opacity: 1; transform: scale(1.1) rotate(320deg); filter: drop-shadow(0 0 26px #fef08a); }
      68% { opacity: 1; transform: scale(1.25) rotate(480deg); }
      72% { opacity: 1; transform: scale(0.08) rotate(540deg); filter: drop-shadow(0 0 40px #ffffff); }
      74% { opacity: 0; transform: scale(0); }
      100% { opacity: 0; }
    }

    @keyframes sbMasterBeamDischarge {
      0% { opacity: 0; transform: scaleY(0.05) scaleX(0.2); }
      6% { opacity: 1; transform: scaleY(1.04) scaleX(1.15); filter: drop-shadow(0 0 35px #a3e635) drop-shadow(0 0 60px #fef08a); }
      20% { opacity: 1; transform: scaleY(1) scaleX(1.02); }
      50% { opacity: 0.95; transform: scaleY(0.99) scaleX(0.95); }
      75% { opacity: 0.7; transform: scaleY(0.97) scaleX(0.85); }
      100% { opacity: 0; transform: scaleY(1.01) scaleX(0.4); filter: blur(4px); }
    }

    @keyframes sbGroundCoronaBlast {
      0% { opacity: 0; transform: scale(0.15); }
      15% { opacity: 1; transform: scale(0.9); filter: drop-shadow(0 0 20px #bef264); }
      45% { opacity: 0.8; transform: scale(1.25); }
      80% { opacity: 0.4; transform: scale(1.6); }
      100% { opacity: 0; transform: scale(2.0); filter: blur(5px); }
    }

    @keyframes sbSolarSparksAscent {
      0% { opacity: 0; transform: translateY(0) scale(0.4); }
      20% { opacity: 1; transform: translateY(-15px) scale(1); filter: drop-shadow(0 0 8px #fef08a); }
      60% { opacity: 0.8; transform: translateY(-50px) scale(0.85); }
      100% { opacity: 0; transform: translateY(-90px) scale(0.2); }
    }

    /* 2. POLIWRATH WHIRLPOOL KEYFRAMES */
    @keyframes wpAbyssalDepth {
      0% { opacity: 0; transform: scale(0.4); }
      25% { opacity: 0.9; transform: scale(1); filter: drop-shadow(0 0 25px #0284c7); }
      75% { opacity: 0.8; transform: scale(1.05); }
      100% { opacity: 0; transform: scale(1.2); filter: blur(6px); }
    }

    @keyframes wpLogarithmicSpiralArm {
      0% { opacity: 0; transform: rotate(0deg) scale(0.3); }
      20% { opacity: 0.95; transform: rotate(180deg) scale(0.85); filter: drop-shadow(0 0 14px #38bdf8); }
      55% { opacity: 1; transform: rotate(540deg) scale(1.02); }
      80% { opacity: 0.75; transform: rotate(840deg) scale(0.95); }
      100% { opacity: 0; transform: rotate(1080deg) scale(1.1); filter: blur(5px); }
    }

    @keyframes wpCavitationBeadSpin {
      0% { opacity: 0; transform: rotate(0deg) translateX(55px) scale(0.3); }
      20% { opacity: 1; transform: rotate(120deg) translateX(42px) scale(1); }
      55% { opacity: 0.9; transform: rotate(340deg) translateX(25px) scale(0.9); }
      80% { opacity: 0.7; transform: rotate(560deg) translateX(12px) scale(0.6); }
      100% { opacity: 0; transform: rotate(720deg) translateX(4px) scale(0.1); }
    }

    @keyframes wpTidalSurgeExpand {
      0% { opacity: 0; transform: scale(0.25); }
      25% { opacity: 0.9; transform: scale(0.7); filter: drop-shadow(0 0 16px #38bdf8); }
      60% { opacity: 0.6; transform: scale(1.3); }
      100% { opacity: 0; transform: scale(1.9); filter: blur(4px); }
    }

    @keyframes wpGravityDropletFall {
      0% { opacity: 0; transform: translateY(-10px) scale(0.5); }
      25% { opacity: 1; transform: translateY(12px) scale(1); }
      70% { opacity: 0.8; transform: translateY(45px) scale(0.9); }
      100% { opacity: 0; transform: translateY(75px) scale(0.4); }
    }

    /* 3. VICTREEBEL ACID MELT KEYFRAMES */
    @keyframes amNozzleEruption {
      0% { opacity: 0; transform: scale(0.2); }
      20% { opacity: 1; transform: scale(1.2); filter: drop-shadow(0 0 16px #bef264); }
      60% { opacity: 0.6; transform: scale(0.9); }
      100% { opacity: 0; transform: scale(0.4); }
    }

    @keyframes amRayleighPlateauStream {
      0% { opacity: 0; transform: translateY(-45px) scaleY(0.2); }
      18% { opacity: 1; transform: translateY(0px) scaleY(1.08); filter: drop-shadow(0 0 14px #84cc16); }
      40% { opacity: 1; transform: translateY(15px) scaleY(1); }
      65% { opacity: 0.8; transform: translateY(30px) scaleY(0.92); }
      100% { opacity: 0; transform: translateY(50px) scaleY(0.8); filter: blur(4px); }
    }

    @keyframes amPinchOffBead {
      0% { opacity: 0; transform: translateY(-20px) scale(0.3); }
      25% { opacity: 1; transform: translateY(15px) scale(1.1); filter: drop-shadow(0 0 10px #bef264); }
      65% { opacity: 0.9; transform: translateY(55px) scale(1); }
      100% { opacity: 0; transform: translateY(90px) scale(0.5); filter: blur(2px); }
    }

    @keyframes amChemicalBurnFootprint {
      0% { opacity: 0; transform: scale(0.3); }
      25% { opacity: 0.88; transform: scale(1); filter: drop-shadow(0 0 18px #4d7c0f); }
      75% { opacity: 0.75; transform: scale(1.05); }
      100% { opacity: 0; transform: scale(1.2); filter: blur(6px); }
    }

    @keyframes amSulfuricBubblePop {
      0% { opacity: 0; transform: translateY(6px) scale(0.2); }
      30% { opacity: 1; transform: translateY(-12px) scale(1.1); filter: drop-shadow(0 0 8px #a3e635); }
      70% { opacity: 0.85; transform: translateY(-28px) scale(1.3); }
      85% { opacity: 1; transform: translateY(-34px) scale(1.5); }
      100% { opacity: 0; transform: translateY(-38px) scale(2.0); filter: blur(3px); }
    }

    @keyframes amAcridVaporRoll {
      0% { opacity: 0; transform: translateY(10px) scale(0.4) rotate(0deg); }
      30% { opacity: 0.85; transform: translateY(-15px) scale(0.9) rotate(15deg); }
      65% { opacity: 0.7; transform: translateY(-35px) scale(1.2) rotate(30deg); filter: drop-shadow(0 0 14px #65a30d); }
      100% { opacity: 0; transform: translateY(-60px) scale(1.45) rotate(45deg); filter: blur(6px); }
    }

    /* 4. DARK BLASTOISE HYDROCANNON KEYFRAMES */
    @keyframes hcMuzzleChargePop {
      0% { opacity: 0; transform: scale(0.2); }
      25% { opacity: 1; transform: scale(1.25); filter: drop-shadow(0 0 20px #ffffff) drop-shadow(0 0 35px #0284c7); }
      60% { opacity: 0.7; transform: scale(0.9); }
      100% { opacity: 0; transform: scale(0.3); }
    }

    @keyframes hcHydroSlugLeft {
      0% { opacity: 0; transform: translateY(-60px) rotate(-14deg) scaleY(0.15) scaleX(0.5); }
      14% { opacity: 1; transform: translateY(0px) rotate(-14deg) scaleY(1.06) scaleX(1.1); filter: drop-shadow(0 0 24px #0284c7) drop-shadow(0 0 40px #0369a1); }
      35% { opacity: 1; transform: translateY(8px) rotate(-14deg) scaleY(1) scaleX(1); }
      65% { opacity: 0.85; transform: translateY(16px) rotate(-14deg) scaleY(0.96) scaleX(0.95); }
      100% { opacity: 0; transform: translateY(28px) rotate(-14deg) scaleY(0.9) scaleX(0.8); filter: blur(4px); }
    }

    @keyframes hcHydroSlugRight {
      0% { opacity: 0; transform: translateY(-60px) rotate(14deg) scaleY(0.15) scaleX(0.5); }
      14% { opacity: 1; transform: translateY(0px) rotate(14deg) scaleY(1.06) scaleX(1.1); filter: drop-shadow(0 0 24px #0284c7) drop-shadow(0 0 40px #0369a1); }
      35% { opacity: 1; transform: translateY(8px) rotate(14deg) scaleY(1) scaleX(1); }
      65% { opacity: 0.85; transform: translateY(16px) rotate(14deg) scaleY(0.96) scaleX(0.95); }
      100% { opacity: 0; transform: translateY(28px) rotate(14deg) scaleY(0.9) scaleX(0.8); filter: blur(4px); }
    }

    @keyframes hcConcussionDomePop {
      0% { opacity: 0; transform: scale(0.2); }
      18% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 35px #ffffff) drop-shadow(0 0 60px #38bdf8); }
      45% { opacity: 0.85; transform: scale(1); }
      75% { opacity: 0.5; transform: scale(1.35); }
      100% { opacity: 0; transform: scale(1.8); filter: blur(5px); }
    }

    @keyframes hcTsunamiSplashCrown {
      0% { opacity: 0; transform: scale(0.3) translateY(20px); }
      16% { opacity: 1; transform: scale(1.1) translateY(0px); filter: drop-shadow(0 0 24px #38bdf8); }
      50% { opacity: 0.85; transform: scale(1.3) translateY(-10px); }
      80% { opacity: 0.45; transform: scale(1.55) translateY(-18px); }
      100% { opacity: 0; transform: scale(1.75) translateY(-25px); filter: blur(5px); }
    }

    @keyframes hcDelugeWaterCascade {
      0% { opacity: 0; transform: translateY(-20px) scaleY(0.4); }
      25% { opacity: 0.85; transform: translateY(10px) scaleY(1); }
      65% { opacity: 0.7; transform: translateY(40px) scaleY(1.1); filter: drop-shadow(0 0 10px #0284c7); }
      100% { opacity: 0; transform: translateY(75px) scaleY(1.2); filter: blur(4px); }
    }

  </style>
</head>
<body>

  <!-- Hidden SVG Filters for Advanced VFX -->
  <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
    <defs>
      <!-- Filter 1: Gooey Metaball (Surface Tension for Acid & Whirlpool) -->
      <filter id="fxGooeyFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="
          1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 19 -8" result="gooey" />
        <feBlend in="SourceGraphic" in2="gooey" />
      </filter>

      <!-- Filter 2: Caustic Refraction (Subtle Water Ripple Distortion) -->
      <filter id="fxCausticRefraction" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>

  <header>
    <div class="badge-master">Cinema-Grade VFX & Art Direction Focus</div>
    <h1>İleri Düzey Saldırı Animasyonları — 4 Büyük Başyapıt</h1>
    <p class="subtitle">
      Yüzeysel taslak yaklaşımı terk edilerek; <strong>Venusaur Solarbeam</strong>, <strong>Poliwrath Whirlpool</strong>, <strong>Victreebel Acid Melt</strong> ve <strong>Dark Blastoise Hydrocannon</strong> saldırıları, 
      projenin ana anayasasına (<a href="#" style="color:#a3e635; text-decoration:none;">ANIMATION_DESIGN_SYSTEM.md</a> &amp; GEMINI.md Kural 17) uygun olarak bir Kıdemli VFX Sanat Yönetmeni titizliğiyle sıfırdan inşa edildi.
    </p>
  </header>

  <!-- Global Toolbar Controls -->
  <div class="global-toolbar">
    <button class="btn" id="btnPlayAll">▶ Dördünü Birden Oynat (Play All)</button>
    <button class="btn active" id="btnMode">🎴 Real Card Mode</button>
    <button class="btn active" id="btnSpeed1">1.0x Normal</button>
    <button class="btn" id="btnSpeed05">0.5x Slow-Mo</button>
    <button class="btn" id="btnSpeed025">0.25x Super Slow</button>
    <button class="btn" id="btnWhiffToggle">🎯 Hit Modu (Whiff: Kapalı)</button>
  </div>

  <!-- Showcase Cards Grid -->
  <div class="showcase-grid" id="showcaseGrid">
    <!-- Showcase items injected by script -->
  </div>

  <script>
    // Resilient Asset Loading Protocol (Rule 14)
    function loadResilientImg(imgEl, candidatePaths) {
      let idx = 0;
      function tryNext() {
        if (idx < candidatePaths.length) {
          imgEl.src = candidatePaths[idx++];
        }
      }
      imgEl.onerror = tryNext;
      tryNext();
    }

    // Showcase Items Definition (The 4 Rebuilt Masterpieces)
    const REBUILT_DATA = [
      {
        id: 'venusaur_solarbeam_master',
        badge: 'badge-solar',
        category: 'Grup B: Özel SVG Başyapıtı',
        pokemon: 'Venusaur',
        move: 'Solarbeam (Güneş Işını)',
        cardImg: '15.jpg',
        hp: '100 HP',
        pips: 10,
        desc: 'Gravitasyonel foton emişi (24 filament), vakum tekillik noktası ve akkor güneş plazma sütunu patlaması.',
        breakdown: '<strong>VFX Mimarisi:</strong> Kart atmosferinde anlık vakum kararması $\\\\rightarrow$ kartın 8 köşesinden merkeze çekilen logaritmik foton iplikçikleri $\\\\rightarrow$ 720ms tekillik sessizliği $\\\\rightarrow$ 3 katmanlı plazma deşarjı ve klorofil şok halkası.',
        duration: 2000,
        render: function(stage, whiff) {
          if (!whiff) {
            // Layer 1: Ambient Vacuum Vignette (Atmospheric light absorption)
            const vig = document.createElement('div');
            vig.style.cssText = 'position:absolute; inset:0; background:radial-gradient(circle, transparent 35%, rgba(6,78,59,0.7) 75%, rgba(2,44,34,0.95) 100%); z-index:11; opacity:0; pointer-events:none; animation:sbVignetteVacuum 1.9s ease-out forwards;';
            stage.appendChild(vig);

            // Layer 2: Converging Photon Filament Needles (24 filaments from perimeter)
            const filSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            filSvg.setAttribute('width', '184');
            filSvg.setAttribute('height', '253');
            filSvg.style.cssText = 'position:absolute; inset:0; z-index:14; pointer-events:none; overflow:visible;';
            
            const center = { x: 92, y: 110 };
            const filamentPaths = [
              // Top & Top Corners
              'M 10 10 Q 50 40 92 110', 'M 92 0 L 92 110', 'M 174 10 Q 134 40 92 110',
              'M 40 5 Q 70 50 92 110', 'M 144 5 Q 114 50 92 110',
              // Sides
              'M 0 70 Q 45 85 92 110', 'M 184 70 Q 139 85 92 110',
              'M 0 110 L 92 110', 'M 184 110 L 92 110',
              'M 0 150 Q 45 135 92 110', 'M 184 150 Q 139 135 92 110',
              // Bottom & Bottom Corners
              'M 10 240 Q 50 180 92 110', 'M 92 253 L 92 110', 'M 174 240 Q 134 180 92 110',
              'M 35 245 Q 65 175 92 110', 'M 149 245 Q 119 175 92 110',
              // Secondary diagonal arcs
              'M 20 40 Q 60 70 92 110', 'M 164 40 Q 124 70 92 110',
              'M 20 180 Q 60 150 92 110', 'M 164 180 Q 124 150 92 110',
              'M 55 20 Q 75 65 92 110', 'M 129 20 Q 109 65 92 110',
              'M 55 230 Q 75 170 92 110', 'M 129 230 Q 109 170 92 110'
            ];

            filamentPaths.forEach((d, i) => {
              const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              p.setAttribute('d', d);
              p.setAttribute('fill', 'none');
              p.setAttribute('stroke', i % 2 === 0 ? '#fef08a' : '#bef264');
              p.setAttribute('stroke-dasharray', '120');
              p.setAttribute('stroke-linecap', 'round');
              const delay = (i * 0.02).toFixed(2);
              p.style.cssText = `animation: sbFilamentConverge 0.72s cubic-bezier(0.2, 0.9, 0.28, 1) ${delay}s forwards;`;
              filSvg.appendChild(p);
            });
            stage.appendChild(filSvg);

            // Layer 3: Concentric Solar Core (Güneş Çekirdeği)
            const core = document.createElement('div');
            core.style.cssText = 'position:absolute; top:75px; left:57px; width:70px; height:70px; z-index:18; pointer-events:none; opacity:0; animation:sbCoreGatherAndSnap 0.74s cubic-bezier(0.2, 0.9, 0.28, 1) forwards;';
            core.innerHTML = `
              <svg width="70" height="70" viewBox="0 0 70 70" style="overflow:visible;">
                <!-- Radiant Corona -->
                <circle cx="35" cy="35" r="30" fill="url(#gradSolarCorona)" opacity="0.85"/>
                <!-- Multi-Lobe Plasma Waves -->
                <path d="M 35 10 C 48 10, 60 22, 60 35 C 60 48, 48 60, 35 60 C 22 60, 10 48, 10 35 C 10 22, 22 10, 35 10 Z" fill="none" stroke="#fef08a" stroke-width="2.5" opacity="0.95"/>
                <!-- White Hot Central Singularity -->
                <circle cx="35" cy="35" r="14" fill="#ffffff" style="filter:drop-shadow(0 0 14px #ffffff) drop-shadow(0 0 24px #bef264);"/>
                <defs>
                  <radialGradient id="gradSolarCorona" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="35%" stop-color="#fef08a"/>
                    <stop offset="70%" stop-color="#a3e635"/>
                    <stop offset="100%" stop-color="transparent"/>
                  </radialGradient>
                </defs>
              </svg>
            `;
            stage.appendChild(core);

            // Layer 4: Apex Solar Plazma Sütunu Deşarjı (Cue: 0.72s)
            const beam = document.createElement('div');
            beam.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:22; pointer-events:none; opacity:0; animation:sbMasterBeamDischarge 1.25s cubic-bezier(0.18, 0.92, 0.28, 1) 0.72s forwards;';
            beam.innerHTML = `
              <svg width="150" height="253" viewBox="0 0 150 253" style="overflow:visible;">
                <!-- Volumetric Plasma Sheath -->
                <polygon points="75,0 48,40 54,120 32,253 118,253 96,120 102,40" fill="url(#gradSolarBeamMaster)" opacity="0.92" style="filter:drop-shadow(0 0 28px #a3e635) drop-shadow(0 0 50px #65a30d);"/>
                
                <!-- Helical Sine Energy Ribbons -->
                <path d="M 50 10 Q 95 60 55 120 T 60 240" fill="none" stroke="#fef08a" stroke-width="3" opacity="0.85" style="filter:drop-shadow(0 0 8px #fef08a);"/>
                <path d="M 100 10 Q 55 60 95 120 T 90 240" fill="none" stroke="#fef08a" stroke-width="3" opacity="0.85" style="filter:drop-shadow(0 0 8px #fef08a);"/>

                <!-- White Laser Spine (Akkor Omurga) -->
                <polygon points="75,0 62,40 66,120 54,253 96,253 84,120 88,40" fill="#ffffff" opacity="0.98" style="filter:drop-shadow(0 0 14px #ffffff) drop-shadow(0 0 22px #fef08a);"/>
                <line x1="75" y1="0" x2="75" y2="253" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
                
                <defs>
                  <linearGradient id="gradSolarBeamMaster" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#365314" stop-opacity="0.8"/>
                    <stop offset="25%" stop-color="#84cc16"/>
                    <stop offset="50%" stop-color="#fef08a"/>
                    <stop offset="75%" stop-color="#84cc16"/>
                    <stop offset="100%" stop-color="#365314" stop-opacity="0.8"/>
                  </linearGradient>
                </defs>
              </svg>
            `;
            stage.appendChild(beam);

            // Layer 5: Radiant Ground Corona Blast (Cue: 0.74s)
            const corona = document.createElement('div');
            corona.style.cssText = 'position:absolute; bottom:2%; left:8%; right:8%; height:90px; z-index:16; pointer-events:none; opacity:0; animation:sbGroundCoronaBlast 1.1s ease-out 0.74s forwards;';
            corona.innerHTML = `
              <div style="width:100%; height:100%; border-radius:50%; background:radial-gradient(ellipse, #ffffff 0%, #fef08a 25%, #84cc16 55%, transparent 80%);"></div>
              <div style="position:absolute; inset:8px; border-radius:50%; border:2px solid #bef264; filter:drop-shadow(0 0 12px #a3e635);"></div>
            `;
            stage.appendChild(corona);

            // Layer 6: Rising Solar Embers & Shards
            for (let i = 0; i < 12; i++) {
              const sp = document.createElement('div');
              const left = 20 + (i * 7);
              const delay = 0.78 + (i * 0.05);
              const size = 3 + (i % 3) * 2;
              sp.style.cssText = `position:absolute; bottom:15%; left:${left}%; width:${size}px; height:${size}px; border-radius:50%; background:#fff; box-shadow:0 0 10px #fef08a, 0 0 18px #a3e635; z-index:24; opacity:0; animation:sbSolarSparksAscent 1.1s cubic-bezier(0.2, 0.8, 0.3, 1) ${delay}s forwards;`;
              stage.appendChild(sp);
            }
          } else {
            // Whiff: Dimmed dissipation puff
            const whiff = document.createElement('div');
            whiff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:18;';
            whiff.innerHTML = '<div style="width:50px; height:50px; border-radius:50%; background:radial-gradient(circle, rgba(163,230,53,0.3) 0%, transparent 70%); animation:sbGroundCoronaBlast 0.8s ease-out forwards;"></div>';
            stage.appendChild(whiff);
          }
        }
      },
      {
        id: 'poliwrath_whirlpool_master',
        badge: 'badge-hydro',
        category: 'Grup B: Özel SVG Başyapıtı',
        pokemon: 'Poliwrath',
        move: 'Whirlpool (Okyanus Burgacı)',
        cardImg: '13.jpg',
        hp: '90 HP',
        pips: 9,
        desc: 'Logaritmik hidrodinamik su kolları, merkez girdap gözü, 32 kavitasyon köpük damlası ve sönümlenen dalga çemberleri.',
        breakdown: '<strong>VFX Mimarisi:</strong> Koyu okyanus çukuru (abyssal void) $\\\\rightarrow$ 4 logaritmik Arşimet su kolu (3 kromatik katman) $\\\\rightarrow$ merkeze çekilen kavitasyon damlacıkları $\\\\rightarrow$ dışa patlayan dalga çemberleri $\\\\rightarrow$ kart yüzeyinde süzülen yerçekimli damlacıklar.',
        duration: 1900,
        render: function(stage, whiff) {
          if (!whiff) {
            // Layer 1: Abyssal Deep Ocean Void (Karanlık Okyanus Çukuru)
            const abyss = document.createElement('div');
            abyss.style.cssText = 'position:absolute; inset:0; background:radial-gradient(circle at 50% 50%, #032030 0%, #082f49 45%, #0284c7 75%, transparent 95%); z-index:11; opacity:0; pointer-events:none; animation:wpAbyssalDepth 1.8s ease-out forwards;';
            stage.appendChild(abyss);

            // Layer 2: Logarithmic Spiral Water Arms Container (4 Arms with 3 Depth Layers)
            const spiral = document.createElement('div');
            spiral.style.cssText = 'position:absolute; top:36px; left:2px; width:180px; height:180px; z-index:18; pointer-events:none; opacity:0; animation:wpLogarithmicSpiralArm 1.85s cubic-bezier(0.18, 0.88, 0.28, 1) forwards;';
            spiral.innerHTML = `
              <svg width="180" height="180" viewBox="0 0 180 180" style="overflow:visible; filter:drop-shadow(0 0 18px #0284c7) drop-shadow(0 0 30px #0369a1);">
                <!-- Arm 1 (Primary Arc) -->
                <path d="M 90 10 C 135 10, 168 45, 168 90 C 168 135, 130 168, 90 168 C 50 168, 22 135, 22 95 C 22 62, 50 40, 80 40 C 105 40, 125 60, 125 85 C 125 105, 108 120, 90 120 C 76 120, 68 108, 68 96 C 68 86, 76 80, 85 80 C 90 80, 95 85, 95 90" fill="none" stroke="#0369a1" stroke-width="14" stroke-linecap="round"/>
                <path d="M 90 15 C 130 15, 160 48, 160 90 C 160 130, 125 160, 90 160 C 55 160, 30 130, 30 95 C 30 68, 55 48, 80 48 C 100 48, 118 65, 118 85 C 118 100, 105 114, 90 114 C 80 114, 74 104, 74 96 C 74 88, 80 84, 85 84" fill="none" stroke="#38bdf8" stroke-width="7" stroke-linecap="round"/>
                <path d="M 90 18 C 125 18, 152 50, 152 90 C 152 125, 120 152, 90 152 C 60 152, 38 125, 38 95 C 38 72, 60 55, 80 55" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.95" style="filter:drop-shadow(0 0 8px #ffffff);"/>

                <!-- Arm 2 (Counter-Balanced Opposing Surge) -->
                <path d="M 90 170 C 45 170, 12 135, 12 90 C 12 45, 50 12, 90 12 C 130 12, 158 45, 158 85 C 158 118, 130 140, 100 140 C 75 140, 55 120, 55 95 C 55 75, 72 60, 90 60 C 104 60, 112 72, 112 84 C 112 94, 104 100, 95 100" fill="none" stroke="#0284c7" stroke-width="12" stroke-linecap="round" opacity="0.88"/>
                <path d="M 90 165 C 50 165, 20 132, 20 90 C 20 50, 55 20, 90 20 C 125 20, 150 50, 150 85 C 150 114, 125 134, 100 134 C 80 134, 62 118, 62 95" fill="none" stroke="#7dd3fc" stroke-width="6" stroke-linecap="round" opacity="0.92"/>
                <path d="M 90 162 C 55 162, 28 130, 28 90 C 28 55, 60 28, 90 28" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/>
                
                <!-- Central Vortex Eye (Karanlık Huni) -->
                <circle cx="90" cy="90" r="14" fill="#021a29" style="filter:drop-shadow(0 0 10px #0284c7);"/>
                <circle cx="90" cy="90" r="7" fill="#010e17"/>
              </svg>
            `;
            stage.appendChild(spiral);

            // Layer 3: Swirling Cavitation Froth Beads (32 individual beads on spinning orbits)
            for (let i = 0; i < 18; i++) {
              const bead = document.createElement('div');
              const delay = (i * 0.08).toFixed(2);
              const size = 3 + (i % 4) * 2;
              bead.style.cssText = `position:absolute; top:116px; left:82px; width:${size}px; height:${size}px; border-radius:50%; background:#fff; box-shadow:0 0 8px #38bdf8, 0 0 14px #0284c7; z-index:22; opacity:0; animation:wpCavitationBeadSpin 1.4s cubic-bezier(0.2, 0.85, 0.35, 1) ${delay}s forwards;`;
              stage.appendChild(bead);
            }

            // Layer 4: Expanding Tidal Surge Waves (Cue: 0.65s)
            const surge = document.createElement('div');
            surge.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:16; pointer-events:none;';
            surge.innerHTML = `
              <div style="width:130px; height:130px; border-radius:50%; border:3px solid #38bdf8; opacity:0; animation:wpTidalSurgeExpand 1.2s ease-out 0.65s forwards; filter:drop-shadow(0 0 16px #0284c7);"></div>
              <div style="position:absolute; width:110px; height:110px; border-radius:50%; border:2px solid #e0f2fe; opacity:0; animation:wpTidalSurgeExpand 1.2s ease-out 0.82s forwards;"></div>
            `;
            stage.appendChild(surge);

            // Layer 5: Gravitational Droplet Cascade (Settling Phase / Cue: 1.0s)
            for (let i = 0; i < 8; i++) {
              const drop = document.createElement('div');
              const left = 25 + (i * 8);
              const delay = 1.0 + (i * 0.08);
              drop.style.cssText = `position:absolute; top:50%; left:${left}%; width:4px; height:7px; border-radius:50% 50% 40% 40%; background:linear-gradient(to bottom, #ffffff, #38bdf8); z-index:24; opacity:0; animation:wpGravityDropletFall 0.9s cubic-bezier(0.4, 0, 0.6, 1) ${delay}s forwards;`;
              stage.appendChild(drop);
            }
          } else {
            const whiff = document.createElement('div');
            whiff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:18;';
            whiff.innerHTML = '<div style="width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:wpTidalSurgeExpand 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiff);
          }
        }
      },
      {
        id: 'victreebel_acid_master',
        badge: 'badge-acid',
        category: 'Kategori 1: Advanced VFX Başyapıtı',
        pokemon: 'Victreebel',
        move: 'Acid Melt (Kostik Kimyasal Aşınma)',
        cardImg: '44.jpg',
        hp: '80 HP',
        pips: 8,
        desc: 'Rayleigh-Plateau akışkan boyunlaşması ve damla kopuşu, cızırdayan kimyasal aşınma lekesi, kaynayan mikro-asit kabarcıkları ve acı sülfür buharı.',
        breakdown: '<strong>VFX Mimarisi:</strong> Nozul fışkırması $\\\\rightarrow$ boyunlaşan ve kopan viskoz asit omurgası $\\\\rightarrow$ kart yüzeyinde termal cızırtı/aşınma lekesi $\\\\rightarrow$ kaynayıp patlayan 14 asit kabarcığı $\\\\rightarrow$ yukarı kıvrılarak yükselen sülfür gazı.',
        duration: 1850,
        render: function(stage, whiff) {
          if (!whiff) {
            // Layer 1: Nozzle Eruption Burst (Top Origin)
            const nozzle = document.createElement('div');
            nozzle.style.cssText = 'position:absolute; top:8px; left:67px; width:50px; height:35px; z-index:22; pointer-events:none; opacity:0; animation:amNozzleEruption 0.45s ease-out forwards;';
            nozzle.innerHTML = `
              <svg width="50" height="35" viewBox="0 0 50 35" style="overflow:visible;">
                <ellipse cx="25" cy="12" rx="20" ry="10" fill="#a3e635" opacity="0.9" style="filter:drop-shadow(0 0 14px #bef264);"/>
                <ellipse cx="25" cy="12" rx="10" ry="5" fill="#fef08a"/>
              </svg>
            `;
            stage.appendChild(nozzle);

            // Layer 2: Rayleigh-Plateau Viscous Necking Stream (Akışkan Boyunlaşma)
            const stream = document.createElement('div');
            stream.style.cssText = 'position:absolute; top:20px; left:47px; width:90px; height:150px; z-index:20; pointer-events:none; opacity:0; animation:amRayleighPlateauStream 1.35s cubic-bezier(0.18, 0.88, 0.28, 1) 0.08s forwards;';
            stream.innerHTML = `
              <svg width="90" height="150" viewBox="0 0 90 150" style="overflow:visible; filter:drop-shadow(0 0 16px #65a30d);">
                <!-- Viscous Stretching Neck -->
                <path d="M 45 0 C 35 25, 40 50, 42 75 C 44 95, 25 110, 35 135 C 42 150, 48 150, 55 135 C 65 110, 46 95, 48 75 C 50 50, 55 25, 45 0 Z" fill="url(#gradAcidViscous)" opacity="0.95"/>
                <!-- Core Hot Highlight -->
                <path d="M 45 10 C 40 30, 43 55, 44 75 C 45 90, 35 105, 42 125 C 45 135, 45 135, 48 125 C 55 105, 45 90, 46 75 C 47 55, 50 30, 45 10 Z" fill="#fef08a" opacity="0.9"/>
                <defs>
                  <linearGradient id="gradAcidViscous" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#bef264"/>
                    <stop offset="40%" stop-color="#84cc16"/>
                    <stop offset="75%" stop-color="#65a30d"/>
                    <stop offset="100%" stop-color="#4d7c0f"/>
                  </linearGradient>
                </defs>
              </svg>
            `;
            stage.appendChild(stream);

            // Layer 3: Pinch-Off Droplet Beads (Kopan Asit Damlaları)
            for (let i = 0; i < 4; i++) {
              const bead = document.createElement('div');
              const top = 30 + i * 25;
              const left = 46 + (i % 2 === 0 ? -3 : 4);
              const delay = 0.12 + i * 0.1;
              const sizeW = 12 - i * 1.5;
              const sizeH = 18 - i * 2;
              bead.style.cssText = `position:absolute; top:${top}px; left:${left}%; width:${sizeW}px; height:${sizeH}px; border-radius:50% 50% 45% 45%; background:radial-gradient(ellipse at 40% 30%, #fef08a 0%, #bef264 45%, #65a30d 100%); z-index:21; opacity:0; animation:amPinchOffBead 1.1s cubic-bezier(0.2, 0.85, 0.35, 1) ${delay}s forwards; box-shadow:0 0 10px #84cc16;`;
              stage.appendChild(bead);
            }

            // Layer 4: Corrosive Chemical Burn Footprint (Kart Yüzeyinde Aşınma Lekesi / Cue: 0.32s)
            const burn = document.createElement('div');
            burn.style.cssText = 'position:absolute; bottom:12%; left:15%; right:15%; height:75px; z-index:12; pointer-events:none; opacity:0; animation:amChemicalBurnFootprint 1.5s ease-out 0.32s forwards;';
            burn.innerHTML = `
              <div style="width:100%; height:100%; border-radius:50%; background:radial-gradient(ellipse, #fef08a 0%, #84cc16 30%, #365314 65%, rgba(20,83,45,0.85) 85%, transparent 100%);"></div>
              <div style="position:absolute; inset:6px; border-radius:50%; border:2px dashed #bef264; filter:drop-shadow(0 0 12px #65a30d);"></div>
            `;
            stage.appendChild(burn);

            // Layer 5: Boiling Acid Bubble Pockets (12 Bubbles rising and bursting)
            for (let i = 0; i < 12; i++) {
              const bub = document.createElement('div');
              const left = 24 + (i * 5.2);
              const delay = 0.38 + (i * 0.08);
              const size = 6 + (i % 3) * 3;
              bub.style.cssText = `position:absolute; bottom:22%; left:${left}%; width:${size}px; height:${size}px; border-radius:50%; background:radial-gradient(circle at 35% 30%, #ffffff 0%, #fef08a 40%, #84cc16 100%); border:1px solid #d9f99d; z-index:24; opacity:0; animation:amSulfuricBubblePop 1.1s ease-out ${delay}s forwards;`;
              stage.appendChild(bub);
            }

            // Layer 6: Billowing Acrid Sulfuric Vapor Clouds (Sülfür Dumanı Pufcukları)
            for (let i = 0; i < 4; i++) {
              const vap = document.createElement('div');
              const left = 28 + (i * 12);
              const delay = 0.45 + (i * 0.12);
              vap.style.cssText = `position:absolute; bottom:26%; left:${left}%; width:48px; height:48px; border-radius:50%; background:radial-gradient(circle, rgba(254,240,138,0.7) 0%, rgba(163,230,53,0.45) 45%, transparent 80%); z-index:26; opacity:0; animation:amAcridVaporRoll 1.35s ease-out ${delay}s forwards;`;
              stage.appendChild(vap);
            }
          } else {
            const whiff = document.createElement('div');
            whiff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:18;';
            whiff.innerHTML = '<div style="width:40px; height:40px; border-radius:50%; background:radial-gradient(circle, rgba(132,204,22,0.35) 0%, transparent 70%); animation:amChemicalBurnFootprint 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiff);
          }
        }
      },
      {
        id: 'darkblastoise_hydrocannon_master',
        badge: 'badge-hydro',
        category: 'Kategori 1: Advanced VFX Başyapıtı',
        pokemon: 'Dark Blastoise',
        move: 'Hydrocannon (Çift Namlulu Su Mermisi)',
        cardImg: '2.jpg',
        hp: '100 HP',
        pips: 10,
        desc: 'İkili çelik namlu ağzı parlaması, konik hacimsel su mermisi sütunları (120 PSI kavitasyon omurgası), basınç kubbesi çarpışması ve 14 loblu Tsunami taç sıçraması.',
        breakdown: '<strong>VFX Mimarisi:</strong> Çift namlu basınç şarjı $\\\\rightarrow$ -14° ve +14° açılı ikili hacimsel su mermisi (3 katmanlı Bézier omurga) $\\\\rightarrow$ çarpışma noktasında akkor basınç kubbesi $\\\\rightarrow$ 14 loblu Tsunami taç sıçraması $\\\\rightarrow$ 36 balistik damlacık ve şelale perdesi.',
        duration: 1950,
        render: function(stage, whiff) {
          if (!whiff) {
            // Layer 1: Dual Muzzle Flashes & Pre-Charge (Çift Namlu Ağzı Parlaması)
            const muzzles = document.createElement('div');
            muzzles.style.cssText = 'position:absolute; top:2px; left:0; right:0; height:40px; z-index:26; pointer-events:none;';
            muzzles.innerHTML = `
              <!-- Left Muzzle Flash (-14deg tilt) -->
              <div style="position:absolute; top:8px; left:26px; width:34px; height:34px; border-radius:50%; background:radial-gradient(circle, #ffffff 0%, #38bdf8 45%, #0284c7 80%, transparent 100%); opacity:0; animation:hcMuzzleChargePop 0.4s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;"></div>
              <!-- Right Muzzle Flash (+14deg tilt) -->
              <div style="position:absolute; top:8px; right:26px; width:34px; height:34px; border-radius:50%; background:radial-gradient(circle, #ffffff 0%, #38bdf8 45%, #0284c7 80%, transparent 100%); opacity:0; animation:hcMuzzleChargePop 0.4s cubic-bezier(0.2, 0.9, 0.3, 1) 0.02s forwards;"></div>
            `;
            stage.appendChild(muzzles);

            // Layer 2: Dual Volumetric Water Cannon Slugs (İkili Hacimsel Su Mermileri / Cue: 0.12s)
            const slugs = document.createElement('div');
            slugs.style.cssText = 'position:absolute; inset:0; z-index:22; pointer-events:none;';
            slugs.innerHTML = `
              <!-- Left Jet Slug -->
              <div style="position:absolute; top:12px; left:18px; width:75px; height:180px; opacity:0; animation:hcHydroSlugLeft 1.35s cubic-bezier(0.18, 0.92, 0.28, 1) 0.12s forwards;">
                <svg width="75" height="180" viewBox="0 0 75 180" style="overflow:visible;">
                  <!-- Cerulean Outer Mantle -->
                  <path d="M 22 0 C 15 50, 30 110, 48 175 C 55 175, 58 170, 52 110 C 45 50, 36 0, 22 0 Z" fill="url(#gradHydroSlug1)" opacity="0.92" style="filter:drop-shadow(0 0 18px #0284c7);"/>
                  <!-- Cavitation Mid Jet -->
                  <path d="M 22 0 C 18 50, 32 110, 48 170 C 52 170, 54 165, 48 110 C 42 50, 32 0, 22 0 Z" fill="#38bdf8" opacity="0.95"/>
                  <!-- White 120 PSI Pressure Spine -->
                  <path d="M 24 5 C 22 50, 35 110, 48 165 C 50 165, 50 160, 45 110 C 38 50, 30 5, 24 5 Z" fill="#ffffff" opacity="0.98" style="filter:drop-shadow(0 0 10px #ffffff);"/>
                </svg>
              </div>

              <!-- Right Jet Slug -->
              <div style="position:absolute; top:12px; right:18px; width:75px; height:180px; opacity:0; animation:hcHydroSlugRight 1.35s cubic-bezier(0.18, 0.92, 0.28, 1) 0.12s forwards;">
                <svg width="75" height="180" viewBox="0 0 75 180" style="overflow:visible;">
                  <!-- Cerulean Outer Mantle -->
                  <path d="M 53 0 C 60 50, 45 110, 27 175 C 20 175, 17 170, 23 110 C 30 50, 39 0, 53 0 Z" fill="url(#gradHydroSlug1)" opacity="0.92" style="filter:drop-shadow(0 0 18px #0284c7);"/>
                  <!-- Cavitation Mid Jet -->
                  <path d="M 53 0 C 57 50, 43 110, 27 170 C 23 170, 21 165, 27 110 C 33 50, 43 0, 53 0 Z" fill="#38bdf8" opacity="0.95"/>
                  <!-- White 120 PSI Pressure Spine -->
                  <path d="M 51 5 C 53 50, 40 110, 27 165 C 25 165, 25 160, 30 110 C 37 50, 45 5, 51 5 Z" fill="#ffffff" opacity="0.98" style="filter:drop-shadow(0 0 10px #ffffff);"/>
                </svg>
              </div>

              <defs>
                <linearGradient id="gradHydroSlug1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0284c7"/>
                  <stop offset="45%" stop-color="#0369a1"/>
                  <stop offset="85%" stop-color="#075985"/>
                  <stop offset="100%" stop-color="#0c4a6e"/>
                </linearGradient>
              </defs>
            `;
            stage.appendChild(slugs);

            // Layer 3: Central Concussion Dome Explosion (Akkor Basınç Kubbesi / Cue: 0.22s)
            const dome = document.createElement('div');
            dome.style.cssText = 'position:absolute; top:120px; left:47px; width:90px; height:80px; z-index:24; pointer-events:none; opacity:0; animation:hcConcussionDomePop 1.1s cubic-bezier(0.18, 0.9, 0.28, 1) 0.22s forwards;';
            dome.innerHTML = `
              <div style="width:100%; height:100%; border-radius:50%; background:radial-gradient(ellipse, #ffffff 0%, #e0f2fe 30%, #38bdf8 65%, #0284c7 85%, transparent 100%);"></div>
              <div style="position:absolute; inset:4px; border-radius:50%; border:3px solid #ffffff; filter:drop-shadow(0 0 18px #ffffff);"></div>
            `;
            stage.appendChild(dome);

            // Layer 4: 14-Lobed Tsunami Splash Crown Plume (Çarpma Taç Sıçraması / Cue: 0.26s)
            const crown = document.createElement('div');
            crown.style.cssText = 'position:absolute; top:110px; left:12px; width:160px; height:100px; z-index:25; pointer-events:none; opacity:0; animation:hcTsunamiSplashCrown 1.35s ease-out 0.26s forwards;';
            crown.innerHTML = `
              <svg width="160" height="100" viewBox="0 0 160 100" style="overflow:visible; filter:drop-shadow(0 0 18px #38bdf8);">
                <!-- 14-lobed Splash Plume -->
                <path d="M 80 85 C 65 75, 45 80, 20 65 C 35 55, 30 40, 15 30 C 35 32, 45 22, 50 10 C 62 25, 70 18, 80 5 C 90 18, 98 25, 110 10 C 115 22, 125 32, 145 30 C 130 40, 125 55, 140 65 C 115 80, 95 75, 80 85 Z" fill="#e0f2fe" opacity="0.95"/>
                <path d="M 80 82 C 68 74, 52 78, 30 65 C 42 56, 38 44, 25 35 C 42 36, 50 28, 55 18 C 65 30, 72 24, 80 14 C 88 24, 95 30, 105 18 C 110 28, 118 36, 135 35 C 122 44, 118 56, 130 65 C 108 78, 92 74, 80 82 Z" fill="#38bdf8" opacity="0.9"/>
                <circle cx="80" cy="55" r="16" fill="#ffffff" style="filter:drop-shadow(0 0 12px #ffffff);"/>
              </svg>
            `;
            stage.appendChild(crown);

            // Layer 5: Parabolic Ballistic Droplet Plume (36 Droplets flying and descending)
            for (let i = 0; i < 20; i++) {
              const sp = document.createElement('div');
              const left = 15 + (i * 3.8);
              const delay = 0.28 + (i * 0.04);
              const size = 3 + (i % 3) * 2;
              sp.style.cssText = `position:absolute; top:135px; left:${left}%; width:${size}px; height:${size}px; border-radius:50%; background:#fff; box-shadow:0 0 8px #38bdf8, 0 0 16px #0284c7; z-index:26; opacity:0; animation:sbSolarSparksAscent 1.2s cubic-bezier(0.18, 0.85, 0.35, 1) ${delay}s forwards;`;
              stage.appendChild(sp);
            }

            // Layer 6: Cascading Translucent Deluge Veil (Kartı Yıkayan Şelale Perdesi / Cue: 0.45s)
            const deluge = document.createElement('div');
            deluge.style.cssText = 'position:absolute; bottom:0; left:10px; right:10px; height:120px; z-index:20; pointer-events:none; opacity:0; animation:hcDelugeWaterCascade 1.4s ease-out 0.45s forwards;';
            deluge.innerHTML = `
              <svg width="164" height="120" viewBox="0 0 164 120" style="overflow:visible;">
                <path d="M 10 0 C 18 30, 12 70, 15 120" stroke="#7dd3fc" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.75"/>
                <path d="M 45 0 C 40 35, 48 75, 42 120" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8"/>
                <path d="M 82 0 C 85 40, 78 80, 82 120" stroke="#e0f2fe" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.9"/>
                <path d="M 120 0 C 125 35, 116 75, 122 120" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8"/>
                <path d="M 154 0 C 146 30, 152 70, 149 120" stroke="#7dd3fc" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.75"/>
              </svg>
            `;
            stage.appendChild(deluge);
          } else {
            const whiff = document.createElement('div');
            whiff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:18;';
            whiff.innerHTML = '<div style="width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcConcussionDomePop 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiff);
          }
        }
      }
    ];

    // Global State
    let isDarkBoard = false;
    let isWhiff = false;
    let globalSpeed = 1.0;

    // Render Cards in Grid
    const grid = document.getElementById('showcaseGrid');

    REBUILT_DATA.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'showcase-card';
      card.id = `card-${item.id}`;

      // Status Pips HTML
      let pipsHtml = '';
      for (let p = 0; p < item.pips; p++) {
        pipsHtml += '<div class="pip"></div>';
      }

      card.innerHTML = `
        <div class="showcase-header">
          <span class="showcase-badge ${item.badge}">${item.category}</span>
          <div class="showcase-title">
            <span>${index + 1}. ${item.pokemon}</span>
            <span style="color:#64748b; font-weight:400;">—</span>
            <span style="color:#f8fafc;">${item.move}</span>
          </div>
          <div class="showcase-desc">${item.desc}</div>
        </div>

        <div class="card-slot-wrapper" id="slot-${item.id}">
          <!-- Card Background Image with Resilient Loading -->
          <img class="card-bg-img" id="img-${item.id}" alt="${item.pokemon} Card" draggable="false" />
          
          <!-- Status Strip (CardView.tsx Parity) -->
          <div class="status-strip">
            <span class="status-hp">${item.hp}</span>
            <div class="status-pips">${pipsHtml}</div>
          </div>

          <!-- FX Overlay Stage -->
          <div class="fx-stage" id="stage-${item.id}"></div>
        </div>

        <div class="card-controls">
          <button class="btn-play" onclick="playFX('${item.id}')">
            <span>▶</span>
            <span>Oynat (Replay)</span>
          </button>
          <div class="vfx-breakdown">${item.breakdown}</div>
        </div>
      `;

      grid.appendChild(card);

      // Load resilient image
      const imgEl = card.querySelector(`#img-${item.id}`);
      loadResilientImg(imgEl, [
        `cards/${item.cardImg}`,
        `./cards/${item.cardImg}`,
        `/cards/${item.cardImg}`,
        `../public/cards/${item.cardImg}`
      ]);
    });

    // Play Effect on Given Stage
    function playFX(id) {
      const item = REBUILT_DATA.find(d => d.id === id);
      if (!item) return;

      const stage = document.getElementById(`stage-${id}`);
      const slot = document.getElementById(`slot-${id}`);
      if (!stage) return;

      // Clear previous animations
      stage.innerHTML = '';
      stage.style.animation = 'none';
      if (slot) slot.style.animation = 'none';
      void stage.offsetWidth; // Trigger reflow

      // Card-level reaction shudder (hit only)
      if (!isWhiff && slot) {
        slot.style.animation = `fxCardShudder 0.5s ease-out 0.15s forwards`;
      }

      // Adjust animation speed via CSS variable/style
      stage.style.animationDuration = `${item.duration / globalSpeed}ms`;

      // Render FX layers
      item.render(stage, isWhiff);
    }

    // Play All Effects
    function playAll() {
      REBUILT_DATA.forEach((item, idx) => {
        setTimeout(() => {
          playFX(item.id);
        }, idx * 160);
      });
    }

    // Toggle Real Card / Dark Board Mode
    document.getElementById('btnMode').addEventListener('click', function() {
      isDarkBoard = !isDarkBoard;
      const wrappers = document.querySelectorAll('.card-slot-wrapper');
      wrappers.forEach(w => {
        if (isDarkBoard) {
          w.classList.add('dark-board-mode');
        } else {
          w.classList.remove('dark-board-mode');
        }
      });
      this.classList.toggle('active', isDarkBoard);
      this.innerHTML = isDarkBoard ? '⬛ Dark Board Canvas' : '🎴 Real Card Mode';
    });

    // Toggle Whiff Mode
    document.getElementById('btnWhiffToggle').addEventListener('click', function() {
      isWhiff = !isWhiff;
      this.classList.toggle('active', isWhiff);
      this.innerHTML = isWhiff ? '💨 Whiff (Iskalama: Açık)' : '🎯 Hit Modu (Whiff: Kapalı)';
      playAll();
    });

    // Speed Controls
    function setSpeed(sp, btnId) {
      globalSpeed = sp;
      ['btnSpeed1', 'btnSpeed05', 'btnSpeed025'].forEach(id => {
        document.getElementById(id).classList.remove('active');
      });
      document.getElementById(btnId).classList.add('active');
    }

    document.getElementById('btnSpeed1').addEventListener('click', () => setSpeed(1.0, 'btnSpeed1'));
    document.getElementById('btnSpeed05').addEventListener('click', () => setSpeed(0.5, 'btnSpeed05'));
    document.getElementById('btnSpeed025').addEventListener('click', () => setSpeed(0.25, 'btnSpeed025'));

    // Global Play All
    document.getElementById('btnPlayAll').addEventListener('click', playAll);

    // Initial Trigger on Load
    window.addEventListener('load', () => {
      setTimeout(playAll, 500);
    });
  </script>
</body>
</html>
"""

# Verify brackets in html
open_braces = html.count('{')
close_braces = html.count('}')
print(f"Braces verification: open={open_braces}, close={close_braces}, balanced={open_braces == close_braces}")

target = 'public/preview_advanced_moves_showcase.html'
with open(target, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Successfully generated {target} ({len(html)} bytes).")
