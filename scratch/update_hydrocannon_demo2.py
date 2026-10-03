import re

with open('scratch/generate_cinema_masterpieces.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add GSAP script tag to <head> if not present
if 'cdnjs.cloudflare.com/ajax/libs/gsap' not in content:
    content = content.replace(
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>'
    )
    # Add script tag after <title>
    content = content.replace(
        '<title>Pokémon TCG 1999 — İleri Düzey VFX Sanat Yönetmenliği Numune Paneli</title>',
        '<title>Pokémon TCG 1999 — İleri Düzey VFX Sanat Yönetmenliği Numune Paneli</title>\n  <!-- GSAP CDN for real-time fluid turbulence interpolation (Demo 2 Parity) -->\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>'
    )

# 2. Replace CSS Keyframes for Dark Blastoise Hydrocannon
old_kfs_target = """    /* 4. DARK BLASTOISE HYDROCANNON ADVANCED HYDRAULIC TORRENTS KEYFRAMES */
    /* Nozzle Bore Pressurized Ejection Blowout (Süpersonik Buhar/Püskürme Çıkışı — Sıfır Katı Top/Küre!) */
    @keyframes hcMuzzleVaporBlowout {
      0% { opacity: 0; transform: scale(0.2); }
      18% { opacity: 0.95; transform: scale(1.15); filter: drop-shadow(0 0 14px #38bdf8); }
      50% { opacity: 0.65; transform: scale(1.45) translateY(6px); }
      100% { opacity: 0; transform: scale(1.85) translateY(12px); filter: blur(4px); }
    }

    /* Collimated Hydraulic Torrent Left: Straight ballistic trajectory along 20 deg barrel axis */
    @keyframes hcHydroTorrentL {
      0% { opacity: 0; transform: rotate(20deg) scaleY(0.12) scaleX(0.7); }
      18% { opacity: 1; transform: rotate(20deg) scaleY(1.05) scaleX(1.08); filter: drop-shadow(0 0 24px #0284c7); }
      38% { opacity: 1; transform: rotate(20deg) scaleY(1.0) scaleX(1.0); }
      68% { opacity: 0.88; transform: rotate(20deg) scaleY(0.98) scaleX(0.96); }
      88% { opacity: 0.45; transform: rotate(20deg) scaleY(0.95) scaleX(0.9); filter: blur(2px); }
      100% { opacity: 0; transform: rotate(20deg) scaleY(0.92) scaleX(0.75); filter: blur(4px); }
    }

    /* Collimated Hydraulic Torrent Right: Straight ballistic trajectory along -20 deg barrel axis */
    @keyframes hcHydroTorrentR {
      0% { opacity: 0; transform: rotate(-20deg) scaleY(0.12) scaleX(0.7); }
      18% { opacity: 1; transform: rotate(-20deg) scaleY(1.05) scaleX(1.08); filter: drop-shadow(0 0 24px #0284c7); }
      38% { opacity: 1; transform: rotate(-20deg) scaleY(1.0) scaleX(1.0); }
      68% { opacity: 0.88; transform: rotate(-20deg) scaleY(0.98) scaleX(0.96); }
      88% { opacity: 0.45; transform: rotate(-20deg) scaleY(0.95) scaleX(0.9); filter: blur(2px); }
      100% { opacity: 0; transform: rotate(-20deg) scaleY(0.92) scaleX(0.75); filter: blur(4px); }
    }

    /* Turbulent Hydraulic Collision Dome (Çarpışma Odak Noktasında Köpüren Su Patlaması) */
    @keyframes hcHydraulicCollisionDome {
      0% { opacity: 0; transform: scale(0.18) rotate(0deg); }
      20% { opacity: 1; transform: scale(1.3) rotate(15deg); filter: drop-shadow(0 0 24px #ffffff) drop-shadow(0 0 45px #38bdf8); }
      50% { opacity: 0.95; transform: scale(1.1) rotate(28deg); }
      75% { opacity: 0.5; transform: scale(1.4) rotate(42deg); }
      100% { opacity: 0; transform: scale(1.7) rotate(58deg); filter: blur(5px); }
    }"""

new_kfs = """    /* 4. DARK BLASTOISE HYDROCANNON ADVANCED HYDRAULIC TORRENTS KEYFRAMES */
    /* Nozzle Bore Pressurized Ejection Blowout (Süpersonik Buhar/Püskürme Çıkışı — SIFIR KATI KÜRE!) */
    @keyframes hcMuzzleVaporBlowout {
      0% { opacity: 0; transform: scale(0.2); }
      18% { opacity: 0.95; transform: scale(1.15); filter: drop-shadow(0 0 14px #38bdf8); }
      50% { opacity: 0.65; transform: scale(1.45) translateY(6px); }
      100% { opacity: 0; transform: scale(1.85) translateY(12px); filter: blur(4px); }
    }

    /* Hydrodynamic Column Left: Doğrusal +22.5 deg eksen boyunca hedefe (92px, 135px) çakılan sıvı sütun (Demo 2 Mimarisi) */
    @keyframes hcHydroStreamL {
      0% { opacity: 0; transform: rotate(22.5deg) scaleY(0.08) scaleX(0.7); }
      14% { opacity: 1; transform: rotate(22.5deg) scaleY(1.02) scaleX(1.05); filter: drop-shadow(0 0 20px #0284c7); }
      35% { opacity: 1; transform: rotate(22.5deg) scaleY(1.0) scaleX(1.0); }
      65% { opacity: 0.88; transform: rotate(22.5deg) scaleY(0.98) scaleX(0.96); }
      85% { opacity: 0.45; transform: rotate(22.5deg) scaleY(0.95) scaleX(0.85); filter: blur(2px); }
      100% { opacity: 0; transform: rotate(22.5deg) scaleY(0.92) scaleX(0.7); filter: blur(4px); }
    }

    /* Hydrodynamic Column Right: Doğrusal -22.5 deg eksen boyunca hedefe (92px, 135px) çakılan sıvı sütun (Demo 2 Mimarisi) */
    @keyframes hcHydroStreamR {
      0% { opacity: 0; transform: rotate(-22.5deg) scaleY(0.08) scaleX(0.7); }
      14% { opacity: 1; transform: rotate(-22.5deg) scaleY(1.02) scaleX(1.05); filter: drop-shadow(0 0 20px #0284c7); }
      35% { opacity: 1; transform: rotate(-22.5deg) scaleY(1.0) scaleX(1.0); }
      65% { opacity: 0.88; transform: rotate(-22.5deg) scaleY(0.98) scaleX(0.96); }
      85% { opacity: 0.45; transform: rotate(-22.5deg) scaleY(0.95) scaleX(0.85); filter: blur(2px); }
      100% { opacity: 0; transform: rotate(-22.5deg) scaleY(0.92) scaleX(0.7); filter: blur(4px); }
    }

    /* Turbulent Hydraulic Collision Dome (Tam darbe merkezinde (92px, 135px) köpüren taç patlaması — SIFIR KATI BEYAZ KÜRE!) */
    @keyframes hcHydraulicCollisionDome {
      0% { opacity: 0; transform: scale(0.2) rotate(0deg); }
      20% { opacity: 1; transform: scale(1.15) rotate(12deg); filter: drop-shadow(0 0 20px #38bdf8); }
      50% { opacity: 0.9; transform: scale(1.05) rotate(24deg); }
      75% { opacity: 0.5; transform: scale(1.3) rotate(38deg); }
      100% { opacity: 0; transform: scale(1.55) rotate(52deg); filter: blur(4px); }
    }"""

assert old_kfs_target in content, "Could not find old_kfs_target"
content = content.replace(old_kfs_target, new_kfs)

# 3. Replace Dark Blastoise render function with Demo 2 Architecture & Exact (92, 135) Convergence
old_render_start = "id: 'darkblastoise_hydrocannon_master',"
old_render_end = "whiff.innerHTML = '<div style=\"width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcVaporCondensationShock 0.7s ease-out forwards;\"></div>';"

# Locate section
start_pos = content.find(old_render_start)
end_pos = content.find(old_render_end, start_pos)
assert start_pos != -1 and end_pos != -1, "Could not locate Dark Blastoise render block"

# We replace the body of darkblastoise_hydrocannon_master
new_blastoise_block = """id: 'darkblastoise_hydrocannon_master',
        badge: 'badge-hydro',
        category: 'Kategori 1: Advanced VFX Başyapıtı',
        pokemon: 'Dark Blastoise',
        move: 'Hydrocannon (Çift Namlulu Su Mermisi)',
        cardImg: '2.jpg',
        hp: '100 HP',
        pips: 10,
        desc: 'preview_advanced_vfx.html Demo 2 (Su Jeti Hidrodinamiği) mimarisiyle sil baştan yenilendi: Canlı GSAP/rAF baseFrequency türbülansı, iç kaustik ışık kırılması, doğrusal balistik V-çarpışması ve sıfır beyaz küre.',
        breakdown: '<strong>Demo 2 İleri Düzey Hidrodinamiği:</strong> Nozul çıkışında buhar püskürmesi $\\\\rightarrow$ Demo 2 SVG feDisplacementMap türbülanslı ve iç caustics yansımalı ikiz hidrolik sütunlar (22.5° eksenle (92px, 135px) odak noktasına tam V-çarpışması) $\\\\rightarrow$ odaklı çarpışma noktasında köpüren sıvı taç (Hydraulic Splash Crown — sıfır katı küre!) $\\\\rightarrow$ difüz buhar şok dalgası $\\\\rightarrow$ darbe merkezinden fışkıran 28 kavitasyon damlası $\\\\rightarrow$ doğal çağlayan su perdesi.',
        duration: 2100,
        render: function(stage, whiff) {
          if (!whiff) {
            // Global SVG Filter & Defs for Liquid Turbulence and Caustics (Demo 2 Architecture)
            const svgDefsContainer = document.createElement('div');
            svgDefsContainer.style.cssText = 'position:absolute; width:0; height:0; overflow:hidden; pointer-events:none;';
            svgDefsContainer.innerHTML = `
              <svg width="0" height="0">
                <defs>
                  <!-- 1. Real-time Animated Fluid Turbulence Filter (Demo 2 feDisplacementMap Standard) -->
                  <filter id="hcWaterDisplacement" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence id="hcWaterTurbElem" type="turbulence" baseFrequency="0.02 0.09" numOctaves="2" result="noise"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G"/>
                  </filter>

                  <!-- 2. Hydraulic Splash Crown Gradient -->
                  <linearGradient id="gradHydraulicSplashCrown" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="25%" stop-color="#bae6fd"/>
                    <stop offset="60%" stop-color="#38bdf8"/>
                    <stop offset="85%" stop-color="#0284c7"/>
                    <stop offset="100%" stop-color="#0369a1"/>
                  </linearGradient>

                  <!-- 3. Soft Radial Boil (Zero Solid White Circles!) -->
                  <radialGradient id="gradSplashCenterBoil" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
                    <stop offset="35%" stop-color="#bae6fd" stop-opacity="0.75"/>
                    <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="transparent"/>
                  </radialGradient>

                  <!-- 4. Vapor Condensation Shock Disk Gradient -->
                  <radialGradient id="gradCondensationShockWave" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
                    <stop offset="30%" stop-color="#7dd3fc" stop-opacity="0.75"/>
                    <stop offset="65%" stop-color="#0284c7" stop-opacity="0.35"/>
                    <stop offset="90%" stop-color="#0369a1" stop-opacity="0.15"/>
                    <stop offset="100%" stop-color="transparent"/>
                  </radialGradient>

                  <radialGradient id="gradHydroPopHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/>
                    <stop offset="40%" stop-color="#7dd3fc" stop-opacity="0.5"/>
                    <stop offset="75%" stop-color="#0284c7" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="transparent"/>
                  </radialGradient>
                </defs>
              </svg>
            `;
            stage.appendChild(svgDefsContainer);

            // Layer 1: Nozzle Bore Pressurized Ejection Blowout (Süpersonik Buhar Tahliyesi — SIFIR KATI KÜRE!)
            // Left Cannon Throat: (46px, 24px) -> Muzzle blowout at left: 28px, top: 8px
            // Right Cannon Throat: (138px, 24px) -> Muzzle blowout at left: 120px, top: 8px
            const muzzles = document.createElement('div');
            muzzles.style.cssText = 'position:absolute; inset:0; z-index:26; pointer-events:none;';
            muzzles.innerHTML = `
              <!-- Left Muzzle Vapor Blowout -->
              <div style="position:absolute; top:8px; left:28px; width:36px; height:32px; border-radius:50%; background:radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.95) 0%, rgba(125,211,252,0.85) 40%, rgba(2,132,199,0.2) 75%, transparent 100%); opacity:0; animation:hcMuzzleVaporBlowout 0.45s ease-out 0.08s forwards; filter:blur(2px);"></div>

              <!-- Right Muzzle Vapor Blowout -->
              <div style="position:absolute; top:8px; left:120px; width:36px; height:32px; border-radius:50%; background:radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.95) 0%, rgba(125,211,252,0.85) 40%, rgba(2,132,199,0.2) 75%, transparent 100%); opacity:0; animation:hcMuzzleVaporBlowout 0.45s ease-out 0.08s forwards; filter:blur(2px);"></div>
            `;
            stage.appendChild(muzzles);

            // Layer 2: Dual Collimated Hydrodynamic Water Streams (Demo 2 Architecture)
            // Left Cannon: Throat at (46px, 24px) -> Shoots along straight +22.5 deg axis -> Hits (92px, 135px)
            // Right Cannon: Throat at (138px, 24px) -> Shoots along straight -22.5 deg axis -> Hits (92px, 135px)
            // SIFIR DIŞ KAVİS, SIFIR SINIR DIŞINA TAŞMA! TAM V-ŞEKLİ ODAK NOKTASI KİLİTLENMESİ!
            const torrents = document.createElement('div');
            torrents.style.cssText = 'position:absolute; inset:0; z-index:22; pointer-events:none;';
            torrents.innerHTML = `
              <!-- Left Hydrodynamic Stream (Demo 2 Fluid Gradient + Inset Caustics + feDisplacementMap) -->
              <div style="position:absolute; top:24px; left:34px; width:24px; height:120px; transform-origin:12px 0; opacity:0; animation:hcHydroStreamL 1.35s cubic-bezier(0.18, 0.88, 0.32, 1) 0.10s forwards; filter:url(#hcWaterDisplacement);">
                <!-- Outer Volumetric Column -->
                <div style="position:absolute; inset:0; border-radius:12px 12px 6px 6px; background:linear-gradient(to bottom, #ffffff 0%, rgba(186,230,253,0.95) 15%, rgba(56,189,248,0.9) 45%, rgba(2,132,199,0.95) 80%, rgba(3,105,161,0.98) 100%); box-shadow:0 0 16px rgba(56,189,248,0.7), inset 0 0 8px #ffffff;"></div>
                <!-- Inner High-Velocity Cavitation Core Line -->
                <div style="position:absolute; top:4px; left:7px; width:10px; height:110px; border-radius:5px; background:linear-gradient(to bottom, #ffffff 0%, #e0f2fe 35%, rgba(125,211,252,0.6) 80%, transparent 100%); box-shadow:0 0 8px #ffffff; opacity:0.9; filter:blur(1px);"></div>
              </div>

              <!-- Right Hydrodynamic Stream (Demo 2 Fluid Gradient + Inset Caustics + feDisplacementMap) -->
              <div style="position:absolute; top:24px; left:126px; width:24px; height:120px; transform-origin:12px 0; opacity:0; animation:hcHydroStreamR 1.35s cubic-bezier(0.18, 0.88, 0.32, 1) 0.10s forwards; filter:url(#hcWaterDisplacement);">
                <!-- Outer Volumetric Column -->
                <div style="position:absolute; inset:0; border-radius:12px 12px 6px 6px; background:linear-gradient(to bottom, #ffffff 0%, rgba(186,230,253,0.95) 15%, rgba(56,189,248,0.9) 45%, rgba(2,132,199,0.95) 80%, rgba(3,105,161,0.98) 100%); box-shadow:0 0 16px rgba(56,189,248,0.7), inset 0 0 8px #ffffff;"></div>
                <!-- Inner High-Velocity Cavitation Core Line -->
                <div style="position:absolute; top:4px; left:7px; width:10px; height:110px; border-radius:5px; background:linear-gradient(to bottom, #ffffff 0%, #e0f2fe 35%, rgba(125,211,252,0.6) 80%, transparent 100%); box-shadow:0 0 8px #ffffff; opacity:0.9; filter:blur(1px);"></div>
              </div>
            `;
            stage.appendChild(torrents);

            // Layer 3: Central Hydraulic Collision Crown & Condensation Shockwave (SIFIR BEYAZ KÜRE!)
            // Center is at EXACTLY (92px, 135px) where both water streams meet!
            // Dome width: 76px, height: 76px -> top: 135 - 38 = 97px, left: 92 - 38 = 54px
            const bursts = document.createElement('div');
            bursts.style.cssText = 'position:absolute; inset:0; z-index:24; pointer-events:none;';
            bursts.innerHTML = `
              <!-- Central Hydraulic Collision Crown (Cue: 0.22s — İki jetin tam çarpışma noktasında (92px, 135px) köpüren taç patlaması) -->
              <div style="position:absolute; top:97px; left:54px; width:76px; height:76px; opacity:0; animation:hcHydraulicCollisionDome 0.95s cubic-bezier(0.18, 0.9, 0.28, 1) 0.22s forwards; filter:url(#hcWaterDisplacement);">
                <svg width="76" height="76" viewBox="0 0 76 76" style="overflow:visible;">
                  <!-- Soft Aquatic Halo -->
                  <ellipse cx="38" cy="38" rx="36" ry="36" fill="url(#gradHydroPopHalo)" opacity="0.85"/>
                  <!-- Multi-Lobed Splashing Crown (Organic Liquid Crown — ZERO solid white circles!) -->
                  <path d="M 38 6 C 42 18, 52 14, 64 10 C 58 22, 70 28, 72 38 C 64 42, 68 54, 60 62 C 50 58, 46 70, 38 72 C 32 64, 24 70, 16 62 C 20 52, 8 46, 6 38 C 16 34, 10 22, 18 16 C 26 20, 32 8, 38 6 Z" fill="url(#gradHydraulicSplashCrown)" style="filter:drop-shadow(0 0 14px #38bdf8);"/>
                  <!-- Soft Translucent Central Water Boil (Blurry, Organic — SIFIR KATI KÜRE!) -->
                  <circle cx="38" cy="38" r="16" fill="url(#gradSplashCenterBoil)" style="filter:blur(2px);"/>
                </svg>
              </div>

              <!-- Central Collision High-Pressure Vapor Condensation Shockwave (Cue: 0.22s — Tam (92px, 135px) merkezli difüz şok) -->
              <div style="position:absolute; top:90px; left:12px; width:160px; height:90px; opacity:0; animation:hcVaporCondensationShock 1.15s cubic-bezier(0.18, 0.9, 0.28, 1) 0.22s forwards;">
                <svg width="160" height="90" viewBox="0 0 160 90" style="overflow:visible;">
                  <ellipse cx="80" cy="45" rx="75" ry="38" fill="url(#gradCondensationShockWave)" opacity="0.85" style="filter:blur(3px);"/>
                </svg>
              </div>
            `;
            stage.appendChild(bursts);

            // Layer 4: Volumetric Aerosol Shock Haze (Kabarık su buharı ve sis zerreleri)
            for (let i = 0; i < 3; i++) {
              const haze = document.createElement('div');
              const left = 24 + i * 26;
              const delay = 0.26 + i * 0.06;
              haze.style.cssText = `position:absolute; top:110px; left:${left}%; width:65px; height:50px; border-radius:50%; background:radial-gradient(circle, rgba(224,242,254,0.75) 0%, rgba(56,189,248,0.3) 55%, transparent 80%); z-index:23; opacity:0; animation:hcAerosolMistPlume 1.25s ease-out ${delay.toFixed(2)}s forwards; pointer-events:none;`;
              stage.appendChild(haze);
            }

            // Layer 5: Parabolic Gravity Droplets (Tam çarpışma noktası (92px, 135px)'ten yayılan 28 damla)
            const dropletsContainer = document.createElement('div');
            dropletsContainer.style.cssText = 'position:absolute; inset:0; z-index:25; pointer-events:none;';
            for (let i = 0; i < 28; i++) {
              const drop = document.createElement('div');
              const angleDeg = (i * 13) - 90;
              const rad = (angleDeg * Math.PI) / 180;
              const speed = 28 + (i % 5) * 8;
              const dxUp = Math.round(Math.cos(rad) * speed);
              const dyUp = Math.round(Math.sin(rad) * (speed * 0.7));
              const delay = (0.22 + (i * 0.022)).toFixed(2);
              const size = 2 + (i % 3) * 1.6;

              drop.style.cssText = `
                position: absolute;
                top: 135px;
                left: 92px;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: #ffffff;
                box-shadow: 0 0 6px #7dd3fc, 0 0 12px #0284c7;
                --dx-up: ${dxUp}px;
                --dy-up: ${dyUp}px;
                opacity: 0;
                animation: hcParabolicGravityDroplet 1.1s cubic-bezier(0.2, 0.85, 0.35, 1) ${delay}s forwards;
              `;
              dropletsContainer.appendChild(drop);
            }
            stage.appendChild(dropletsContainer);

            // Layer 6: Cascading Caustic Deluge Waterfall / Sheet (Darbe noktasından (135px) aşağı çağlayan su perdesi)
            const deluge = document.createElement('div');
            deluge.style.cssText = 'position:absolute; bottom:0; left:8px; right:8px; height:118px; z-index:21; pointer-events:none; opacity:0; animation:hcCausticWaterVeilFlow 1.45s ease-out 0.36s forwards;';
            deluge.innerHTML = `
              <svg width="168" height="118" viewBox="0 0 168 118" style="overflow:visible;">
                <!-- Volumetric Translucent Water Veil Body -->
                <path d="M 12 0 C 26 30, 14 65, 20 118 C 45 118, 75 118, 95 118 C 115 118, 145 118, 154 118 C 160 65, 148 30, 156 0 Z" fill="url(#gradWaterVeilSheet)" opacity="0.65"/>
                
                <!-- Soft Diffuse Flow Streaks -->
                <rect x="26" y="0" width="34" height="118" fill="url(#gradFlowStreamSoft)" opacity="0.45" style="filter:blur(5px);"/>
                <rect x="108" y="0" width="34" height="118" fill="url(#gradFlowStreamSoft)" opacity="0.45" style="filter:blur(5px);"/>
                <rect x="66" y="0" width="36" height="118" fill="url(#gradFlowStreamCenter)" opacity="0.65" style="filter:blur(3px);"/>

                <defs>
                  <linearGradient id="gradWaterVeilSheet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.8"/>
                    <stop offset="35%" stop-color="#38bdf8" stop-opacity="0.55"/>
                    <stop offset="75%" stop-color="#0284c7" stop-opacity="0.35"/>
                    <stop offset="100%" stop-color="#0369a1" stop-opacity="0.1"/>
                  </linearGradient>
                  <linearGradient id="gradFlowStreamSoft" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="50%" stop-color="#7dd3fc" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="transparent"/>
                  </linearGradient>
                  <linearGradient id="gradFlowStreamCenter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
                    <stop offset="60%" stop-color="#e0f2fe" stop-opacity="0.5"/>
                    <stop offset="100%" stop-color="transparent"/>
                  </linearGradient>
                </defs>
              </svg>
            `;
            stage.appendChild(deluge);

            // Layer 7: Fine-Grained Gravitational Droplets
            for (let i = 0; i < 16; i++) {
              const fdrop = document.createElement('div');
              const left = 18 + (i * 4.4);
              const delay = 0.40 + (i * 0.035);
              const size = 1.8 + (i % 3) * 1.2;
              fdrop.style.cssText = `position:absolute; top:125px; left:${left}%; width:${size}px; height:${size * 1.5}px; border-radius:50% 50% 40% 40%; background:radial-gradient(ellipse, #ffffff 0%, #7dd3fc 65%, #0284c7 100%); z-index:22; opacity:0; animation:hcFineGrainVelocityCascade 0.72s cubic-bezier(0.45, 0.05, 0.9, 1) ${delay.toFixed(3)}s forwards; pointer-events:none; box-shadow:0 0 4px #7dd3fc;`;
              stage.appendChild(fdrop);
            }

            // Layer 8: Runoff Drip Tears descending from veil edge
            for (let i = 0; i < 8; i++) {
              const drip = document.createElement('div');
              const left = 16 + i * 9.5;
              const delay = 0.50 + i * 0.06;
              const size = 2.5 + (i % 2) * 1.5;
              drip.style.cssText = `position:absolute; bottom:25px; left:${left}%; width:${size}px; height:${size * 1.6}px; border-radius:50% 50% 40% 40%; background:radial-gradient(ellipse, #ffffff 0%, #7dd3fc 60%, #0284c7 100%); z-index:22; opacity:0; animation:hcRunoffDripTear 0.85s cubic-bezier(0.4, 0, 0.9, 1) ${delay.toFixed(2)}s forwards; pointer-events:none;`;
              stage.appendChild(drip);
            }

            // Real-Time GSAP / rAF Fluid Turbulence Driver (Demo 2 Parity)
            if (typeof gsap !== 'undefined') {
              const turbEl = document.getElementById('hcWaterTurbElem');
              if (turbEl) {
                const turbObj = { bfX: 0.02, bfY: 0.09 };
                gsap.to(turbObj, {
                  bfX: 0.038,
                  bfY: 0.16,
                  duration: 0.9,
                  repeat: 3,
                  yoyo: true,
                  ease: "power1.inOut",
                  onUpdate: () => {
                    turbEl.setAttribute('baseFrequency', `${turbObj.bfX.toFixed(3)} ${turbObj.bfY.toFixed(3)}`);
                  }
                });
              }
            } else {
              // Continuous 60fps fallback loop
              let startT = performance.now();
              const updateTurb = () => {
                const turbEl = document.getElementById('hcWaterTurbElem');
                if (turbEl) {
                  const elapsed = (performance.now() - startT) / 1000;
                  const bx = 0.025 + 0.015 * Math.sin(elapsed * 7);
                  const by = 0.09 + 0.06 * Math.cos(elapsed * 9);
                  turbEl.setAttribute('baseFrequency', `${bx.toFixed(3)} ${by.toFixed(3)}`);
                  if (elapsed < 2.2) requestAnimationFrame(updateTurb);
                }
              };
              requestAnimationFrame(updateTurb);
            }
          } else {
            const whiff = document.createElement('div');
            whiff.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:18;';
            whiff.innerHTML = '<div style="width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcVaporCondensationShock 0.7s ease-out forwards;"></div>';"""

end_of_block = content.find("whiff.innerHTML = '<div style=\"width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcVaporCondensationShock 0.7s ease-out forwards;\"></div>';", start_pos)
end_of_block += len("whiff.innerHTML = '<div style=\"width:45px; height:45px; border-radius:50%; border:2px solid #0284c7; opacity:0; animation:hcVaporCondensationShock 0.7s ease-out forwards;\"></div>';")

content = content[:start_pos] + new_blastoise_block + content[end_of_block:]

with open('scratch/generate_cinema_masterpieces.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated scratch/generate_cinema_masterpieces.py")
