# Script to generate public/preview_advanced_moves_showcase.html
import os
import re

html_content = """<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pokémon TCG 1999 — İleri Düzey FX & Numune İnceleme Paneli</title>
  <style>
    :root {
      --bg-dark: #080b12;
      --panel-bg: rgba(18, 24, 38, 0.92);
      --card-w: 184px;
      --card-h: 253px;
      --accent-cyan: #38bdf8;
      --accent-purple: #c084fc;
      --accent-lime: #a3e635;
      --accent-gold: #facc15;
      --accent-rose: #fb7185;
      --accent-orange: #f97316;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: radial-gradient(circle at 50% 12%, #141c2e 0%, #06080e 100%);
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
      max-width: 980px;
      margin-bottom: 20px;
    }

    .badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 9999px;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: var(--accent-cyan);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    h1 {
      font-size: 24px;
      font-weight: 800;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }

    p.subtitle {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
    }

    /* Global Control Bar */
    .global-toolbar {
      display: flex;
      gap: 10px;
      margin-bottom: 26px;
      flex-wrap: wrap;
      justify-content: center;
      background: rgba(15, 23, 42, 0.7);
      padding: 8px 16px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(8px);
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
      background: rgba(56, 189, 248, 0.2);
      border-color: var(--accent-cyan);
      color: #38bdf8;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
    }

    /* Grid of Showcase Cards */
    .showcase-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 22px;
      max-width: 1380px;
      width: 100%;
    }

    .showcase-card {
      background: var(--panel-bg);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(12px);
      transition: transform 0.2s ease, border-color 0.2s ease;
      position: relative;
    }

    .showcase-card:hover {
      border-color: rgba(56, 189, 248, 0.35);
      transform: translateY(-2px);
    }

    .showcase-header {
      width: 100%;
      text-align: left;
      margin-bottom: 12px;
    }

    .showcase-badge {
      display: inline-block;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .badge-b {
      background: rgba(249, 115, 22, 0.2);
      color: #fb923c;
      border: 1px solid rgba(249, 115, 22, 0.4);
    }

    .badge-adv {
      background: rgba(168, 85, 247, 0.2);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.4);
    }

    .showcase-title {
      font-size: 14px;
      font-weight: 700;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .showcase-desc {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 3px;
      line-height: 1.35;
    }

    /* Card Slot with Parity (Rule 14: 184px x 253px) */
    .card-slot-wrapper {
      position: relative;
      width: var(--card-w);
      height: var(--card-h);
      border-radius: 12px;
      overflow: hidden;
      background: #0f172a;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      margin-bottom: 12px;
    }

    .card-bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      pointer-events: none;
      z-index: 1;
      opacity: 0.92;
      transition: opacity 0.3s ease, filter 0.3s ease;
    }

    .dark-board-mode .card-bg-img {
      opacity: 0.10;
      filter: grayscale(100%) brightness(0.3);
    }

    /* Status Strip (CardView.tsx parity) */
    .status-strip {
      position: absolute;
      top: 6px;
      right: 8px;
      z-index: 25;
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(4px);
      padding: 2px 6px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.12);
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
      gap: 8px;
    }

    .btn-play {
      width: 100%;
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(30, 41, 59, 0.8) 100%);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #e0f2fe;
      padding: 8px;
      border-radius: 8px;
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
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.4) 0%, rgba(30, 41, 59, 0.95) 100%);
      border-color: #38bdf8;
      box-shadow: 0 0 14px rgba(56, 189, 248, 0.35);
      color: #fff;
    }

    .tech-note {
      font-size: 10px;
      color: #64748b;
      line-height: 1.3;
      background: rgba(0, 0, 0, 0.3);
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.04);
    }

    .tech-note strong {
      color: #cbd5e1;
    }

    /* =====================================================================
       ROOT-LEVEL KEYFRAMES (Rule 14 Invariant: Strictly No Nested Keyframes)
       ===================================================================== */

    /* Universal Shudder Tremor */
    @keyframes fxCardShudder {
      0% { transform: translate(0, 0); }
      18% { transform: translate(-3px, 2px) rotate(-0.6deg); }
      36% { transform: translate(3px, -2px) rotate(0.6deg); }
      54% { transform: translate(-2px, 1px) rotate(-0.3deg); }
      72% { transform: translate(2px, -1px) rotate(0.3deg); }
      100% { transform: translate(0, 0); }
    }

    /* Demo 1: Charizard Fire Spin Keyframes */
    @keyframes fsFloorScorch {
      0% { opacity: 0; transform: scale(0.4); }
      20% { opacity: 0.85; transform: scale(1.05); }
      70% { opacity: 0.7; transform: scale(1); }
      100% { opacity: 0; transform: scale(1.15); }
    }

    @keyframes fsVortexCore {
      0% { opacity: 0; transform: translateY(40px) scale(0.3) rotate(0deg); }
      15% { opacity: 0.95; transform: translateY(10px) scale(0.85) rotate(120deg); }
      45% { opacity: 1; transform: translateY(-10px) scale(1.1) rotate(320deg); }
      75% { opacity: 0.85; transform: translateY(-25px) scale(1.15) rotate(540deg); }
      100% { opacity: 0; transform: translateY(-40px) scale(1.2) rotate(720deg); filter: blur(4px); }
    }

    @keyframes fsSparkOrbit {
      0% { opacity: 0; transform: rotate(0deg) translateX(15px) scale(0.4); }
      20% { opacity: 1; transform: rotate(90deg) translateX(35px) scale(1); }
      60% { opacity: 0.8; transform: rotate(260deg) translateX(55px) scale(0.9); }
      100% { opacity: 0; transform: rotate(420deg) translateX(70px) scale(0.2); }
    }

    /* Demo 2: Venusaur Solarbeam Keyframes */
    @keyframes sbPreshockSuck {
      0% { opacity: 0; transform: scale(2.2); filter: blur(6px); }
      40% { opacity: 0.9; transform: scale(0.8); filter: blur(0px); }
      60% { opacity: 1; transform: scale(0.4); }
      65% { opacity: 0; transform: scale(0.1); }
      100% { opacity: 0; }
    }

    @keyframes sbBeamBlast {
      0% { opacity: 0; transform: scaleY(0.05) scaleX(0.2); }
      8% { opacity: 1; transform: scaleY(1.04) scaleX(1.1); filter: drop-shadow(0 0 24px #a3e635); }
      35% { opacity: 1; transform: scaleY(1) scaleX(1); filter: drop-shadow(0 0 18px #fef08a); }
      70% { opacity: 0.85; transform: scaleY(0.98) scaleX(0.92); }
      100% { opacity: 0; transform: scaleY(1.02) scaleX(0.7); filter: blur(3px); }
    }

    @keyframes sbFloorPulse {
      0% { opacity: 0; transform: scale(0.2); }
      20% { opacity: 0.9; transform: scale(1.1); }
      60% { opacity: 0.7; transform: scale(1.3); }
      100% { opacity: 0; transform: scale(1.7); filter: blur(4px); }
    }

    /* Demo 3: Poliwrath Whirlpool Vortex Keyframes */
    @keyframes wpVortexSpin {
      0% { opacity: 0; transform: rotate(0deg) scale(0.4); }
      25% { opacity: 0.95; transform: rotate(180deg) scale(0.95); }
      60% { opacity: 1; transform: rotate(480deg) scale(1.05); }
      85% { opacity: 0.8; transform: rotate(720deg) scale(1); }
      100% { opacity: 0; transform: rotate(900deg) scale(1.15); filter: blur(4px); }
    }

    @keyframes wpRippleRing {
      0% { opacity: 0; transform: scale(0.3); }
      25% { opacity: 0.85; transform: scale(0.7); }
      60% { opacity: 0.6; transform: scale(1.2); }
      100% { opacity: 0; transform: scale(1.8); }
    }

    /* Demo 4: Electrode Chain Lightning Keyframes */
    @keyframes clFlashArc {
      0% { opacity: 0; transform: scaleY(0.1); }
      10% { opacity: 1; transform: scaleY(1.02); filter: drop-shadow(0 0 20px #38bdf8); }
      20% { opacity: 0.3; }
      30% { opacity: 1; filter: drop-shadow(0 0 24px #ffffff); }
      50% { opacity: 0.8; }
      70% { opacity: 0.95; }
      85% { opacity: 0.4; }
      100% { opacity: 0; transform: scaleY(1); filter: blur(2px); }
    }

    @keyframes clGroundIon {
      0% { opacity: 0; }
      15% { opacity: 0.8; }
      35% { opacity: 0.2; }
      50% { opacity: 0.9; }
      100% { opacity: 0; }
    }

    /* Demo 5: Ninetales Fire Blast (Dai Kanji) Keyframes */
    @keyframes fbStarBurst {
      0% { opacity: 0; transform: scale(0.2) rotate(-15deg); }
      15% { opacity: 1; transform: scale(1.08) rotate(0deg); filter: drop-shadow(0 0 24px #ea580c); }
      40% { opacity: 1; transform: scale(1) rotate(2deg); filter: drop-shadow(0 0 30px #f97316); }
      75% { opacity: 0.85; transform: scale(1.05) rotate(4deg); }
      100% { opacity: 0; transform: scale(1.25) rotate(6deg); filter: blur(5px); }
    }

    @keyframes fbShockwaveOut {
      0% { opacity: 0; transform: scale(0.3); }
      25% { opacity: 0.9; transform: scale(0.85); }
      70% { opacity: 0.5; transform: scale(1.4); }
      100% { opacity: 0; transform: scale(2.0); }
    }

    /* Demo 6: Victreebel Acid Melt Keyframes */
    @keyframes amDropletFall {
      0% { opacity: 0; transform: translateY(-40px) scaleY(1.4) scaleX(0.8); }
      20% { opacity: 1; transform: translateY(0px) scaleY(1) scaleX(1); }
      30% { opacity: 1; transform: translateY(15px) scaleY(0.8) scaleX(1.3); }
      50% { opacity: 0.9; transform: translateY(22px) scale(1.2); }
      100% { opacity: 0; transform: translateY(30px) scale(1.6); filter: blur(3px); }
    }

    @keyframes amBubbleBoil {
      0% { opacity: 0; transform: translateY(10px) scale(0.3); }
      35% { opacity: 0.95; transform: translateY(-8px) scale(1); }
      65% { opacity: 0.8; transform: translateY(-22px) scale(1.2); }
      100% { opacity: 0; transform: translateY(-38px) scale(1.5); filter: blur(2px); }
    }

    /* Demo 7: Dark Blastoise Hydrocannon Keyframes */
    @keyframes hcDualJetBurst {
      0% { opacity: 0; transform: translateY(-50px) scaleY(0.2) scaleX(0.7); }
      12% { opacity: 1; transform: translateY(0px) scaleY(1.05) scaleX(1.08); filter: drop-shadow(0 0 22px #0284c7); }
      40% { opacity: 1; transform: translateY(5px) scaleY(1) scaleX(1); }
      70% { opacity: 0.85; transform: translateY(10px) scaleY(0.95) scaleX(0.95); }
      100% { opacity: 0; transform: translateY(18px) scaleY(0.9) scaleX(0.9); filter: blur(3px); }
    }

    @keyframes hcCavitationSplash {
      0% { opacity: 0; transform: scale(0.3); }
      18% { opacity: 0.95; transform: scale(1.1); filter: drop-shadow(0 0 18px #e0f2fe); }
      55% { opacity: 0.7; transform: scale(1.4); }
      100% { opacity: 0; transform: scale(1.9); filter: blur(4px); }
    }

    /* Demo 8: Weezing Toxic Smog Keyframes */
    @keyframes tsSmogPuff {
      0% { opacity: 0; transform: scale(0.4) rotate(0deg); }
      20% { opacity: 0.9; transform: scale(0.85) rotate(15deg); }
      50% { opacity: 0.95; transform: scale(1.1) rotate(30deg); filter: drop-shadow(0 0 16px #9333ea); }
      80% { opacity: 0.7; transform: scale(1.22) rotate(45deg); }
      100% { opacity: 0; transform: scale(1.35) rotate(60deg); filter: blur(5px); }
    }

    @keyframes tsMiasmaDrift {
      0% { opacity: 0; transform: translateY(15px) scale(0.8); }
      30% { opacity: 0.8; transform: translateY(-5px) scale(1); }
      70% { opacity: 0.6; transform: translateY(-20px) scale(1.15); }
      100% { opacity: 0; transform: translateY(-35px) scale(1.3); filter: blur(4px); }
    }

    /* Demo 9: Raichu Gigashock Keyframes */
    @keyframes gsDielectricCore {
      0% { opacity: 0; transform: scale(0.2); }
      10% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 30px #ffffff) drop-shadow(0 0 50px #38bdf8); }
      25% { opacity: 0.4; }
      40% { opacity: 1; filter: drop-shadow(0 0 25px #facc15); }
      65% { opacity: 0.85; transform: scale(1.05); }
      100% { opacity: 0; transform: scale(1.3); filter: blur(4px); }
    }

    @keyframes gsPlasmaArcs {
      0% { opacity: 0; transform: rotate(0deg) scale(0.6); }
      15% { opacity: 1; transform: rotate(30deg) scale(1.1); }
      45% { opacity: 0.8; transform: rotate(-25deg) scale(1.02); }
      75% { opacity: 0.6; transform: rotate(15deg) scale(1.08); }
      100% { opacity: 0; transform: rotate(40deg) scale(1.25); }
    }

    /* Demo 10: Porygon Conversion Matrix Glitch Keyframes */
    @keyframes cvGlitchBand {
      0% { opacity: 0; transform: translateX(-20px) scaleY(1); }
      15% { opacity: 0.95; transform: translateX(6px) scaleY(1.05); filter: drop-shadow(0 0 12px #38bdf8); }
      30% { opacity: 0.4; transform: translateX(-8px) scaleY(0.95); filter: drop-shadow(0 0 12px #ec4899); }
      50% { opacity: 1; transform: translateX(4px) scaleY(1.02); }
      75% { opacity: 0.7; transform: translateX(-3px) scaleY(1); }
      100% { opacity: 0; transform: translateX(12px) scaleY(0.9); }
    }

    @keyframes cvWireframeMatrix {
      0% { opacity: 0; transform: scale(0.7); }
      20% { opacity: 0.9; transform: scale(1.05); }
      60% { opacity: 0.75; transform: scale(1); filter: drop-shadow(0 0 10px #22d3ee); }
      100% { opacity: 0; transform: scale(1.15); filter: blur(3px); }
    }

  </style>
</head>
<body>

  <!-- Hidden SVG Filters for Advanced VFX (Gooey, Turbulence, Glow) -->
  <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
    <defs>
      <!-- Filter 1: Gooey Metaball (Surface Tension for Acid & Whirlpool) -->
      <filter id="fxGooeyFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="
          1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 18 -7" result="gooey" />
        <feBlend in="SourceGraphic" in2="gooey" />
      </filter>

      <!-- Filter 2: Perlin Gas Turbulence (Organic Smog Lobes) -->
      <filter id="fxGasTurbulence" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>

  <header>
    <div class="badge">Advanced VFX & Signature SVG Showcase</div>
    <h1>İleri Düzey FX & Akışkan Simülasyonu Numune Paneli</h1>
    <p class="subtitle">
      "Mevcut Özel SVG'lerin Geliştirilmesi" ve "Advanced VFX Uygunluğu" başlıklarında önerilen 10 ikonik saldırının masaüstü kart paritesinde (184×253px) canlı numuneleri.
    </p>
  </header>

  <!-- Global Toolbar Controls -->
  <div class="global-toolbar">
    <button class="btn" id="btnPlayAll">▶ Tümünü Oynat (Play All)</button>
    <button class="btn active" id="btnMode">🎴 Real Card Mode</button>
    <button class="btn" id="btnSpeed1">1.0x Normal</button>
    <button class="btn" id="btnSpeed05">0.5x Slow</button>
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

    // Showcase Items Definition (The 10 Target Attacks)
    const SHOWCASE_DATA = [
      {
        id: 'charizard_firespin',
        group: 'B. Özel SVG İyileştirme',
        groupBadge: 'badge-b',
        pokemon: 'Charizard',
        move: 'Fire Spin (Alev Burgacı)',
        cardImg: '4.jpg',
        hp: '120 HP',
        pips: 12,
        desc: 'Çift sarmallı volkanik alev helezonu, akkor lav lekesi ve balistik köz kavitasyonu.',
        tech: '<strong>Yöntem:</strong> Double-helix Bézier vortex + termal zemin kavrulması + yörüngesel kıvılcım saçılımı.',
        duration: 1500,
        render: function(stage, whiff) {
          if (!whiff) {
            // Layer 1: Ambient Card Floor / Atmosphere (Thermal Scorch Floor)
            const floor = document.createElement('div');
            floor.style.cssText = 'position:absolute; bottom:6%; left:12%; right:12%; height:90px; border-radius:50%; z-index:11; opacity:0; pointer-events:none; background:radial-gradient(ellipse, #ffffff 0%, #fef08a 25%, #f97316 55%, #b91c1c 80%, transparent 95%); animation:fsFloorScorch 1.5s ease-out forwards;';
            stage.appendChild(floor);

            // Layer 2: Double-Helix Fire Vortex (Primary Actor)
            const vortex = document.createElement('div');
            vortex.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20; opacity:0; pointer-events:none; animation:fsVortexCore 1.5s cubic-bezier(0.2, 0.85, 0.3, 1) forwards;';
            vortex.innerHTML = `
              <svg width="150" height="210" viewBox="0 0 150 210" style="overflow:visible; filter:drop-shadow(0 0 18px #f97316) drop-shadow(0 0 32px #ea580c);">
                <path d="M 75 200 C 35 170, 20 130, 55 95 C 80 70, 115 50, 75 10 C 60 55, 120 75, 95 110 C 65 150, 115 175, 75 200 Z" fill="url(#gradFireVortex1)" opacity="0.95"/>
                <path d="M 75 195 C 105 165, 120 125, 85 90 C 60 65, 35 45, 75 15 C 85 55, 30 75, 55 110 C 85 145, 35 170, 75 195 Z" fill="url(#gradFireVortex2)" opacity="0.88"/>
                <path d="M 75 180 C 55 150, 45 120, 68 95 C 85 75, 95 55, 75 25 C 65 60, 95 80, 80 105 C 60 135, 90 155, 75 180 Z" fill="#ffffff" opacity="0.82" style="filter:drop-shadow(0 0 10px #ffffff)"/>
                <defs>
                  <linearGradient id="gradFireVortex1" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stop-color="#b91c1c"/>
                    <stop offset="35%" stop-color="#f97316"/>
                    <stop offset="70%" stop-color="#facc15"/>
                    <stop offset="100%" stop-color="#ffffff"/>
                  </linearGradient>
                  <linearGradient id="gradFireVortex2" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stop-color="#991b1b"/>
                    <stop offset="40%" stop-color="#ea580c"/>
                    <stop offset="75%" stop-color="#fef08a"/>
                    <stop offset="100%" stop-color="#ffffff"/>
                  </linearGradient>
                </defs>
              </svg>
            `;
            stage.appendChild(vortex);

            // Layer 3: Concentric Shockwave Rings
            const shock = document.createElement('div');
            shock.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:22; pointer-events:none;';
            shock.innerHTML = `
              <div style="width:130px; height:130px; border-radius:50%; border:2.5px solid #fde047; opacity:0; animation:fbShockwaveOut 1.1s ease-out 0.2s forwards; filter:drop-shadow(0 0 14px #facc15);"></div>
            `;
            stage.appendChild(shock);

            // Layer 4 & 5: Orbiting Cavitation Sparks & Embers
            for (let i = 0; i < 6; i++) {
              const sp = document.createElement('div');
              const delay = 0.1 + i * 0.12;
              const size = 6 + (i % 3) * 3;
              sp.style.cssText = `position:absolute; top:50%; left:50%; width:${size}px; height:${size}px; border-radius:50%; background:#fff; box-shadow:0 0 12px #facc15, 0 0 20px #f97316; opacity:0; z-index:25; animation:fsSparkOrbit 1.2s cubic-bezier(0.2, 0.8, 0.4, 1) ${delay}s forwards;`;
              stage.appendChild(sp);
            }
          } else {
            // Whiff State
            const whiffPuff = document.createElement('div');
            whiffPuff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20;';
            whiffPuff.innerHTML = '<div style="width:50px; height:50px; border-radius:50%; background:radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%); animation:fbShockwaveOut 0.8s ease-out forwards;"></div>';
            stage.appendChild(whiffPuff);
          }
        }
      },
      {
        id: 'venusaur_solarbeam',
        group: 'B. Özel SVG İyileştirme',
        groupBadge: 'badge-b',
        pokemon: 'Venusaur',
        move: 'Solarbeam (Güneş Işını)',
        cardImg: '15.jpg',
        hp: '100 HP',
        pips: 10,
        desc: 'İki fazlı gravitasyonel foton emişi ve masif güneş plazma sütunu patlaması.',
        tech: '<strong>Yöntem:</strong> İçe çöken foton parçacıkları + konsantre dikey lazer ışını + klorofil radyasyonu.',
        duration: 1800,
        render: function(stage, whiff) {
          if (!whiff) {
            // Phase 1: Gravitational Photon Implosion
            const implosion = document.createElement('div');
            implosion.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:24; pointer-events:none;';
            implosion.innerHTML = `
              <div style="width:140px; height:140px; border-radius:50%; background:radial-gradient(circle, #ffffff 0%, #a3e635 35%, rgba(163,230,53,0.3) 70%, transparent 100%); animation:sbPreshockSuck 0.65s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;"></div>
            `;
            stage.appendChild(implosion);

            // Phase 2: Concentrated Solar Pillar Blast (0.65s cue)
            const beam = document.createElement('div');
            beam.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:22; pointer-events:none; opacity:0; animation:sbBeamBlast 1.1s cubic-bezier(0.18, 0.92, 0.28, 1) 0.62s forwards;';
            beam.innerHTML = `
              <svg width="130" height="250" viewBox="0 0 130 250" style="overflow:visible;">
                <polygon points="65,0 42,40 50,120 30,250 100,250 80,120 88,40" fill="url(#gradSolarBeam1)" opacity="0.92" style="filter:drop-shadow(0 0 24px #a3e635) drop-shadow(0 0 40px #65a30d);"/>
                <polygon points="65,0 52,40 58,120 46,250 84,250 72,120 78,40" fill="#ffffff" opacity="0.95" style="filter:drop-shadow(0 0 12px #ffffff);"/>
                <line x1="30" y1="20" x2="30" y2="230" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
                <line x1="100" y1="20" x2="100" y2="230" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
                <defs>
                  <linearGradient id="gradSolarBeam1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#4d7c0f"/>
                    <stop offset="30%" stop-color="#a3e635"/>
                    <stop offset="50%" stop-color="#fef08a"/>
                    <stop offset="70%" stop-color="#a3e635"/>
                    <stop offset="100%" stop-color="#4d7c0f"/>
                  </linearGradient>
                </defs>
              </svg>
            `;
            stage.appendChild(beam);

            // Ground Floor Pulse
            const floor = document.createElement('div');
            floor.style.cssText = 'position:absolute; bottom:4%; left:15%; right:15%; height:70px; border-radius:50%; z-index:12; opacity:0; pointer-events:none; background:radial-gradient(ellipse, #fef08a 0%, #a3e635 50%, transparent 80%); animation:sbFloorPulse 1.0s ease-out 0.65s forwards;';
            stage.appendChild(floor);
          } else {
            const whiffPuff = document.createElement('div');
            whiffPuff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20;';
            whiffPuff.innerHTML = '<div style="width:40px; height:40px; border-radius:50%; background:radial-gradient(circle, rgba(163,230,53,0.35) 0%, transparent 70%); animation:fbShockwaveOut 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiffPuff);
          }
        }
      },
      {
        id: 'poliwrath_whirlpool',
        group: 'B. Özel SVG İyileştirme',
        groupBadge: 'badge-b',
        pokemon: 'Poliwrath',
        move: 'Whirlpool (Su Girdabı)',
        cardImg: '13.jpg',
        hp: '90 HP',
        pips: 9,
        desc: 'SVG Gooey yüzey gerilimi filtreli döner hidrodinamik su burgacı ve kavitasyon.',
        tech: '<strong>Yöntem:</strong> SVG feColorMatrix akışkan metaball + çift eşmerkezli spiral akış + kavitasyon.',
        duration: 1600,
        render: function(stage, whiff) {
          if (!whiff) {
            // Gooey Filter Container
            const vortexContainer = document.createElement('div');
            vortexContainer.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20; filter:url(#fxGooeyFilter); pointer-events:none;';
            
            const vortex = document.createElement('div');
            vortex.style.cssText = 'width:150px; height:150px; opacity:0; animation:wpVortexSpin 1.6s cubic-bezier(0.2, 0.85, 0.3, 1) forwards;';
            vortex.innerHTML = `
              <svg width="150" height="150" viewBox="0 0 150 150" style="overflow:visible;">
                <path d="M 75 15 C 110 15, 135 45, 135 75 C 135 110, 105 135, 75 135 C 45 135, 25 110, 25 80 C 25 55, 45 40, 70 40 C 90 40, 105 55, 105 75 C 105 90, 90 105, 75 105 C 62 105, 52 95, 52 82 C 52 72, 60 65, 72 65 C 80 65, 86 71, 86 78" fill="none" stroke="#0284c7" stroke-width="16" stroke-linecap="round"/>
                <path d="M 75 22 C 105 22, 128 48, 128 75 C 128 105, 102 128, 75 128 C 48 128, 32 105, 32 80 C 32 58, 48 46, 70 46 C 88 46, 98 58, 98 75 C 98 86, 88 98, 75 98 C 65 98, 58 90, 58 82" fill="none" stroke="#38bdf8" stroke-width="9" stroke-linecap="round"/>
                <path d="M 75 30 C 98 30, 118 52, 118 75 C 118 98, 98 118, 75 118 C 55 118, 40 98, 40 80" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
              </svg>
            `;
            vortexContainer.appendChild(vortex);
            stage.appendChild(vortexContainer);

            // Concentric Water Ripples
            const ripples = document.createElement('div');
            ripples.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:18; pointer-events:none;';
            ripples.innerHTML = `
              <div style="width:120px; height:120px; border-radius:50%; border:2px solid #38bdf8; opacity:0; animation:wpRippleRing 1.2s ease-out 0.25s forwards; filter:drop-shadow(0 0 10px #0284c7);"></div>
              <div style="position:absolute; width:100px; height:100px; border-radius:50%; border:1.5px solid #e0f2fe; opacity:0; animation:wpRippleRing 1.2s ease-out 0.45s forwards;"></div>
            `;
            stage.appendChild(ripples);
          } else {
            const whiffPuff = document.createElement('div');
            whiffPuff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20;';
            whiffPuff.innerHTML = '<div style="width:45px; height:45px; border-radius:50%; border:1.5px solid #38bdf8; opacity:0; animation:fbShockwaveOut 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiffPuff);
          }
        }
      },
      {
        id: 'electrode_chainlightning',
        group: 'B. Özel SVG İyileştirme',
        groupBadge: 'badge-b',
        pokemon: 'Electrode',
        move: 'Chain Lightning (Zincirleme Yıldırım)',
        cardImg: '21.jpg',
        hp: '80 HP',
        pips: 8,
        desc: 'Fraktal çatallanan L-System elektrik arkları ve kart tabanında gezen dielektrik boşalma.',
        tech: '<strong>Yöntem:</strong> L-System fraktal ark dallanması + çoklu keyframe gerilim titreşimi + akkor beyaz çekirdek.',
        duration: 1300,
        render: function(stage, whiff) {
          if (!whiff) {
            // Ground Ionization
            const ion = document.createElement('div');
            ion.style.cssText = 'position:absolute; inset:0; background:radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(250,204,21,0.15) 50%, transparent 80%); z-index:12; opacity:0; animation:clGroundIon 1.3s ease-out forwards;';
            stage.appendChild(ion);

            // Fractal Lightning Arcs
            const bolt = document.createElement('div');
            bolt.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:22; pointer-events:none; opacity:0; transform-origin:top center; animation:clFlashArc 1.3s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;';
            bolt.innerHTML = `
              <svg width="160" height="230" viewBox="0 0 160 230" style="overflow:visible;">
                <!-- Main Core Bolt -->
                <path d="M 80 0 L 72 45 L 94 52 L 68 110 L 90 118 L 55 185 L 82 188 L 60 230" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" style="filter:drop-shadow(0 0 16px #0284c7) drop-shadow(0 0 28px #38bdf8);"/>
                <path d="M 80 0 L 72 45 L 94 52 L 68 110 L 90 118 L 55 185 L 82 188 L 60 230" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 10px #ffffff);"/>
                
                <!-- Fork Branch 1 (Left Ricochet) -->
                <path d="M 72 45 L 35 75 L 48 80 L 15 125" fill="none" stroke="#facc15" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" style="filter:drop-shadow(0 0 10px #facc15);"/>
                <path d="M 72 45 L 35 75 L 48 80 L 15 125" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>
                
                <!-- Fork Branch 2 (Right Splay) -->
                <path d="M 90 118 L 130 145 L 120 152 L 148 195" fill="none" stroke="#facc15" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" style="filter:drop-shadow(0 0 10px #facc15);"/>
                <path d="M 90 118 L 130 145 L 120 152 L 148 195" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
            `;
            stage.appendChild(bolt);
          } else {
            const whiffPuff = document.createElement('div');
            whiffPuff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20;';
            whiffPuff.innerHTML = '<div style="width:40px; height:40px; border-radius:50%; background:radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%); animation:fbShockwaveOut 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiffPuff);
          }
        }
      },
      {
        id: 'ninetales_fireblast',
        group: 'B. Özel SVG İyileştirme',
        groupBadge: 'badge-b',
        pokemon: 'Ninetales',
        move: 'Fire Blast (Büyük Ateş Patlaması)',
        cardImg: '12.jpg',
        hp: '80 HP',
        pips: 8,
        desc: 'Kanonik 5 uçlu "大" (Dai) yıldız ateşi, dışa doğru patlayan lav jeti lobları.',
        tech: '<strong>Yöntem:</strong> Akkor merkezli 5 loblu Dai kanjisi + termal genleşme şok halkaları + köz saçılımı.',
        duration: 1500,
        render: function(stage, whiff) {
          if (!whiff) {
            // Thermal Scorch Aura
            const scorch = document.createElement('div');
            scorch.style.cssText = 'position:absolute; inset:0; background:radial-gradient(circle, rgba(234,88,12,0.4) 0%, rgba(185,28,28,0.2) 50%, transparent 80%); z-index:11; opacity:0; animation:clGroundIon 1.5s ease-out forwards;';
            stage.appendChild(scorch);

            // Dai Kanji Starburst Blast
            const dai = document.createElement('div');
            dai.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:22; pointer-events:none; opacity:0; animation:fbStarBurst 1.5s cubic-bezier(0.18, 0.9, 0.28, 1) forwards;';
            dai.innerHTML = `
              <svg width="160" height="160" viewBox="0 0 160 160" style="overflow:visible;">
                <!-- Outermost Volcanic Glow -->
                <path d="M 80 15 L 87 65 L 145 68 L 98 98 L 122 150 L 80 118 L 38 150 L 62 98 L 15 68 L 73 65 Z" fill="#ea580c" opacity="0.9" style="filter:drop-shadow(0 0 24px #ea580c) drop-shadow(0 0 40px #b91c1c);"/>
                <!-- Middle Fiery Orange Star -->
                <path d="M 80 25 L 85 70 L 135 72 L 95 96 L 115 140 L 80 114 L 45 140 L 65 96 L 25 72 L 75 70 Z" fill="#f97316" opacity="0.95" style="filter:drop-shadow(0 0 14px #facc15);"/>
                <!-- Inner Lemon Yellow Core -->
                <path d="M 80 38 L 83 74 L 120 76 L 90 94 L 105 128 L 80 108 L 55 128 L 70 94 L 40 76 L 77 74 Z" fill="#fef08a" opacity="0.95"/>
                <!-- White Hot Central Pop -->
                <circle cx="80" cy="85" r="16" fill="#ffffff" style="filter:drop-shadow(0 0 12px #ffffff);"/>
              </svg>
            `;
            stage.appendChild(dai);

            // Shockwave Out
            const shock = document.createElement('div');
            shock.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20; pointer-events:none;';
            shock.innerHTML = `
              <div style="width:130px; height:130px; border-radius:50%; border:2px solid #facc15; opacity:0; animation:fbShockwaveOut 1.1s ease-out 0.15s forwards; filter:drop-shadow(0 0 14px #f97316);"></div>
            `;
            stage.appendChild(shock);
          } else {
            const whiffPuff = document.createElement('div');
            whiffPuff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20;';
            whiffPuff.innerHTML = '<div style="width:45px; height:45px; border-radius:50%; background:radial-gradient(circle, rgba(234,88,12,0.3) 0%, transparent 70%); animation:fbShockwaveOut 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiffPuff);
          }
        }
      },
      {
        id: 'victreebel_acid',
        group: 'Kategori 1: Advanced VFX',
        groupBadge: 'badge-adv',
        pokemon: 'Victreebel',
        move: 'Acid Melt (Kostik Asit Erimesi)',
        cardImg: '44.jpg',
        hp: '80 HP',
        pips: 8,
        desc: 'Viskoz asit köpürmesi (Gooey SVG feColorMatrix), damla boyunlaşması ve erime dumanı.',
        tech: '<strong>Yöntem:</strong> SVG feColorMatrix metaball yüzey gerilimi + damla kopuşu (necking/pinch-off) + aşındırıcı gaz.',
        duration: 1600,
        render: function(stage, whiff) {
          if (!whiff) {
            // Gooey Filter Container for Viscous Droplet Pinch-Off
            const gooeyStage = document.createElement('div');
            gooeyStage.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:22; filter:url(#fxGooeyFilter); pointer-events:none;';
            
            const acidDrops = document.createElement('div');
            acidDrops.style.cssText = 'position:relative; width:120px; height:160px;';
            acidDrops.innerHTML = `
              <!-- Main Pool Base -->
              <div style="position:absolute; bottom:20px; left:20px; width:80px; height:35px; border-radius:50%; background:#84cc16; box-shadow:0 0 16px #4d7c0f;"></div>
              <!-- Droplet 1: Necking & Falling -->
              <div style="position:absolute; top:30px; left:52px; width:22px; height:32px; border-radius:50%; background:#bef264; animation:amDropletFall 1.3s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;"></div>
              <!-- Droplet 2: Secondary Bead -->
              <div style="position:absolute; top:10px; left:48px; width:14px; height:18px; border-radius:50%; background:#bef264; animation:amDropletFall 1.3s cubic-bezier(0.2, 0.8, 0.3, 1) 0.15s forwards;"></div>
            `;
            gooeyStage.appendChild(acidDrops);
            stage.appendChild(gooeyStage);

            // Caustic Bubbles & Gas Rising
            for (let i = 0; i < 4; i++) {
              const bub = document.createElement('div');
              const left = 35 + i * 15;
              const delay = 0.2 + i * 0.14;
              bub.style.cssText = `position:absolute; bottom:30%; left:${left}%; width:10px; height:10px; border-radius:50%; background:#ecfccb; border:1px solid #84cc16; z-index:24; opacity:0; animation:amBubbleBoil 1.2s ease-out ${delay}s forwards; box-shadow:0 0 8px #a3e635;`;
              stage.appendChild(bub);
            }
          } else {
            const whiffPuff = document.createElement('div');
            whiffPuff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20;';
            whiffPuff.innerHTML = '<div style="width:40px; height:40px; border-radius:50%; background:radial-gradient(circle, rgba(132,204,22,0.3) 0%, transparent 70%); animation:fbShockwaveOut 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiffPuff);
          }
        }
      },
      {
        id: 'darkblastoise_hydrocannon',
        group: 'Kategori 1: Advanced VFX',
        groupBadge: 'badge-adv',
        pokemon: 'Dark Blastoise',
        move: 'Hydrocannon (Yüksek Basınçlı Su Topu)',
        cardImg: '2.jpg',
        hp: '100 HP',
        pips: 10,
        desc: 'Masif çift namlulu hidrodinamik su topu jeti ve çarpma anında kavitasyon patlaması.',
        tech: '<strong>Yöntem:</strong> Çift eksenli su mermisi sütunları + çarpma anında mikro-köpük kavitasyonu.',
        duration: 1400,
        render: function(stage, whiff) {
          if (!whiff) {
            // Dual Convergent Water Cannon Blast
            const jet = document.createElement('div');
            jet.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:22; pointer-events:none; opacity:0; animation:hcDualJetBurst 1.4s cubic-bezier(0.18, 0.92, 0.3, 1) forwards;';
            jet.innerHTML = `
              <svg width="150" height="230" viewBox="0 0 150 230" style="overflow:visible;">
                <!-- Left Cannon Stream -->
                <path d="M 45 0 C 42 60, 48 120, 68 200" fill="none" stroke="#0284c7" stroke-width="18" stroke-linecap="round" opacity="0.9" style="filter:drop-shadow(0 0 20px #0369a1);"/>
                <path d="M 45 0 C 42 60, 48 120, 68 200" fill="none" stroke="#38bdf8" stroke-width="10" stroke-linecap="round" opacity="0.95"/>
                <path d="M 45 0 C 42 60, 48 120, 68 200" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
                
                <!-- Right Cannon Stream -->
                <path d="M 105 0 C 108 60, 102 120, 82 200" fill="none" stroke="#0284c7" stroke-width="18" stroke-linecap="round" opacity="0.9" style="filter:drop-shadow(0 0 20px #0369a1);"/>
                <path d="M 105 0 C 108 60, 102 120, 82 200" fill="none" stroke="#38bdf8" stroke-width="10" stroke-linecap="round" opacity="0.95"/>
                <path d="M 105 0 C 108 60, 102 120, 82 200" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
              </svg>
            `;
            stage.appendChild(jet);

            // Ground Cavitation Splash
            const splash = document.createElement('div');
            splash.style.cssText = 'position:absolute; bottom:8%; left:12%; right:12%; height:75px; z-index:24; display:flex; align-items:center; justify-content:center; pointer-events:none;';
            splash.innerHTML = `
              <div style="width:130px; height:60px; border-radius:50%; background:radial-gradient(ellipse, #ffffff 0%, #38bdf8 40%, rgba(2,132,199,0.3) 70%, transparent 100%); opacity:0; animation:hcCavitationSplash 1.1s ease-out 0.12s forwards;"></div>
            `;
            stage.appendChild(splash);
          } else {
            const whiffPuff = document.createElement('div');
            whiffPuff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20;';
            whiffPuff.innerHTML = '<div style="width:40px; height:40px; border-radius:50%; background:radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%); animation:fbShockwaveOut 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiffPuff);
          }
        }
      },
      {
        id: 'weezing_smog',
        group: 'Kategori 1: Advanced VFX',
        groupBadge: 'badge-adv',
        pokemon: 'Weezing',
        move: 'Toxic Smog (Toksik Zehir Sisi)',
        cardImg: '51.jpg',
        hp: '60 HP',
        pips: 6,
        desc: 'Perlin türbülansı (feTurbulence) destekli çok loblu kabaran miazma ve zehir gazı.',
        tech: '<strong>Yöntem:</strong> SVG feTurbulence gürültüsü ile dalgalanan organik gaz lobları + toksik süzülüş.',
        duration: 1700,
        render: function(stage, whiff) {
          if (!whiff) {
            // Perlin Filtered Smog Cloud
            const smogStage = document.createElement('div');
            smogStage.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:22; filter:url(#fxGasTurbulence); pointer-events:none;';
            
            const smog = document.createElement('div');
            smog.style.cssText = 'width:150px; height:150px; opacity:0; animation:tsSmogPuff 1.7s cubic-bezier(0.2, 0.85, 0.3, 1) forwards;';
            smog.innerHTML = `
              <svg width="150" height="150" viewBox="0 0 150 150" style="overflow:visible;">
                <circle cx="75" cy="75" r="50" fill="#7e22ce" opacity="0.85"/>
                <circle cx="55" cy="65" r="38" fill="#581c87" opacity="0.88"/>
                <circle cx="95" cy="70" r="36" fill="#6b21a8" opacity="0.82"/>
                <circle cx="70" cy="90" r="35" fill="#3b0764" opacity="0.9"/>
                <circle cx="75" cy="75" r="28" fill="#a855f7" opacity="0.75" style="filter:drop-shadow(0 0 14px #a855f7);"/>
                <circle cx="75" cy="75" r="16" fill="#d8b4fe" opacity="0.6"/>
              </svg>
            `;
            smogStage.appendChild(smog);
            stage.appendChild(smogStage);

            // Dissipating Miasma Veils
            const veil = document.createElement('div');
            veil.style.cssText = 'position:absolute; inset:0; background:radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(88,28,135,0.15) 60%, transparent 85%); z-index:20; opacity:0; animation:tsMiasmaDrift 1.5s ease-out 0.2s forwards;';
            stage.appendChild(veil);
          } else {
            const whiffPuff = document.createElement('div');
            whiffPuff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20;';
            whiffPuff.innerHTML = '<div style="width:40px; height:40px; border-radius:50%; background:radial-gradient(circle, rgba(147,51,234,0.3) 0%, transparent 70%); animation:fbShockwaveOut 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiffPuff);
          }
        }
      },
      {
        id: 'raichu_gigashock',
        group: 'Kategori 1: Advanced VFX',
        groupBadge: 'badge-adv',
        pokemon: 'Raichu',
        move: 'Gigashock (Yüksek Voltaj Şoku)',
        cardImg: '14.jpg',
        hp: '80 HP',
        pips: 8,
        desc: '30.000V küresel dielektrik plazma kafesi ve hedefin etrafında küresel iyonlaşma.',
        tech: '<strong>Yöntem:</strong> Akkor plazma çekirdeği + 4 yönlü radyal ark kafesi + eşmerkezli şok halkaları.',
        duration: 1500,
        render: function(stage, whiff) {
          if (!whiff) {
            // Dielectric Plasma Core
            const core = document.createElement('div');
            core.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:22; pointer-events:none; opacity:0; animation:gsDielectricCore 1.5s cubic-bezier(0.18, 0.9, 0.28, 1) forwards;';
            core.innerHTML = `
              <div style="width:110px; height:110px; border-radius:50%; background:radial-gradient(circle, #ffffff 0%, #38bdf8 30%, #facc15 65%, transparent 100%);"></div>
            `;
            stage.appendChild(core);

            // Plasma Arc Cage (Rotating Arcs)
            const arcs = document.createElement('div');
            arcs.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:24; pointer-events:none; opacity:0; animation:gsPlasmaArcs 1.5s ease-out forwards;';
            arcs.innerHTML = `
              <svg width="160" height="160" viewBox="0 0 160 160" style="overflow:visible;">
                <path d="M 80 10 L 88 50 L 110 55 L 82 85 L 120 120 L 75 105 L 45 140 L 60 95 L 20 70 L 65 60 Z" fill="none" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 12px #facc15);"/>
                <path d="M 80 10 L 88 50 L 110 55 L 82 85 L 120 120 L 75 105 L 45 140 L 60 95 L 20 70 L 65 60 Z" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            `;
            stage.appendChild(arcs);

            // Expanding Shockwave
            const shock = document.createElement('div');
            shock.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20; pointer-events:none;';
            shock.innerHTML = `
              <div style="width:130px; height:130px; border-radius:50%; border:2px solid #38bdf8; opacity:0; animation:fbShockwaveOut 1.1s ease-out 0.15s forwards; filter:drop-shadow(0 0 16px #38bdf8);"></div>
            `;
            stage.appendChild(shock);
          } else {
            const whiffPuff = document.createElement('div');
            whiffPuff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20;';
            whiffPuff.innerHTML = '<div style="width:40px; height:40px; border-radius:50%; background:radial-gradient(circle, rgba(250,204,21,0.3) 0%, transparent 70%); animation:fbShockwaveOut 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiffPuff);
          }
        }
      },
      {
        id: 'porygon_conversion',
        group: 'Kategori 1: Advanced VFX',
        groupBadge: 'badge-adv',
        pokemon: 'Porygon',
        move: 'Conversion (Sayısal Matris Glitch)',
        cardImg: '39.jpg',
        hp: '30 HP',
        pips: 3,
        desc: 'RGB kromatik kanal ayrışması, kayan piksel blokları ve siber matris rezonansı.',
        tech: '<strong>Yöntem:</strong> CSS clip-path yatay veri dilimleme + Cyan/Magenta ikili kanal ayrışması (glitch art).',
        duration: 1400,
        render: function(stage, whiff) {
          if (!whiff) {
            // Horizontal Glitch Slice Bands
            for (let i = 0; i < 5; i++) {
              const band = document.createElement('div');
              const top = 15 + i * 16;
              const height = 10 + (i % 2) * 8;
              const delay = i * 0.08;
              const color = i % 2 === 0 ? 'rgba(56,189,248,0.7)' : 'rgba(236,72,153,0.7)';
              band.style.cssText = `position:absolute; top:${top}%; left:5%; right:5%; height:${height}px; background:${color}; z-index:22; opacity:0; pointer-events:none; border-left:3px solid #fff; border-right:3px solid #fff; animation:cvGlitchBand 1.1s cubic-bezier(0.2, 0.9, 0.3, 1) ${delay}s forwards; mix-blend-mode:screen;`;
              stage.appendChild(band);
            }

            // Wireframe Cyber Matrix
            const matrix = document.createElement('div');
            matrix.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20; pointer-events:none; opacity:0; animation:cvWireframeMatrix 1.2s ease-out 0.15s forwards;';
            matrix.innerHTML = `
              <svg width="150" height="200" viewBox="0 0 150 200" style="overflow:visible;">
                <line x1="20" y1="30" x2="130" y2="30" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
                <line x1="20" y1="70" x2="130" y2="70" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
                <line x1="20" y1="110" x2="130" y2="110" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
                <line x1="20" y1="150" x2="130" y2="150" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
                <rect x="35" y="45" width="80" height="110" fill="none" stroke="#22d3ee" stroke-width="1.8" stroke-dasharray="6 3" style="filter:drop-shadow(0 0 10px #06b6d4);"/>
              </svg>
            `;
            stage.appendChild(matrix);
          } else {
            const whiffPuff = document.createElement('div');
            whiffPuff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20;';
            whiffPuff.innerHTML = '<div style="width:40px; height:40px; border-radius:50%; background:radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%); animation:fbShockwaveOut 0.7s ease-out forwards;"></div>';
            stage.appendChild(whiffPuff);
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

    SHOWCASE_DATA.forEach((item, index) => {
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
          <span class="showcase-badge ${item.groupBadge}">${item.group}</span>
          <div class="showcase-title">
            <span>${index + 1}. ${item.pokemon}</span>
            <span style="color:#64748b; font-weight:400;">—</span>
            <span style="color:#38bdf8;">${item.move}</span>
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
          <div class="tech-note">${item.tech}</div>
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
      const item = SHOWCASE_DATA.find(d => d.id === id);
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
        slot.style.animation = `fxCardShudder 0.45s ease-out 0.12s forwards`;
      }

      // Adjust animation speed via CSS variables
      stage.style.animationDuration = `${item.duration / globalSpeed}ms`;

      // Render FX layers
      item.render(stage, isWhiff);
    }

    // Play All Effects
    function playAll() {
      SHOWCASE_DATA.forEach((item, idx) => {
        setTimeout(() => {
          playFX(item.id);
        }, idx * 120);
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
      setTimeout(playAll, 400);
    });
  </script>
</body>
</html>
"""

# Verify brackets in html_content
open_braces = html_content.count('{')
close_braces = html_content.count('}')
print(f"Braces verification: open={open_braces}, close={close_braces}, balanced={open_braces == close_braces}")

# Write to file
target_file = 'public/preview_advanced_moves_showcase.html'
with open(target_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Successfully generated {target_file} with size {len(html_content)} bytes.")
